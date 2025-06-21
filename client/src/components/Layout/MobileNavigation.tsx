import { motion } from "framer-motion";
import { MessageCircle, BookOpen, BarChart3 } from "lucide-react";

interface MobileNavigationProps {
  activeView: "chat" | "journal" | "dashboard";
  onViewChange: (view: "chat" | "journal" | "dashboard") => void;
}

export function MobileNavigation({
  activeView,
  onViewChange,
}: MobileNavigationProps) {
  const menuItems = [
    { id: "chat" as const, label: "Chat", icon: MessageCircle },
    { id: "journal" as const, label: "Journal", icon: BookOpen },
    { id: "dashboard" as const, label: "Insights", icon: BarChart3 },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewChange(item.id)}
            className={`relative flex flex-col items-center gap-1 px-6 py-3 rounded-2xl transition-all min-w-0 flex-1 ${
              activeView === item.id
                ? "bg-blue-500/20 text-blue-400"
                : "text-slate-400 hover:text-slate-300 active:text-slate-200"
            }`}
          >
            <item.icon size={20} />
            <span className="text-xs font-medium truncate">{item.label}</span>
            {activeView === item.id && (
              <motion.div
                layoutId="mobileActiveIndicator"
                className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
