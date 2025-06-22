// client/src/components/Chat/ConversationHistory.tsx
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Clock, X } from "lucide-react";
import { useAppStore } from "../../store/useAppstore";
import { format } from "date-fns";

interface ConversationHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConversationHistory({
  isOpen,
  onClose,
}: ConversationHistoryProps) {
  const {
    conversations,
    currentConversation,
    setCurrentConversation,
    createConversation,
  } = useAppStore();

  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  const handleSelectConversation = (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
      onClose();
    }
  };

  const handleNewChat = () => {
    createConversation();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed left-0 top-0 h-full w-80 bg-slate-900 border-r border-slate-700 z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-white">Chat History</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNewChat}
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Start New Chat
              </motion.button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {sortedConversations.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <MessageCircle
                    size={48}
                    className="mx-auto mb-3 opacity-50"
                  />
                  <p>No previous conversations</p>
                </div>
              ) : (
                sortedConversations.map((conversation) => {
                  const isActive = currentConversation?.id === conversation.id;
                  const messagePreview =
                    conversation.messages[0]?.content || "Empty conversation";

                  return (
                    <motion.button
                      key={conversation.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectConversation(conversation.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-blue-600/20 border-blue-600/50"
                          : "bg-slate-800/50 hover:bg-slate-800 border-transparent"
                      } border`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isActive ? "bg-blue-600" : "bg-slate-700"
                          }`}
                        >
                          <MessageCircle size={16} className="text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock size={12} className="text-slate-400" />
                            <span className="text-xs text-slate-400">
                              {format(
                                new Date(conversation.startTime),
                                "MMM d, h:mm a"
                              )}
                            </span>
                          </div>

                          <p className="text-sm text-slate-300 line-clamp-2">
                            {messagePreview}
                          </p>

                          {conversation.tags.length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {conversation.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
