import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp, StudyGroup, AnimalType, COSMETIC_STORE } from "@/context/AppContext";
import { Plus, ChevronLeft, Copy, Check } from "lucide-react";
import { animalIconImages } from "@/components/AnimalCharacter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import bearActiveImg from "@/assets/bearactive.png";
import catActiveImg from "@/assets/catactive.png";
import dogActiveImg from "@/assets/dogactive.png";
import chickenActiveImg from "@/assets/chickenactive.png";
import idleTableImg from "@/assets/idletable.png";

const activeImages: Record<AnimalType, string> = {
  bear: bearActiveImg,
  cat: catActiveImg,
  dog: dogActiveImg,
  chicken: chickenActiveImg,
};

const rankLabels = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

const Groups = () => {
  const { groups } = useApp();
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [showCreateJoin, setShowCreateJoin] = useState(false);
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupEmoji, setNewGroupEmoji] = useState("📚");

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Invite code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen theme-gradient pb-28">
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
                  className="w-full flex items-center gap-4 p-4 bg-card/80 backdrop-blur-sm rounded-2xl shadow-sm border border-border/50 text-left"
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
              onClick={() => setShowCreateJoin(true)}
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
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedGroup(null)} className="p-2 -ml-2">
                  <ChevronLeft className="w-6 h-6 text-foreground" />
                </button>
                <h1 className="text-xl font-extrabold text-foreground">My Study Group</h1>
              </div>
              <Button
                onClick={() => setShowInvite(true)}
                size="sm"
                className="rounded-full px-4 gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Invite
              </Button>
            </div>

            {/* Leaderboard */}
            <div className="space-y-3">
              {[...selectedGroup.members]
                .sort((a, b) => b.hours - a.hours)
                .map((member, i) => {
                  const borderItem = member.equippedBorder
                    ? COSMETIC_STORE.find((c) => c.id === member.equippedBorder)
                    : null;
                  const statusImg = member.status === "studying"
                    ? activeImages[member.animal]
                    : idleTableImg;

                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 p-3 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/30"
                    >
                      {/* Rank */}
                      <span className="text-sm font-bold text-muted-foreground w-8 text-center">
                        {rankLabels[i] || `${i + 1}th`}
                      </span>

                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full overflow-hidden bg-muted/50 flex items-center justify-center flex-shrink-0 ${
                          borderItem ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""
                        }`}
                      >
                        <img
                          src={animalIconImages[member.animal]}
                          alt={member.animal}
                          className="w-7 h-7 object-contain"
                        />
                      </div>

                      {/* Name + hours */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground text-sm truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.hours} hrs</p>
                      </div>

                      {/* Status illustration */}
                      <img
                        src={statusImg}
                        alt={member.status === "studying" ? "Studying" : "Idle"}
                        className="w-16 h-12 object-contain flex-shrink-0"
                      />
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite Code Dialog */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="rounded-2xl max-w-xs mx-auto">
          <DialogHeader>
            <DialogTitle>Invite Code</DialogTitle>
            <DialogDescription>Share this code so others can join your group.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 bg-muted rounded-xl p-4 mt-2">
            <span className="text-2xl font-mono font-bold text-foreground tracking-widest flex-1 text-center">
              {selectedGroup?.inviteCode || "------"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleCopyCode(selectedGroup?.inviteCode || "")}
            >
              {copied ? <Check className="w-5 h-5 text-primary" /> : <Copy className="w-5 h-5" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create / Join Dialog */}
      <Dialog open={showCreateJoin} onOpenChange={setShowCreateJoin}>
        <DialogContent className="rounded-2xl max-w-xs mx-auto">
          <DialogHeader>
            <DialogTitle>Create or Join a Group</DialogTitle>
            <DialogDescription>Enter a code to join, or create a new study group.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="join" className="mt-2">
            <TabsList className="w-full">
              <TabsTrigger value="join" className="flex-1">Join</TabsTrigger>
              <TabsTrigger value="create" className="flex-1">Create</TabsTrigger>
            </TabsList>
            <TabsContent value="join" className="space-y-3 pt-3">
              <Input
                placeholder="Enter invite code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="text-center font-mono tracking-widest text-lg"
                maxLength={6}
              />
              <Button className="w-full rounded-xl" onClick={() => { toast.success("Joined group!"); setShowCreateJoin(false); }}>
                Join Group
              </Button>
            </TabsContent>
            <TabsContent value="create" className="space-y-3 pt-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const emojis = ["📚", "🦉", "🔥", "⭐", "🎯", "💪", "🧠", "🚀"];
                    const idx = emojis.indexOf(newGroupEmoji);
                    setNewGroupEmoji(emojis[(idx + 1) % emojis.length]);
                  }}
                  className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl hover:bg-muted/80 transition-colors"
                >
                  {newGroupEmoji}
                </button>
                <Input
                  placeholder="Group name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="flex-1"
                />
              </div>
              <Button className="w-full rounded-xl" onClick={() => { toast.success("Group created!"); setShowCreateJoin(false); }}>
                Create Group
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Groups;
