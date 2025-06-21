import React, { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { ChatInterface } from './components/Chat/ChatInterface';
import { JournalView } from './components/Journal/JournalView';
import { Dashboard } from './components/Dashboard/Dashboard';
import { BreathingAnimation } from './components/UI/BreathingAnimation';

function App() {
  const [activeView, setActiveView] = useState<'chat' | 'journal' | 'dashboard'>('chat');
  const [isBreathing, setIsBreathing] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'chat':
        return <ChatInterface onStartBreathing={() => setIsBreathing(true)} />;
      case 'journal':
        return <JournalView />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <ChatInterface onStartBreathing={() => setIsBreathing(true)} />;
    }
  };

  return (
    <div className="h-screen bg-slate-900 flex overflow-hidden">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 flex flex-col min-w-0">
        {renderActiveView()}
      </main>
      
      <BreathingAnimation 
        isActive={isBreathing} 
        onComplete={() => setIsBreathing(false)} 
      />
    </div>
  );
}

export default App;