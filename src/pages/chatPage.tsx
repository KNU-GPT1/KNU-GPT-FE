import React from "react";
import { Plus, User, Settings, HelpCircle, LogOut, ChevronRight, Send, GraduationCap, BookOpen, BriefcaseBusiness, CalendarDays, MessageCircle } from "lucide-react";

// --- Chat bubble components
function ChatBubble({ role = "assistant", children }: { role?: "assistant" | "user"; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"} my-3`}>
      <div className={`max-w-[72%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md border ${
        isUser
          ? "bg-[#1f1b24] border-neutral-800 text-neutral-100"
          : "bg-[#121113] border-neutral-800 text-neutral-100"
      }`}
      >
        {children}
      </div>
    </div>
  );
}

function LeftMenuItem({ icon: Icon, label, active = false }: { icon: React.ElementType; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition ${
        active
          ? "bg-[#221f26] text-neutral-100 border border-neutral-800"
          : "text-neutral-300 hover:bg-[#1b181f] border border-transparent"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="truncate">{label}</span>
    </button>
  );
}

export default function Chat() {
  return (
    <div className="h-screen w-full bg-[#0c0b0d] text-neutral-100 flex">
      {/* Sidebar */}
      <aside className="w-[280px] shrink-0 h-full border-r border-neutral-800 bg-[#0f0e11] flex flex-col">
        {/* Brand */}
        <div className="px-4 py-4 border-b border-neutral-800">
          <div className="text-xs uppercase tracking-widest text-neutral-400">KNU GPT</div>
        </div>

        {/* Profile / Settings / Help */}
        <div className="px-3 pt-2 space-y-1">
          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-[#1b181f] text-neutral-300">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-[#1b181f] text-neutral-300">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-[#1b181f] text-neutral-300">
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
          </button>
        </div>

        {/* New Chat */}
        <div className="px-3 py-3">
          <button className="w-full flex items-center gap-3 bg-[#221f26] hover:bg-[#26222a] border border-neutral-800 px-3 py-2 rounded-xl text-neutral-100 transition">
            <Plus className="w-4 h-4" />
            <span>새 채팅</span>
          </button>
        </div>

        {/* Nav */}
        <div className="px-3 space-y-1 mt-1">
          <LeftMenuItem icon={GraduationCap} label="컴퓨터학부 졸업 요건" active />
          <LeftMenuItem icon={BookOpen} label="이번 학기 수강신청" />
          <LeftMenuItem icon={BriefcaseBusiness} label="취업을 잘 하려면" />
          <LeftMenuItem icon={CalendarDays} label="MT 일정" />
        </div>

        <div className="mt-auto px-4 py-4 border-t border-neutral-800">
          <button className="flex items-center gap-3 text-neutral-300 hover:text-neutral-100">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">로그인 하러 가기</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 h-full flex flex-col">
        {/* Top spacer (optional header area) */}
        <div className="h-6" />

        {/* Chat area */}
        <div className="flex-1 px-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* User message bubble (small) */}
            <div className="w-full flex justify-end mt-6">
              <div className="relative">
                <ChatBubble role="user">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 opacity-70" />
                    <span className="text-sm">컴퓨터학부 졸업 요건을 알려줘</span>
                  </div>
                </ChatBubble>
              </div>
            </div>

            {/* Assistant content block */}
            <div className="mt-6">
              <h1 className="text-xl font-semibold">컴퓨터학부 졸업 요건이 궁금하시군요!</h1>
              <p className="mt-4 text-neutral-300">졸업 요건은 다음과 같습니다.</p>
              <ol className="mt-4 list-decimal list-inside space-y-2 text-neutral-200">
                <li>제대로 잘 살았는가</li>
                <li>학점은 다 채웠는가</li>
                <li>정신 똑바로 차리</li>
              </ol>
            </div>

            {/* Helper banner */}
            <div className="mt-10">
              <div className="rounded-2xl border border-neutral-800 bg-[#111014] p-4 flex items-center justify-between">
                <div className="text-sm text-neutral-300">경북대학교 학사 정보 관련 무엇이든 궁금한 걸 물어보세요!</div>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-neutral-800 p-4">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <input
              className="flex-1 bg-[#121113] border border-neutral-800 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-neutral-500 focus:border-neutral-600"
              placeholder="경북대학교 학사 정보 관련 무엇이든 궁금한 걸 물어보세요!"
            />
            <button className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-red-600 bg-red-600 hover:bg-red-700 transition">
              <Send className="w-4 h-4" />
              <span className="text-sm">보내기</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
