// client/src/types/index.ts
export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    mood?: 'anxious' | 'calm' | 'confused' | 'hopeful' | 'stressed' | 'relaxed';
    tags?: string[];
    sentiment?: number; // -1 to 1 scale
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
    mood?: 'positive' | 'negative' | 'neutral';
}

export interface UserInsight {
    id: string;
    type: 'pattern' | 'trigger' | 'improvement' | 'achievement';
    title: string;
    description: string;
    frequency: number;
    lastOccurrence: Date;
    actionable?: string; // Suggested action
}

export interface MoodEntry {
    id: string;
    timestamp: Date;
    mood: number; // 1-10 scale
    emotions: string[];
    triggers?: string[];
    physicalSymptoms?: string[];
    notes?: string;
}

export interface UserProfile {
    id: string;
    name: string;
    preferredCommunicationStyle: 'empathetic' | 'direct' | 'analytical';
    triggers: string[];
    copingStrategies: string[];
    goals: string[];
    createdAt: Date;
    notificationPreferences?: {
        checkIns: boolean;
        insights: boolean;
        reminders: boolean;
    };
}

export interface BreathingPattern {
    name: string;
    inhale: number;
    hold: number;
    exhale: number;
    pauseAfter?: number;
    description: string;
    benefits: string[];
}