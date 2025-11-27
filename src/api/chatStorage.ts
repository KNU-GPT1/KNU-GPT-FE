import type { ChatSession } from '../types/chat';

const STORAGE_KEY = 'chat_sessions';
const ACTIVE_CHAT_ID_KEY = 'active_chat_id';

export const saveChatSessions = (sessions: ChatSession[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

export const loadChatSessions = (): ChatSession[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveActiveChatId = (id: string | null): void => {
  if (id) {
    localStorage.setItem(ACTIVE_CHAT_ID_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_CHAT_ID_KEY);
  }
};

export const loadActiveChatId = (): string | null => {
  return localStorage.getItem(ACTIVE_CHAT_ID_KEY);
};
