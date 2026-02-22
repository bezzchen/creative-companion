import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play, Pause, Square, Users, User, Plus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import AnimalCharacter from "@/components/AnimalCharacter";
import BreakReminder from "@/components/BreakReminder";

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const springTransition = { type: "spring" as const, stiffness: 200, damping: 20 };

const Home = () => {
  const { paws, timerSeconds, timerRunning, startTimer, pauseTimer, stopTimer } = useApp();
  const navigate = useNavigate();
  const [isStudying, setIsStudying] = useState(false);

  const handlePlay = useCallback(() => {
    setIsStudying(true);
    startTimer();
  }, [startTimer]);

  const handlePause = useCallback(() => {
    pauseTimer();
  }, [pauseTimer]);

  const handleStop = useCallback(() => {
    setIsStudying(false);
    stopTimer();
  }, [stopTimer]);

  return (
    <div className="min-h-screen theme-gradient grainy flex flex-col relative overflow-hidden">
      <BreakReminder />

      {/* Top Bar - Paws */}
      <div className="flex justify-end items-center px-5 pt-6 pb-2 relative z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/store")}
          className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-border/50"
        >
          <span className="text-lg">🐾</span>
          <span className="font-bold text-foreground">{paws}</span>
          <Plus className="w-4 h-4 text-primary" />
        </motion.button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center relative px-6 z-10">
        {/* Animal + Buttons Zone */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Timer - behind animal, floats up */}
          <AnimatePresence>
            {isStudying && (
              <motion.div
                key="timer"
                initial={{ opacity: 0, y: 200 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 200 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mb-[-2rem] z-0 relative"
              >
                <div className="bg-card/90 backdrop-blur-sm rounded-3xl px-10 py-4 shadow-lg border border-border/50">
                  <span className="text-5xl font-mono font-bold text-foreground tracking-widest">
                    {formatTime(timerSeconds)}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative flex items-center justify-center">
            {/* Group icon - floating left */}
            {!isStudying && (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-10 top-4 z-20"
              >
                <motion.button
                  layoutId="groups-icon"
                  onClick={() => navigate("/groups")}
                  className="w-12 h-12 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-border/50"
                >
                  <Users className="w-5 h-5 text-primary" />
                </motion.button>
              </motion.div>
            )}

            {/* Profile icon - floating right */}
            {!isStudying && (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -right-10 top-4 z-20"
              >
                <motion.button
                  layoutId="profile-icon"
                  onClick={() => navigate("/profile")}
                  className="w-12 h-12 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-border/50"
                >
                  <User className="w-5 h-5 text-primary" />
                </motion.button>
              </motion.div>
            )}

            {/* Animal */}
            <div className="relative z-10">
              <AnimalCharacter size="2xl" active={isStudying} />

              {/* Play/Pause + Stop buttons */}
              <div className="absolute inset-0 flex items-center justify-center z-30">
                {/* Play/Pause button */}
                <motion.button
                  animate={{ x: isStudying ? -72 : 0 }}
                  transition={springTransition}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={isStudying ? (timerRunning ? handlePause : startTimer) : handlePlay}
                  className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl ${
                    isStudying ? "bg-accent" : "bg-primary glow-shadow"
                  }`}
                >
                  {isStudying && !timerRunning ? (
                    <Play className="w-11 h-11 text-accent-foreground ml-1" fill="currentColor" />
                  ) : isStudying ? (
                    <Pause className="w-11 h-11 text-accent-foreground" fill="currentColor" />
                  ) : (
                    <Play className="w-11 h-11 text-primary-foreground ml-1" fill="currentColor" />
                  )}
                </motion.button>

                {/* Stop button */}
                <motion.button
                  animate={{
                    x: isStudying ? 72 : 0,
                    opacity: isStudying ? 1 : 0,
                    scale: isStudying ? 1 : 0.5,
                  }}
                  transition={springTransition}
                  whileHover={isStudying ? { scale: 1.1 } : undefined}
                  whileTap={isStudying ? { scale: 0.9 } : undefined}
                  onClick={isStudying ? handleStop : undefined}
                  className="absolute w-24 h-24 rounded-full bg-destructive flex items-center justify-center shadow-lg"
                  style={{ pointerEvents: isStudying ? "auto" : "none" }}
                >
                  <Square className="w-7 h-7 text-destructive-foreground" fill="currentColor" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {isStudying && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm text-muted-foreground">
            Earning 10 🐾 per minute
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default Home;
