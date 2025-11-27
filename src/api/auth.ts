// Simple mock implementations for auth flows
// Replace with real API calls when backend is ready

type SendCodeParams = { email: string };
type VerifyCodeParams = { email: string; code: string };

// src/api/auth.ts

interface LoginCredentials {
  email: string;
  password: string;
}

// 백엔드 응답 구조에 맞게 수정
interface LoginResponse {
  accountId: number;
  userRole: "USER" | "ADMIN" | "BOOTH_MANAGER";
  accessToken: string;
  refreshToken: string;
}

interface RegisterParams {
  email: string;
  password: string;
  nickname: string; // 별명
  major: string; // 전공
  score: string; // 학점 (string according to API)
  introduction: string; // 자기 소개
  status: string; // 재학 여부
}

// JWT 토큰을 localStorage에 저장 (만료 기간 30일은 백엔드에서 설정됨)
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

// JWT 토큰을 localStorage에서 제거
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// JWT 토큰을 가져옴 (인증 헤더에 사용)
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.knugpt.click';

//JWT 완료 test 해봐야함 계정 기다리는 중
export async function login({ email, password }: LoginCredentials): Promise<LoginResponse> {
  // 실제 백엔드 API 주소로 요청을 보냅니다.
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  // 백엔드 응답 구조: { success, data, error }
  const payload: {
    success: boolean;
    data: LoginResponse | null;
    error: { message?: string } | null;
  } = await response.json();

  // 실패 처리: HTTP 상태 코드가 200이 아니거나 success가 false인 경우
  if (!response.ok || !payload.success || !payload.data) {
    const errorMessage = payload.error?.message || '로그인에 실패했습니다.';
    throw new Error(errorMessage);
  }

  // 성공 시: accessToken을 localStorage에 저장
  setAuthToken(payload.data.accessToken);
  
  // data 객체를 반환 (accountId, userRole, accessToken, refreshToken 포함)
  return payload.data;
}



//테스트 완료
export async function sendVerificationCode({ email }: SendCodeParams): Promise<void> {
  
  // 학교 이메일인지 유효성 검사 로직
  if (!email.endsWith("@knu.ac.kr")) {
    throw new Error("경북대학교 이메일만 사용할 수 있습니다.");
  }
  
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/email/code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }), // Request body에 email 포함
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '인증코드 전송에 실패했습니다.');
  }
  
  // 성공 시, 특별한 데이터 없이 완료 (Promise<void>)
}
export async function verifyCode({ email, code }: VerifyCodeParams): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/email/validation`, { // https://api.knugpt.click/api/v1/auth/email/verify
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });

  let payload: { success?: boolean; data?: unknown; error?: { message?: string } | null };

  try {
    payload = await response.json();
  } catch {
    throw new Error('서버 응답을 해석할 수 없습니다.');
  }

  if (!response.ok || !payload?.success) {
    const message =
      (payload?.error && typeof payload.error === 'object' && 'message' in payload.error
        ? payload.error.message
        : undefined) || '인증 코드 검증에 실패했습니다.';
    throw new Error(message);
  }
}

export async function register(params: RegisterParams): Promise<void> {
  const { email, password, nickname, major, score, introduction, status } = params;

  // Basic client-side validation
  if (!email || !password || !nickname) {
    throw new Error('email, password, nickname은 필수입니다.');
  }

  if (password.length < 8) {
    throw new Error('비밀번호는 8자 이상이어야 합니다.');
  }

  const requestBody = { email, password, nickname, major, score, introduction, status };

  // Dev debug: log exact request body being sent so we can compare with server logs
  // Remove or guard in production
  // eslint-disable-next-line no-console
  console.error('register() request body', requestBody);

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  let payload: { success?: boolean; data?: unknown; error?: { message?: string } | null };
  try {
    payload = await response.json();
  } catch (err) {
    throw new Error('서버 응답을 해석할 수 없습니다.');
  }

  if (!response.ok || !payload?.success) {
    // Extract server-provided message when available. Include status for easier debugging.
    const serverErrorMessage =
      payload && payload.error && (typeof payload.error === 'object' ? (payload.error.message ?? JSON.stringify(payload.error)) : String(payload.error));

    const message = serverErrorMessage || `회원가입에 실패했습니다. (status ${response.status})`;

    // Log full payload + status to console for debugging (dev only). This helps identify why backend returned a 500.
    // Remove or guard these logs in production if necessary.
    // eslint-disable-next-line no-console
    console.error('register() failed', { status: response.status, payload });

    throw new Error(message);
  }

  // 성공 시 특별한 데이터 없음 (API 예시에서 data: null)
  return;
}





