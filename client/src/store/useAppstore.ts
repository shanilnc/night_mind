// client/src/store/useAppStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import CryptoJS from "crypto-js";
import {
  Conversation,
  Message,
  UserInsight,
  UserProfile,
  MoodEntry,
} from "../types";
import { api } from "../services/api";

// Encryption helper
const ENCRYPTION_KEY = "nightmind-secure-key-2025"; // In production, use env variable

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
  breathingPattern: "box" | "478" | "coherent";
  theme: "dark" | "light" | "system";

  // Actions
  createConversation: () => void;
  addMessage: (content: string, mood?: Message["mood"]) => Promise<void>;
  endConversation: (anxietyLevelAfter?: number) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;

  updateUserProfile: (updates: Partial<UserProfile>) => void;
  trackMood: (entry: MoodEntry) => void;

  setBreathing: (active: boolean) => void;
  setBreathingPattern: (pattern: "box" | "478" | "coherent") => void;
  setTheme: (theme: "dark" | "light" | "system") => void;

  generateInsights: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      userProfile: {
        id: crypto.randomUUID(),
        name: "",
        preferredCommunicationStyle: "empathetic",
        triggers: [],
        copingStrategies: [],
        goals: [],
        createdAt: new Date(),
      },

      conversations: [],
      currentConversation: null,
      moodHistory: [],
      insights: [],

      isBreathing: false,
      breathingPattern: "box",
      theme: "dark",

      // Actions
      createConversation: () => {
        const newConversation: Conversation = {
          id: crypto.randomUUID(),
          title: `Session ${new Date().toLocaleDateString()}`,
          messages: [],
          startTime: new Date(),
          tags: [],
          mood: undefined,
        };

        set({ currentConversation: newConversation });
      },

      addMessage: async (content: string, mood?: Message["mood"]) => {
        const { currentConversation, userProfile } = get();
        if (!currentConversation) return;

        const userMessage: Message = {
          id: crypto.randomUUID(),
          content,
          sender: "user",
          timestamp: new Date(),
          mood,
          tags: extractTags(content),
        };

        const updatedConversation = {
          ...currentConversation,
          messages: [...currentConversation.messages, userMessage],
        };

        set({ currentConversation: updatedConversation });

        try {
          // Call the API
          const response = await api.getChatCompletion({
            messages: updatedConversation.messages.map((m) => ({
              content: m.content,
              sender: m.sender,
              timestamp: m.timestamp,
            })),
            userProfile: {
              preferredCommunicationStyle:
                userProfile.preferredCommunicationStyle,
            },
          });

          const aiMessage: Message = {
            id: crypto.randomUUID(),
            content: response.content,
            sender: "ai",
            timestamp: new Date(response.timestamp),
            tags: response.tags,
          };

          const finalConversation = {
            ...updatedConversation,
            messages: [...updatedConversation.messages, aiMessage],
            tags: [
              ...new Set([
                ...updatedConversation.tags,
                ...userMessage.tags!,
                ...aiMessage.tags!,
              ]),
            ],
          };

          set({ currentConversation: finalConversation });
        } catch (error) {
          console.error("Failed to get AI response:", error);
          // Fallback message
          const errorMessage: Message = {
            id: crypto.randomUUID(),
            content:
              "I'm having trouble connecting right now. Please try again in a moment.",
            sender: "ai",
            timestamp: new Date(),
            tags: [],
          };

          set({
            currentConversation: {
              ...updatedConversation,
              messages: [...updatedConversation.messages, errorMessage],
            },
          });
        }
      },

      endConversation: async (anxietyLevelAfter?: number) => {
        const { currentConversation, conversations } = get();
        if (!currentConversation || currentConversation.messages.length === 0)
          return;

        try {
          // Get conversation analysis from API
          const analysis = await api.analyzeConversation({
            conversation: {
              messages: currentConversation.messages.map((m) => ({
                content: m.content,
                sender: m.sender,
              })),
            },
          });

          const completedConversation: Conversation = {
            ...currentConversation,
            endTime: new Date(),
            anxietyLevelAfter,
            summary: analysis.summary,
            mood: analysis.mood,
            tags: analysis.tags,
          };

          set({
            conversations: [...conversations, completedConversation],
            currentConversation: null,
          });
        } catch (error) {
          console.error("Failed to analyze conversation:", error);
          // Save without analysis
          const completedConversation: Conversation = {
            ...currentConversation,
            endTime: new Date(),
            anxietyLevelAfter,
          };

          set({
            conversations: [...conversations, completedConversation],
            currentConversation: null,
          });
        }
      },

      setCurrentConversation: (conversation) => {
        set({ currentConversation: conversation });
      },

      updateUserProfile: (updates) => {
        set((state) => ({
          userProfile: { ...state.userProfile, ...updates },
        }));
      },

      trackMood: (entry) => {
        set((state) => ({
          moodHistory: [...state.moodHistory, entry],
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
        conversations.forEach((conv) => {
          conv.tags.forEach((tag) => {
            tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
          });
        });

        Object.entries(tagFrequency).forEach(([tag, count]) => {
          if (count >= 3) {
            insights.push({
              id: crypto.randomUUID(),
              type: "pattern",
              title: `Recurring Theme: ${tag}`,
              description: `You've discussed ${tag} in ${count} conversations. This seems to be an important topic for you.`,
              frequency: count,
              lastOccurrence: new Date(),
            });
          }
        });

        set({ insights });
      },
    }),
    {
      name: "nightmind-storage",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return decryptData(str);
        },
        setItem: (name, value) => {
          localStorage.setItem(name, encryptData(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
    }
  )
);

// Helper functions
function extractTags(content: string): string[] {
  const keywords = [
    "anxiety",
    "stress",
    "work",
    "sleep",
    "relationship",
    "family",
    "health",
    "decision",
    "future",
    "money",
    "career",
    "self-doubt",
    "confidence",
    "fear",
    "anger",
    "sadness",
    "joy",
    "hope",
  ];

  return keywords.filter((keyword) =>
    content.toLowerCase().includes(keyword.toLowerCase())
  );
}
