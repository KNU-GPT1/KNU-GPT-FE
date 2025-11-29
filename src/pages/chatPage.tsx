import React, { useState, useRef, useEffect } from "react";
import { LogOut, MoreVertical, Pencil, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getChatRooms, createChatRoom, sendMessage, getChatHistory, updateChatRoomTitle, deleteChatRoom } from '../api/chatApi';
import { logout } from '../api/auth';
import type { ChatRoom, ChatMessage } from '../types/chat';

// 사용자 아이콘 컴포넌트
function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-4 h-4"} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_64_1258)">
        <path d="M14 25.3002C20.2408 25.3002 25.3 20.241 25.3 14.0002C25.3 7.75938 20.2408 2.7002 14 2.7002C7.75919 2.7002 2.70001 7.75938 2.70001 14.0002C2.70001 20.241 7.75919 25.3002 14 25.3002Z" stroke="#222222" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 16.9004C10.5 16.9004 7.5 18.9004 6 21.9004C8 24.0004 10.9 25.2004 14 25.2004C17.1 25.2004 20 23.9004 22 21.9004C20.5 19.0004 17.5 16.9004 14 16.9004Z" stroke="#222222" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 14.3001C15.9882 14.3001 17.6 12.6883 17.6 10.7001C17.6 8.71187 15.9882 7.1001 14 7.1001C12.0118 7.1001 10.4 8.71187 10.4 10.7001C10.4 12.6883 12.0118 14.3001 14 14.3001Z" stroke="#222222" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_64_1258">
          <rect width="24" height="24" fill="white" transform="translate(2 2)"/>
        </clipPath>
      </defs>
    </svg>
  );
}

// 설정 아이콘 컴포넌트
function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-4 h-4"} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 17.5C15.933 17.5 17.5 15.933 17.5 14C17.5 12.067 15.933 10.5 14 10.5C12.067 10.5 10.5 12.067 10.5 14C10.5 15.933 12.067 17.5 14 17.5Z" stroke="#222222" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M24.2883 9.07025L23.4133 7.55475C22.9303 6.71737 21.8602 6.43125 21.0228 6.91425L20.5625 7.18025C18.8125 8.19 16.625 6.92737 16.625 4.907V4.375C16.625 3.40812 15.8419 2.625 14.875 2.625H13.125C12.1582 2.625 11.375 3.40812 11.375 4.375V4.907C11.375 6.92737 9.18753 8.19088 7.43753 7.18025L6.97728 6.91425C6.1399 6.43125 5.06978 6.71737 4.58678 7.55475L3.71178 9.07025C3.22878 9.90763 3.5149 10.9777 4.35228 11.4607L4.81253 11.7268C6.56253 12.7374 6.56253 15.2626 4.81253 16.2732L4.35228 16.5393C3.5149 17.0223 3.22878 18.0924 3.71178 18.9298L4.58678 20.4452C5.06978 21.2826 6.1399 21.5688 6.97728 21.0858L7.43753 20.8197C9.18753 19.8091 11.375 21.0726 11.375 23.093V23.625C11.375 24.5919 12.1582 25.375 13.125 25.375H14.875C15.8419 25.375 16.625 24.5919 16.625 23.625V23.093C16.625 21.0726 18.8125 19.8091 20.5625 20.8197L21.0228 21.0858C21.8602 21.5688 22.9303 21.2826 23.4133 20.4452L24.2883 18.9298C24.7713 18.0924 24.4852 17.0223 23.6478 16.5393L23.1875 16.2732C21.4375 15.2626 21.4375 12.7374 23.1875 11.7268L23.6478 11.4607C24.4852 10.9777 24.7722 9.90763 24.2883 9.07025Z" stroke="#222222" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// 도움말 아이콘 컴포넌트
function GuideIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-4 h-4"} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_64_1269)">
        <path d="M14 25.25C20.2132 25.25 25.25 20.2132 25.25 14C25.25 7.7868 20.2132 2.75 14 2.75C7.7868 2.75 2.75 7.7868 2.75 14C2.75 20.2132 7.7868 25.25 14 25.25Z" stroke="#222222" strokeWidth="1.5" strokeMiterlimit="10" strokeLinejoin="round"/>
        <path d="M14 20V21.5" stroke="#222222" strokeWidth="1.5" strokeMiterlimit="10" strokeLinejoin="round"/>
        <path d="M14 18.5V16.5388C14 15.458 14.6578 14.4868 15.6613 14.0855C16.9228 13.5808 17.75 12.359 17.75 11C17.75 8.92925 16.0707 7.25 14 7.25C11.9293 7.25 10.25 8.92925 10.25 11" stroke="#222222" strokeWidth="1.5" strokeMiterlimit="10" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_64_1269">
          <rect width="24" height="24" fill="white" transform="translate(2 2)"/>
        </clipPath>
      </defs>
    </svg>
  );
}

// 새 채팅 아이콘 컴포넌트
function NewChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-4 h-4"} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.72017 18.4548L11.4812 17.9468L22.0842 7.21686C22.1678 7.13116 22.2144 7.016 22.2138 6.89625C22.2132 6.7765 22.1656 6.66178 22.0812 6.57687L21.4462 5.93487C21.4051 5.8927 21.3561 5.85914 21.302 5.83612C21.2478 5.81311 21.1896 5.80112 21.1308 5.80084C21.072 5.80056 21.0137 5.812 20.9593 5.8345C20.9049 5.85699 20.8556 5.8901 20.8142 5.93187L10.2392 16.6339L9.71917 18.4538L9.72017 18.4548ZM22.7032 4.66287L23.3382 5.30587C24.2142 6.19287 24.2222 7.62386 23.3542 8.50186L12.4282 19.5598L8.66418 20.6438C8.43437 20.7082 8.18844 20.6787 7.98034 20.5619C7.77224 20.4451 7.61898 20.2505 7.55418 20.0208C7.50596 19.8557 7.50527 19.6803 7.55218 19.5148L8.64718 15.6749L19.5442 4.64587C19.7514 4.43723 19.998 4.27193 20.2698 4.15962C20.5416 4.04731 20.833 3.99024 21.127 3.99173C21.4211 3.99322 21.7119 4.05324 21.9825 4.1683C22.2531 4.28335 22.4981 4.45214 22.7032 4.66287ZM11.1842 5.81587C11.6802 5.81587 12.0822 6.22287 12.0822 6.72487C12.083 6.84353 12.0604 6.96119 12.0156 7.07112C11.9709 7.18104 11.905 7.28108 11.8216 7.3655C11.7382 7.44992 11.639 7.51707 11.5296 7.56312C11.4202 7.60917 11.3028 7.63321 11.1842 7.63386H7.59218C6.60018 7.63386 5.79618 8.44786 5.79618 9.45086V20.3568C5.79618 21.3608 6.60018 22.1748 7.59218 22.1748H18.3682C19.3602 22.1748 20.1652 21.3608 20.1652 20.3568V16.7218C20.1652 16.2199 20.5672 15.8129 21.0632 15.8129C21.5592 15.8129 21.9612 16.2199 21.9612 16.7228V20.3568C21.9612 22.3648 20.3522 23.9928 18.3682 23.9928H7.59218C5.60818 23.9928 4.00018 22.3648 4.00018 20.3568V9.45086C4.00018 7.44386 5.60818 5.81587 7.59218 5.81587H11.1842Z" fill="#222222"/>
    </svg>
  );
}

// 채팅 아이콘 컴포넌트
function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-4 h-4"} viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M12.6876 11.3706C12.6876 12.0955 12.1 12.6831 11.3751 12.6831C10.6502 12.6831 10.0626 12.0955 10.0626 11.3706C10.0626 10.6457 10.6502 10.0581 11.3751 10.0581C12.1 10.0581 12.6876 10.6457 12.6876 11.3706ZM6.56262 10.0581C5.83775 10.0581 5.25012 10.6457 5.25012 11.3706C5.25012 12.0955 5.83775 12.6831 6.56262 12.6831C7.2875 12.6831 7.87512 12.0955 7.87512 11.3706C7.87512 10.6457 7.2875 10.0581 6.56262 10.0581ZM16.1876 10.0581C15.4627 10.0581 14.8751 10.6457 14.8751 11.3706C14.8751 12.0955 15.4627 12.6831 16.1876 12.6831C16.9125 12.6831 17.5001 12.0955 17.5001 11.3706C17.5001 10.6457 16.9125 10.0581 16.1876 10.0581ZM22.7501 11.3706C22.751 15.3653 20.6563 19.0677 17.2318 21.1245C13.8073 23.1813 9.55486 23.2909 6.02887 21.4134L2.30465 22.6548C1.67576 22.8646 0.982353 22.7009 0.513584 22.2321C0.0448151 21.7634 -0.118825 21.07 0.090903 20.4411L1.33231 16.7169C-0.890348 12.538 -0.293012 7.41948 2.83216 3.86471C5.95734 0.309949 10.9572 -0.938097 15.3863 0.730981C19.8155 2.40006 22.7482 6.63742 22.7501 11.3706ZM21.0001 11.3706C20.999 7.32406 18.4669 3.71036 14.664 2.32767C10.861 0.944972 6.59929 2.08859 3.99946 5.18946C1.39964 8.29034 1.01696 12.6862 3.04184 16.1897C3.16727 16.4068 3.19356 16.6672 3.11403 16.905L1.75012 20.9956L5.84075 19.6317C5.92984 19.6013 6.02333 19.5858 6.11747 19.5858C6.27114 19.586 6.42204 19.6268 6.55497 19.7039C9.53308 21.427 13.2045 21.4293 16.1848 19.71C19.165 17.9907 21.0009 14.8113 21.0001 11.3706Z" fill="#222222"/>
    </svg>
  );
}

// 메뉴 닫기 아이콘 컴포넌트
function SlideIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-4 h-4"} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#767676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 3V21" stroke="#767676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// KNU 로고 컴포넌트
function KnuLogo() {
  return (
    <div className="relative shrink-0 size-[28px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="group-R5">
          <path d="M16.0753 14.1918V13.9585C16.0753 13.8248 15.9778 13.7247 15.8798 13.7247H12.1329C12.0027 13.7247 11.9049 13.8248 11.9049 13.9585V14.1918C11.9049 14.3256 12.0027 14.426 12.1329 14.426H15.8798C15.9778 14.426 16.0753 14.3256 16.0753 14.1918ZM11.9049 12.6893V12.9231C11.9049 13.0566 12.0027 13.1569 12.1329 13.1569H15.8798C15.9778 13.1569 16.0753 13.0566 16.0753 12.9231V12.6893C16.0753 12.5555 15.9778 12.4558 15.8798 12.4558H12.1329C12.0027 12.4558 11.9049 12.5555 11.9049 12.6893ZM11.807 17.7652V18.0322C11.807 18.1328 11.9049 18.2324 12.0354 18.2324H15.9778C16.0753 18.2324 16.1731 18.1328 16.1731 18.0322V17.7652C16.1731 17.632 16.0753 17.5314 15.9778 17.5314H12.0354C11.9049 17.5314 11.807 17.632 11.807 17.7652ZM12.5241 15.6946H15.4565C15.5866 15.6946 15.6842 15.5943 15.6842 15.4611V15.2272C15.6842 15.0935 15.5866 14.9937 15.4565 14.9937H12.5241C12.3936 14.9937 12.2958 15.0935 12.2958 15.2272V15.4611C12.2958 15.5943 12.3936 15.6946 12.5241 15.6946ZM15.2282 10.5521L15.8145 10.1182L16.4991 10.3852L16.2708 9.68392L16.7268 9.08277H16.0102L15.5866 8.48187L15.3585 9.18312L14.6745 9.41667L15.2608 9.81746L15.2282 10.5521ZM12.1003 16.4965V16.7298C12.1003 16.8635 12.1981 16.9636 12.3284 16.9636H15.6842C15.7819 16.9636 15.8798 16.8635 15.8798 16.7298V16.4965C15.8798 16.3627 15.7819 16.2623 15.6842 16.2623H12.3284C12.1981 16.2623 12.1003 16.3627 12.1003 16.4965ZM11.123 20.7702H16.8572C16.9876 20.7702 17.0852 20.6707 17.0852 20.5701V20.303C17.0852 20.203 16.9876 20.0692 16.8572 20.0692H11.123C11.0253 20.0692 10.9275 20.203 10.9275 20.303V20.5701C10.9275 20.6707 11.0253 20.7702 11.123 20.7702ZM19.7568 15.3942L20.4414 15.6612L20.2131 14.9603L20.6368 14.3591H19.92L19.5288 13.7579L19.3009 14.4594L18.6168 14.6595L19.2034 15.0935L19.1705 15.8282L19.7568 15.3942ZM18.682 12.1884L19.3658 12.4222L19.1381 11.7208L19.5614 11.153H18.8445L18.4539 10.5521L18.2259 11.2536L17.5412 11.4537L18.1278 11.8881L18.0955 12.6224L18.682 12.1884ZM28 10.4853V10.4184C27.9673 10.2851 27.8699 10.1851 27.772 10.0845C27.7393 10.0845 27.7067 10.0513 27.6416 10.0513C26.8273 9.71737 26.7294 9.51676 26.5337 9.08277C26.371 8.78257 26.143 8.31488 25.6216 7.78072C24.351 6.47816 22.852 6.74558 22.2331 6.9456C21.3861 6.4448 20.5715 6.4448 19.9525 6.64515C19.9525 5.97727 19.6918 5.20938 18.9751 4.54143C18.9427 3.87355 18.7471 2.33744 17.1505 1.50266C16.4662 1.13506 16.0102 1.06858 15.6518 1.03514C15.1958 0.968409 15.0002 0.934959 14.4462 0.233551C14.4138 0.200102 14.3809 0.166655 14.3486 0.133373C14.2509 0.0664768 14.1856 0.0332794 14.0878 0.0332794L14.0551 -1.90735e-06H13.9902H13.9249L13.8924 0.0332794H13.8271L13.7944 0.0664768H13.7296L13.6643 0.0999241V0.133373H13.6317C13.6317 0.166655 13.5991 0.166655 13.5664 0.200102V0.233551C13.0127 0.934959 12.7844 0.968409 12.3284 1.03514C11.9701 1.06858 11.5141 1.13506 10.8297 1.50266C9.23326 2.33744 9.03783 3.87355 9.00526 4.54143C8.28845 5.20938 8.06045 5.97727 8.02777 6.6786C7.40867 6.47816 6.62672 6.47816 5.77973 6.97905C5.16053 6.77869 3.66178 6.51161 2.3911 7.78072C1.86977 8.34808 1.64167 8.78257 1.47896 9.11622C1.28346 9.51676 1.18562 9.75081 0.370991 10.0513C0.208142 10.1182 0.11063 10.2183 0.045292 10.3852C0.0127986 10.4184 0.0127986 10.4521 0.0127986 10.4853C0.0127986 10.5187 0.0127986 10.5521 0.0127986 10.5855C-0.0198224 10.6859 0.0127986 10.786 0.0779767 10.886C0.566622 11.6542 0.534128 11.8881 0.468791 12.3553C0.403676 12.7228 0.305973 13.1901 0.436138 13.9585C0.729472 15.7615 2.09806 16.4628 2.6843 16.6629C3.1078 17.5983 3.72706 18.0659 4.37859 18.2661C3.98771 18.8338 3.72706 19.6016 3.9224 20.6038C3.56421 21.1379 2.84712 22.5072 3.66178 24.1435C3.98771 24.8445 4.34597 25.1783 4.60659 25.4122C4.93238 25.7461 5.09526 25.9135 5.12795 26.8146C5.12795 26.9153 5.16053 26.9816 5.19306 27.0485V27.0817L5.25833 27.1486C5.38853 27.3155 5.61659 27.4161 5.81232 27.3492C6.69187 27.1154 6.88731 27.2154 7.2785 27.4161C7.60408 27.6162 8.02777 27.8169 8.77718 27.9501C10.5366 28.2508 11.6116 27.1154 12.0027 26.5808C12.9803 26.4476 13.6317 25.9799 14.0225 25.4122C14.4138 25.9799 15.0326 26.4476 16.0425 26.5477C16.4011 27.0817 17.4765 28.2171 19.2358 27.9169C19.9848 27.8169 20.4085 27.5825 20.7344 27.4161C21.1254 27.1823 21.3211 27.0817 22.1681 27.3155C22.2007 27.3155 22.2655 27.3492 22.2984 27.3492C22.3637 27.3492 22.4288 27.3155 22.4937 27.3155C22.5262 27.2822 22.5591 27.2822 22.5915 27.2822V27.2492L22.6568 27.2154L22.6893 27.1823L22.7218 27.1486L22.7544 27.1154L22.7868 27.0817L22.8197 27.0148L22.852 26.9485V26.9153C22.885 26.8815 22.885 26.8484 22.885 26.7815C22.9173 25.8799 23.0804 25.713 23.4063 25.4122C23.667 25.1452 24.0251 24.8112 24.351 24.1098C25.1656 22.4734 24.449 21.1046 24.0903 20.5701C24.2857 19.5684 24.0251 18.8001 23.6341 18.2661C24.2857 18.0322 24.905 17.5651 25.3283 16.6298C25.9149 16.4296 27.2833 15.728 27.5764 13.9585C27.7067 13.1901 27.6093 12.6893 27.544 12.3222C27.4786 11.8881 27.446 11.6542 27.9024 10.886C27.9353 10.8529 27.9673 10.8194 27.9673 10.786C28 10.7191 28 10.6522 28 10.5855V10.5521C28 10.5521 28 10.5187 28 10.4853ZM9.91742 5.24258C10.0801 5.10921 10.1454 4.94214 10.1128 4.74153C10.1128 4.67505 10.0153 3.20542 11.3183 2.50452C11.8396 2.2371 12.1656 2.20382 12.4914 2.13692C13.0127 2.07036 13.4363 1.9701 13.9902 1.40248C14.5439 1.9701 14.9676 2.07036 15.4888 2.13692C15.8145 2.20382 16.1406 2.2371 16.6618 2.50452C17.9978 3.20542 17.8672 4.67505 17.8672 4.74153C17.8348 4.94214 17.9325 5.10921 18.0626 5.24258C19.0728 6.04417 18.8774 6.97905 18.682 7.41329C17.3135 6.54481 15.7171 6.01064 13.9902 6.01064C12.2634 6.01064 10.6341 6.54481 9.2984 7.41329C9.10281 6.9456 8.94004 6.04417 9.91742 5.24258ZM3.62913 15.9954C3.56421 15.8282 3.40111 15.6946 3.23826 15.6612C3.17311 15.628 1.77213 15.2941 1.51145 13.7913C1.44627 13.2236 1.47896 12.8563 1.54407 12.5555C1.64167 11.9878 1.6743 11.5538 1.34873 10.8529C2.00022 10.4853 2.22828 10.1182 2.45628 9.61736C2.61913 9.31666 2.74958 9.01587 3.17311 8.58188C4.21574 7.51338 5.55173 8.08108 5.61659 8.11453C5.77973 8.18109 5.9752 8.14798 6.13789 8.04763C7.18051 7.34639 7.96249 7.78072 8.32086 8.11453C6.36604 9.78426 5.12795 12.2885 5.12795 15.0935C5.12795 15.8619 5.22574 16.5965 5.38853 17.2975C4.89992 17.3312 4.05288 17.1639 3.62913 15.9954ZM11.6443 25.4791C11.4814 25.4791 11.2859 25.5791 11.2208 25.7461C11.1881 25.813 10.4062 27.0817 8.94004 26.8484C8.386 26.7478 8.09285 26.5808 7.7998 26.4144C7.31103 26.1806 6.91987 26.0131 6.17057 26.1138C6.04031 25.3459 5.74704 25.0114 5.35594 24.6106C5.12795 24.3773 4.89992 24.1435 4.63927 23.6089C3.95506 22.2733 4.89992 21.1379 4.93238 21.1046C5.06286 20.9377 5.12795 20.7371 5.06286 20.5701C4.73707 19.3678 5.35594 18.7337 5.74704 18.4667C6.98514 21.6387 9.91742 23.9096 13.4035 24.1435C13.2734 24.6106 12.8823 25.4122 11.6443 25.4791ZM13.9902 23.1418C9.65685 23.1418 6.13789 19.5353 6.13789 15.0935C6.13789 10.6522 9.65685 7.04569 13.9902 7.04569C18.2908 7.04569 21.8094 10.6522 21.8094 15.0935C21.8094 19.5353 18.2908 23.1418 13.9902 23.1418ZM23.3734 23.6089C23.1128 24.1098 22.885 24.3436 22.6568 24.6106C22.2655 24.9782 21.9727 25.3122 21.8423 26.08C21.0928 25.9799 20.7021 26.1469 20.2131 26.4144C19.92 26.5477 19.6265 26.7146 19.0728 26.8146C17.6065 27.0485 16.8246 25.7798 16.7922 25.713C16.6945 25.5791 16.5315 25.4453 16.3358 25.4453C15.1305 25.4122 14.7396 24.6106 14.6092 24.1435C18.0626 23.8759 20.9951 21.5718 22.2007 18.3998C22.6244 18.6668 23.2757 19.3014 22.9501 20.537C22.885 20.7371 22.9501 20.9377 23.0804 21.0709C23.1128 21.1046 24.0577 22.2401 23.3734 23.6089ZM26.4687 12.5223C26.5337 12.8563 26.5666 13.1901 26.5014 13.7579C26.2407 15.2607 24.8397 15.628 24.7744 15.628C24.6117 15.6612 24.449 15.795 24.3837 15.9954C23.96 17.1975 23.0475 17.2975 22.5591 17.2643C22.7218 16.5631 22.8197 15.8282 22.8197 15.0935C22.8197 12.2885 21.5818 9.78426 19.6265 8.11453C19.9848 7.81383 20.7995 7.31269 21.8747 8.04763C22.0378 8.14798 22.2331 8.14798 22.3961 8.08108C22.4613 8.04763 23.7971 7.47993 24.8397 8.58188C25.2304 8.98268 25.3936 9.28346 25.524 9.58366C25.7846 10.0845 26.0123 10.4853 26.6643 10.8194C26.3383 11.5206 26.371 11.9878 26.4687 12.5223ZM17.0852 21.3717H10.8948C10.7646 21.3717 10.6668 21.4717 10.6668 21.5718V21.8388C10.6668 21.9394 10.7646 22.0726 10.8948 22.0726H17.0852C17.2158 22.0726 17.3135 21.9394 17.3135 21.8388V21.5718C17.3135 21.4717 17.2158 21.3717 17.0852 21.3717ZM11.4814 19.5015H16.4991C16.6292 19.5015 16.7268 19.4015 16.7268 19.3014V19.0344C16.7268 18.9007 16.6292 18.8001 16.4991 18.8001H11.4814C11.3836 18.8001 11.2859 18.9007 11.2859 19.0344V19.3014C11.2859 19.4015 11.3836 19.5015 11.4814 19.5015ZM11.5463 10.3852L12.2307 10.1182L12.8172 10.5521L12.7844 9.81746L13.3711 9.41667L12.6869 9.18312L12.4589 8.48187L12.0676 9.08277H11.351L11.7747 9.68392L11.5463 10.3852ZM9.81954 11.2536L9.62411 10.5521L9.20069 11.153H8.48396L8.9073 11.7208L8.71204 12.4222L9.36346 12.1884L9.94999 12.6224V11.8881L10.5039 11.4537L9.81954 11.2536ZM8.74461 14.4594L8.51645 13.7579L8.12534 14.3591H7.40867L7.83208 14.9603L7.60408 15.6612L8.28845 15.3942L8.87481 15.8282V15.0935L9.42869 14.6595L8.74461 14.4594Z" fill="var(--fill-0, #222222)" id="path2" />
        </g>
      </svg>
    </div>
  );
}

function ChatItem({ 
  label, 
  active = false, 
  onRename, 
  onDelete, 
  onSelect,
  isEditing,
  editingName,
  onEditingNameChange,
  onSaveRename,
  onCancelRename
}: { 
  label: string; 
  active?: boolean; 
  onRename: () => void;
  onDelete: () => void;
  onSelect: () => void;
  isEditing?: boolean;
  editingName?: string;
  onEditingNameChange?: (value: string) => void;
  onSaveRename?: () => void;
  onCancelRename?: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isMenuClickRef = useRef(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // 전체 선택
      inputRef.current.select();
    }
  }, [isEditing]);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu && menuRef.current) {
        const target = event.target as HTMLElement;
        // 메뉴 내부나 MoreVertical 버튼이 아닌 곳을 클릭했을 때만 닫기
        if (!menuRef.current.contains(target) && !target.closest('button[class*="opacity-0"]')) {
          setShowMenu(false);
        }
      }
    };

    if (showMenu) {
      // 약간의 지연을 두어 현재 클릭 이벤트가 처리된 후에 리스너 추가
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showMenu]);

  return (
    <div className="relative">
      <div 
        className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors group cursor-pointer ${
          active ? "bg-gray-300" : "hover:bg-gray-200"
        }`}
        onClick={onSelect}
      >
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
            <input
              ref={inputRef}
              type="text"
              value={editingName !== undefined ? editingName : label}
              onChange={(e) => onEditingNameChange?.(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.currentTarget.blur();
                  onSaveRename?.();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  onCancelRename?.();
                }
              }}
              onBlur={() => {
                // 메뉴 클릭으로 인한 blur가 아니면 저장
                if (!isMenuClickRef.current) {
                  onSaveRename?.();
                }
                isMenuClickRef.current = false;
              }}
              className="h-6 text-sm px-2 border border-gray-300 rounded flex-1"
            />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 flex-1">
              <ChatIcon className="w-5 h-5" />
              <span className="text-sm font-Pretendard">{label}</span>
        </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-300 rounded"
          >
              <MoreVertical className="h-4 w-4" />
          </button>
          </>
        )}
      </div>
      {showMenu && !isEditing && (
        <div ref={menuRef} className="chat-item-menu absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
              isMenuClickRef.current = true;
              onRename();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              isMenuClickRef.current = true;
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
          >
            <Pencil className="w-4 h-4" />
            이름 바꾸기
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
              onDelete();
            }}
            onMouseDown={(e) => e.preventDefault()}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-b-lg"
          >
            <Trash2 className="w-4 h-4" />
            대화 삭제
          </button>
        </div>
      )}
    </div>
  );
}

// Message와 ChatSession은 types/chat.ts에서 import

type UserInfo = {
  name: string;
  department: string;
  year: string;
  status: string;
  gpa: string;
  maxGpa: string;
  additionalInfo: string;
};

export default function Chat() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const headerMenuRef = useRef<HTMLDivElement>(null);
  
  // 채팅방 목록 상태 (새로운 타입 사용)
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoadingChatRooms, setIsLoadingChatRooms] = useState(true);
  
  // 현재 활성 채팅방 ID (null이면 초기 화면)
  const [activeChatId, setActiveChatId] = useState<string | number | null>(null);
  
  // 현재 활성 채팅방의 메시지들
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  // 채팅방 목록 로드
  const loadChatRooms = async () => {
    try {
      setIsLoadingChatRooms(true);
      const response = await getChatRooms(0, 50); // 첫 페이지, 최대 50개
      setChatRooms(response.data?.chat_rooms || []);
    } catch (error) {
      console.error('Failed to load chat rooms:', error);
      setChatRooms([]);
    } finally {
      setIsLoadingChatRooms(false);
    }
  };
  
  // 초기 화면: 채팅방 목록 로드
  useEffect(() => {
    loadChatRooms();
  }, []);
  
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingChatName, setEditingChatName] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  
  // 채팅방 클릭 시: 채팅 내역 로드
  // string | number를 number로 변환하는 헬퍼 함수
  const toNumber = (id: string | number): number => {
    return typeof id === 'string' ? parseInt(id, 10) : id;
  };

  const loadChatHistory = async (chatRoomId: string | number) => {
    try {
      setIsLoadingMessages(true);
      const response = await getChatHistory(toNumber(chatRoomId), 0, 100); // 최신 100개 메시지
      // 최신 메시지가 아래에 오도록 정렬 (createdAt 기준 오름차순)
      const sortedMessages = [...(response.data?.chats || [])].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateA - dateB;
      });
      setCurrentMessages(sortedMessages);
    } catch (error) {
      console.error('Failed to load chat history:', error);
      setCurrentMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const [savedUserInfo, setSavedUserInfo] = useState<UserInfo>({
    name: "",
    department: "컴퓨터학부",
    year: "2학년",
    status: "재학",
    gpa: "3.6",
    maxGpa: "4.3",
    additionalInfo: "",
  });

  const [tempUserInfo, setTempUserInfo] = useState<UserInfo>({
    name: "",
    department: "컴퓨터학부",
    year: "2학년",
    status: "재학",
    gpa: "3.6",
    maxGpa: "4.3",
    additionalInfo: "",
  });

  // currentMessages는 이미 상태로 관리됨

  // 메시지가 추가되면 스크롤을 맨 아래로
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [currentMessages, isTyping]);

  // 헤더 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showHeaderMenu && headerMenuRef.current) {
        const target = event.target as HTMLElement;
        // 메뉴 내부나 버튼이 아닌 곳을 클릭했을 때만 닫기
        if (!headerMenuRef.current.contains(target) && !target.closest('button[class*="h-8"]')) {
          setShowHeaderMenu(false);
        }
      }
    };

    if (showHeaderMenu) {
      // 약간의 지연을 두어 현재 클릭 이벤트가 처리된 후에 리스너 추가
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showHeaderMenu]);

  const suggestedQuestions = [
    "우리 학과의 졸업 요건이 궁금해요.",
    "우리 학과의 졸업 요건이 궁금해요.",
    "우리 학과의 졸업 요건이 궁금해요.",
    "우리 학과의 졸업 요건이 궁금해요.",
  ];

  const handleSuggestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpenUserModal = () => {
    setTempUserInfo(savedUserInfo);
    setShowUserModal(true);
  };

  const handleSaveUserInfo = () => {
    setSavedUserInfo(tempUserInfo);
    setShowUserModal(false);
  };

  const handleCloseUserModal = (e?: React.MouseEvent) => {
    // 배경 클릭만 닫기 (모달 내부 클릭은 무시)
    if (e && e.target !== e.currentTarget) {
      return;
    }
    setShowUserModal(false);
  };

<<<<<<< HEAD
  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    // 낙관적 업데이트: 사용자 메시지를 즉시 추가
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'USER',
      content: textToSend,
      createdAt: new Date().toISOString(),
    };
    setCurrentMessages(prev => [...prev, userMessage]);
    
    setInputMessage("");
    setIsTyping(true);

    try {
      let chatRoomId: string | number;
      let isNewRoom = false;
      
      // activeChatId가 없으면 채팅방 생성
      if (!activeChatId) {
        const createResponse = await createChatRoom(textToSend);
        chatRoomId = createResponse.data?.chat_room_id;
        isNewRoom = true;
      } else {
        chatRoomId = activeChatId;
      }

      // 메시지 전송
      const sendResponse = await sendMessage(toNumber(chatRoomId), textToSend);
      
      // 챗봇 응답 추가 (먼저 메시지를 화면에 표시)
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: 'CHAT_BOT',
        content: sendResponse.data?.answer || '',
        createdAt: new Date().toISOString(),
      };
      setCurrentMessages(prev => [...prev, botMessage]);
      
      // ★ 중요: 새 방인 경우 ID만 설정하고, 내역 조회(loadChatHistory)는 호출하지 않음
      // 답변을 화면에 수동으로 추가했으므로, 서버에서 다시 불러올 필요가 없음
      if (isNewRoom) {
        setActiveChatId(chatRoomId);
        // loadChatHistory는 호출하지 않음! (메시지가 사라지는 것을 방지)
      }
      
      // 채팅방 목록 갱신 (마지막 메시지 업데이트)
      await loadChatRooms();
    } catch (error: any) {
      console.error('Chat error:', error);
      // 에러 메시지 추가
      let errorMessage = '오류가 발생했습니다. 다시 시도해주세요.';
      if (error.response?.status === 404) {
        errorMessage = '채팅 서비스를 준비 중입니다. 잠시 후 다시 시도해주세요.';
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        errorMessage = '인증 오류가 발생했습니다.';
      } else if (error.response?.status === 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      }
      
      const errorBotMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'CHAT_BOT',
        content: errorMessage,
        createdAt: new Date().toISOString(),
      };
      setCurrentMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRenameChat = (chatId: string | number, currentName: string) => {
    setEditingChatId(chatId.toString());
    setEditingChatName(currentName);
  };

  const handleSaveRename = async (chatId: string | number) => {
    // 이미 편집 모드가 아니면 무시
    if (editingChatId !== chatId.toString()) {
      return;
    }

    const nameToSave = (editingChatName || "").trim();
    
    // 빈 값이면 편집 취소
    if (!nameToSave) {
      setEditingChatId(null);
      setEditingChatName("");
      return;
    }
    
    try {
      // 서버에 채팅방 제목 업데이트
      await updateChatRoomTitle(toNumber(chatId), nameToSave);
      
      // 로컬 상태 업데이트
      setChatRooms(prev => 
        prev.map(room => 
          room.id === chatId ? { ...room, title: nameToSave } : room
        )
      );
      
      // 편집 모드 종료
      setEditingChatId(null);
      setEditingChatName("");
      
      // 목록 갱신
      await loadChatRooms();
    } catch (error) {
      console.error('Failed to update chat room title:', error);
    }
  };

  const handleDeleteChat = async (chatId: string | number) => {
    try {
      // 서버에서 채팅방 삭제
      await deleteChatRoom(toNumber(chatId));
      
      // 로컬 상태에서 제거
      setChatRooms(prev => prev.filter(room => room.id !== chatId));
      
      // 현재 활성 채팅방이 삭제된 경우 초기 화면으로
      if (activeChatId === chatId) {
        setActiveChatId(null);
        setCurrentMessages([]);
      }
      
      // 목록 갱신
      await loadChatRooms();
    } catch (error) {
      console.error('Failed to delete chat room:', error);
    }
  };
  
  // 채팅방 선택 핸들러
  // 채팅방을 클릭했을 때만 내역을 불러옴
  const handleSelectChatRoom = async (chatRoomId: string | number) => {
    setActiveChatId(chatRoomId);
    await loadChatHistory(chatRoomId); // 클릭했을 때만 내역 불러오기!
  };

  const handleNewChat = async () => {
    // 현재 선택된 방 ID를 null로 초기화하고 초기 화면으로 돌아가기
    setActiveChatId(null);
    setCurrentMessages([]);
    
    // 채팅방 목록 갱신
    await loadChatRooms();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); 
    } catch (error) {
      console.error('Logout failed:', error);
      // 에러가 발생하더라도 로컬에서는 로그아웃 처리하고 페이지 이동
      navigate('/');
    }
  };
  return (
    <div className="flex h-screen bg-[#505050]">
      {/* Sidebar */}
      {sidebarOpen ? (
        <div className="w-64 bg-[#f5f5f5] border-r border-gray-200 flex flex-col">
          <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
              <KnuLogo />
              <span className="font-semibold font-Pretendard">KNU GPT</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="h-8 w-8 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
            >
              <SlideIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="p-2 space-y-1">
          <button 
              onClick={handleOpenUserModal}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <UserIcon className="w-6 h-6" />
              <span className="text-sm font-Pretendard">사용자</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              <SettingsIcon className="w-6 h-6" />
              <span className="text-sm font-Pretendard">설정</span>
          </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              <GuideIcon className="w-6 h-6" />
              <span className="text-sm font-Pretendard">도움말</span>
          </button>
      </div>

          <div className="h-px bg-gray-200 my-2" />

          {/* New Chat */}
          <div className="p-2">
        <button 
          onClick={handleNewChat}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
              <NewChatIcon className="w-6 h-6" />
              <span className="text-sm font-Pretendard">새 채팅</span>
        </button>
      </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoadingChatRooms ? (
          <div className="p-4 text-center text-gray-500">로딩 중...</div>
        ) : chatRooms.length === 0 ? (
          <div className="p-4 text-center text-gray-500">채팅방이 없습니다</div>
        ) : (
          chatRooms.map((room) => (
            <div key={room.id} className="relative">
              <ChatItem
                label={room.title}
                active={activeChatId === room.id}
                onRename={() => handleRenameChat(room.id, room.title)}
                onDelete={() => handleDeleteChat(room.id)}
                onSelect={() => handleSelectChatRoom(room.id)}
                isEditing={editingChatId === room.id.toString()}
                editingName={editingChatName}
                onEditingNameChange={setEditingChatName}
                onSaveRename={() => handleSaveRename(room.id)}
                onCancelRename={() => {
                  setEditingChatId(null);
                  setEditingChatName("");
                }}
              />
            </div>
          ))
        )}
      </div>

          <div className="p-2">
          <button 
            onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-red-600"
          >
            <LogOut className="w-4 h-4" />
              <span className="text-sm font-Pretendard">로그아웃</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="w-[68px] bg-[#f5f5f5] border-r border-gray-200 flex flex-col items-center py-4">
          {/* KNU GPT Logo */}
          <button 
            onClick={() => setSidebarOpen(true)}
            className="mb-6 flex items-center justify-center hover:bg-gray-200 rounded transition-colors p-2"
          >
            <KnuLogo />
          </button>

          {/* Menu Icons */}
          <div className="flex flex-col gap-4 items-center">
            <button 
              onClick={handleOpenUserModal}
              className="flex items-center justify-center hover:bg-gray-200 rounded transition-colors p-2"
              title="사용자"
            >
              <UserIcon className="w-6 h-6" />
            </button>
            <button 
              className="flex items-center justify-center hover:bg-gray-200 rounded transition-colors p-2"
              title="설정"
            >
              <SettingsIcon className="w-6 h-6" />
            </button>
            <button 
              className="flex items-center justify-center hover:bg-gray-200 rounded transition-colors p-2"
              title="도움말"
            >
              <GuideIcon className="w-6 h-6" />
            </button>
            <button 
              onClick={handleNewChat}
              className="flex items-center justify-center hover:bg-gray-200 rounded transition-colors p-2"
              title="새 채팅"
            >
              <NewChatIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 relative">
          <div className="flex-1" />
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowHeaderMenu(!showHeaderMenu);
              }}
              className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            {showHeaderMenu && activeChatId && (
              <div 
                ref={headerMenuRef}
                className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHeaderMenu(false);
                    handleDeleteChat(activeChatId);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  대화 삭제
                </button>
              </div>
            )}
          </div>
      </div>

        {/* Chat Area */}
        <div ref={chatAreaRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {!activeChatId || currentMessages.length === 0 ? (
            <div className="space-y-[54px] max-w-[840px] mx-auto">
              <div className="flex flex-col gap-[6px] items-start">
                <h1 className="font-Pretendard font-semibold text-[#222222] text-[32px] tracking-[-0.8px] w-full">안녕하세요, KNU GPT 입니다!</h1>
                <p className="font-Pretendard font-medium text-[#505050] text-[21px] tracking-[-0.525px] w-full">경북대학교에 관해 궁금한 모든 것들을 정확하게 답변해주는 AI 챗봇입니다.</p>
                </div>
              <div className="flex gap-[18px] items-center max-w-[860px] mx-auto">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(question)}
                    className="bg-white h-[108px] relative rounded-[18px] shrink-0 w-[200px] hover:shadow-md transition-shadow"
                >
                    <div className="box-border content-stretch flex flex-col gap-[8px] h-[108px] items-center justify-center overflow-clip p-[18px] relative rounded-[inherit] w-[200px]">
                      <p className="font-Pretendard leading-[1.4] not-italic relative shrink-0 text-[#505050] text-[18px] tracking-[-0.45px] w-[164px] text-left whitespace-normal break-words">{question}</p>
                    </div>
                    <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[18px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.03)]" />
                  </button>
                ))}
            </div>
          </div>
        ) : (
            <div className="space-y-6">
              {isLoadingMessages ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-gray-500">메시지를 불러오는 중...</div>
                </div>
              ) : (
                currentMessages.map((message) => (
                  <div key={message.id}>
                    {message.type === 'USER' ? (
                      <div className="flex justify-end max-w-[840px] mx-auto">
                        <div className="bg-[#FFF0F0] rounded-2xl px-4 py-3 max-w-[70%]">
                          <p className="text-base font-Pretendard">{message.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-start max-w-[840px] mx-auto">
                        <div className="space-y-4 max-w-[80%]">
                          <div className="text-base text-gray-900 prose prose-base max-w-none font-Pretendard">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              {isTyping && (
                <div className="flex justify-start max-w-[840px] mx-auto">
                  <div className="max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          </div>

        {/* Input Area */}
        <div className="p-6">
          <div className="max-w-[840px] mx-auto">
            <div className="bg-white box-border content-stretch flex items-center justify-between pl-[20px] pr-[18px] py-[12px] relative rounded-[36px] shrink-0 w-full">
              <div aria-hidden="true" className="absolute border-[#d9d9d9] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[36px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.03)]" />
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="경북대학교에 관한 무엇이든 물어보세요!"
                className="flex-1 bg-transparent outline-none text-[18px] text-[#767676] placeholder:text-[#767676] disabled:opacity-50 font-Pretendard pl-[8px]"
                disabled={isTyping}
              />
              <button 
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                className="mr-[-7px] relative shrink-0 size-[38px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" fill="#DA2127" r="21" />
                  <g transform="translate(10.5, 11)">
                    <path d="M19.4907 9.10579L1.59068 0.105785C0.690683 -0.294215 -0.309317 0.505785 0.0906835 1.40579L2.59068 8.10579L13.9907 10.0058L2.59068 11.9058L0.0906835 18.6058C-0.209317 19.5058 0.690683 20.3058 1.59068 19.8058L19.4907 10.8058C20.1907 10.5058 20.1907 9.50578 19.4907 9.10579Z" fill="white"/>
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>
            </div>
            
      {/* User Info Modal */}
      {showUserModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
          onClick={handleCloseUserModal}
          onMouseDown={(e) => {
            // 모달 내부에서 시작된 마우스 이벤트는 무시
            if (e.target === e.currentTarget) {
              handleCloseUserModal(e);
            }
          }}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto relative" 
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">사용자 정보</h2>
              <button
                onClick={handleCloseUserModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="닫기"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">이름</label>
                <input
                  id="name"
                  type="text"
                  placeholder="이름"
                  value={tempUserInfo.name}
                  onChange={(e) => setTempUserInfo({ ...tempUserInfo, name: e.target.value })}
                  maxLength={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500">최대 10자 입력 가능</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="department" className="block text-sm font-medium">학과</label>
                <input
                  id="department"
                  type="text"
                  placeholder="컴퓨터학부"
                  value={tempUserInfo.department}
                  onChange={(e) => setTempUserInfo({ ...tempUserInfo, department: e.target.value })}
                  maxLength={20}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500">최대 20자 입력 가능</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">재학 여부</label>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((year) => (
                      <label key={year} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="year"
                          value={`${year}학년`}
                          checked={tempUserInfo.year === `${year}학년`}
                          onChange={(e) => setTempUserInfo({ ...tempUserInfo, year: e.target.value, status: "재학" })}
                          className="w-4 h-4 text-[#DA2127] border-gray-300 focus:ring-[#DA2127]"
                        />
                        <span className="text-sm">{year}학년</span>
                      </label>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["휴학", "초과 학기", "졸업 유예"].map((status) => (
                      <label key={status} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value={status}
                          checked={tempUserInfo.status === status}
                          onChange={(e) => setTempUserInfo({ ...tempUserInfo, status: e.target.value, year: "" })}
                          className="w-4 h-4 text-[#DA2127] border-gray-300 focus:ring-[#DA2127]"
                        />
                        <span className="text-sm">{status}</span>
                      </label>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["대학원", "교직원", "선택 안함"].map((status) => (
                      <label key={status} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value={status}
                          checked={tempUserInfo.status === status}
                          onChange={(e) => setTempUserInfo({ ...tempUserInfo, status: e.target.value, year: "" })}
                          className="w-4 h-4 text-[#DA2127] border-gray-300 focus:ring-[#DA2127]"
                        />
                        <span className="text-sm">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">학점</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder={tempUserInfo.gpa === '' ? "3.6" : ""}
                    value={tempUserInfo.gpa}
                    onChange={(e) => {
                      const value = e.target.value;
                      // 숫자와 소수점만 허용
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        const maxGpa = parseFloat(tempUserInfo.maxGpa) || 4.5;
                        const gpa = parseFloat(value);
                        
                        // 최대학점보다 큰 값 입력 방지
                        if (value === '' || (!isNaN(gpa) && gpa >= 0 && gpa <= maxGpa)) {
                          setTempUserInfo({ ...tempUserInfo, gpa: value });
                        }
                      }
                    }}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <span className="text-gray-500">/</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder={tempUserInfo.maxGpa === '' ? "4.3" : ""}
                    value={tempUserInfo.maxGpa}
                    onChange={(e) => {
                      const value = e.target.value;
                      // 숫자와 소수점만 허용
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        const maxGpa = parseFloat(value) || 4.5;
                        const currentGpa = parseFloat(tempUserInfo.gpa) || 0;
                        
                        // 최대학점 변경 시 현재 학점이 새로운 최대학점보다 크면 조정
                        if (value === '' || (!isNaN(maxGpa) && maxGpa >= 0)) {
                          const newGpa = currentGpa > maxGpa ? '' : tempUserInfo.gpa;
                          setTempUserInfo({ ...tempUserInfo, maxGpa: value, gpa: newGpa });
                        }
                      }
                    }}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                {tempUserInfo.gpa && tempUserInfo.maxGpa && parseFloat(tempUserInfo.gpa) > parseFloat(tempUserInfo.maxGpa) && (
                  <p className="text-xs text-red-500">현재 학점은 최대 학점보다 클 수 없습니다.</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="additional" className="block text-sm font-medium">추가 정보</label>
                <input
                  id="additional"
                  type="text"
                  placeholder=""
                  value={tempUserInfo.additionalInfo}
                  onChange={(e) => setTempUserInfo({ ...tempUserInfo, additionalInfo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <button
                onClick={handleSaveUserInfo}
                className="w-full px-4 py-2 bg-[#DA2127] hover:bg-[#c01d23] text-white rounded-md transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
