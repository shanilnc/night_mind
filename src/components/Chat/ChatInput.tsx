import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Heart } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, mood?: 'anxious' | 'calm' | 'confused' | 'hopeful') => void;
  isTyping: boolean;
}

export function ChatInput({ onSendMessage, isTyping }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [selectedMood, setSelectedMood] = useState<'anxious' | 'calm' | 'confused' | 'hopeful' | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isTyping) {
      onSendMessage(message.trim(), selectedMood || undefined);
      setMessage('');
      setSelectedMood(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const moods = [
    { value: 'anxious' as const, label: '😰 Anxious', color: 'text-red-400' },
    { value: 'confused' as const, label: '🤔 Confused', color: 'text-yellow-400' },
    { value: 'hopeful' as const, label: '🌟 Hopeful', color: 'text-green-400' },
    { value: 'calm' as const, label: '😌 Calm', color: 'text-blue-400' },
  ];

  return (
    <div className="border-t border-slate-700 bg-slate-800/95 backdrop-blur-sm p-4">
      {/* Mood Selector */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <span className="text-xs text-slate-400 mr-2 self-center">How are you feeling?</span>
        {moods.map(mood => (
          <button
            key={mood.value}
            onClick={() => setSelectedMood(selectedMood === mood.value ? null : mood.value)}
            className={`text-xs px-3 py-1 rounded-full transition-all ${
              selectedMood === mood.value
                ? 'bg-slate-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {mood.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What's on your mind tonight?"
            disabled={isTyping}
            className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-2xl px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all max-h-32 text-sm leading-relaxed"
            rows={1}
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-300 transition-colors"
            title="Voice input (coming soon)"
          >
            <Mic size={18} />
          </button>
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || isTyping}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isTyping ? (
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            <Send size={18} />
          )}
        </button>
      </form>
      
      <div className="flex items-center justify-center mt-3">
        <Heart size={14} className="text-slate-500 mr-2" />
        <span className="text-xs text-slate-500">Your thoughts are safe here</span>
      </div>
    </div>
  );
}