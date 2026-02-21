import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp, StudyGroup, UserStatus, AnimalType, COSMETIC_STORE } from "@/context/AppContext";
import { Plus, ChevronLeft, Share2 } from "lucide-react";
import AnimalCharacter from "@/components/AnimalCharacter";

import bearImg from "@/assets/bear.png";
import catImg from "@/assets/cat.png";
import dogImg from "@/assets/dog.png";
import duckImg from "@/assets/duck.png";

const animalIcons: Record<AnimalType, string> = { bear: bearImg, cat: catImg, dog: dogImg, chicken: duckImg };

const statusColors: Record<UserStatus, string> = {
  studying: "bg-green-400",
  "in-event": "bg-yellow-400",
  away: "bg-orange-400",
  offline: "bg-muted-foreground/40",
};

const statusLabels: Record<UserStatus, string> = {
  studying: "Studying",
  "in-event": "In Event",
  away: "Away",
  offline: "Offline",
};

const Groups = () => {
  const { groups } = useApp();
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);

  return (
    <div className="min-h-screen bg-background pb-28">
      <AnimatePresence mode="wait">
        {!selectedGroup ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-5 pt-8"
          >
            <h1 className="text-2xl font-extrabold text-foreground mb-6">My Study Groups</h1>
            <div className="space-y-3">
              {groups.map((g) => (
                <motion.button
                  key={g.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedGroup(g)}
                  className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl shadow-sm border border-border/50 text-left"
                >
                  <span className="text-3xl">{g.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-foreground">{g.name}</p>
                    <p className="text-sm text-muted-foreground">{g.members.length} members</p>
                  </div>
                </motion.button>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 flex items-center justify-center gap-2 p-4 bg-primary/10 rounded-2xl border border-primary/20 text-primary font-semibold"
            >
              <Plus className="w-5 h-5" />
              Create / Join group
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="px-5 pt-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setSelectedGroup(null)} className="p-2 -ml-2">
                <ChevronLeft className="w-6 h-6 text-foreground" />
              </button>
              <h1 className="text-xl font-extrabold text-foreground">{selectedGroup.name}</h1>
              <button className="p-2 -mr-2">
                <Share2 className="w-5 h-5 text-primary" />
              </button>
            </div>

            {/* Leaderboard */}
            <div className="space-y-3">
              {[...selectedGroup.members]
                .sort((a, b) => b.hours - a.hours)
                .map((member, i) => {
                  const rank = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`;
                  const borderItem = member.equippedBorder
                    ? COSMETIC_STORE.find((c) => c.id === member.equippedBorder)
                    : null;

                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 p-4 bg-card rounded-2xl shadow-sm border border-border/50"
                    >
                      <span className="text-xl w-8 text-center font-bold">{rank}</span>
                      <div className="relative">
                        <div
                          className={`w-11 h-11 rounded-full overflow-hidden bg-muted flex items-center justify-center ${
                            borderItem ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""
                          }`}
                        >
                          <img
                            src={animalIcons[member.animal]}
                            alt={member.animal}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${statusColors[member.status]} ring-2 ring-card`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{statusLabels[member.status]}</p>
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground">{member.hours} hrs</span>
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Groups;
