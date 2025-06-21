import React from 'react';
import { Message } from '../../types';
import { User, Bot, Clock } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-600' : 'bg-slate-700'
      }`}>
        {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-slate-300" />}
      </div>
      
      <div className={`flex-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-blue-600 text-white rounded-br-md' 
            : 'bg-slate-800 text-slate-100 rounded-bl-md'
        }`}>
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        
        <div className="flex items-center gap-2 mt-1 px-2">
          <Clock size={12} className="text-slate-500" />
          <span className="text-xs text-slate-500">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {message.tags && message.tags.length > 0 && (
            <div className="flex gap-1 ml-2">
              {message.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}