import { useState, useEffect } from 'react';
import { Conversation, Message } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { generateAIResponse } from '../utils/aiResponses';

export function useConversations() {
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('nightmind-conversations', []);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const startNewConversation = () => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: `Conversation ${new Date().toLocaleDateString()}`,
      messages: [],
      startTime: new Date(),
      tags: [],
    };
    setCurrentConversation(newConversation);
    return newConversation;
  };

  const sendMessage = async (content: string, mood?: Message['mood']) => {
    if (!currentConversation) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      sender: 'user',
      timestamp: new Date(),
      mood,
      tags: extractTags(content),
    };

    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage],
    };

    setCurrentConversation(updatedConversation);
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(content, updatedConversation.messages);
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        tags: extractTags(aiResponse),
      };

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, aiMessage],
        tags: [...new Set([...updatedConversation.tags, ...userMessage.tags!, ...aiMessage.tags!])],
      };

      setCurrentConversation(finalConversation);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const endConversation = (anxietyLevelAfter?: number) => {
    if (!currentConversation) return;

    const endedConversation = {
      ...currentConversation,
      endTime: new Date(),
      anxietyLevelAfter,
    };

    setConversations(prev => {
      const existing = prev.findIndex(c => c.id === endedConversation.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = endedConversation;
        return updated;
      }
      return [...prev, endedConversation];
    });

    setCurrentConversation(null);
  };

  const extractTags = (content: string): string[] => {
    const keywords = [
      'startup', 'business', 'strategy', 'anxiety', 'sleep', 'decision',
      'team', 'product', 'market', 'stress', 'worried', 'uncertain',
      'growth', 'revenue', 'funding', 'leadership', 'competition'
    ];
    
    return keywords.filter(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  return {
    conversations,
    currentConversation,
    isTyping,
    startNewConversation,
    sendMessage,
    endConversation,
    setCurrentConversation,
  };
}