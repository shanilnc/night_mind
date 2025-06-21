// client/src/components/UI/WelcomeScreen.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Heart, Shield, ArrowRight } from "lucide-react";
import { useAppStore } from "../../store/useAppstore";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [style, setStyle] = useState<"empathetic" | "direct" | "analytical">(
    "empathetic"
  );
  const { updateUserProfile } = useAppStore();

  const handleComplete = () => {
    updateUserProfile({ name, preferredCommunicationStyle: style });
    onComplete();
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Support",
      description:
        "Get personalized guidance based on your unique needs and patterns",
    },
    {
      icon: Heart,
      title: "Track Your Journey",
      description:
        "Monitor your mood and progress with beautiful visualizations",
    },
    {
      icon: Shield,
      title: "Your Privacy Matters",
      description:
        "End-to-end encryption keeps your thoughts completely secure",
    },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        {step === 0 && (
          <div className="text-center">
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-purple-500/30">
                <Brain size={48} className="text-white" />
              </div>
              <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Welcome to NightMind
              </h1>
              <p className="text-xl text-slate-300">
                Your AI companion for mindful conversations and emotional
                wellbeing
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
                >
                  <feature.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(1)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 mx-auto hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              Get Started
              <ArrowRight size={20} />
            </motion.button>
          </div>
        )}

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Let's personalize your experience
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-slate-300 text-sm font-medium mb-2 block">
                  What should I call you?
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm font-medium mb-3 block">
                  How would you like me to communicate?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    {
                      value: "empathetic",
                      label: "Warm & Empathetic",
                      emoji: "🤗",
                    },
                    { value: "direct", label: "Clear & Direct", emoji: "🎯" },
                    {
                      value: "analytical",
                      label: "Logical & Analytical",
                      emoji: "🧠",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setStyle(option.value as any)}
                      className={`p-4 rounded-xl border transition-all ${
                        style === option.value
                          ? "bg-blue-500/20 border-blue-500 text-white"
                          : "bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      <div className="text-2xl mb-2">{option.emoji}</div>
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleComplete}
                disabled={!name}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                Start Your Journey
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
