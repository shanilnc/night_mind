import React, { useState } from 'react';
import { useConversations } from '../../hooks/useConversations';
import { Search, Calendar, Tag, Clock, TrendingUp } from 'lucide-react';
import { Conversation } from '../../types';

export function JournalView() {
  const { conversations } = useConversations();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  const allTags = [...new Set(conversations.flatMap(conv => conv.tags))];
  
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = searchTerm === '' || 
      conv.messages.some(msg => 
        msg.content.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      conv.tags.some(tag => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesTag = selectedTag === '' || conv.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConversationSummary = (conversation: Conversation) => {
    const userMessages = conversation.messages.filter(msg => msg.sender === 'user');
    if (userMessages.length === 0) return 'No messages';
    
    const firstMessage = userMessages[0].content;
    return firstMessage.length > 100 ? firstMessage.substring(0, 100) + '...' : firstMessage;
  };

  return (
    <div className="h-full bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-light text-white mb-4">Journal & Insights</h1>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search conversations, thoughts, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 text-white placeholder-slate-400 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tag Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedTag('')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedTag === '' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All Topics
          </button>
          {allTags.slice(0, 8).map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTag === tag 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto w-12 h-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">No conversations found</h3>
            <p className="text-slate-500">
              {searchTerm || selectedTag 
                ? 'Try adjusting your search or filter criteria'
                : 'Start your first conversation to see it here'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConversations
              .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
              .map((conversation) => (
                <div
                  key={conversation.id}
                  className="bg-slate-800 rounded-lg p-4 hover:bg-slate-750 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-slate-400" />
                      <span className="text-slate-400 text-sm">
                        {formatDate(conversation.startTime)}
                      </span>
                    </div>
                    <span className="text-slate-500 text-sm">
                      {conversation.messages.length} messages
                    </span>
                  </div>
                  
                  <p className="text-slate-200 text-sm mb-3 leading-relaxed">
                    {getConversationSummary(conversation)}
                  </p>
                  
                  {conversation.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag size={14} className="text-slate-500" />
                      {conversation.tags.slice(0, 4).map(tag => (
                        <span
                          key={tag}
                          className="bg-slate-700 text-slate-300 px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {conversation.tags.length > 4 && (
                        <span className="text-slate-500 text-xs">
                          +{conversation.tags.length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  {conversation.anxietyLevelBefore && conversation.anxietyLevelAfter && (
                    <div className="mt-3 flex items-center gap-2">
                      <TrendingUp size={14} className="text-green-400" />
                      <span className="text-sm text-slate-400">
                        Anxiety: {conversation.anxietyLevelBefore} → {conversation.anxietyLevelAfter}
                      </span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}