import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw } from "lucide-react";

interface BreathingAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
}

export function BreathingAnimation({
  isActive,
  onComplete,
}: BreathingAnimationProps) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "pause">(
    "inhale"
  );
  const [countdown, setCountdown] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const totalCycles = 4; // Complete 4 breathing cycles

  useEffect(() => {
    if (!isActive) {
      // Reset when animation is deactivated
      setPhase("inhale");
      setCountdown(4);
      setCycle(0);
      setIsStarted(false);
      return;
    }

    if (!isStarted) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setPhase((currentPhase) => {
            switch (currentPhase) {
              case "inhale":
                return "hold";
              case "hold":
                return "exhale";
              case "exhale":
                return "pause";
              case "pause":
                const nextCycle = cycle + 1;
                setCycle(nextCycle);
                if (nextCycle >= totalCycles) {
                  onComplete?.();
                  return "inhale";
                }
                return "inhale";
              default:
                return "inhale";
            }
          });
          // Return appropriate duration for each phase
          return getCurrentPhaseDuration();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, cycle, totalCycles, onComplete, isStarted]);

  const getCurrentPhaseDuration = () => {
    switch (phase) {
      case "inhale":
        return 4;
      case "hold":
        return 4;
      case "exhale":
        return 6;
      case "pause":
        return 2;
      default:
        return 4;
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
      case "pause":
        return "Pause";
    }
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case "inhale":
        return "Fill your lungs slowly and deeply";
      case "hold":
        return "Hold this breath gently";
      case "exhale":
        return "Release slowly and completely";
      case "pause":
        return "Rest and prepare for the next breath";
    }
  };

  const getScale = () => {
    switch (phase) {
      case "inhale":
        return "scale-150 bg-gradient-to-br from-blue-400 to-cyan-500";
      case "hold":
        return "scale-150 bg-gradient-to-br from-blue-400 to-cyan-500";
      case "exhale":
        return "scale-100 bg-gradient-to-br from-purple-400 to-blue-500";
      case "pause":
        return "scale-100 bg-gradient-to-br from-slate-400 to-slate-500";
    }
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/95 flex items-center justify-center z-50"
      >
        {/* Close button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onComplete}
          className="absolute top-6 right-6 w-12 h-12 bg-slate-800/50 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-300 hover:text-white border border-slate-700/50 transition-colors"
        >
          <X size={20} />
        </motion.button>

        <div className="text-center max-w-md mx-auto px-6">
          {!isStarted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <RotateCcw size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-light text-white">
                  Breathing Exercise
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Find a comfortable position and prepare for a 4-cycle
                  breathing exercise. This will help calm your mind and reduce
                  anxiety.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsStarted(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                Begin Exercise
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Breathing circle */}
              <div className="relative">
                <motion.div
                  className={`w-32 h-32 rounded-full mx-auto transition-all duration-1000 ease-in-out ${getScale()}`}
                  animate={{
                    scale:
                      phase === "inhale" ? 1.5 : phase === "hold" ? 1.5 : 1,
                  }}
                  transition={{ duration: 1 }}
                />

                {/* Pulse rings */}
                <motion.div
                  className="absolute inset-0 w-32 h-32 rounded-full mx-auto border-2 border-white/20"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 w-32 h-32 rounded-full mx-auto border-2 border-white/10"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
              </div>

              {/* Text content */}
              <div className="text-white space-y-6">
                <h2 className="text-2xl font-light">{getPhaseText()}</h2>
                <div className="text-6xl font-light text-blue-300">
                  {countdown}
                </div>
                <p className="text-slate-300 text-lg">
                  {getPhaseInstruction()}
                </p>

                {/* Progress indicator */}
                <div className="space-y-2">
                  <div className="flex justify-center space-x-2">
                    {[...Array(totalCycles)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          i < cycle
                            ? "bg-green-400"
                            : i === cycle
                            ? "bg-blue-400"
                            : "bg-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-slate-400 text-sm">
                    Cycle {cycle + 1} of {totalCycles}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
