import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useConversations } from '../../hooks/useConversations';
import { MessageCircle, Moon, Wind } from 'lucide-react';

interface ChatInterfaceProps {
  onStartBreathing: () => void;
}

export function ChatInterface({ onStartBreathing }: ChatInterfaceProps) {
  const { currentConversation, isTyping, startNewConversation, sendMessage, endConversation } = useConversations();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages, isTyping]);

  useEffect(() => {
    if (!currentConversation) {
      startNewConversation();
    }
  }, []);

  const handleSendMessage = (message: string, mood?: 'anxious' | 'calm' | 'confused' | 'hopeful') => {
    sendMessage(message, mood);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Moon size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-medium">NightMind</h2>
            <p className="text-slate-400 text-sm">Your companion for late-night thoughts</p>
          </div>
        </div>
        
        <button
          onClick={onStartBreathing}
          className="bg-slate-700 hover:bg-slate-600 text-slate-300 p-2 rounded-lg transition-colors"
          title="Start breathing exercise"
        >
          <Wind size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
        {!currentConversation || currentConversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={24} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-light text-white mb-2">Welcome to NightMind</h3>
            <p className="text-slate-400 max-w-md leading-relaxed">
              I'm here to help you process your thoughts and reduce anxiety through conversation. 
              What's keeping you awake tonight?
            </p>
          </div>
        ) : (
          <>
            {currentConversation.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isTyping && (
              <div className="flex gap-3 mb-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                  <MessageCircle size={16} className="text-slate-300" />
                </div>
                <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
    </div>
  );
}