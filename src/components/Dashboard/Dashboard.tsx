import React from 'react';
import { useConversations } from '../../hooks/useConversations';
import { BarChart3, Clock, MessageSquare, Target, TrendingUp, Calendar } from 'lucide-react';

export function Dashboard() {
  const { conversations } = useConversations();

  const totalConversations = conversations.length;
  const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0);
  const avgMessagesPerConversation = totalConversations > 0 ? Math.round(totalMessages / totalConversations) : 0;

  // Calculate peak hours
  const hourCounts = new Array(24).fill(0);
  conversations.forEach(conv => {
    const hour = new Date(conv.startTime).getHours();
    hourCounts[hour]++;
  });
  const peakHour = hourCounts.indexOf(Math.max(...hourCounts));

  // Most common tags
  const tagCounts: Record<string, number> = {};
  conversations.forEach(conv => {
    conv.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  const topTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6);

  // Recent activity (last 7 days)
  const last7Days = new Array(7).fill(0);
  const today = new Date();
  conversations.forEach(conv => {
    const convDate = new Date(conv.startTime);
    const daysDiff = Math.floor((today.getTime() - convDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff >= 0 && daysDiff < 7) {
      last7Days[6 - daysDiff]++;
    }
  });

  const stats = [
    {
      label: 'Total Conversations',
      value: totalConversations,
      icon: MessageSquare,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    {
      label: 'Messages Exchanged',
      value: totalMessages,
      icon: BarChart3,
      color: 'text-green-400',
      bg: 'bg-green-400/10'
    },
    {
      label: 'Avg. Messages/Session',
      value: avgMessagesPerConversation,
      icon: Target,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    },
    {
      label: 'Peak Hour',
      value: `${peakHour}:00`,
      icon: Clock,
      color: 'text-orange-400',
      bg: 'bg-orange-400/10'
    }
  ];

  return (
    <div className="h-full bg-slate-900 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-light text-white mb-6">Dashboard & Insights</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-semibold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <stat.icon className={stat.color} size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Recent Activity (Last 7 Days)
          </h3>
          <div className="flex items-end gap-2 h-32">
            {last7Days.map((count, index) => {
              const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              const date = new Date();
              date.setDate(date.getDate() - (6 - index));
              const maxCount = Math.max(...last7Days);
              const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="bg-blue-500 rounded-t-sm w-full transition-all hover:bg-blue-400"
                    style={{ height: `${Math.max(height, 4)}%` }}
                    title={`${count} conversations`}
                  ></div>
                  <span className="text-xs text-slate-400 mt-2">
                    {dayNames[date.getDay()]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Topics */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Most Discussed Topics
          </h3>
          {topTags.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {topTags.map(([tag, count]) => (
                <div key={tag} className="bg-slate-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-200 font-medium capitalize">{tag}</span>
                    <span className="text-slate-400 text-sm">{count}x</span>
                  </div>
                  <div className="mt-2 bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(count / topTags[0][1]) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">Start conversations to see topic insights</p>
          )}
        </div>

        {/* Insights */}
        <div className="bg-slate-800 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-medium text-white mb-4">Personalized Insights</h3>
          <div className="space-y-3">
            {totalConversations > 0 && (
              <>
                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-slate-200 text-sm">
                    🌙 You tend to have deeper conversations around {peakHour}:00. 
                    This seems to be when your mind is most active.
                  </p>
                </div>
                {topTags.length > 0 && (
                  <div className="bg-slate-700 rounded-lg p-3">
                    <p className="text-slate-200 text-sm">
                      🎯 Your main focus areas are {topTags.slice(0, 2).map(([tag]) => tag).join(' and ')}. 
                      Consider setting specific goals around these topics.
                    </p>
                  </div>
                )}
                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-slate-200 text-sm">
                    💡 You average {avgMessagesPerConversation} messages per session, showing you value thoughtful dialogue.
                  </p>
                </div>
              </>
            )}
            {totalConversations === 0 && (
              <div className="bg-slate-700 rounded-lg p-3">
                <p className="text-slate-400 text-sm">
                  Start having conversations to unlock personalized insights about your thoughts and patterns.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}