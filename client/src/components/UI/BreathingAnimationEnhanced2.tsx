import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Sparkles, Heart } from "lucide-react";

interface BreathingAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  size: number;
  color: string;
}

export function BreathingAnimation({
  isActive,
  onComplete,
}: BreathingAnimationProps) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "pause">(
    "inhale"
  );
  const [cycle, setCycle] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const totalCycles = 4;

  // Generate floating particles with different colors and sizes
  useEffect(() => {
    const colors = [
      "#60A5FA",
      "#A78BFA",
      "#34D399",
      "#F472B6",
      "#FBBF24",
      "#FB7185",
    ];
    const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 8,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (!isActive) {
      setPhase("inhale");
      setCycle(0);
      setIsStarted(false);
      return;
    }

    if (!isStarted) return;

    let phaseTimer: ReturnType<typeof setTimeout>;

    const startPhaseTimer = () => {
      const duration = getCurrentPhaseDuration() * 1000; // Convert to milliseconds

      phaseTimer = setTimeout(() => {
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
      }, duration);
    };

    startPhaseTimer();

    return () => {
      if (phaseTimer) clearTimeout(phaseTimer);
    };
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

  const getPhaseColors = () => {
    switch (phase) {
      case "inhale":
        return {
          primary: "from-cyan-400 via-blue-500 to-indigo-600",
          secondary: "from-blue-300 to-cyan-400",
          accent: "#60A5FA",
        };
      case "hold":
        return {
          primary: "from-emerald-400 via-teal-500 to-cyan-600",
          secondary: "from-teal-300 to-emerald-400",
          accent: "#34D399",
        };
      case "exhale":
        return {
          primary: "from-purple-400 via-pink-500 to-rose-600",
          secondary: "from-pink-300 to-purple-400",
          accent: "#A78BFA",
        };
      case "pause":
        return {
          primary: "from-slate-400 via-slate-500 to-slate-600",
          secondary: "from-slate-300 to-slate-400",
          accent: "#94A3B8",
        };
    }
  };

  const getMainCircleScale = () => {
    return phase === "inhale" || phase === "hold" ? 1.5 : 1;
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-hidden"
        style={{
          background: `radial-gradient(circle at center, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.98) 100%)`,
        }}
      >
        {/* Ambient Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`geo-${i}`}
              className="absolute"
              style={{
                width: 40 + i * 8,
                height: 40 + i * 8,
                left: `${20 + i * 15}%`,
                top: `${15 + i * 12}%`,
                background: `linear-gradient(45deg, ${
                  getPhaseColors().accent
                }20, transparent)`,
                borderRadius:
                  phase === "inhale"
                    ? "50%"
                    : phase === "hold"
                    ? "20%"
                    : phase === "exhale"
                    ? "0%"
                    : "30%",
                border: `1px solid ${getPhaseColors().accent}30`,
              }}
              animate={{
                rotate: [0, 360],
                scale:
                  phase === "inhale"
                    ? [0.8, 1.2, 0.8]
                    : phase === "hold"
                    ? [1.2, 1.2, 1.2]
                    : phase === "exhale"
                    ? [1.2, 0.6, 0.8]
                    : [0.8, 1, 0.8],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                rotate: {
                  duration: 20 + i * 5,
                  repeat: Infinity,
                  ease: "linear",
                },
                scale: {
                  duration: getCurrentPhaseDuration(),
                  ease: "easeInOut",
                },
                opacity: { duration: 3, repeat: Infinity },
              }}
            />
          ))}
        </div>

        {/* Animated Background Particles */}
        <div className="absolute inset-0">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full opacity-30"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + particle.delay,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: `linear-gradient(45deg, ${
              getPhaseColors().accent
            }, transparent)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{
            background: `linear-gradient(135deg, ${
              getPhaseColors().accent
            }, transparent)`,
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Close button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onComplete}
          className="absolute top-6 right-6 w-14 h-14 bg-slate-800/30 backdrop-blur-md rounded-full flex items-center justify-center text-slate-300 hover:text-white border border-slate-600/30 transition-all z-10 hover:bg-slate-700/40"
        >
          <X size={22} />
        </motion.button>

        <div className="flex items-center justify-center min-h-screen px-6">
          <div className="text-center max-w-lg mx-auto">
            {!isStarted ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div className="space-y-6">
                  {/* Main Icon with Sparkles */}
                  <div className="relative">
                    <motion.div
                      className="w-40 h-40 mx-auto rounded-full flex items-center justify-center relative"
                      style={{
                        background: `linear-gradient(135deg, ${
                          getPhaseColors().primary
                        })`,
                      }}
                      animate={{
                        boxShadow: [
                          `0 0 0 0px ${getPhaseColors().accent}40`,
                          `0 0 0 20px ${getPhaseColors().accent}20`,
                          `0 0 0 40px ${getPhaseColors().accent}10`,
                          `0 0 0 0px ${getPhaseColors().accent}00`,
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <RotateCcw
                        size={64}
                        className="text-white drop-shadow-lg"
                      />

                      {/* Floating Sparkles */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute"
                          style={{
                            left: `${
                              50 + Math.cos((i * Math.PI * 2) / 8) * 60
                            }%`,
                            top: `${
                              50 + Math.sin((i * Math.PI * 2) / 8) * 60
                            }%`,
                          }}
                          animate={{
                            scale: [0, 1, 0],
                            rotate: [0, 360],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.25,
                          }}
                        >
                          <Sparkles size={16} className="text-yellow-300" />
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  <motion.h2
                    className="text-4xl font-light text-white"
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(255,255,255,0.3)",
                        "0 0 20px rgba(255,255,255,0.6)",
                        "0 0 10px rgba(255,255,255,0.3)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Mindful Breathing
                  </motion.h2>

                  <p className="text-slate-300 text-xl leading-relaxed max-w-md mx-auto">
                    Embark on a transformative journey of 4 breathing cycles.
                    Let each breath guide you to deeper tranquility and inner
                    peace.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsStarted(true)}
                  className="group relative px-10 py-5 rounded-full font-semibold text-xl text-white overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${
                      getPhaseColors().primary
                    })`,
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10">Begin Your Journey</span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-12"
              >
                {/* Main Breathing Visualization */}
                <div className="relative">
                  {/* Geometric Flow Lines */}
                  <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                          width: 2,
                          height: 120,
                          backgroundColor: getPhaseColors().accent,
                          left: "50%",
                          top: "50%",
                          transformOrigin: "bottom center",
                          transform: `translate(-50%, -50%) rotate(${
                            i * 60
                          }deg)`,
                          opacity: 0.3,
                        }}
                        animate={{
                          scaleY:
                            phase === "inhale"
                              ? [0.5, 1.5, 0.5]
                              : phase === "hold"
                              ? [1.5, 1.5, 1.5]
                              : phase === "exhale"
                              ? [1.5, 0.3, 0.5]
                              : [0.5, 1, 0.5],
                          opacity: [0.2, 0.6, 0.2],
                        }}
                        transition={{
                          duration: getCurrentPhaseDuration(),
                          ease: "easeInOut",
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>

                  {/* Outer Rings */}
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border-2"
                      style={{
                        borderColor: `${getPhaseColors().accent}30`,
                        width: 200 + i * 40,
                        height: 200 + i * 40,
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 6 + i,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut",
                      }}
                    />
                  ))}

                  {/* Main Breathing Circle */}
                  <motion.div
                    className="relative w-48 h-48 mx-auto rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${
                        getPhaseColors().primary
                      })`,
                      boxShadow: `0 0 60px ${getPhaseColors().accent}60`,
                    }}
                    animate={{
                      scale: getMainCircleScale(),
                      boxShadow: [
                        `0 0 60px ${getPhaseColors().accent}60`,
                        `0 0 100px ${getPhaseColors().accent}80`,
                        `0 0 60px ${getPhaseColors().accent}60`,
                      ],
                    }}
                    transition={{
                      scale: {
                        duration: getCurrentPhaseDuration(),
                        ease: "easeInOut",
                      },
                      boxShadow: { duration: 2, repeat: Infinity },
                    }}
                  >
                    {/* Inner Mandala Pattern */}
                    <div className="absolute inset-4 rounded-full border-2 border-white/30" />
                    <div className="absolute inset-8 rounded-full border border-white/20" />

                    {/* Heart Icon that pulses */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: getCurrentPhaseDuration(),
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Heart
                        size={48}
                        className="text-white drop-shadow-lg"
                        fill="currentColor"
                      />
                    </motion.div>

                    {/* Floating Elements around the circle */}
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-3 h-3 rounded-full bg-white/60"
                        style={{
                          left: `${
                            50 + Math.cos((i * Math.PI * 2) / 12) * 45
                          }%`,
                          top: `${50 + Math.sin((i * Math.PI * 2) / 12) * 45}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        animate={{
                          scale: [0.5, 1, 0.5],
                          opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}

                    {/* Energy Flow Streams */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={`stream-${i}`}
                        className="absolute"
                        style={{
                          width: 60,
                          height: 2,
                          backgroundColor: getPhaseColors().accent,
                          left: "50%",
                          top: "50%",
                          transformOrigin: "left center",
                          transform: `translate(-50%, -50%) rotate(${
                            i * 45
                          }deg)`,
                          borderRadius: "1px",
                        }}
                        animate={{
                          scaleX:
                            phase === "inhale"
                              ? [0, 1, 0]
                              : phase === "hold"
                              ? [1, 1, 1]
                              : phase === "exhale"
                              ? [1, 0, 0]
                              : [0, 0.5, 0],
                          opacity:
                            phase === "inhale"
                              ? [0, 0.8, 0]
                              : phase === "hold"
                              ? [0.8, 0.8, 0.8]
                              : phase === "exhale"
                              ? [0.8, 0, 0]
                              : [0, 0.4, 0],
                          x:
                            phase === "inhale"
                              ? [0, 0, 0]
                              : phase === "exhale"
                              ? [0, 30, 0]
                              : [0, 0, 0],
                        }}
                        transition={{
                          duration: getCurrentPhaseDuration(),
                          ease: "easeInOut",
                          delay: i * 0.05,
                        }}
                      />
                    ))}
                  </motion.div>
                </div>

                {/* Creative Visual Elements Instead of Text */}
                <div className="relative">
                  {/* Phase-responsive Energy Waves */}
                  <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                          width: 80 + i * 20,
                          height: 4,
                          backgroundColor: getPhaseColors().accent,
                          opacity: 0.3 - i * 0.05,
                          left: "50%",
                          top: i * 8,
                          transform: "translateX(-50%)",
                        }}
                        animate={{
                          scaleX:
                            phase === "inhale"
                              ? [1, 2, 1]
                              : phase === "hold"
                              ? [2, 2, 2]
                              : phase === "exhale"
                              ? [2, 0.5, 1]
                              : [1, 1.5, 1],
                          opacity: [
                            0.3 - i * 0.05,
                            0.6 - i * 0.05,
                            0.3 - i * 0.05,
                          ],
                        }}
                        transition={{
                          duration: getCurrentPhaseDuration(),
                          ease: "easeInOut",
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>

                  {/* Minimalist Progress Visualization */}
                  <motion.div
                    className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {[...Array(totalCycles)].map((_, i) => (
                      <motion.div key={i} className="relative">
                        {/* Base dot */}
                        <motion.div
                          className={`w-3 h-3 rounded-full transition-all duration-700 ${
                            i < cycle
                              ? "bg-emerald-400"
                              : i === cycle
                              ? "bg-white"
                              : "bg-slate-600"
                          }`}
                          animate={
                            i === cycle
                              ? {
                                  boxShadow: [
                                    `0 0 0 0px ${getPhaseColors().accent}40`,
                                    `0 0 0 8px ${getPhaseColors().accent}20`,
                                    `0 0 0 0px ${getPhaseColors().accent}00`,
                                  ],
                                }
                              : {}
                          }
                          transition={{
                            duration: getCurrentPhaseDuration(),
                            repeat: Infinity,
                          }}
                        />

                        {/* Active cycle indicator */}
                        {i === cycle && (
                          <motion.div
                            className="absolute inset-0 rounded-full border-2"
                            style={{ borderColor: getPhaseColors().accent }}
                            animate={{
                              scale: [1, 1.8, 1],
                              opacity: [1, 0, 1],
                            }}
                            transition={{
                              duration: getCurrentPhaseDuration(),
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Subtle Phase Indicator through Color Shifts */}
                  <motion.div
                    className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-32 h-1 rounded-full"
                    style={{ backgroundColor: getPhaseColors().accent }}
                    animate={{
                      width:
                        phase === "inhale"
                          ? 160
                          : phase === "hold"
                          ? 200
                          : phase === "exhale"
                          ? 120
                          : 80,
                      opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                      width: {
                        duration: getCurrentPhaseDuration(),
                        ease: "easeInOut",
                      },
                      opacity: { duration: 2, repeat: Infinity },
                    }}
                  />

                  {/* Breathing Rhythm Visualization */}
                  <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 rounded-full"
                        style={{ backgroundColor: getPhaseColors().accent }}
                        animate={{
                          height:
                            phase === "inhale"
                              ? [4, 32, 4]
                              : phase === "hold"
                              ? [32, 32, 32]
                              : phase === "exhale"
                              ? [32, 4, 4]
                              : [4, 16, 4],
                          opacity: [0.3, 0.9, 0.3],
                        }}
                        transition={{
                          duration: getCurrentPhaseDuration(),
                          ease: "easeInOut",
                          delay: i * 0.05,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
