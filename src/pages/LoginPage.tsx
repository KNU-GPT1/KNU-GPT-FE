// 로그인 성공 자동로그인 해야함
import { useState } from "react";
import { login } from "../api/auth"; 
import { useNavigate } from "react-router"; // 페이지 이동을 위해 추가

export default function LoginPage() {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력하세요.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // 🌟 API 연결 부분 🌟
      await login({ email, password }); 
      
      // 로그인 성공 처리: 토큰은 login 함수 내부에서 이미 저장됨
      // 필요시 response 변수에 저장하여 accountId, userRole 등을 사용할 수 있음
      alert(`로그인 성공! 환영합니다.`);
      navigate("/"); // 메인 페이지로 이동
      
    } catch (e: any) {
      // API 실패 처리
      setError(e.message || "로그인 처리 중 알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... (이전과 동일한 JSX 코드) ...
    <div className="w-full min-h-screen bg-white flex flex-col items-center relative">
      

      <div className="w-full h-[72px] px-6 py-4 absolute top-0 left-0 flex items-center gap-2.5 bg-white shadow-sm">
        <div className="relative h-7 flex items-center gap-2">
        <img src="/knu.svg" alt="KNU GPT Logo" className="w-5 h-5 shrink-0" />
          <div className="text-[#222222] text-xl font-normal font-['KNU_TRUTH']">KNU GPT</div>
        </div>
      </div>

 
      <div className="flex-1 w-full flex justify-center items-center pt-[72px] pb-10">
        <div className="w-[412px] flex flex-col items-start gap-10">


          <div className="self-stretch flex flex-col items-center gap-3">
            <div className="self-stretch text-center text-black text-[40px] font-medium font-['Pretendard'] leading-[56px]">로그인</div>
            <div className="self-stretch text-center text-[#505050] text-l font-normal font-['Pretendard'] leading-7">
                KNU GPT에서 무제한으로 채팅을 이용할 수 있습니다.
            </div>
          </div>


          <div className="self-stretch flex flex-col items-start gap-5">
            
            {/* 이메일 */}
            <div className="self-stretch flex flex-col items-start gap-2.5">
              <div className="text-[#505050] text-xl font-normal font-['Pretendard'] leading-7">이메일 주소</div>
              <div className="self-stretch h-[60px] px-7 py-4 rounded-[40px] border border-zinc-300 flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소"
                  className="w-full outline-none bg-transparent text-[#222222] text-xl font-normal font-['Pretendard'] leading-7"
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="self-stretch flex flex-col items-start gap-2.5">
              <div className="text-[#505050] text-xl font-normal font-['Pretendard'] leading-7">비밀번호</div>
              <div className="self-stretch h-[60px] px-7 py-4 rounded-[40px] border border-zinc-300 flex items-center justify-between">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  className="flex-1 outline-none bg-transparent text-[#222222] text-xl font-normal font-['Pretendard'] leading-7"
                />
                {/* 비밀번호 숨김/표시 아이콘 영역 (실제 아이콘으로 대체 필요) */}
                <div className="w-7 h-7" />
              </div>
            </div>
            
            {/* 에러 메시지 */}
            <div className="h-[22px] w-full relative">
              <div className="absolute left-0 top-0 text-sm font-normal font-['Pretendard'] leading-[22.4px]"
                style={{ color: error ? '#DA2127' : 'transparent' }}
              >{error || 'placeholder'}</div>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button 
            onClick={onSubmit}
            disabled={loading}
            className={`self-stretch px-7 py-4 rounded-[40px] flex justify-center items-center gap-2.5 transition ${
              loading 
                ? 'bg-red-600/70 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            <div className="text-white text-xl font-semibold font-['Pretendard'] leading-7">
              {loading ? '로그인 중...' : '로그인하기'}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}