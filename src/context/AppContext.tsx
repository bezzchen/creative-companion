import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useCosmetics } from "@/hooks/useCosmetics";
import { useStudySessions } from "@/hooks/useStudySessions";
import { useAuth } from "@/context/AuthContext";

export type AnimalType = "dog" | "cat" | "bear" | "chicken";
export type UserStatus = "studying" | "in-event" | "away" | "offline";

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
  addPaws: (n: number) => void;
  spendPaws: (n: number) => boolean;
  timerSeconds: number;
  timerRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  status: UserStatus;
  setStatus: (s: UserStatus) => void;
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
    updateProfile.mutate({ username: n });
  }, [updateProfile]);

  const setStatus = useCallback((s: UserStatus) => {
    updateProfile.mutate({ status: s });
  }, [updateProfile]);

  const addPaws = useCallback((n: number) => {
    updateProfile.mutate({ paws: paws + n });
  }, [updateProfile, paws]);

  const spendPaws = useCallback((n: number) => {
    if (paws >= n) {
      updateProfile.mutate({ paws: paws - n });
      return true;
    }
    return false;
  }, [updateProfile, paws]);

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
    updateProfile.mutate({ paws: paws - item.price });
    buyFromDb.mutate(item.id);
    return true;
  }, [paws, ownedCosmetics, updateProfile, buyFromDb]);

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
        animal, setAnimal, paws, addPaws, spendPaws,
        timerSeconds, timerRunning, startTimer, pauseTimer, stopTimer,
        status, setStatus, username, setUsername,
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
