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
};
