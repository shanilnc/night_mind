import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, PhoneOff, Volume2, VolumeX } from "lucide-react";
import AbstractBall from "./AudioVisualizer";
import { useHumeEVI } from "../../hooks/useHumeEVI";
import { HumeEVIProvider } from "./HumeEVIProvider";

interface VoiceChatOverlayProps {
  isActive: boolean;
  onClose: () => void;
}

function VoiceChatContent({ onClose }: { onClose: () => void }) {
  const {
    isConnected,
    isListening,
    messages,
    connect,
    disconnect,
    error,
    accessToken,
    isLoading,
  } = useHumeEVI();

  const [showStartScreen, setShowStartScreen] = useState(true);
  const [duration, setDuration] = useState(0);
  const [config, setConfig] = useState({
    perlinTime: 50.0,
    perlinDNoise: 2.5,
    chromaRGBr: 7.5,
    chromaRGBg: 5,
    chromaRGBb: 7,
    chromaRGBn: 0,
    chromaRGBm: 1.0,
    sphereWireframe: false,
    spherePoints: false,
    spherePsize: 0.9,
    cameraSpeedY: 0.0,
    cameraSpeedX: 0.0,
    cameraZoom: 175,
    cameraGuide: false,
    perlinMorph: 5.5,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setDuration(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected]);

  // Update visualizer config based on connection status
  useEffect(() => {
    if (isConnected && isListening) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        perlinTime: 100.0,
        perlinMorph: 25.0,
        chromaRGBr: 7.5 + 5,
        chromaRGBg: 5.0 + 3,
        chromaRGBb: 7.0 + 4,
      }));
    } else if (isConnected) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        perlinTime: 25.0,
        perlinMorph: 10.0,
        chromaRGBr: 7.5,
        chromaRGBg: 5.0,
        chromaRGBb: 7.0,
      }));
    } else {
      setConfig((prevConfig) => ({
        ...prevConfig,
        perlinTime: 5.0,
        perlinMorph: 0,
        chromaRGBr: 7.5,
        chromaRGBg: 5.0,
        chromaRGBb: 7.0,
      }));
    }
  }, [isConnected, isListening]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartChat = async () => {
    try {
      setShowStartScreen(false);
      await connect();
    } catch (err) {
      console.error("Failed to start voice chat:", err);
      alert("Failed to start voice chat. Please try again.");
    }
  };

  const handleEndChat = () => {
    if (isConnected) {
      disconnect();
    }
    setShowStartScreen(true);
    onClose();
  };

  const renderStartScreen = () => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="relative z-10 text-center max-w-md mx-auto px-8"
    >
      <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="mb-8">
        <h2 className="text-3xl font-light text-white mb-4">Voice Chat</h2>
        <p className="text-slate-300 leading-relaxed">
          Ready to start a voice conversation? I'll listen to your thoughts and
          provide support through our AI-powered voice chat.
        </p>
      </motion.div>

      <motion.div
        className="mb-8"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={handleStartChat}
          disabled={isLoading}
          className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white px-8 py-4 rounded-2xl text-lg font-medium shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Connecting..." : "Start Voice Chat"}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-slate-400"
      >
        <p>Powered by Hume AI - Advanced voice conversation</p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-red-500/20 border border-red-400/50 rounded-lg text-red-300 text-sm"
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );

  const renderChatScreen = () => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="relative z-10 text-center w-full justify-center items-center mx-auto px-8 h-full flex flex-col"
    >
      {/* Status Header */}
      <motion.div className="mb-6" initial={{ y: -20 }} animate={{ y: 0 }}>
        <div className="text-sm text-slate-300 mb-2">
          {isConnected ? "Voice chat active" : "Connecting..."}
        </div>

        {isConnected && (
          <div className="text-emerald-400 text-lg font-mono">
            {formatDuration(duration)}
          </div>
        )}
      </motion.div>

      {/* Audio Visualizer */}
      <div className="flex-1 flex items-center justify-center mb-6 w-full">
        <AbstractBall {...config} />
      </div>

      {/* Message Display */}
      {messages.length > 0 && (
        <div className="mb-6 max-h-32 overflow-y-auto">
          <div className="text-sm text-slate-300">
            {messages.slice(-2).map((msg, index) => (
              <div key={index} className="mb-2">
                <span className="font-medium">
                  {msg.message.role === "user" ? "You" : "AI"}:
                </span>
                <span className="ml-2 text-slate-400">
                  {msg.message.content.length > 50
                    ? msg.message.content.substring(0, 50) + "..."
                    : msg.message.content}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center space-x-6 mb-6">
        {/* Record Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={isConnected ? disconnect : connect}
          disabled={isLoading}
          className={`p-6 rounded-full transition-all ${
            isConnected
              ? "bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400/50"
              : "bg-slate-700/50 text-slate-300 border-2 border-slate-600/50 hover:bg-slate-600/50"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isConnected ? <Mic size={32} /> : <MicOff size={32} />}
        </motion.button>

        {/* End Call */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleEndChat}
          className="p-4 rounded-full bg-red-500/20 text-red-400 border-2 border-red-400/50 transition-all hover:bg-red-500/30"
        >
          <PhoneOff size={24} />
        </motion.button>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-slate-400 mb-4"
      >
        {!isConnected ? (
          <p>Connecting to voice chat...</p>
        ) : (
          <p>I'm listening... Speak naturally and I'll respond</p>
        )}
      </motion.div>
    </motion.div>
  );

  return showStartScreen ? renderStartScreen() : renderChatScreen();
}

export function VoiceChatOverlay({ isActive, onClose }: VoiceChatOverlayProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (isActive) {
      // Fetch access token when overlay becomes active
      fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3001/api"
        }/hume/auth`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => setAccessToken(data.accessToken))
        .catch((err) => {
          console.error("Failed to fetch access token:", err);
          setAccessToken(null);
        });
    }
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95 backdrop-blur-xl z-50 flex items-center justify-center"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating particles */}
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-emerald-500 rounded-full"
                initial={{
                  x:
                    Math.random() *
                    (typeof window !== "undefined" ? window.innerWidth : 1920),
                  y:
                    Math.random() *
                    (typeof window !== "undefined" ? window.innerHeight : 1080),
                  opacity: 0,
                }}
                animate={{
                  x:
                    Math.random() *
                    (typeof window !== "undefined" ? window.innerWidth : 1920),
                  y:
                    Math.random() *
                    (typeof window !== "undefined" ? window.innerHeight : 1080),
                  opacity: [0, 0.6, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}

            {/* Central glow */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-cyan-500/20 via-emerald-500/10 to-transparent rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>

          {/* Main Content */}
          <HumeEVIProvider accessToken={accessToken}>
            <VoiceChatContent onClose={onClose} />
          </HumeEVIProvider>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
