import React, { useState } from "react";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function GuestPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [guestConversationCount, setGuestConversationCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const GUEST_LIMIT = 3;

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Check guest limit
    if (guestConversationCount >= GUEST_LIMIT) {
      setShowLimitModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Increment guest conversation count if this is the first message in a new conversation
    if (messages.length === 0) {
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
      setMessages(prev => [...prev, llmResponse]);
      setIsTyping(false);
    }, 1500);
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

  const handleQuickTest = () => {
    // 빠른 테스트를 위해 바로 채팅 페이지로 이동
    navigate('/chat');
  };

  return (
    <div className="h-screen w-full bg-white text-gray-900 border-2 border-gray-400 relative">
      {/* Top Bar with Login/Signup buttons */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-2">
          <img src="/group-R5.svg" alt="logo" className="w-8 h-8" />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleQuickTest}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium transition"
          >
            테스트
          </button>
          <button
            onClick={handleLogin}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            로그인
          </button>
          <button
            onClick={handleSignup}
            className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            회원 가입
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="h-full flex flex-col pt-24">
        {messages.length === 0 ? (
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
                  onClick={() => setInputMessage("우리 학과의 졸업요건이 궁금해요.")}
                >
                  <p className="text-sm text-gray-700">우리 학과의 졸업요건이 궁금해요.</p>
                </div>
                {/* 카드 2 */}
                <div 
                  className="border border-gray-300 rounded-xl p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setInputMessage("우리 학과의 졸업요건이 궁금해요.")}
                >
                  <p className="text-sm text-gray-700">우리 학과의 졸업요건이 궁금해요.</p>
                </div>
                {/* 카드 3 */}
                <div 
                  className="border border-gray-300 rounded-xl p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setInputMessage("우리 학과의 졸업요건이 궁금해요.")}
                >
                  <p className="text-sm text-gray-700">우리 학과의 졸업요건이 궁금해요.</p>
                </div>
                {/* 카드 4 */}
                <div 
                  className="border border-gray-300 rounded-xl p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setInputMessage("우리 학과의 졸업요건이 궁금해요.")}
                >
                  <p className="text-sm text-gray-700">우리 학과의 졸업요건이 궁금해요.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
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
                  <div className="bg-gray-100 rounded-lg px-4 py-3">
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
        <div className="w-full border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
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
              <span className="text-2xl">⚠️</span>
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
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition"
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
          </div>
        </div>
      )}
    </div>
  );
}
