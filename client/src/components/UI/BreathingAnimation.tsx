import { useState, useEffect } from "react";

interface BreathingAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
}

export function BreathingAnimation({
  isActive,
  onComplete,
}: BreathingAnimationProps) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (!isActive) return;

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
                onComplete?.();
                return "inhale";
              default:
                return "inhale";
            }
          });
          return phase === "hold" ? 4 : 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, onComplete]);

  if (!isActive) return null;

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
    }
  };

  const getScale = () => {
    switch (phase) {
      case "inhale":
        return "scale-150";
      case "hold":
        return "scale-150";
      case "exhale":
        return "scale-100";
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 flex items-center justify-center z-50">
      <div className="text-center">
        <div
          className={`w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mx-auto mb-8 transition-transform duration-4000 ease-in-out ${getScale()}`}
        ></div>

        <div className="text-white">
          <h2 className="text-2xl font-light mb-4">{getPhaseText()}</h2>
          <div className="text-6xl font-light text-blue-300 mb-8">
            {countdown}
          </div>
          <p className="text-slate-300 text-lg">
            {phase === "inhale" && "Fill your lungs slowly and deeply"}
            {phase === "hold" && "Hold this breath gently"}
            {phase === "exhale" && "Release slowly and completely"}
          </p>
        </div>
      </div>
    </div>
  );
}
