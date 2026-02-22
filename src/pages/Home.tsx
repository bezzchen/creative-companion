import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play, Pause, Square, Users, User, Plus } from "lucide-react";
import pawIcon from "@/assets/paw.png";
import { useApp } from "@/context/AppContext";
import AnimalCharacter from "@/components/AnimalCharacter";
import BreakReminder from "@/components/BreakReminder";

import icebergBg from "@/assets/Iceberg.png";
import fieldBg from "@/assets/Field.png";
import houseBg from "@/assets/House.png";

const backgroundMap: Record<string, string> = {
  "bg-iceberg": icebergBg,
  "bg-field": fieldBg,
  "bg-house": houseBg,
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const springTransition = { type: "spring" as const, stiffness: 200, damping: 20 };

const Home = () => {
  const { paws, timerSeconds, timerRunning, startTimer, pauseTimer, stopTimer, equippedBackground } = useApp();
  const bgImage = equippedBackground ? backgroundMap[equippedBackground] : null;
  const navigate = useNavigate();
  const [isStudying, setIsStudying] = useState(false);

  const quotes = [
    "Let's study!",
    "You've got this!",
    "Time to focus!",
    "One step at a time!",
    "You're doing great!",
    "Keep it up!",
    "You can do it!",
  ];
  const randomQuote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);

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
      {/* Equipped background image */}
      <AnimatePresence>
        {bgImage && (
          <motion.img
            key={equippedBackground}
            src={bgImage}
            alt="Background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 w-full h-full object-cover z-0"
            draggable={false}
          />
        )}
      </AnimatePresence>
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
          {/* Speech bubble - visible when NOT studying */}
          <AnimatePresence>
            {!isStudying && (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
                className="mb-[-1rem] z-20 relative"
              >
                <motion.div
                  key="speech-bubble"
                  initial={{ opacity: 0, y: 200 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 200 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="bg-card/90 backdrop-blur-sm rounded-2xl px-10 py-6 shadow-lg border border-border/50 relative">
                    <p className="text-base font-semibold text-foreground text-center">{randomQuote}</p>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card/90 border-r border-b border-border/50 rotate-45" />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Timer - visible when studying */}
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
            {/* Home paw icon - floating top-left */}
            {!isStudying && (
              <motion.div
                className="absolute right-[150px] top-[-20px] z-20"
              >
                <motion.button
                  layoutId="home-icon"
                  onClick={() => navigate("/home")}
                  className="w-12 h-12 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-border/50"
                >
                  <img src={pawIcon} alt="Home" className="w-6 h-6 object-contain" />
                </motion.button>
              </motion.div>
            )}

            {/* Group icon - floating left */}
            {!isStudying && (
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-[150px] top-12 z-20"
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
                className="absolute right-[150px] top-12 z-20"
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
              <AnimalCharacter size="2xl" active={isStudying && timerRunning} paused={isStudying && !timerRunning} />

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
