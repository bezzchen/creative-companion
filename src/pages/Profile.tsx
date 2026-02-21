import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApp, COSMETIC_STORE, AnimalType } from "@/context/AppContext";
import { Plus, Clock, Flame } from "lucide-react";
import { animalIconImages } from "@/components/AnimalCharacter";

const allAnimals: AnimalType[] = ["bear", "cat", "dog", "chicken"];

const Profile = () => {
  const { paws, username, hoursStudied, streak, status, setStatus, equippedBorder, animal, setAnimal } = useApp();
  const navigate = useNavigate();

  const borderItem = equippedBorder ? COSMETIC_STORE.find((c) => c.id === equippedBorder) : null;
  const statuses = ["studying", "in-event", "away", "offline"] as const;

  const currentIcon = animal ? animalIconImages[animal] : null;

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="px-6 pt-10 flex flex-col items-center">
        {/* Avatar - using icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className={`relative w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden ${
            borderItem ? "ring-4 ring-primary ring-offset-4 ring-offset-background" : "ring-2 ring-border"
          }`}
        >
          {currentIcon ? (
            <img src={currentIcon} alt={animal || "avatar"} className="w-24 h-24 object-contain" draggable={false} />
          ) : (
            <div className="w-24 h-24 bg-muted rounded-full" />
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-4 text-2xl font-extrabold text-foreground"
        >
          {username}
        </motion.h1>

        {/* Animal Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="flex gap-3 mt-3"
        >
          {allAnimals.map((a) => (
            <button
              key={a}
              onClick={() => setAnimal(a)}
              className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                animal === a ? "border-primary scale-110 shadow-md" : "border-border opacity-60 hover:opacity-100"
              }`}
            >
              <img src={animalIconImages[a]} alt={a} className="w-full h-full object-contain" draggable={false} />
            </button>
          ))}
        </motion.div>

        {/* Status toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mt-4 flex-wrap justify-center"
        >
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                status === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s.replace("-", " ")}
            </button>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 gap-4 w-full max-w-sm mt-8"
        >
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50 text-center">
            <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{hoursStudied}</p>
            <p className="text-xs text-muted-foreground mt-1">Hours Studied</p>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50 text-center">
            <Flame className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{streak}</p>
            <p className="text-xs text-muted-foreground mt-1">Day Streak</p>
          </div>
        </motion.div>

        {/* Paws balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full max-w-sm mt-4"
        >
          <button
            onClick={() => navigate("/store")}
            className="w-full flex items-center justify-between p-5 bg-card rounded-2xl shadow-sm border border-border/50"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🐾</span>
              <div className="text-left">
                <p className="font-bold text-foreground text-lg">{paws}</p>
                <p className="text-xs text-muted-foreground">Paws Balance</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
              <Plus className="w-4 h-4 text-primary" />
            </div>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
