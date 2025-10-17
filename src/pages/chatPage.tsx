import React, { useState } from "react";
import { Plus, User, Settings, HelpCircle, LogOut, PanelLeftClose, PanelLeft, Send, MessageCircle, MoreHorizontal, Edit, Trash2, AlertCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function LeftMenuItem({ icon: Icon, label, active = false, collapsed = false }: { icon: React.ElementType; label: string; active?: boolean; collapsed?: boolean }) {
  return (
    <button
      className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-xl text-sm transition ${
        active
          ? "bg-gray-200 text-gray-800"
          : "text-gray-600 hover:bg-gray-100"
      }`}
      title={collapsed ? label : undefined}
    >
      <Icon className="w-4 h-4" />
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}

function ChatItem({ label, active = false, collapsed = false, onRename, onDelete, onSelect }: { 
  label: string; 
  active?: boolean; 
  collapsed?: boolean;
  onRename: () => void;
  onDelete: () => void;
  onSelect: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showMoreIcon, setShowMoreIcon] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setShowMoreIcon(true)}
      onMouseLeave={() => {
        setShowMoreIcon(false);
        setShowMenu(false);
      }}
    >
      <button
        onClick={onSelect}
        className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-2 rounded-xl text-sm transition ${
          active
            ? "bg-gray-200 text-gray-800"
            : "text-gray-600 hover:bg-gray-100"
        }`}
        title={collapsed ? label : undefined}
      >
        <div className={`flex items-center ${collapsed ? 'gap-0' : 'gap-3'}`}>
          <MessageCircle className="w-4 h-4" />
          {!collapsed && <span className="truncate">{label}</span>}
        </div>
        {!collapsed && showMoreIcon && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 hover:bg-gray-200 rounded transition"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </button>
      
      {!collapsed && showMenu && (
        <div className="absolute right-0 top-0 mt-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRename();
              setShowMenu(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
          >
            <Edit className="w-3 h-3" />
            이름 바꾸기
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              setShowMenu(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-b-lg"
          >
            <Trash2 className="w-3 h-3" />
            삭제
          </button>
        </div>
      )}
    </div>
  );
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
}

export default function Chat() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    { id: '1', name: '채팅 1', messages: [] },
  ]);
  const [activeChatId, setActiveChatId] = useState('1');
  const [isGuestMode, setIsGuestMode] = useState(false); // 로그인된 상태로 시작
  const [guestConversationCount, setGuestConversationCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const GUEST_LIMIT = 3;

  // 현재 활성 채팅의 메시지 가져오기
  const currentMessages = chatSessions.find(chat => chat.id === activeChatId)?.messages || [];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Check guest limit
    if (isGuestMode && guestConversationCount >= GUEST_LIMIT) {
      setShowLimitModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    // 현재 활성 채팅에 메시지 추가
    setChatSessions(prev => 
      prev.map(chat => 
        chat.id === activeChatId 
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );
    
    setInputMessage("");
    setIsTyping(true);

    // Increment guest conversation count if this is the first message in a new conversation
    if (isGuestMode && currentMessages.length === 0) {
      setGuestConversationCount(prev => prev + 1);
    }

    // Simulate LLM response
    setTimeout(() => {
      const llmResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `안녕하세요! "${inputMessage}"에 대한 답변입니다. 경북대학교에 관한 질문이시군요. 더 자세한 정보가 필요하시면 언제든 말씀해 주세요!`,
        isUser: false,
        timestamp: new Date(),
      };
      
      // 현재 활성 채팅에 응답 메시지 추가
      setChatSessions(prev => 
        prev.map(chat => 
          chat.id === activeChatId 
            ? { ...chat, messages: [...chat.messages, llmResponse] }
            : chat
        )
      );
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRenameChat = (chatId: string) => {
    const newName = prompt('새로운 채팅 이름을 입력하세요:');
    if (newName && newName.trim()) {
      setChatSessions(prev => 
        prev.map(chat => 
          chat.id === chatId ? { ...chat, name: newName.trim() } : chat
        )
      );
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setChatSessions(prev => prev.filter(chat => chat.id !== chatId));
    if (activeChatId === chatId) {
      const remainingChats = chatSessions.filter(chat => chat.id !== chatId);
      setActiveChatId(remainingChats.length > 0 ? remainingChats[0].id : '');
    }
  };

  const handleNewChat = () => {
    const newChatId = (Math.max(...chatSessions.map(chat => parseInt(chat.id))) + 1).toString();
    const newChat: ChatSession = {
      id: newChatId,
      name: `채팅 ${newChatId}`,
      messages: []
    };
    setChatSessions(prev => [...prev, newChat]);
    setActiveChatId(newChatId);
  };

  const handleLogin = () => {
    setIsGuestMode(false);
    setShowLimitModal(false);
    // In a real app, this would redirect to login page
    console.log('Redirect to login page');
  };

  const handleSignup = () => {
    setIsGuestMode(false);
    setShowLimitModal(false);
    // In a real app, this would redirect to signup page
    console.log('Redirect to signup page');
  };

  return (
    <div className="h-screen w-full bg-white text-gray-900 flex border-2 border-blue-500">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">로그인된 사용자</span>
          <button
            onClick={() => navigate('/')}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded transition"
          >
            게스트 화면으로
          </button>
        </div>
        <div className="flex items-center gap-2">
          {isGuestMode && (
            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              게스트 ({guestConversationCount}/{GUEST_LIMIT})
            </span>
          )}
          <span className="text-sm">&lt;/&gt;</span>
        </div>
      </div>
      
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-[280px]'} shrink-0 h-full border-r border-gray-300 bg-gray-100 flex flex-col pt-8 transition-all duration-300`}>
      {/* Brand */}
      <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 border-b border-gray-300`}>
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <img src="/g1.svg" alt="logo" className="w-6 h-6" />
            <div className="text-lg font-bold text-gray-800">KNU GPT</div>
          </div>
        )}
        {!sidebarCollapsed && (
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        )}
        {sidebarCollapsed && (
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 사용자 / 설정 / 도움말 */}
      <div className="px-3 pt-3 space-y-1">
        <LeftMenuItem icon={User} label="사용자" collapsed={sidebarCollapsed} />
        <LeftMenuItem icon={Settings} label="설정" collapsed={sidebarCollapsed} />
        <LeftMenuItem icon={HelpCircle} label="도움말" collapsed={sidebarCollapsed} />
      </div>

      {/* 새 채팅 */}
      <div className="px-3 pt-4 pb-2">
        <button 
          onClick={handleNewChat}
          className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-xl text-gray-800 transition`} 
          title={sidebarCollapsed ? "새 채팅" : undefined}
        >
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">새 채팅</span>
            </div>
          )}
          {sidebarCollapsed && <MessageCircle className="w-4 h-4" />}
          {!sidebarCollapsed && <Plus className="w-4 h-4" />}
        </button>
      </div>

      {/* 채팅 목록 */}
      <div className="px-3 space-y-1 mt-1 flex-1 overflow-y-auto">
        {chatSessions.map((chat) => (
          <ChatItem
            key={chat.id}
            label={chat.name}
            active={activeChatId === chat.id}
            collapsed={sidebarCollapsed}
            onRename={() => handleRenameChat(chat.id)}
            onDelete={() => handleDeleteChat(chat.id)}
            onSelect={() => setActiveChatId(chat.id)}
          />
        ))}
      </div>

      {/* 로그아웃 (하단 고정) */}
      <div className="mt-auto px-4 py-4 border-t border-gray-300">
          <button 
            onClick={() => navigate('/')}
            className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} text-gray-600 hover:text-gray-800 text-sm`} 
            title={sidebarCollapsed ? "로그아웃" : undefined}
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && <span>로그아웃</span>}
          </button>
      </div>
    </aside>

      {/* Main */}
      <main className="flex-1 h-full flex flex-col pt-20">
        {currentMessages.length === 0 ? (
          /* Welcome Screen */
          <div className="flex-1 flex flex-col items-center">
            <div className="max-w-3xl w-full px-8 text-left">
              {/* 환영 메시지 */}
              <h1 className="text-4xl font-bold mb-2 text-gray-900">안녕하세요, KNU GPT 입니다!</h1>
              <p className="text-gray-600 mb-12">
                경북대학교에 관해 궁금한 모든 것들을 정확하게 답변해주는 AI 챗봇입니다.
              </p>

              {/* 추천 질문 카드 */}
              <div className="grid grid-cols-2 gap-4 text-left">
                {/* 카드 1 */}
                <div 
                  className="border border-gray-300 rounded-xl p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setInputMessage("우리 학과의 졸업 요건이 궁금해요.")}
                >
                  <p className="text-sm text-gray-700">우리 학과의 졸업 요건이 궁금해요.</p>
                </div>
                {/* 카드 2 */}
                <div 
                  className="border border-gray-300 rounded-xl p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setInputMessage("휴학 신청은 어떻게 해야 하나요?")}
                >
                  <p className="text-sm text-gray-700">휴학 신청은 어떻게 해야 하나요?</p>
                </div>
                {/* 카드 3 */}
                <div 
                  className="border border-gray-300 rounded-xl p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setInputMessage("일청담이 어디에 있나요?")}
                >
                  <p className="text-sm text-gray-700">일청담이 어디에 있나요?</p>
                </div>
                {/* 카드 4 */}
                <div 
                  className="border border-gray-300 rounded-xl p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setInputMessage("수강신청 관련 정보를 알려주세요.")}
                >
                  <p className="text-sm text-gray-700">수강신청 관련 정보를 알려주세요.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.isUser
                        ? 'text-gray-900'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                    style={message.isUser ? { backgroundColor: 'rgba(218, 33, 39, 0.06)' } : {}}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isUser ? 'text-gray-600' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 하단 입력창 */}
        <div className="w-full mt-auto border-t border-gray-300 p-4">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-gray-500 focus:border-gray-400"
              placeholder="경북대학교에 관한 무엇이든 물어보세요!"
              disabled={isTyping}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </main>

      {/* Guest Limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              대화 횟수 제한
            </h2>
            
            <p className="text-gray-600 text-center mb-6">
              게스트 모드에서는 하루에 <span className="font-semibold text-orange-600">{GUEST_LIMIT}번</span>의 대화만 가능합니다.
              <br />
              더 많은 대화를 원하시면 로그인하거나 회원가입해주세요.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleLogin}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition"
              >
                로그인하기
              </button>
              
              <button
                onClick={handleSignup}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition"
              >
                회원가입하기
              </button>
              
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm transition"
              >
                나중에 하기
              </button>
            </div>
            
            <button
              onClick={() => setShowLimitModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
