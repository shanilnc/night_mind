// client/src/store/useAppStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import CryptoJS from 'crypto-js';
import { Conversation, Message, UserInsight, UserProfile, MoodEntry } from '../types';
import { generateAIResponse } from '../utils/aiResponses';

// Encryption helper
const ENCRYPTION_KEY = 'nightmind-secure-key-2025'; // In production, use env variable

const encryptData = (data: any) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

const decryptData = (encryptedData: string) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch {
        return null;
    }
};

interface AppState {
    // User Profile
    userProfile: UserProfile;

    // Conversations
    conversations: Conversation[];
    currentConversation: Conversation | null;

    // Mood Tracking
    moodHistory: MoodEntry[];

    // Insights
    insights: UserInsight[];

    // UI State
    isBreathing: boolean;
    breathingPattern: 'box' | '478' | 'coherent';
    theme: 'dark' | 'light' | 'system';

    // Actions
    createConversation: () => void;
    addMessage: (content: string, mood?: Message['mood']) => Promise<void>;
    endConversation: (anxietyLevelAfter?: number) => void;

    updateUserProfile: (updates: Partial<UserProfile>) => void;
    trackMood: (entry: MoodEntry) => void;

    setBreathing: (active: boolean) => void;
    setBreathingPattern: (pattern: 'box' | '478' | 'coherent') => void;
    setTheme: (theme: 'dark' | 'light' | 'system') => void;

    generateInsights: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial State
            userProfile: {
                id: crypto.randomUUID(),
                name: '',
                preferredCommunicationStyle: 'empathetic',
                triggers: [],
                copingStrategies: [],
                goals: [],
                createdAt: new Date()
            },

            conversations: [],
            currentConversation: null,
            moodHistory: [],
            insights: [],

            isBreathing: false,
            breathingPattern: 'box',
            theme: 'dark',

            // Actions
            createConversation: () => {
                const newConversation: Conversation = {
                    id: crypto.randomUUID(),
                    title: `Session ${new Date().toLocaleDateString()}`,
                    messages: [],
                    startTime: new Date(),
                    tags: [],
                    mood: undefined
                };

                set({ currentConversation: newConversation });
            },

            addMessage: async (content: string, mood?: Message['mood']) => {
                const { currentConversation } = get();
                if (!currentConversation) return;

                const userMessage: Message = {
                    id: crypto.randomUUID(),
                    content,
                    sender: 'user',
                    timestamp: new Date(),
                    mood,
                    tags: extractTags(content)
                };

                const updatedConversation = {
                    ...currentConversation,
                    messages: [...currentConversation.messages, userMessage]
                };

                set({ currentConversation: updatedConversation });

                // Simulate AI response (replace with real API call)
                setTimeout(async () => {
                    const aiResponse = await generateAIResponse(content, updatedConversation.messages);

                    const aiMessage: Message = {
                        id: crypto.randomUUID(),
                        content: aiResponse,
                        sender: 'ai',
                        timestamp: new Date(),
                        tags: extractTags(aiResponse)
                    };

                    const finalConversation = {
                        ...updatedConversation,
                        messages: [...updatedConversation.messages, aiMessage],
                        tags: [...new Set([...updatedConversation.tags, ...userMessage.tags!, ...aiMessage.tags!])]
                    };

                    set({ currentConversation: finalConversation });
                }, 1500);
            },

            endConversation: (anxietyLevelAfter?: number) => {
                const { currentConversation, conversations } = get();
                if (!currentConversation) return;

                const endedConversation = {
                    ...currentConversation,
                    endTime: new Date(),
                    anxietyLevelAfter
                };

                set({
                    conversations: [...conversations, endedConversation],
                    currentConversation: null
                });

                // Generate insights after conversation ends
                get().generateInsights();
            },

            updateUserProfile: (updates) => {
                set((state) => ({
                    userProfile: { ...state.userProfile, ...updates }
                }));
            },

            trackMood: (entry) => {
                set((state) => ({
                    moodHistory: [...state.moodHistory, entry]
                }));
            },

            setBreathing: (active) => set({ isBreathing: active }),
            setBreathingPattern: (pattern) => set({ breathingPattern: pattern }),
            setTheme: (theme) => set({ theme }),

            generateInsights: () => {
                const { conversations } = get();

                // Analyze patterns in conversations and mood
                const insights: UserInsight[] = [];

                // Example insight generation (expand this with real analysis)
                const tagFrequency: Record<string, number> = {};
                conversations.forEach(conv => {
                    conv.tags.forEach(tag => {
                        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
                    });
                });

                Object.entries(tagFrequency).forEach(([tag, count]) => {
                    if (count >= 3) {
                        insights.push({
                            id: crypto.randomUUID(),
                            type: 'pattern',
                            title: `Recurring Theme: ${tag}`,
                            description: `You've discussed ${tag} in ${count} conversations. This seems to be an important topic for you.`,
                            frequency: count,
                            lastOccurrence: new Date()
                        });
                    }
                });

                set({ insights });
            }
        }),
        {
            name: 'nightmind-storage',
            storage: createJSONStorage(() => ({
                getItem: (name) => {
                    const str = localStorage.getItem(name);
                    if (!str) return null;
                    return decryptData(str);
                },
                setItem: (name, value) => {
                    localStorage.setItem(name, encryptData(value));
                },
                removeItem: (name) => localStorage.removeItem(name)
            }))
        }
    )
);

// Helper functions
function extractTags(content: string): string[] {
    const keywords = [
        'anxiety', 'stress', 'work', 'sleep', 'relationship', 'family',
        'health', 'decision', 'future', 'money', 'career', 'self-doubt',
        'confidence', 'fear', 'anger', 'sadness', 'joy', 'hope'
    ];

    return keywords.filter(keyword =>
        content.toLowerCase().includes(keyword.toLowerCase())
    );
}