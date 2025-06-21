// client/src/components/Chat/QuickActions.tsx
import { motion } from "framer-motion";
import { Brain, Heart, Moon, Coffee } from "lucide-react";
import { useAppStore } from "../../store/useAppstore";
interface QuickActionsProps {
  onSelect: () => void;
}

export function QuickActions({ onSelect }: QuickActionsProps) {
  const { addMessage } = useAppStore();

  const quickPrompts = [
    {
      icon: Brain,
      text: "I'm feeling overwhelmed",
      message:
        "I'm feeling overwhelmed and my mind won't stop racing. I need help calming down.",
      color: "from-red-400 to-orange-500",
    },
    {
      icon: Moon,
      text: "Can't sleep",
      message:
        "I can't sleep because my mind is too active. What can I do to quiet my thoughts?",
      color: "from-indigo-400 to-purple-500",
    },
    {
      icon: Heart,
      text: "Feeling anxious",
      message:
        "I'm feeling anxious about tomorrow and I can't shake this feeling. Can you help?",
      color: "from-pink-400 to-red-500",
    },
    {
      icon: Coffee,
      text: "Need motivation",
      message:
        "I'm struggling to find motivation and feel stuck. How can I get back on track?",
      color: "from-yellow-400 to-orange-500",
    },
  ];

  const handleQuickAction = async (prompt: (typeof quickPrompts)[0]) => {
    onSelect();
    await addMessage(prompt.message);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 gap-3"
    >
      {quickPrompts.map((prompt, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleQuickAction(prompt)}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 text-left hover:border-slate-600/50 transition-all group"
        >
          <div
            className={`w-10 h-10 bg-gradient-to-br ${prompt.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
          >
            <prompt.icon size={20} className="text-white" />
          </div>
          <p className="text-sm text-slate-300 font-medium">{prompt.text}</p>
        </motion.button>
      ))}
    </motion.div>
  );
}
