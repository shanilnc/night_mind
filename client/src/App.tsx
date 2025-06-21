// client/src/App.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Radio } from "lucide-react";
import { Sidebar } from "./components/Layout/Sidebar";
import { MobileNavigation } from "./components/Layout/MobileNavigation";
import { ChatInterface } from "./components/Chat/ChatInterface";
import { JournalView } from "./components/Journal/JournalView";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { WelcomeScreen } from "./components/UI/WelcomeScreen";
import { BreathingAnimation } from "./components/UI/BreathingAnimationEnhanced2";
import { VoiceChatOverlay } from "./components/UI/VoiceChatOverlay";
import { useAppStore } from "./store/useAppstore";

function App() {
  const { userProfile, theme, isBreathing, setBreathing } = useAppStore();
  const [activeView, setActiveView] = useState<
    "chat" | "journal" | "dashboard"
  >("chat");
  const [showWelcome, setShowWelcome] = useState(!userProfile.name);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showVoiceChat, setShowVoiceChat] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Apply theme
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const renderActiveView = () => {
    const views = {
      chat: <ChatInterface />,
      journal: <JournalView />,
      dashboard: <Dashboard />,
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {views[activeView]}
        </motion.div>
      </AnimatePresence>
    );
  };

  if (showWelcome) {
    return <WelcomeScreen onComplete={() => setShowWelcome(false)} />;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex overflow-hidden">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Sidebar activeView={activeView} onViewChange={setActiveView} />
        </motion.div>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col min-w-0 relative ${
          isMobile ? "pb-20" : ""
        }`}
      >
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-3xl" />

        <div className="relative z-10 h-full">{renderActiveView()}</div>

        {/* Enhanced Floating orbs for ambiance */}
        <motion.div
          className="fixed top-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(circle, #3B82F6, #1E40AF, transparent)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="fixed bottom-20 left-20 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{
            background:
              "radial-gradient(circle, #8B5CF6, #6366F1, transparent)",
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="fixed top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{
            background:
              "radial-gradient(circle, #10B981, #059669, transparent)",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.05, 0.2, 0.05],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating Action Buttons */}
        <div
          className={`fixed ${
            isMobile
              ? activeView === "chat"
                ? "bottom-44 right-1 gap-1"
                : "bottom-32 right-6"
              : activeView === "chat"
              ? "bottom-40 right-3"
              : "bottom-24 right-8"
          } z-40 flex flex-col gap-4`}
        >
          {/* Breathing Exercise Button */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setBreathing(!isBreathing)}
            className={`${
              activeView === "chat" ? "w-12 h-12" : "w-14 h-14"
            } rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all group overflow-hidden relative ${
              isBreathing
                ? "bg-gradient-to-br from-emerald-400/90 via-teal-500/90 to-cyan-500/90 text-white shadow-emerald-500/25"
                : "bg-slate-800/80 text-slate-300 hover:text-white border border-slate-600/30 hover:border-slate-500/50 hover:bg-slate-700/80"
            }`}
            title={
              isBreathing
                ? "Stop breathing exercise"
                : "Start breathing exercise"
            }
          >
            {/* Subtle glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent"
              animate={
                isBreathing
                  ? {
                      opacity: [0.2, 0.4, 0.2],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Icon with subtle animation */}
            <motion.div
              animate={
                isBreathing
                  ? {
                      scale: [1, 1.08, 1],
                    }
                  : {}
              }
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <Wind
                size={activeView === "chat" ? 20 : 24}
                className="drop-shadow-sm"
              />
            </motion.div>

            {/* Elegant pulse rings when active */}
            {isBreathing && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border border-emerald-200/50"
                  animate={{
                    scale: [1, 1.6],
                    opacity: [0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border border-cyan-200/30"
                  animate={{
                    scale: [1, 1.9],
                    opacity: [0.3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.3,
                    ease: "easeOut",
                  }}
                />
              </>
            )}
          </motion.button>

          {/* Voice Chat Button */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowVoiceChat(true)}
            className={`${
              activeView === "chat" ? "w-12 h-12" : "w-14 h-14"
            } rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all group overflow-hidden relative ${
              showVoiceChat
                ? "bg-gradient-to-br from-purple-400/90 via-blue-500/90 to-indigo-500/90 text-white shadow-purple-500/25"
                : "bg-slate-800/80 text-slate-300 hover:text-white border border-slate-600/30 hover:border-slate-500/50 hover:bg-slate-700/80"
            }`}
            title="Start voice chat"
          >
            {/* Subtle glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent"
              animate={
                showVoiceChat
                  ? {
                      opacity: [0.2, 0.4, 0.2],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Icon with subtle animation */}
            <motion.div
              animate={
                showVoiceChat
                  ? {
                      scale: [1, 1.08, 1],
                    }
                  : {}
              }
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <Radio
                size={activeView === "chat" ? 20 : 24}
                className="drop-shadow-sm"
              />
            </motion.div>

            {/* Elegant pulse rings when active */}
            {showVoiceChat && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border border-purple-200/50"
                  animate={{
                    scale: [1, 1.6],
                    opacity: [0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border border-blue-200/30"
                  animate={{
                    scale: [1, 1.9],
                    opacity: [0.3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.3,
                    ease: "easeOut",
                  }}
                />
              </>
            )}
          </motion.button>
        </div>
      </main>

      {/* Mobile Navigation */}
      {isMobile && (
        <MobileNavigation
          activeView={activeView}
          onViewChange={setActiveView}
        />
      )}

      {/* Breathing Overlay */}
      <BreathingAnimation
        isActive={isBreathing}
        onComplete={() => setBreathing(false)}
      />

      {/* Voice Chat Overlay */}
      <VoiceChatOverlay
        isActive={showVoiceChat}
        onClose={() => setShowVoiceChat(false)}
      />
    </div>
  );
}

export default App;
