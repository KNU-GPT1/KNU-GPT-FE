import type { ChatSession, Message } from '../types/chat';

// Mock implementation of chat API

export const streamMemberChatResponse = async (
  chatId: string,
  message: string,
  onChunk: (chunk: string) => void,
  onComplete?: () => void,
  token?: string | null,
  ...args: any[]
): Promise<void> => {
  // Simulate streaming response
  const response = "This is a mock response from the member chat API.";
  const chunks = response.split(" ");
  
  for (const chunk of chunks) {
    await new Promise(resolve => setTimeout(resolve, 100));
    onChunk(chunk + " ");
  }
  if (onComplete) onComplete();
};

export const streamGuestChatResponse = async (
  message: string,
  onChunk: (chunk: string) => void,
  onComplete?: () => void,
  ...args: any[]
): Promise<void> => {
  // Simulate streaming response
  const response = "This is a mock response from the guest chat API.";
  const chunks = response.split(" ");
  
  for (const chunk of chunks) {
    await new Promise(resolve => setTimeout(resolve, 100));
    onChunk(chunk + " ");
  }
  if (onComplete) onComplete();
};

export const getChatRooms = async (token?: string | null): Promise<any[]> => {
  return [];
};

export const createChatRoom = async (token: string | null, title: string): Promise<ChatSession> => {
  return {
    id: Date.now().toString(),
    title,
    name: title,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const updateChatRoomTitle = async (chatId: string, title: string, token?: string | null): Promise<void> => {
  console.log(`Updated chat room ${chatId} title to ${title}`);
};

export const deleteChatRoom = async (chatId: string, token?: string | null): Promise<void> => {
  console.log(`Deleted chat room ${chatId}`);
};

export const getChatHistory = async (chatId: string, token?: string | null): Promise<Message[]> => {
  return [];
};
