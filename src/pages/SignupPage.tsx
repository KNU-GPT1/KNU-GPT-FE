import React, { useState, useCallback, useMemo, useEffect } from 'react';


import { sendVerificationCode, verifyCode, register } from '../api/auth';

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
  const [error, setError] = useState<string | null>(null);
  
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
  };

  const handleGPABlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const value = parseFloat(raw);
    if (raw === '') {
      // empty is allowed
      setError(null);
      setFormData(prev => ({ ...prev, gpa: '' }));
      return;
    }

    if (isNaN(value) || value < 0 || value > 4.3) {
      setError('학점은 0.0에서 4.3 사이의 값이어야 합니다.');
      setFormData(prev => ({ ...prev, gpa: '' }));
    } else {
      setError(null);
      // keep string form (as entered) to send as score string
      setFormData(prev => ({ ...prev, gpa: raw }));
    }
  }, []);

  const onSendCode = async () => {
    if (!formData.email) {
      setError("이메일을 입력해 주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await sendVerificationCode({ email: formData.email });
      setRemainingSec(180); // 코드 전송 성공 시 타이머 시작
      alert(`인증 코드가 ${formData.email}로 전송되었습니다.`);
    } catch (e) {
      setError("코드 전송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyCode = async () => {
    if (!formData.code || !formData.email) {
      setError("이메일과 인증 코드를 모두 입력해 주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await verifyCode({ email: formData.email, code: formData.code });
      setEmailVerified(true);
      setRemainingSec(0); // 인증 완료 시 타이머 중지
      alert("이메일 인증이 완료되었습니다.");
    } catch (e) {
      setEmailVerified(false);
      setError("인증 코드 확인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailVerified) {
      setError('이메일 인증을 완료해야 합니다.');
      return;
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('비밀번호는 8자 이상이어야 하며, 숫자, 영문자, 특수문자를 포함해야 합니다.');
      return;
    }
    if (!formData.name || !formData.major) {
      setError('이름과 학과를 입력해 주세요.');
      return;
    }

    setLoading(true);
    setError(null);
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
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>기본 회원가입</h2>
      <form onSubmit={handleSubmit}>
        
        {/* 에러 메시지 */}
        {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{error}</p>}

        {/* 1. 이메일 주소 (인증 필요) */}
        <fieldset style={{ border: '1px solid #ccc', padding: '15px', margin: '15px 0' }}>
          <legend>이메일 인증</legend>
          <label htmlFor="email">이메일 주소:</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={emailVerified || loading}
              placeholder="knu@knu.ac.kr"
              required
              style={{ flexGrow: 1, padding: '8px' }}
            />
            <button 
              type="button" 
              onClick={onSendCode} 
              disabled={loading || emailVerified}
              style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              {loading ? '전송 중' : '코드 전송'}
            </button>
          </div>
          
          <label htmlFor="code" style={{ display: 'block', marginTop: '10px' }}>인증 코드:</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              disabled={emailVerified || !timerRunning || loading}
              placeholder="6자리 인증 코드"
              style={{ flexGrow: 1, padding: '8px' }}
            />
            <div style={{ width: '80px', textAlign: 'center', lineHeight: '35px', color: timerRunning ? 'red' : 'gray' }}>
                {emailVerified ? '인증 완료' : (timerRunning ? mmss : '대기')}
            </div>
            <button 
              type="button" 
              onClick={onVerifyCode} 
              disabled={loading || emailVerified || !timerRunning}
              style={{ padding: '8px 15px', backgroundColor: emailVerified ? 'green' : '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              {emailVerified ? '인증됨' : '인증 확인'}
            </button>
          </div>
        </fieldset>

        {/* 2. 비밀번호 */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">비밀번호 (8자 이상):</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        {/* 3. 이름 */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name">이름:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="실명"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        {/* 4. 학과 */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="major">학과:</label>
          <input
            type="text"
            id="major"
            name="major"
            value={formData.major}
            onChange={handleChange}
            placeholder="컴퓨터학부"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        {/* 5. 재학 여부 */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="enrollmentStatus">재학 여부:</label>
          <select
            id="enrollmentStatus"
            name="enrollmentStatus"
            value={formData.enrollmentStatus}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
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

        {/* 6. 학점 */}
        <div style={{ marginBottom: '15px' }}>
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
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        {/* 7. 자기소개 */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="bio">자기소개:</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={5}
            placeholder="자유롭게 작성해 주세요."
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        {/* 최종 제출 버튼 */}
        <button 
          type="submit" 
          disabled={loading || !emailVerified}
          style={{ width: '100%', padding: '10px', backgroundColor: loading || !emailVerified ? '#ccc' : '#dc3545', color: 'white', border: 'none', cursor: 'pointer', fontSize: '18px' }}
        >
          {loading ? '처리 중...' : '회원가입 완료'}
        </button>
      </form>
    </div>
  );
}