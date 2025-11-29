// src/api/chatApi.ts
import apiClient from './client';
import type { ChatRoom, ChatMessage } from '../types/chat';

// API 응답 타입 정의
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { message?: string } | null;
}

// =================================================================
// 1. [회원] 채팅방 목록 조회
// GET /api/v1/chat-rooms
// =================================================================
export const getChatRooms = async (page = 1, size = 10) => {
  const response = await apiClient.get<ApiResponse<{ chat_rooms: ChatRoom[], total_page: number }>>('/chat-rooms', {
    params: { page, size }
  });
  return response.data;
};

// =================================================================
// 2. [회원] 채팅방 생성 (새 채팅 시작)
// POST /api/v1/chat-rooms
// 주의: PDF를 보니 여기서는 질문을 'first_query'라고 보내야 하네요!
// =================================================================
export const createChatRoom = async (firstQuery: string) => {
  const response = await apiClient.post<ApiResponse<{ chat_room_id: number }>>('/chat-rooms', {
    first_query: firstQuery 
  });
  return response.data;
};

// =================================================================
// 3. [회원] 채팅방 채팅 전송 (대화 이어가기)
// POST /api/v1/chat-rooms/{chatRoomId}/chats
// 주의: 여기서는 질문을 'question'이라고 보내야 합니다!
// =================================================================
export const sendMessage = async (chatRoomId: number, message: string) => {
  const response = await apiClient.post<ApiResponse<{ answer: string }>>(`/chat-rooms/${chatRoomId}/chats`, {
    question: message
  });
  return response.data;
};

// =================================================================
// 4. [회원] 채팅방 채팅내역 조회 (과거 대화 불러오기)
// GET /api/v1/chat-rooms/{chatRoomId}/chats
// =================================================================
export const getChatHistory = async (chatRoomId: number, page = 1, size = 20) => {
  const response = await apiClient.get<ApiResponse<{ chats: ChatMessage[] }>>(`/chat-rooms/${chatRoomId}/chats`, {
    params: { page, size }
  });
  return response.data;
};

// =================================================================
// 5. [회원] 채팅방 제목 수정
// PUT /api/v1/chat-rooms/{chatRoomId}
// =================================================================
export const updateChatRoomTitle = async (chatRoomId: number, newTitle: string) => {
  const response = await apiClient.put(`/chat-rooms/${chatRoomId}`, {
    title: newTitle
  });
  return response.data;
};

// =================================================================
// 6. [회원] 채팅방 삭제
// DELETE /api/v1/chat-rooms/{chatRoomId}
// =================================================================
export const deleteChatRoom = async (chatRoomId: number) => {
  const response = await apiClient.delete(`/chat-rooms/${chatRoomId}`);
  return response.data;
};

// =================================================================
// 7. [비회원] 채팅 전송 (로그인 안 했을 때)
// POST /api/v1/chats
// =================================================================
export const sendGuestMessage = async (message: string) => {
  const response = await apiClient.post<ApiResponse<{ answer: string }>>('/chats', {
    question: message
  });
  return response.data;
};