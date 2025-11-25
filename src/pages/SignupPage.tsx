import React, { useState, useCallback, useMemo, useEffect } from 'react';


import { sendVerificationCode, verifyCode, register } from '../api/auth';
import "./SignupPage.css";
import AnimatedContent from './AnimatedContent';


interface FormData {
  email: string;
  code: string;
  password: string;
  name: string;
  major: string;
  // expanded to cover all backend status labels (Korean shown to the user)
  enrollmentStatus:
    | '1학년'
    | '2학년'
    | '3학년'
    | '4학년'
    | '휴학 중'
    | '초과 학기'
    | '졸업유예'
    | '졸업생'
    | '교직원'
    | '기타';
  gpa: string; // keep as string because input.value is string and API expects score as string
  bio: string;
}

export default function BasicSignupForm() {
  // Map UI enrollmentStatus (Korean) -> backend status enum
  const mapEnrollmentToBackend = (status: FormData['enrollmentStatus']) => {
    switch (status) {
      case '1학년':
        return 'GRADE1';
      case '2학년':
        return 'GRADE2';
      case '3학년':
        return 'GRADE3';
      case '4학년':
        return 'GRADE4';
      case '휴학 중':
        return 'BREAKE';
      case '초과 학기':
        return 'EXCEED';
      case '졸업유예':
        return 'DEFERRED';
      case '졸업생':
        return 'GRADUATESCHOOL';
      case '교직원':
        return 'STAFF';
      case '기타':
      default:
        return 'NONE';
    }
  };
  const [formData, setFormData] = useState<FormData>({
    email: '',
    code: '',
    password: '',
    name: '',
    major: '',
    enrollmentStatus: '1학년',
    gpa: '',
    bio: '',
  });

  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 인증 코드 타이머 상태 (3분 = 180초)
  const [remainingSec, setRemainingSec] = useState<number>(0);
  const timerRunning = remainingSec > 0 && !emailVerified;

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setRemainingSec((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const mmss = useMemo(() => {
    const m = Math.floor(remainingSec / 60).toString().padStart(1, "0");
    const s = (remainingSec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [remainingSec]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 입력 시 해당 필드의 에러 메시지 초기화
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleGPABlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const value = parseFloat(raw);
    if (raw === '') {
      // empty is allowed
      setErrors(prev => ({ ...prev, gpa: '' }));
      setFormData(prev => ({ ...prev, gpa: '' }));
      return;
    }

    if (isNaN(value) || value < 0 || value > 4.3) {
      setErrors(prev => ({ ...prev, gpa: '학점은 0.0에서 4.3 사이의 값이어야 합니다.' }));
      setFormData(prev => ({ ...prev, gpa: '' }));
    } else {
      setErrors(prev => ({ ...prev, gpa: '' }));
      // keep string form (as entered) to send as score string
      setFormData(prev => ({ ...prev, gpa: raw }));
    }
  }, []);

  const onSendCode = async () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: "이메일을 입력해 주세요." }));
      return;
    }
    setLoading(true);
    setErrors(prev => ({ ...prev, email: '' }));
    try {
      await sendVerificationCode({ email: formData.email });
      setRemainingSec(180); // 코드 전송 성공 시 타이머 시작
      alert(`인증 코드가 ${formData.email}로 전송되었습니다.`);
    } catch (e) {
      setErrors(prev => ({ ...prev, email: "학교 이메일만 사용이 가능합니다." }));
    } finally {
      setLoading(false);
    }
  };

  const onVerifyCode = async () => {
    if (!formData.code || !formData.email) {
      setErrors(prev => ({ ...prev, code: "이메일과 인증 코드를 모두 입력해 주세요." }));
      return;
    }
    setLoading(true);
    setErrors(prev => ({ ...prev, code: '' }));
    try {
      await verifyCode({ email: formData.email, code: formData.code });
      setEmailVerified(true);
      setRemainingSec(0); // 인증 완료 시 타이머 중지
      alert("이메일 인증이 완료되었습니다.");
    } catch (e) {
      setEmailVerified(false);
      setErrors(prev => ({ ...prev, code: "인증 코드 확인에 실패했습니다." }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // 초기화

    if (!emailVerified) {
      setErrors(prev => ({ ...prev, email: '이메일 인증을 완료해야 합니다.' }));
      return;
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setErrors(prev => ({ ...prev, password: '비밀번호는 8자 이상이어야 하며, 숫자, 영문자, 특수문자를 포함해야 합니다.' }));
      return;
    }
    if (!formData.name) {
      setErrors(prev => ({ ...prev, name: '이름을 입력해 주세요.' }));
      return;
    }
    if (!formData.major) {
      setErrors(prev => ({ ...prev, major: '학과를 입력해 주세요.' }));
      return;
    }

    setLoading(true);
    try {
      // 실제 회원가입 API 호출 — 폼 필드 이름을 API 스펙에 맞게 매핑
      await register({
        email: formData.email,
        password: formData.password,
        nickname: formData.name,
        major: formData.major,
        score: formData.gpa === '' ? '' : String(formData.gpa),
        introduction: formData.bio,
        status: mapEnrollmentToBackend(formData.enrollmentStatus),
      });

      // 성공 처리: 간단한 알림 및 로그인 페이지로 리디렉션
      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      window.location.href = '/login';
    } catch (e) {
      // Log full error to console so developer can inspect status/payload from register()
      // eslint-disable-next-line no-console
      console.error('회원가입 에러', e);

      const message = e && (e as any).message ? (e as any).message : '회원가입 처리 중 오류가 발생했습니다.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const showPassword = emailVerified;
  const showName = showPassword && formData.password.length >= 8;
  const showMajor = showName && formData.name.length > 0;
  const showEnrollment = showMajor && formData.major.length > 0;
  const showGPA = showEnrollment; // Enrollment has default value, so it's effectively "filled"
  const showBio = showGPA; // GPA is optional
  const showSubmit = showBio;

  return (


    <div className="w-full min-h-screen bg-white flex flex-col items-center relative">
      

      <div className="w-full h-[72px] px-6 py-4 absolute top-0 left-0 flex items-center gap-2.5 bg-white ">
        <div className="relative h-7 flex items-center gap-2">
        <img src="/knu.svg" alt="KNU GPT Logo" className="w-5 h-5 shrink-0" />
          <div className="text-[#222222] text-xl font-normal font-['KNU_TRUTH']">KNU GPT</div>
        </div>
      </div>

         <div className="flex-1 w-full flex justify-center items-center pt-[72px] pb-10">
        <div className="w-[412px] flex flex-col items-start gap-10">


          <div className="self-stretch flex flex-col items-center gap-3">
            <div className="self-stretch text-center text-black text-[40px] font-medium font-['Pretendard'] leading-[56px]">회원가입</div>
            <div className="self-stretch text-center text-[#505050] text-l font-normal font-['Pretendard'] leading-7">
                KNU GPT에서 무제한으로 채팅을 이용할 수 있습니다.
                <p>경북대학교 재학생 및 졸업생, 교직원만 이용 가능합니다.</p>
            </div>
          </div>


      <div className="signup-container">
      <form onSubmit={handleSubmit}>
        
        {/* 1. 이메일 주소 (인증 필요) */}
        <fieldset className="form-field-group" style={{ border: 'none', padding: 0, margin: '0 0 15px 0' }}>
          <label htmlFor="email">이메일 주소:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={emailVerified || loading}
            placeholder="knu@knu.ac.kr"
            required
            className="signup-form-field"
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
          <button 
            type="button" 
            onClick={onSendCode} 
            disabled={loading || emailVerified}
            className="form-button"
            style={{ marginTop: '10px', width: '100%' }}>
            {loading ? '전송 중' : '코드 전송'}
          </button>
          
          {(timerRunning || emailVerified) && (
            <>
            <AnimatedContent>
              <label htmlFor="code" style={{ display: 'block', marginTop: '10px' }}>인증 코드:</label>
              <div className="form-row">
                <div className="input-wrapper signup-form-field">
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    disabled={emailVerified || !timerRunning || loading}
                    placeholder="6자리 인증 코드"
                    className="input-field-transparent"
                  />
                  <div className={`timer-display ${timerRunning ? 'running' : ''}`}>
                      {emailVerified ? '인증 완료' : (timerRunning ? mmss : '대기')}
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={onVerifyCode} 
                  disabled={loading || emailVerified || !timerRunning}
                  className="form-button"
                >
                  {emailVerified ? '인증됨' : '인증 확인'}
                </button>
              </div>
              {errors.code && <p className="error-message">{errors.code}</p>}
              </AnimatedContent>
            </>
          )}
        </fieldset>

        {/* 2. 비밀번호 */}
        {showPassword && (
        <AnimatedContent>
          <div className="form-field-group">
            <label htmlFor="password">비밀번호 (8자 이상):</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호"
              required
              className="signup-form-field"
            />
            {errors.password && <p className="error-message">{errors.password}</p>}
          </div>
        </AnimatedContent>
        )}

        {/* 3. 이름 */}
        {showName && (
        <AnimatedContent>
          <div className="form-field-group">
            <label htmlFor="name">이름:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="실명"
              required
              className="signup-form-field"
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>
        </AnimatedContent>
        )}

        {/* 4. 학과 */}
        {showMajor && (
        <AnimatedContent>
          <div className="form-field-group">
            <label htmlFor="major">학과:</label>
            <input
              type="text"
              id="major"
              name="major"
              value={formData.major}
              onChange={handleChange}
              placeholder="컴퓨터학부"
              required
              className="signup-form-field"
            />
            {errors.major && <p className="error-message">{errors.major}</p>}
          </div>
        </AnimatedContent>
        )}

        {/* 5. 재학 여부 */}
        {showEnrollment && (
        <AnimatedContent>
          <div className="form-field-group">
            <label htmlFor="enrollmentStatus">재학 여부:</label>
            <select
              id="enrollmentStatus"
              name="enrollmentStatus"
              value={formData.enrollmentStatus}
              onChange={handleChange}
              required
              className="signup-form-field"
            >
              <option value="1학년">1학년</option>
              <option value="2학년">2학년</option>
              <option value="3학년">3학년</option>
              <option value="4학년">4학년</option>
              <option value="휴학 중">휴학 중</option>
              <option value="초과 학기">초과 학기</option>
              <option value="졸업유예">졸업유예</option>
              <option value="교직원">교직원</option>
              <option value="기타">기타</option>
            </select>
          </div>
        </AnimatedContent>
        )}

        {/* 6. 학점 */}
        {showGPA && (
        <AnimatedContent>
          <div className="form-field-group">
            <label htmlFor="gpa">학점 (예: 4.5 만점에 4.0):</label>
            <input
              type="number"
              id="gpa"
              name="gpa"
              value={formData.gpa}
              onChange={handleChange}
              onBlur={handleGPABlur}
              placeholder="0.0 ~ 4.5"
              step="0.01"
              min="0"
              max="4.5"
              className="signup-form-field"
            />
          </div>
        </AnimatedContent>
        )}

        {/* 7. 자기소개 */}
        {showBio && (
        <AnimatedContent>
          <div className="form-field-group">
            <label htmlFor="bio">자기소개:</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={5}
              placeholder="자유롭게 작성해 주세요."
              className="signup-form-field textarea"
            />
          </div>
        </AnimatedContent>
        )}

        {/* 최종 제출 버튼 */}
        {showSubmit && (
        <AnimatedContent>
          <button 
            type="submit" 
            disabled={loading || !emailVerified}
            className="form-button"
            style={{ width: '100%', marginTop: '20px' }}
          >
            {loading ? '처리 중...' : '회원가입 완료'}
          </button>
        </AnimatedContent>
        )}
      </form>
    </div>
    </div>
    </div>
    </div>
  );
}