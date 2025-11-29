import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sendGuestMessage } from '../api/chatApi';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// KNU 로고 컴포넌트
function G() {
  return (
    <div className="absolute contents inset-0" data-name="g1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="group-R5">
          <path d="M16.0753 14.1918V13.9585C16.0753 13.8248 15.9778 13.7247 15.8798 13.7247H12.1329C12.0027 13.7247 11.9049 13.8248 11.9049 13.9585V14.1918C11.9049 14.3256 12.0027 14.426 12.1329 14.426H15.8798C15.9778 14.426 16.0753 14.3256 16.0753 14.1918ZM11.9049 12.6893V12.9231C11.9049 13.0566 12.0027 13.1569 12.1329 13.1569H15.8798C15.9778 13.1569 16.0753 13.0566 16.0753 12.9231V12.6893C16.0753 12.5555 15.9778 12.4558 15.8798 12.4558H12.1329C12.0027 12.4558 11.9049 12.5555 11.9049 12.6893ZM11.807 17.7652V18.0322C11.807 18.1328 11.9049 18.2324 12.0354 18.2324H15.9778C16.0753 18.2324 16.1731 18.1328 16.1731 18.0322V17.7652C16.1731 17.632 16.0753 17.5314 15.9778 17.5314H12.0354C11.9049 17.5314 11.807 17.632 11.807 17.7652ZM12.5241 15.6946H15.4565C15.5866 15.6946 15.6842 15.5943 15.6842 15.4611V15.2272C15.6842 15.0935 15.5866 14.9937 15.4565 14.9937H12.5241C12.3936 14.9937 12.2958 15.0935 12.2958 15.2272V15.4611C12.2958 15.5943 12.3936 15.6946 12.5241 15.6946ZM15.2282 10.5521L15.8145 10.1182L16.4991 10.3852L16.2708 9.68392L16.7268 9.08277H16.0102L15.5866 8.48187L15.3585 9.18312L14.6745 9.41667L15.2608 9.81746L15.2282 10.5521ZM12.1003 16.4965V16.7298C12.1003 16.8635 12.1981 16.9636 12.3284 16.9636H15.6842C15.7819 16.9636 15.8798 16.8635 15.8798 16.7298V16.4965C15.8798 16.3627 15.7819 16.2623 15.6842 16.2623H12.3284C12.1981 16.2623 12.1003 16.3627 12.1003 16.4965ZM11.123 20.7702H16.8572C16.9876 20.7702 17.0852 20.6707 17.0852 20.5701V20.303C17.0852 20.203 16.9876 20.0692 16.8572 20.0692H11.123C11.0253 20.0692 10.9275 20.203 10.9275 20.303V20.5701C10.9275 20.6707 11.0253 20.7702 11.123 20.7702ZM19.7568 15.3942L20.4414 15.6612L20.2131 14.9603L20.6368 14.3591H19.92L19.5288 13.7579L19.3009 14.4594L18.6168 14.6595L19.2034 15.0935L19.1705 15.8282L19.7568 15.3942ZM18.682 12.1884L19.3658 12.4222L19.1381 11.7208L19.5614 11.153H18.8445L18.4539 10.5521L18.2259 11.2536L17.5412 11.4537L18.1278 11.8881L18.0955 12.6224L18.682 12.1884ZM28 10.4853V10.4184C27.9673 10.2851 27.8699 10.1851 27.772 10.0845C27.7393 10.0845 27.7067 10.0513 27.6416 10.0513C26.8273 9.71737 26.7294 9.51676 26.5337 9.08277C26.371 8.78257 26.143 8.31488 25.6216 7.78072C24.351 6.47816 22.852 6.74558 22.2331 6.9456C21.3861 6.4448 20.5715 6.4448 19.9525 6.64515C19.9525 5.97727 19.6918 5.20938 18.9751 4.54143C18.9427 3.87355 18.7471 2.33744 17.1505 1.50266C16.4662 1.13506 16.0102 1.06858 15.6518 1.03514C15.1958 0.968409 15.0002 0.934959 14.4462 0.233551C14.4138 0.200102 14.3809 0.166655 14.3486 0.133373C14.2509 0.0664768 14.1856 0.0332794 14.0878 0.0332794L14.0551 -1.90735e-06H13.9902H13.9249L13.8924 0.0332794H13.8271L13.7944 0.0664768H13.7296L13.6643 0.0999241V0.133373H13.6317C13.6317 0.166655 13.5991 0.166655 13.5664 0.200102V0.233551C13.0127 0.934959 12.7844 0.968409 12.3284 1.03514C11.9701 1.06858 11.5141 1.13506 10.8297 1.50266C9.23326 2.33744 9.03783 3.87355 9.00526 4.54143C8.28845 5.20938 8.06045 5.97727 8.02777 6.6786C7.40867 6.47816 6.62672 6.47816 5.77973 6.97905C5.16053 6.77869 3.66178 6.51161 2.3911 7.78072C1.86977 8.34808 1.64167 8.78257 1.47896 9.11622C1.28346 9.51676 1.18562 9.75081 0.370991 10.0513C0.208142 10.1182 0.11063 10.2183 0.045292 10.3852C0.0127986 10.4184 0.0127986 10.4521 0.0127986 10.4853C0.0127986 10.5187 0.0127986 10.5521 0.0127986 10.5855C-0.0198224 10.6859 0.0127986 10.786 0.0779767 10.886C0.566622 11.6542 0.534128 11.8881 0.468791 12.3553C0.403676 12.7228 0.305973 13.1901 0.436138 13.9585C0.729472 15.7615 2.09806 16.4628 2.6843 16.6629C3.1078 17.5983 3.72706 18.0659 4.37859 18.2661C3.98771 18.8338 3.72706 19.6016 3.9224 20.6038C3.56421 21.1379 2.84712 22.5072 3.66178 24.1435C3.98771 24.8445 4.34597 25.1783 4.60659 25.4122C4.93238 25.7461 5.09526 25.9135 5.12795 26.8146C5.12795 26.9153 5.16053 26.9816 5.19306 27.0485V27.0817L5.25833 27.1486C5.38853 27.3155 5.61659 27.4161 5.81232 27.3492C6.69187 27.1154 6.88731 27.2154 7.2785 27.4161C7.60408 27.6162 8.02777 27.8169 8.77718 27.9501C10.5366 28.2508 11.6116 27.1154 12.0027 26.5808C12.9803 26.4476 13.6317 25.9799 14.0225 25.4122C14.4138 25.9799 15.0326 26.4476 16.0425 26.5477C16.4011 27.0817 17.4765 28.2171 19.2358 27.9169C19.9848 27.8169 20.4085 27.5825 20.7344 27.4161C21.1254 27.1823 21.3211 27.0817 22.1681 27.3155C22.2007 27.3155 22.2655 27.3492 22.2984 27.3492C22.3637 27.3492 22.4288 27.3155 22.4937 27.3155C22.5262 27.2822 22.5591 27.2822 22.5915 27.2822V27.2492L22.6568 27.2154L22.6893 27.1823L22.7218 27.1486L22.7544 27.1154L22.7868 27.0817L22.8197 27.0148L22.852 26.9485V26.9153C22.885 26.8815 22.885 26.8484 22.885 26.7815C22.9173 25.8799 23.0804 25.713 23.4063 25.4122C23.667 25.1452 24.0251 24.8112 24.351 24.1098C25.1656 22.4734 24.449 21.1046 24.0903 20.5701C24.2857 19.5684 24.0251 18.8001 23.6341 18.2661C24.2857 18.0322 24.905 17.5651 25.3283 16.6298C25.9149 16.4296 27.2833 15.728 27.5764 13.9585C27.7067 13.1901 27.6093 12.6893 27.544 12.3222C27.4786 11.8881 27.446 11.6542 27.9024 10.886C27.9353 10.8529 27.9673 10.8194 27.9673 10.786C28 10.7191 28 10.6522 28 10.5855V10.5521C28 10.5521 28 10.5187 28 10.4853ZM9.91742 5.24258C10.0801 5.10921 10.1454 4.94214 10.1128 4.74153C10.1128 4.67505 10.0153 3.20542 11.3183 2.50452C11.8396 2.2371 12.1656 2.20382 12.4914 2.13692C13.0127 2.07036 13.4363 1.9701 13.9902 1.40248C14.5439 1.9701 14.9676 2.07036 15.4888 2.13692C15.8145 2.20382 16.1406 2.2371 16.6618 2.50452C17.9978 3.20542 17.8672 4.67505 17.8672 4.74153C17.8348 4.94214 17.9325 5.10921 18.0626 5.24258C19.0728 6.04417 18.8774 6.97905 18.682 7.41329C17.3135 6.54481 15.7171 6.01064 13.9902 6.01064C12.2634 6.01064 10.6341 6.54481 9.2984 7.41329C9.10281 6.9456 8.94004 6.04417 9.91742 5.24258ZM3.62913 15.9954C3.56421 15.8282 3.40111 15.6946 3.23826 15.6612C3.17311 15.628 1.77213 15.2941 1.51145 13.7913C1.44627 13.2236 1.47896 12.8563 1.54407 12.5555C1.64167 11.9878 1.6743 11.5538 1.34873 10.8529C2.00022 10.4853 2.22828 10.1182 2.45628 9.61736C2.61913 9.31666 2.74958 9.01587 3.17311 8.58188C4.21574 7.51338 5.55173 8.08108 5.61659 8.11453C5.77973 8.18109 5.9752 8.14798 6.13789 8.04763C7.18051 7.34639 7.96249 7.78072 8.32086 8.11453C6.36604 9.78426 5.12795 12.2885 5.12795 15.0935C5.12795 15.8619 5.22574 16.5965 5.38853 17.2975C4.89992 17.3312 4.05288 17.1639 3.62913 15.9954ZM11.6443 25.4791C11.4814 25.4791 11.2859 25.5791 11.2208 25.7461C11.1881 25.813 10.4062 27.0817 8.94004 26.8484C8.386 26.7478 8.09285 26.5808 7.7998 26.4144C7.31103 26.1806 6.91987 26.0131 6.17057 26.1138C6.04031 25.3459 5.74704 25.0114 5.35594 24.6106C5.12795 24.3773 4.89992 24.1435 4.63927 23.6089C3.95506 22.2733 4.89992 21.1379 4.93238 21.1046C5.06286 20.9377 5.12795 20.7371 5.06286 20.5701C4.73707 19.3678 5.35594 18.7337 5.74704 18.4667C6.98514 21.6387 9.91742 23.9096 13.4035 24.1435C13.2734 24.6106 12.8823 25.4122 11.6443 25.4791ZM13.9902 23.1418C9.65685 23.1418 6.13789 19.5353 6.13789 15.0935C6.13789 10.6522 9.65685 7.04569 13.9902 7.04569C18.2908 7.04569 21.8094 10.6522 21.8094 15.0935C21.8094 19.5353 18.2908 23.1418 13.9902 23.1418ZM23.3734 23.6089C23.1128 24.1098 22.885 24.3436 22.6568 24.6106C22.2655 24.9782 21.9727 25.3122 21.8423 26.08C21.0928 25.9799 20.7021 26.1469 20.2131 26.4144C19.92 26.5477 19.6265 26.7146 19.0728 26.8146C17.6065 27.0485 16.8246 25.7798 16.7922 25.713C16.6945 25.5791 16.5315 25.4453 16.3358 25.4453C15.1305 25.4122 14.7396 24.6106 14.6092 24.1435C18.0626 23.8759 20.9951 21.5718 22.2007 18.3998C22.6244 18.6668 23.2757 19.3014 22.9501 20.537C22.885 20.7371 22.9501 20.9377 23.0804 21.0709C23.1128 21.1046 24.0577 22.2401 23.3734 23.6089ZM26.4687 12.5223C26.5337 12.8563 26.5666 13.1901 26.5014 13.7579C26.2407 15.2607 24.8397 15.628 24.7744 15.628C24.6117 15.6612 24.449 15.795 24.3837 15.9954C23.96 17.1975 23.0475 17.2975 22.5591 17.2643C22.7218 16.5631 22.8197 15.8282 22.8197 15.0935C22.8197 12.2885 21.5818 9.78426 19.6265 8.11453C19.9848 7.81383 20.7995 7.31269 21.8747 8.04763C22.0378 8.14798 22.2331 8.14798 22.3961 8.08108C22.4613 8.04763 23.7971 7.47993 24.8397 8.58188C25.2304 8.98268 25.3936 9.28346 25.524 9.58366C25.7846 10.0845 26.0123 10.4853 26.6643 10.8194C26.3383 11.5206 26.371 11.9878 26.4687 12.5223ZM17.0852 21.3717H10.8948C10.7646 21.3717 10.6668 21.4717 10.6668 21.5718V21.8388C10.6668 21.9394 10.7646 22.0726 10.8948 22.0726H17.0852C17.2158 22.0726 17.3135 21.9394 17.3135 21.8388V21.5718C17.3135 21.4717 17.2158 21.3717 17.0852 21.3717ZM11.4814 19.5015H16.4991C16.6292 19.5015 16.7268 19.4015 16.7268 19.3014V19.0344C16.7268 18.9007 16.6292 18.8001 16.4991 18.8001H11.4814C11.3836 18.8001 11.2859 18.9007 11.2859 19.0344V19.3014C11.2859 19.4015 11.3836 19.5015 11.4814 19.5015ZM11.5463 10.3852L12.2307 10.1182L12.8172 10.5521L12.7844 9.81746L13.3711 9.41667L12.6869 9.18312L12.4589 8.48187L12.0676 9.08277H11.351L11.7747 9.68392L11.5463 10.3852ZM9.81954 11.2536L9.62411 10.5521L9.20069 11.153H8.48396L8.9073 11.7208L8.71204 12.4222L9.36346 12.1884L9.94999 12.6224V11.8881L10.5039 11.4537L9.81954 11.2536ZM8.74461 14.4594L8.51645 13.7579L8.12534 14.3591H7.40867L7.83208 14.9603L7.60408 15.6612L8.28845 15.3942L8.87481 15.8282V15.0935L9.42869 14.6595L8.74461 14.4594Z" fill="var(--fill-0, #222222)" id="path2" />
        </g>
      </svg>
    </div>
  );
}

// 사이드바 상단 로고 영역
function Frame3() {
  return (
    <div className="relative shrink-0 size-[28px]">
      <G />
    </div>
  );
}

// 사이드바 상단 컨테이너
function Frame11() {
  return (
    <div className="box-border content-stretch flex flex-col items-start p-[20px] relative shrink-0 size-[68px]">
      <Frame3 />
    </div>
  );
}

// 사이드바 컴포넌트
function Sidebar() {
  return (
    <div className="bg-white content-stretch flex flex-col h-full items-start overflow-clip relative shrink-0 w-[68px]" data-name="sidebar">
      <Frame11 />
    </div>
  );
}

// 전송 버튼 컴포넌트
function SendButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mr-[-7px] relative shrink-0 size-[38px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 42">
        <circle cx="21" cy="21" fill="#DA2127" r="21" />
        <g transform="translate(10.5, 11)">
          <path d="M19.4907 9.10579L1.59068 0.105785C0.690683 -0.294215 -0.309317 0.505785 0.0906835 1.40579L2.59068 8.10579L13.9907 10.0058L2.59068 11.9058L0.0906835 18.6058C-0.209317 19.5058 0.690683 20.3058 1.59068 19.8058L19.4907 10.8058C20.1907 10.5058 20.1907 9.50578 19.4907 9.10579Z" fill="white"/>
        </g>
      </svg>
    </button>
  );
}

// 입력 필드 컴포넌트
function Frame2({ inputMessage, setInputMessage, handleKeyPress, handleSendMessage, disabled }: {
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleSendMessage: () => void;
  disabled: boolean;
}) {
  return (
    <div className="bg-white box-border content-stretch flex items-center justify-between pl-[20px] pr-[18px] py-[12px] relative rounded-[36px] shrink-0 w-full max-w-[840px]">
      <div aria-hidden="true" className="absolute border-[#d9d9d9] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[36px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.03)]" />
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="경북대학교에 관한 무엇이든 물어보세요!"
        disabled={disabled}
        className="flex-1 bg-transparent outline-none text-[18px] text-[#767676] placeholder:text-[#767676] disabled:opacity-50 font-Pretendard pl-[8px]"
      />
      <SendButton onClick={handleSendMessage} disabled={disabled || !inputMessage.trim()} />
    </div>
  );
}

// 하단 입력 영역
function Frame7({ inputMessage, setInputMessage, handleKeyPress, handleSendMessage, disabled }: {
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleSendMessage: () => void;
  disabled: boolean;
}) {
  return (
    <div className="absolute bottom-0 box-border content-stretch flex flex-col gap-[8px] items-center justify-center left-0 pb-[36px] pt-0 px-0 right-0">
      <Frame2
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleKeyPress={handleKeyPress}
        handleSendMessage={handleSendMessage}
        disabled={disabled}
      />
    </div>
  );
}

// 로그인 버튼
function Frame14({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#da2127] box-border content-stretch flex gap-[8px] items-center justify-center px-[18px] py-[7px] relative rounded-[26px] shrink-0 hover:bg-[#c01d23] transition-colors"
    >
      <p className="font-Pretendard font-semibold leading-[1.4] not-italic relative shrink-0 text-[16px] text-nowrap text-white tracking-[-0.4px] whitespace-pre">로그인</p>
    </button>
  );
}

// 회원가입 버튼
function Frame15({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="box-border content-stretch flex gap-[8px] items-center justify-center px-[18px] py-[7px] relative rounded-[26px] shrink-0 hover:bg-gray-50 transition-colors"
    >
      <div aria-hidden="true" className="absolute border-[#d9d9d9] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[26px]" />
      <p className="font-Pretendard font-semibold leading-[1.4] not-italic relative shrink-0 text-[#222222] text-[16px] text-nowrap tracking-[-0.4px] whitespace-pre">회원 가입</p>
    </button>
  );
}

// 헤더 영역
function Frame12({ handleLogin, handleSignup }: { handleLogin: () => void; handleSignup: () => void }) {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-end overflow-clip px-[20px] py-[14px] relative shrink-0 w-full">
      <Frame14 onClick={handleLogin} />
      <Frame15 onClick={handleSignup} />
    </div>
  );
}

// 환영 메시지 영역
function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start leading-[1.4] not-italic relative shrink-0 w-full max-w-[840px]">
      <p className="font-Pretendard font-semibold relative shrink-0 text-[#222222] text-[32px] tracking-[-0.8px] w-full">안녕하세요, KNU GPT 입니다!</p>
      <p className="font-Pretendard font-medium relative shrink-0 text-[#505050] text-[21px] tracking-[-0.525px] w-full">경북대학교에 관해 궁금한 모든 것들을 정확하게 답변해주는 AI 챗봇입니다.</p>
    </div>
  );
}

// 환영 메시지 컨테이너
function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center justify-center relative shrink-0 w-full">
      <Frame4 />
    </div>
  );
}

// 예시 질문 카드
function Frame6({ question, onClick, disabled }: { question: string; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-white h-[108px] relative rounded-[18px] shrink-0 w-[200px] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-shadow"
    >
      <div className="box-border content-stretch flex flex-col gap-[8px] h-[108px] items-center justify-center overflow-clip p-[18px] relative rounded-[inherit] w-[200px]">
        <p className="font-Pretendard leading-[1.4] not-italic relative shrink-0 text-[#505050] text-[18px] tracking-[-0.45px] w-[164px] text-left whitespace-normal break-words">{question}</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[18px] shadow-[10px_10px_30px_0px_rgba(0,0,0,0.03)]" />
    </button>
  );
}

// 예시 질문 카드들
function Frame5({ suggestedQuestions, handleSuggestionClick, disabled }: {
  suggestedQuestions: string[];
  handleSuggestionClick: (question: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="content-stretch flex gap-[18px] items-center relative shrink-0 w-full max-w-[860px] flex-wrap">
      {suggestedQuestions.map((question, idx) => (
        <Frame6 key={idx} question={question} onClick={() => handleSuggestionClick(question)} disabled={disabled} />
      ))}
    </div>
  );
}

// 예시 질문 컨테이너
function Frame8({ suggestedQuestions, handleSuggestionClick, disabled }: {
  suggestedQuestions: string[];
  handleSuggestionClick: (question: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center justify-center relative shrink-0 w-full">
      <Frame5 suggestedQuestions={suggestedQuestions} handleSuggestionClick={handleSuggestionClick} disabled={disabled} />
    </div>
  );
}

// 메인 콘텐츠 영역
function Frame9({ suggestedQuestions, handleSuggestionClick, disabled }: {
  suggestedQuestions: string[];
  handleSuggestionClick: (question: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="content-stretch flex flex-col gap-[54px] items-start relative shrink-0 w-full">
      <Frame10 />
      <Frame8 suggestedQuestions={suggestedQuestions} handleSuggestionClick={handleSuggestionClick} disabled={disabled} />
    </div>
  );
}

// 채팅 메시지 영역
function ChatMessages({ messages, isTyping }: { messages: Message[]; isTyping: boolean }) {
  return (
    <div className="space-y-6 w-full max-w-[840px] mx-auto">
      {messages.map((message) => (
        <div key={message.id}>
          {message.isUser ? (
            <div className="flex justify-end mb-4">
              <div className="bg-[#FFF0F0] rounded-2xl px-4 py-3 max-w-[80%]">
                <p className="text-base font-Pretendard">{message.text}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-start mb-4">
              <div className="max-w-[80%]">
                <div className="text-base text-gray-900 prose prose-base max-w-none font-Pretendard">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.text || ''}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      {isTyping && (
        <div className="flex justify-start mb-4">
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
  );
}

// 콘텐츠 영역
function Frame13({
  handleLogin,
  handleSignup,
  messages,
  isTyping,
  suggestedQuestions,
  handleSuggestionClick,
  disabled
}: {
  handleLogin: () => void;
  handleSignup: () => void;
  messages: Message[];
  isTyping: boolean;
  suggestedQuestions: string[];
  handleSuggestionClick: (question: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="absolute content-stretch flex flex-col gap-[42px] items-start left-0 top-0 w-full pb-[180px]">
      <Frame12 handleLogin={handleLogin} handleSignup={handleSignup} />
      {messages.length === 0 ? (
        <Frame9 suggestedQuestions={suggestedQuestions} handleSuggestionClick={handleSuggestionClick} disabled={disabled} />
      ) : (
        <div className="w-full px-[20px] pt-[42px]">
          <ChatMessages messages={messages} isTyping={isTyping} />
        </div>
      )}
    </div>
  );
}

// 한도 배너 버튼 (로그인)
function LimitBannerLoginButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#da2127] box-border content-stretch flex gap-[6px] items-center justify-center px-[16px] py-[6px] relative rounded-[24px] shrink-0 hover:bg-[#c01d23] transition-colors"
    >
      <p className="font-Pretendard font-semibold leading-[1.4] not-italic relative shrink-0 text-[16px] text-nowrap text-white tracking-[-0.4px] whitespace-pre">로그인</p>
    </button>
  );
}

// 한도 배너 버튼 (회원가입)
function LimitBannerSignupButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="box-border content-stretch flex gap-[6px] items-center justify-center px-[16px] py-[6px] relative rounded-[24px] shrink-0 hover:bg-gray-50 transition-colors"
    >
      <div aria-hidden="true" className="absolute border-[#d9d9d9] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <p className="font-Pretendard font-semibold leading-[1.4] not-italic relative shrink-0 text-[#222222] text-[16px] text-nowrap tracking-[-0.4px] whitespace-pre">회원 가입</p>
    </button>
  );
}

// 메인 영역
function Main({
  inputMessage,
  setInputMessage,
  handleKeyPress,
  handleSendMessage,
  disabled,
  handleLogin,
  handleSignup,
  messages,
  isTyping,
  suggestedQuestions,
  handleSuggestionClick,
  showLimitBanner,
  chatAreaRef
}: {
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleSendMessage: () => void;
  disabled: boolean;
  handleLogin: () => void;
  handleSignup: () => void;
  messages: Message[];
  isTyping: boolean;
  suggestedQuestions: string[];
  handleSuggestionClick: (question: string) => void;
  showLimitBanner: boolean;
  chatAreaRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="bg-white h-full relative shrink-0 flex-1 overflow-hidden" data-name="main">
      <div ref={chatAreaRef} className="h-full overflow-y-auto">
        <Frame13
          handleLogin={handleLogin}
          handleSignup={handleSignup}
          messages={messages}
          isTyping={isTyping}
          suggestedQuestions={suggestedQuestions}
          handleSuggestionClick={handleSuggestionClick}
          disabled={disabled}
        />
      </div>
      {showLimitBanner && (
        <div className="absolute bottom-[100px] left-0 right-0 px-[20px] animate-slideUp z-10">
          <div className="flex items-center justify-between bg-white border border-gray-300 rounded-xl px-8 py-6 shadow-sm max-w-[840px] mx-auto">
            <div className="flex-1">
              <p className="text-base text-gray-800 font-Pretendard mb-1">오늘의 게스트 채팅 한도에 도달했습니다.</p>
              <p className="text-base text-gray-800 font-Pretendard">로그인 또는 회원 가입을 하고 더 많은 채팅을 할 수 있습니다.</p>
            </div>
            <div className="flex gap-[10px] ml-6">
              <LimitBannerLoginButton onClick={handleLogin} />
              <LimitBannerSignupButton onClick={handleSignup} />
            </div>
          </div>
        </div>
      )}
      <Frame7
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleKeyPress={handleKeyPress}
        handleSendMessage={handleSendMessage}
        disabled={disabled}
      />
    </div>
  );
}

export default function GuestPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [guestConversationCount, setGuestConversationCount] = useState(0);
  const [showLimitBanner, setShowLimitBanner] = useState(false);
  const streamingMessageRef = useRef<string>("");
  const streamingMessageIdRef = useRef<string | null>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const GUEST_LIMIT = 5; // 비로그인 시 5번 제한
  
  // 메시지가 추가되면 스크롤을 맨 아래로
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (guestConversationCount >= GUEST_LIMIT) {
      const timer = setTimeout(() => {
        setShowLimitBanner(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [guestConversationCount]);

  const suggestedQuestions = [
    "우리 학과의 졸업 요건이 궁금해요.",
    "우리 학과의 졸업 요건이 궁금해요.",
    "우리 학과의 졸업 요건이 궁금해요.",
    "우리 학과의 졸업 요건이 궁금해요.",
  ];

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    // Check guest limit
    if (guestConversationCount >= GUEST_LIMIT) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Increment guest conversation count on each message send
    setGuestConversationCount(prev => prev + 1);

    // 비회원 채팅 API 호출
    try {
      const response = await sendGuestMessage(textToSend);
      const answer = response.data?.answer || '';
      
      // 챗봇 응답 메시지 추가
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: answer,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    } catch (error) {
      // 에러 처리
      console.error('Chat error:', error);
      setIsTyping(false);
      
      // 에러 메시지 생성
      let errorMessage = '오류가 발생했습니다. 다시 시도해주세요.';
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = '채팅 서비스를 준비 중입니다. 잠시 후 다시 시도해주세요.';
        } else if (error.message.includes('403') || error.message.includes('401')) {
          errorMessage = '인증 오류가 발생했습니다.';
        } else if (error.message.includes('500')) {
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
      }
      
      // 에러 메시지 추가
      const errorMessageObj: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessageObj]);
    }
  };

  const handleSuggestionClick = (question: string) => {
    if (guestConversationCount >= GUEST_LIMIT) {
      return;
    }
    handleSendMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/login');
  };

  return (
    <div className="content-stretch flex items-start relative size-full h-screen" data-name="Guest1">
      <Sidebar />
      <Main
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleKeyPress={handleKeyPress}
        handleSendMessage={handleSendMessage}
        disabled={guestConversationCount >= GUEST_LIMIT || isTyping}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        messages={messages}
        isTyping={isTyping}
        suggestedQuestions={suggestedQuestions}
        handleSuggestionClick={handleSuggestionClick}
        showLimitBanner={showLimitBanner}
        chatAreaRef={chatAreaRef}
      />
    </div>
  );
}
