// client/src/components/Chat/ChatMessage.tsx
import { motion } from "framer-motion";
import { Message } from "../../types.d";
import { User, Bot, Clock, Sparkles } from "lucide-react";
import { format } from "date-fns";

interface ChatMessageProps {
  message: Message;
  index: number;
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.sender === "user";

  const messageVariants = {
    hidden: {
      opacity: 0,
      x: isUser ? 20 : -20,
      y: 10,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay: index * 0.1,
      },
    },
  };

  const getMoodColor = () => {
    if (!message.mood) return "from-blue-500 to-purple-600";

    const moodColors = {
      anxious: "from-red-400 to-orange-500",
      stressed: "from-orange-400 to-red-500",
      confused: "from-yellow-400 to-orange-500",
      calm: "from-green-400 to-teal-500",
      hopeful: "from-blue-400 to-green-500",
      relaxed: "from-teal-400 to-blue-500",
    };

    return moodColors[message.mood] || "from-blue-500 to-purple-600";
  };

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center ${
          isUser
            ? `bg-gradient-to-br ${getMoodColor()}`
            : "bg-gradient-to-br from-slate-700 to-slate-800"
        }`}
      >
        {isUser ? (
          <User size={20} className="text-white" />
        ) : (
          <Bot size={20} className="text-slate-300" />
        )}
      </motion.div>

      {/* Message Content */}
      <div
        className={`flex-1 max-w-[75%] ${isUser ? "items-end" : "items-start"}`}
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`relative group ${
            isUser
              ? "bg-gradient-to-br from-blue-500/90 to-purple-600/90 text-white rounded-3xl rounded-br-lg"
              : "bg-slate-800/70 backdrop-blur-xl text-slate-100 rounded-3xl rounded-bl-lg border border-slate-700/50"
          } px-5 py-3 shadow-lg`}
        >
          {/* Message text */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>

          {/* AI Sparkle indicator */}
          {!isUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
            >
              <Sparkles size={12} className="text-white" />
            </motion.div>
          )}
        </motion.div>

        {/* Metadata */}
        <div
          className={`flex items-center gap-3 mt-2 px-2 ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >
          <div className="flex items-center gap-1 text-slate-500">
            <Clock size={12} />
            <span className="text-xs">
              {format(new Date(message.timestamp), "h:mm a")}
            </span>
          </div>

          {/* Mood indicator */}
          {message.mood && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getMoodColor()} text-white font-medium`}
            >
              {message.mood}
            </motion.span>
          )}

          {/* Tags */}
          {message.tags && message.tags.length > 0 && (
            <div className="flex gap-1">
              {message.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-slate-700/50 text-slate-400 px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
