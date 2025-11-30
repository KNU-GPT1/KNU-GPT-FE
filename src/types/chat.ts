/**
 * 채팅 관련 TypeScript 타입 정의
 * API 명세 및 회원 채팅 기능 시나리오에 맞춰 엄격하게 정의
 */

/**
 * 채팅 메시지 타입
 * API에서 사용하는 타입: 'USER' | 'CHAT_BOT'
 */
export type ChatMessageType = 'USER' | 'CHAT_BOT';

/**
 * 채팅 메시지 인터페이스
 * 채팅방 채팅내역 조회 API 응답 구조에 맞춤
 */
export interface ChatMessage {
  /** 메시지 ID */
  id: string | number;
  /** 메시지 타입: USER(사용자 질문) 또는 CHAT_BOT(챗봇 답변) */
  type: ChatMessageType;
  /** 메시지 내용 (마크다운 형식 지원) */
  content: string;
  /** 생성 시간 (ISO 8601 형식 또는 Date 객체) */
  createdAt: string | Date;
}

/**
 * 페이징 정보 인터페이스
 * Spring Boot Pageable 구조에 맞춤
 */
export interface Pageable {
  /** 페이지 번호 (0부터 시작) */
  pageNumber: number;
  /** 페이지 크기 */
  pageSize: number;
  /** 정렬 정보 */
  sort?: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
}

/**
 * 채팅 내역 페이징 응답 구조
 * [회원] 채팅방 채팅내역 조회 API 응답 구조
 */
export interface ChatHistoryResponse {
  /** 채팅 메시지 배열 (최신 순) */
  content: ChatMessage[];
  /** 페이징 정보 */
  pageable: Pageable;
  /** 전체 요소 개수 */
  totalElements: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 마지막 페이지 여부 */
  last: boolean;
  /** 첫 페이지 여부 */
  first: boolean;
  /** 현재 페이지 크기 */
  size: number;
  /** 현재 페이지 번호 */
  number: number;
  /** 현재 페이지의 요소 개수 */
  numberOfElements: number;
  /** 빈 페이지 여부 */
  empty: boolean;
}

/**
 * 채팅방 인터페이스
 * [회원] 채팅방 목록 조회 API 응답 구조에 맞춤
 */
export interface ChatRoom {
  /** 채팅방 ID (chat_room_id) */
  chat_room_id: number;
  /** 채팅방 제목 (chat_room_title) */
  chat_room_title: string;
}

/**
 * 채팅방 목록 페이징 응답 구조
 * [회원] 채팅방 목록 조회 API 응답 구조
 */
export interface ChatRoomListResponse {
  /** 채팅방 배열 */
  content: ChatRoom[];
  /** 페이징 정보 */
  pageable: Pageable;
  /** 전체 요소 개수 */
  totalElements: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 마지막 페이지 여부 */
  last: boolean;
  /** 첫 페이지 여부 */
  first: boolean;
  /** 현재 페이지 크기 */
  size: number;
  /** 현재 페이지 번호 */
  number: number;
  /** 현재 페이지의 요소 개수 */
  numberOfElements: number;
  /** 빈 페이지 여부 */
  empty: boolean;
}

/**
 * 채팅방 생성 요청 인터페이스
 * [회원] 채팅방 생성 API 요청 구조
 */
export interface CreateChatRoomRequest {
  /** 첫 번째 질문 (채팅방 생성 시 함께 전송) */
  question: string;
}

/**
 * 채팅방 생성 응답 인터페이스
 * [회원] 채팅방 생성 API 응답 구조
 */
export interface CreateChatRoomResponse {
  /** 생성된 채팅방 ID (chat_room_id) */
  chatRoomId: string | number;
  /** 채팅방 제목 */
  title?: string;
}

/**
 * 채팅 전송 요청 인터페이스
 * [회원] 채팅방 채팅 전송 API 요청 구조
 */
export interface SendChatRequest {
  /** 사용자 질문 */
  question: string;
}

/**
 * 채팅 전송 응답 인터페이스
 * [회원] 채팅방 채팅 전송 API 응답 구조
 */
export interface SendChatResponse {
  /** 챗봇의 답변 (마크다운 형식) */
  answer: string;
  /** 메시지 ID (선택적) */
  messageId?: string | number;
}

/**
 * 채팅방 제목 수정 요청 인터페이스
 * [회원] 채팅방 제목 수정 API 요청 구조
 */
export interface UpdateChatRoomTitleRequest {
  /** 새로운 제목 */
  title: string;
}

/**
 * 채팅방 목록 조회 요청 파라미터
 * [회원] 채팅방 목록 조회 API 요청 파라미터
 */
export interface GetChatRoomsParams {
  /** 페이지 번호 (0부터 시작) */
  page?: number;
  /** 페이지 크기 */
  size?: number;
}

/**
 * 채팅 내역 조회 요청 파라미터
 * [회원] 채팅방 채팅내역 조회 API 요청 파라미터
 */
export interface GetChatHistoryParams {
  /** 채팅방 ID */
  chatRoomId: string | number;
  /** 페이지 번호 (0부터 시작, 최신이 가장 밑에 오도록) */
  page?: number;
  /** 페이지 크기 */
  size?: number;
}

// ===== 기존 호환성을 위한 타입 (점진적 마이그레이션용) =====

/**
 * 기존 Message 타입 (호환성 유지)
 * @deprecated ChatMessage 사용을 권장합니다
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

/**
 * 기존 ChatSession 타입 (호환성 유지)
 * @deprecated ChatRoom 사용을 권장합니다
 */
export interface ChatSession {
  id: string;
  title: string;
  name?: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}
