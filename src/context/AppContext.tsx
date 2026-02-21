import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

export type AnimalType = "dog" | "cat" | "bear" | "chicken";
export type UserStatus = "studying" | "in-event" | "away" | "offline";

export interface CosmeticItem {
  id: string;
  name: string;
  category: "hat" | "border" | "background";
  price: number;
  preview: string; // emoji or CSS class
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
  buyCosmetic: (item: CosmeticItem) => boolean;
  groups: StudyGroup[];
  showBreakReminder: boolean;
  dismissBreakReminder: () => void;
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

const MOCK_GROUPS: StudyGroup[] = [
  {
    id: "1",
    name: "Study Squad",
    icon: "📚",
    inviteCode: "SQ7K2X",
    members: [
      { id: "1", name: "Barry", animal: "bear", hours: 20, status: "studying", equippedHat: "hat-crown" },
      { id: "2", name: "Emily", animal: "cat", hours: 4, status: "away" },
      { id: "3", name: "Rex", animal: "dog", hours: 8, status: "studying" },
      { id: "self", name: "You", animal: "bear", hours: 12, status: "studying" },
    ],
  },
  {
    id: "2",
    name: "Night Owls",
    icon: "🦉",
    inviteCode: "NW3P9L",
    members: [
      { id: "4", name: "Alex", animal: "dog", hours: 15, status: "in-event" },
      { id: "5", name: "Clucky", animal: "chicken", hours: 6, status: "offline" },
      { id: "self", name: "You", animal: "bear", hours: 12, status: "studying" },
    ],
  },
];

const load = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [animal, setAnimalState] = useState<AnimalType | null>(load("animal", null));
  const [paws, setPaws] = useState(load("paws", 0));
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [status, setStatus] = useState<UserStatus>(load("status", "offline"));
  const [username, setUsernameState] = useState(load("username", "StudyBuddy"));
  const [hoursStudied] = useState(load("hoursStudied", 12.5));
  const [streak] = useState(load("streak", 7));
  const [ownedCosmetics, setOwnedCosmetics] = useState<string[]>(load("ownedCosmetics", []));
  const [equippedHat, setEquippedHat] = useState<string | null>(load("equippedHat", null));
  const [equippedBorder, setEquippedBorder] = useState<string | null>(load("equippedBorder", null));
  const [equippedBackground, setEquippedBackground] = useState<string | null>(load("equippedBackground", null));
  const [showBreakReminder, setShowBreakReminder] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const lastPawMinuteRef = useRef(0);

  const setAnimal = useCallback((a: AnimalType) => {
    setAnimalState(a);
    localStorage.setItem("animal", JSON.stringify(a));
  }, []);

  const setUsername = useCallback((n: string) => {
    setUsernameState(n);
    localStorage.setItem("username", JSON.stringify(n));
  }, []);

  const addPaws = useCallback((n: number) => {
    setPaws((p) => {
      const next = p + n;
      localStorage.setItem("paws", JSON.stringify(next));
      return next;
    });
  }, []);

  const spendPaws = useCallback((n: number) => {
    let success = false;
    setPaws((p) => {
      if (p >= n) {
        success = true;
        const next = p - n;
        localStorage.setItem("paws", JSON.stringify(next));
        return next;
      }
      return p;
    });
    return success;
  }, []);

  const startTimer = useCallback(() => {
    setTimerRunning(true);
    setStatus("studying");
    localStorage.setItem("status", JSON.stringify("studying"));
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerRunning(false);
  }, []);

  const stopTimer = useCallback(() => {
    setTimerRunning(false);
    // Award paws for completed minutes
    const minutes = Math.floor(timerSeconds / 60);
    if (minutes > 0) {
      addPaws(minutes * 10);
    }
    setTimerSeconds(0);
    lastPawMinuteRef.current = 0;
  }, [timerSeconds, addPaws]);

  // Timer interval
  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimerSeconds((s) => {
          const next = s + 1;
          // Check for break reminder at 45 minutes
          if (next === 45 * 60) {
            setShowBreakReminder(true);
          }
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
    const newPaws = paws - item.price;
    const newOwned = [...ownedCosmetics, item.id];
    setPaws(newPaws);
    setOwnedCosmetics(newOwned);
    localStorage.setItem("paws", JSON.stringify(newPaws));
    localStorage.setItem("ownedCosmetics", JSON.stringify(newOwned));
    return true;
  }, [paws, ownedCosmetics]);

  const equipCosmetic = useCallback((id: string, category: "hat" | "border" | "background") => {
    if (category === "hat") {
      setEquippedHat(id);
      localStorage.setItem("equippedHat", JSON.stringify(id));
    } else if (category === "border") {
      setEquippedBorder(id);
      localStorage.setItem("equippedBorder", JSON.stringify(id));
    } else {
      setEquippedBackground(id);
      localStorage.setItem("equippedBackground", JSON.stringify(id));
    }
  }, []);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-dog", "theme-cat", "theme-bear", "theme-chicken");
    if (animal) {
      root.classList.add(`theme-${animal}`);
    }
  }, [animal]);

  return (
    <AppContext.Provider
      value={{
        animal, setAnimal, paws, addPaws, spendPaws,
        timerSeconds, timerRunning, startTimer, pauseTimer, stopTimer,
        status, setStatus, username, setUsername,
        hoursStudied, streak, ownedCosmetics,
        equippedHat, equippedBorder, equippedBackground,
        equipCosmetic, buyCosmetic,
        groups: MOCK_GROUPS, showBreakReminder, dismissBreakReminder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
