import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage } from "./ChatMessage";
import { MessageCircle, Brain, Sparkles, Plus } from "lucide-react";
import { useAppStore } from "../../store/useAppstore";
import { QuickActions } from "./QuickActions";
import { ChatInput } from "./ChatInput";
import { ConversationHistory } from "./ConversationHistory";
import { Clock } from "lucide-react";

export function ChatInterface() {
  const {
    currentConversation,
    createConversation,
    userProfile,
    addMessage,
    endConversation,
  } = useAppStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages]);

  useEffect(() => {
    if (!currentConversation) {
      createConversation();
    }
  }, [currentConversation, createConversation]);

  const handleSendMessage = async (
    message: string,
    mood?: "anxious" | "calm" | "confused" | "hopeful"
  ) => {
    setIsTyping(true);
    await addMessage(message, mood);
    setIsTyping(false);
  };

  const handleNewChat = () => {
    if (currentConversation && currentConversation.messages.length > 0) {
      // End current conversation if it has messages
      endConversation();
    }
    // Create new conversation
    createConversation();
    setShowQuickActions(true);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = userProfile.name || "there";

    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 17) return `Good afternoon, ${name}`;
    if (hour < 21) return `Good evening, ${name}`;
    return `Hello, ${name}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Enhanced Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800/50 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Brain size={24} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            <div>
              <h2 className="text-white font-medium flex items-center gap-2">
                {getGreeting()}
                <Sparkles size={16} className="text-yellow-400" />
              </h2>
              <p className="text-slate-400 text-sm">
                I'm here to listen and support you
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white rounded-lg transition-all border border-slate-700/50 hover:border-slate-600/50"
              title="View chat history"
            >
              <Clock size={18} />
              {/* <span className="text-sm font-medium">History</span> */}
            </motion.button>

            {/* New Chat Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNewChat}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white rounded-lg transition-all border border-slate-700/50 hover:border-slate-600/50"
              title="Start new conversation"
            >
              <Plus size={18} />
              {/* <span className="text-sm font-medium">New Chat</span> */}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {!currentConversation || currentConversation.messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="max-w-md mx-auto">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-xl"
                >
                  <MessageCircle size={48} className="text-blue-400" />
                </motion.div>

                <h3 className="text-2xl font-light text-white mb-4">
                  How are you feeling tonight?
                </h3>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Whether it's anxiety, stress, or just need someone to talk to,
                  I'm here to help you process your thoughts in a safe space.
                </p>

                {showQuickActions && (
                  <QuickActions onSelect={() => setShowQuickActions(false)} />
                )}
              </div>
            </motion.div>
          ) : (
            <>
              {currentConversation.messages.map((message, index) => (
                <ChatMessage key={message.id} message={message} index={index} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </AnimatePresence>
      </div>

      <ConversationHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />

      {/* Enhanced Input */}
      <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
    </div>
  );
}
