import { useState, useEffect, useCallback } from "react";
import { useVoice, VoiceReadyState } from "@humeai/voice-react";
import { api } from "../services/api";

export interface UseHumeEVIReturn {
  isConnected: boolean;
  isListening: boolean;
  messages: Array<{
    type: "user_message" | "assistant_message";
    message: {
      role: "user" | "assistant";
      content: string;
    };
    timestamp: Date;
  }>;
  connect: () => Promise<void>;
  disconnect: () => void;
  error: string | null;
  accessToken: string | null;
  isLoading: boolean;
}

export function useHumeEVI(): UseHumeEVIReturn {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{
      type: "user_message" | "assistant_message";
      message: {
        role: "user" | "assistant";
        content: string;
      };
      timestamp: Date;
    }>
  >([]);

  const {
    connect: voiceConnect,
    disconnect: voiceDisconnect,
    readyState,
    messages: voiceMessages,
  } = useVoice();

  // Fetch access token from server
  const fetchAccessToken = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3001/api"
        }/hume/auth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to authenticate with Hume");
      }

      const data = await response.json();
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Authentication failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Connect to Hume EVI
  const connect = useCallback(async () => {
    try {
      if (!accessToken) {
        await fetchAccessToken();
      }

      if (accessToken) {
        await voiceConnect();
      }
    } catch (err) {
      console.error("Failed to connect to Hume EVI:", err);
      setError("Failed to connect to voice chat");
    }
  }, [accessToken, voiceConnect, fetchAccessToken]);

  // Disconnect from Hume EVI
  const disconnect = useCallback(() => {
    voiceDisconnect();
    setChatMessages([]);
    setError(null);
  }, [voiceDisconnect]);

  // Process voice messages and sync with chat
  useEffect(() => {
    if (voiceMessages.length > 0) {
      const newMessages = voiceMessages
        .filter(
          (msg) =>
            msg.type === "user_message" || msg.type === "assistant_message"
        )
        .filter((msg) => msg.message.content) // Filter out messages with undefined content
        .map((msg) => ({
          type: msg.type as "user_message" | "assistant_message",
          message: {
            role: msg.message.role as "user" | "assistant",
            content: msg.message.content!,
          },
          timestamp: new Date(),
        }));

      setChatMessages((prev) => {
        const existingIds = new Set(
          prev.map((m) => `${m.type}-${m.message.content}`)
        );
        const filteredNew = newMessages.filter(
          (m) => !existingIds.has(`${m.type}-${m.message.content}`)
        );
        return [...prev, ...filteredNew];
      });

      // Send user messages to the chat API for processing
      newMessages.forEach(async (msg) => {
        if (msg.type === "user_message") {
          try {
            const response = await api.getChatCompletion({
              messages: [
                {
                  content: msg.message.content,
                  sender: "user",
                  timestamp: msg.timestamp,
                },
              ],
            });

            // Add AI response to chat messages
            setChatMessages((prev) => [
              ...prev,
              {
                type: "assistant_message",
                message: {
                  role: "assistant",
                  content: response.content,
                },
                timestamp: response.timestamp,
              },
            ]);
          } catch (err) {
            console.error("Failed to process chat message:", err);
          }
        }
      });
    }
  }, [voiceMessages]);

  return {
    isConnected: readyState === VoiceReadyState.OPEN,
    isListening: readyState === VoiceReadyState.OPEN,
    messages: chatMessages,
    connect,
    disconnect,
    error,
    accessToken,
    isLoading,
  };
}
