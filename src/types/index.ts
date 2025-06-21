export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  mood?: 'anxious' | 'calm' | 'confused' | 'hopeful';
  tags?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  startTime: Date;
  endTime?: Date;
  anxietyLevelBefore?: number;
  anxietyLevelAfter?: number;
  tags: string[];
  summary?: string;
}

export interface UserInsight {
  id: string;
  type: 'pattern' | 'trigger' | 'improvement';
  title: string;
  description: string;
  frequency: number;
  lastOccurrence: Date;
}

export interface AppState {
  currentConversation: Conversation | null;
  conversations: Conversation[];
  insights: UserInsight[];
  isBreathingMode: boolean;
  darkMode: boolean;
}