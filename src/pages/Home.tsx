import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play, Pause, Square, Users, User, Plus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import AnimalCharacter from "@/components/AnimalCharacter";
import BreakReminder from "@/components/BreakReminder";

const floatAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 2.5,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

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
    <div className="min-h-screen theme-gradient flex flex-col relative overflow-hidden">
      <BreakReminder />

      {/* Top Bar - Paws */}
      <div className="flex justify-end items-center px-5 pt-6 pb-2">
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
      <div className="flex-1 flex flex-col items-center justify-center relative px-6">
        {/* Timer display */}
        <AnimatePresence>
          {isStudying && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="mb-6"
            >
              <div className="bg-card/90 backdrop-blur-sm rounded-3xl px-10 py-4 shadow-lg border border-border/50">
                <span className="text-5xl font-mono font-bold text-foreground tracking-widest">
                  {formatTime(timerSeconds)}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isStudying && (
          <div className="mb-6">
            <div className="bg-card/90 backdrop-blur-sm rounded-3xl px-10 py-4 shadow-lg border border-border/50">
              <span className="text-5xl font-mono font-bold text-foreground tracking-widest">
                {formatTime(timerSeconds)}
              </span>
            </div>
          </div>
        )}

        {/* Animal + Icons Zone */}
        <div className="relative flex items-center justify-center">
          {/* Group icon - floating left */}
          <AnimatePresence>
            {!isStudying && (
              <motion.button
                layoutId="group-icon"
                initial={{ opacity: 1, x: 0 }}
                animate={floatAnimation}
                exit={{ opacity: 0, x: 40, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 100 }}
                onClick={() => navigate("/groups")}
                className="absolute -left-14 top-4 w-12 h-12 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-border/50 z-20"
              >
                <Users className="w-5 h-5 text-primary" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Profile icon - floating right */}
          <AnimatePresence>
            {!isStudying && (
              <motion.button
                layoutId="profile-icon"
                initial={{ opacity: 1, x: 0 }}
                animate={{
                  y: [0, -8, 0],
                  transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const, delay: 0.5 },
                }}
                exit={{ opacity: 0, x: -40, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 100 }}
                onClick={() => navigate("/profile")}
                className="absolute -right-14 top-4 w-12 h-12 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-border/50 z-20"
              >
                <User className="w-5 h-5 text-primary" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Animal */}
          <div className="relative z-10">
            <AnimalCharacter size="lg" active={isStudying} />
          </div>
        </div>

        {/* Play / Pause+Stop buttons (Mitosis) */}
        <div className="mt-2 relative h-2 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!isStudying ? (
              <motion.button
                key="play"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePlay}
                className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-xl glow-shadow"
              >
                <Play className="w-7 h-7 text-primary-foreground ml-1" fill="currentColor" />
              </motion.button>
            ) : (
              <motion.div
                key="controls"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 150, damping: 15 }}
                className="flex items-center gap-8"
              >
                {/* Pause - splits left */}
                <motion.button
                  initial={{ x: 0 }}
                  animate={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 12 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={timerRunning ? handlePause : startTimer}
                  className="w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-lg"
                >
                  {timerRunning ? (
                    <Pause className="w-6 h-6 text-accent-foreground" fill="currentColor" />
                  ) : (
                    <Play className="w-6 h-6 text-accent-foreground ml-0.5" fill="currentColor" />
                  )}
                </motion.button>

                {/* Stop - splits right */}
                <motion.button
                  initial={{ x: 0 }}
                  animate={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 12 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleStop}
                  className="w-14 h-14 rounded-full bg-destructive flex items-center justify-center shadow-lg"
                >
                  <Square className="w-5 h-5 text-destructive-foreground" fill="currentColor" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
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
