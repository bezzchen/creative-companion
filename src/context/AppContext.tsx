import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useCosmetics } from "@/hooks/useCosmetics";
import { useStudySessions } from "@/hooks/useStudySessions";
import { useAuth } from "@/context/AuthContext";

export type AnimalType = "dog" | "cat" | "bear" | "chicken";
export type UserStatus = "studying" | "idle" | "offline";

export interface CosmeticItem {
  id: string;
  name: string;
  category: "hat" | "border" | "background";
  price: number;
  preview: string;
}

export interface GroupMember {
  id: string;
  name: string;
  animal: AnimalType;
  hours: number;
  status: UserStatus;
  equippedHat?: string;
  equippedBorder?: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  icon: string;
  inviteCode: string;
  members: GroupMember[];
}

interface AppState {
  animal: AnimalType | null;
  setAnimal: (a: AnimalType) => void;
  paws: number;
  timerSeconds: number;
  timerRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  status: UserStatus;
  username: string;
  setUsername: (n: string) => void;
  hoursStudied: number;
  streak: number;
  ownedCosmetics: string[];
  equippedHat: string | null;
  equippedBorder: string | null;
  equippedBackground: string | null;
  equipCosmetic: (id: string, category: "hat" | "border" | "background") => void;
  unequipCosmetic: (category: "hat" | "border" | "background") => void;
  buyCosmetic: (item: CosmeticItem) => boolean;
  showBreakReminder: boolean;
  dismissBreakReminder: () => void;
  profileLoading: boolean;
}

const AppContext = createContext<AppState | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export const COSMETIC_STORE: CosmeticItem[] = [
  { id: "hat-crown", name: "Royal Crown", category: "hat", price: 50, preview: "👑" },
  { id: "hat-tophat", name: "Top Hat", category: "hat", price: 30, preview: "🎩" },
  { id: "hat-cap", name: "Baseball Cap", category: "hat", price: 20, preview: "🧢" },
  { id: "hat-party", name: "Party Hat", category: "hat", price: 15, preview: "🥳" },
  { id: "hat-wizard", name: "Wizard Hat", category: "hat", price: 40, preview: "🧙" },
  { id: "border-gold", name: "Gold Frame", category: "border", price: 60, preview: "🟡" },
  { id: "border-rainbow", name: "Rainbow Frame", category: "border", price: 45, preview: "🌈" },
  { id: "border-fire", name: "Fire Frame", category: "border", price: 55, preview: "🔥" },
  { id: "border-ice", name: "Ice Frame", category: "border", price: 40, preview: "❄️" },
  { id: "bg-sunset", name: "Sunset", category: "background", price: 80, preview: "🌅" },
  { id: "bg-forest", name: "Forest", category: "background", price: 70, preview: "🌲" },
  { id: "bg-space", name: "Space", category: "background", price: 100, preview: "🚀" },
  { id: "bg-ocean", name: "Ocean", category: "background", price: 75, preview: "🌊" },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading, updateProfile } = useProfile();
  const { ownedCosmetics, buyCosmetic: buyFromDb } = useCosmetics();
  const { startSession, completeSession } = useStudySessions();

  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showBreakReminder, setShowBreakReminder] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Derived from profile
  const animal = (profile?.animal as AnimalType) || null;
  const paws = profile?.paws ?? 0;
  const status = (profile?.status as UserStatus) ?? "offline";
  const username = profile?.username ?? "StudyBuddy";
  const hoursStudied = Number(profile?.hours_studied ?? 0);
  const streak = profile?.streak ?? 0;
  const equippedHat = profile?.equipped_hat ?? null;
  const equippedBorder = profile?.equipped_border ?? null;
  const equippedBackground = profile?.equipped_background ?? null;

  const setAnimal = useCallback((a: AnimalType) => {
    updateProfile.mutate({ animal: a });
  }, [updateProfile]);

  const setUsername = useCallback((n: string) => {
    const trimmed = n.trim();
    if (!trimmed || trimmed.length > 50) return;
    updateProfile.mutate({ username: trimmed });
  }, [updateProfile]);

  // Auto-sync status based on timer state
  useEffect(() => {
    if (!user) return;
    if (timerRunning) {
      updateProfile.mutate({ status: "studying" });
    } else if (document.visibilityState === "visible") {
      updateProfile.mutate({ status: "idle" });
    }
  }, [timerRunning, user]);

  // Auto-sync status based on tab visibility
  useEffect(() => {
    if (!user) return;
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        updateProfile.mutate({ status: "offline" });
      } else {
        updateProfile.mutate({ status: timerRunning ? "studying" : "idle" });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    // Set idle on mount
    if (document.visibilityState === "visible" && !timerRunning) {
      updateProfile.mutate({ status: "idle" });
    }
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [user, timerRunning]);

  // addPaws and spendPaws removed — all currency operations go through server RPCs

  const startTimer = useCallback(() => {
    if (!timerRunning && timerSeconds === 0) {
      // Record session start server-side
      startSession.mutate();
    }
    setTimerRunning(true);
  }, [timerRunning, timerSeconds, startSession]);

  const pauseTimer = useCallback(() => {
    setTimerRunning(false);
  }, []);

  const stopTimer = useCallback(() => {
    setTimerRunning(false);
    if (timerSeconds > 0) {
      // Server calculates duration & rewards from its own recorded start time
      completeSession.mutate();
    }
    setTimerSeconds(0);
  }, [timerSeconds, completeSession]);

  // Timer interval
  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimerSeconds((s) => {
          const next = s + 1;
          if (next === 45 * 60) setShowBreakReminder(true);
          return next;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning]);

  const dismissBreakReminder = useCallback(() => {
    setShowBreakReminder(false);
  }, []);

  const buyCosmetic = useCallback((item: CosmeticItem) => {
    if (paws < item.price || ownedCosmetics.includes(item.id)) return false;
    // Server-side RPC handles atomic paws deduction + cosmetic insertion
    buyFromDb.mutate(item.id);
    return true;
  }, [paws, ownedCosmetics, buyFromDb]);

  const equipCosmetic = useCallback((id: string, category: "hat" | "border" | "background") => {
    if (category === "hat") updateProfile.mutate({ equipped_hat: id });
    else if (category === "border") updateProfile.mutate({ equipped_border: id });
    else updateProfile.mutate({ equipped_background: id });
  }, [updateProfile]);

  const unequipCosmetic = useCallback((category: "hat" | "border" | "background") => {
    if (category === "hat") updateProfile.mutate({ equipped_hat: null });
    else if (category === "border") updateProfile.mutate({ equipped_border: null });
    else updateProfile.mutate({ equipped_background: null });
  }, [updateProfile]);

  // Apply theme class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-dog", "theme-cat", "theme-bear", "theme-chicken");
    if (animal) root.classList.add(`theme-${animal}`);
  }, [animal]);

  return (
    <AppContext.Provider
      value={{
        animal, setAnimal, paws,
        timerSeconds, timerRunning, startTimer, pauseTimer, stopTimer,
        status, username, setUsername,
        hoursStudied, streak, ownedCosmetics,
        equippedHat, equippedBorder, equippedBackground,
        equipCosmetic, unequipCosmetic, buyCosmetic,
        showBreakReminder, dismissBreakReminder, profileLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
