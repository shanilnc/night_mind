const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface ChatCompletionRequest {
  messages: Array<{
    content: string;
    sender: "user" | "ai";
    timestamp: Date;
  }>;
  userProfile?: {
    preferredCommunicationStyle?: "empathetic" | "direct" | "analytical";
  };
}

export interface ChatCompletionResponse {
  content: string;
  timestamp: Date;
  tags: string[];
}

export interface ConversationAnalysisRequest {
  conversation: {
    messages: Array<{
      content: string;
      sender: "user" | "ai";
    }>;
  };
}

export interface ConversationAnalysisResponse {
  summary: string;
  mood: "positive" | "negative" | "neutral";
  tags: string[];
}

// Journal Types
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: number;
  tags: string[];
  anxietyLevel?: number;
  gratitude?: string;
  goals?: string;
  timestamp: Date;
  updatedAt: Date;
  conversationId?: string;
  messageCount?: number;
  userMessageCount?: number;
  aiMessageCount?: number;
  isFromConversation?: boolean;
}

export interface CreateJournalEntryRequest {
  title?: string;
  content: string;
  mood?: number;
  tags?: string[];
  anxietyLevel?: number;
  gratitude?: string;
  goals?: string;
}

export interface UpdateJournalEntryRequest {
  title?: string;
  content?: string;
  mood?: number;
  tags?: string[];
  anxietyLevel?: number;
  gratitude?: string;
  goals?: string;
}

export interface MoodEntry {
  id: string;
  mood: number;
  emotions: string[];
  triggers?: string[];
  physicalSymptoms?: string[];
  notes?: string;
  timestamp: Date;
}

export interface CreateMoodEntryRequest {
  mood: number;
  emotions?: string[];
  triggers?: string[];
  physicalSymptoms?: string[];
  notes?: string;
}

export interface Insight {
  id: string;
  type: "pattern" | "trigger" | "improvement" | "achievement";
  title: string;
  description: string;
  frequency: number;
  lastOccurrence: Date;
  actionable?: string;
}

export interface CreateInsightRequest {
  type: "pattern" | "trigger" | "improvement" | "achievement";
  title: string;
  description: string;
  frequency?: number;
  actionable?: string;
}

export interface JournalStats {
  totalEntries: number;
  conversationEntries: number;
  manualEntries: number;
  totalMoodEntries: number;
  averageMood: number;
  topTags: Array<{ tag: string; count: number }>;
  moodByDate: Array<{ date: string; averageMood: number }>;
  insights: number;
}

export const api = {
  async getChatCompletion(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    const response = await fetch(`${API_BASE_URL}/chat/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },

  async analyzeConversation(
    request: ConversationAnalysisRequest
  ): Promise<ConversationAnalysisResponse> {
    const response = await fetch(`${API_BASE_URL}/chat/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      return data.status === "ok";
    } catch {
      return false;
    }
  },

  // Journal API methods
  async getJournalEntries(params?: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ entries: JournalEntry[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/journal/entries?${searchParams}`
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },

  async createJournalEntry(
    request: CreateJournalEntryRequest
  ): Promise<JournalEntry> {
    const response = await fetch(`${API_BASE_URL}/journal/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },

  async getJournalEntry(id: string): Promise<JournalEntry> {
    const response = await fetch(`${API_BASE_URL}/journal/entries/${id}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },

  async updateJournalEntry(
    id: string,
    request: UpdateJournalEntryRequest
  ): Promise<JournalEntry> {
    const response = await fetch(`${API_BASE_URL}/journal/entries/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },

  async deleteJournalEntry(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/journal/entries/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
  },

  async getMoodEntries(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<MoodEntry[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value);
        }
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/journal/mood?${searchParams}`
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },

  async createMoodEntry(request: CreateMoodEntryRequest): Promise<MoodEntry> {
    const response = await fetch(`${API_BASE_URL}/journal/mood`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },

  async getInsights(params?: { type?: string }): Promise<Insight[]> {
    const searchParams = new URLSearchParams();
    if (params?.type) {
      searchParams.append("type", params.type);
    }

    const response = await fetch(
      `${API_BASE_URL}/journal/insights?${searchParams}`
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },

  async createInsight(request: CreateInsightRequest): Promise<Insight> {
    const response = await fetch(`${API_BASE_URL}/journal/insights`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },

  async getJournalStats(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<JournalStats> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value);
        }
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/journal/stats?${searchParams}`
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },

  // Create journal entry from conversation
  async createJournalFromConversation(
    conversation: any
  ): Promise<JournalEntry> {
    const response = await fetch(`${API_BASE_URL}/journal/from-conversation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conversation }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  },
};
