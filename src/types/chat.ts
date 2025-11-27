export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  title: string;
  name?: string; // Added to satisfy chatPage.tsx usage
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}
