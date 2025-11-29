// src/api/client.ts
import axios from 'axios';

// 1. 기본 주소 설정
const apiClient = axios.create({
  baseURL: 'https://api.knugpt.click/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. 요청 보낼 때마다 토큰(신분증) 챙겨서 보내기
apiClient.interceptors.request.use((config) => {
  // [수정 포인트] 여기서 'accessToken' 대신 'authToken'을 찾아야 합니다!
  const token = localStorage.getItem('authToken'); 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;