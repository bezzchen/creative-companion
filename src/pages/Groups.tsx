import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp, COSMETIC_STORE } from "@/context/AppContext";
import { useGroups, GroupWithMembers } from "@/hooks/useGroups";
import { useAuth } from "@/context/AuthContext";
import { AnimalType } from "@/context/AppContext";
import { Plus, ChevronLeft, Copy, Check } from "lucide-react";
import { animalIconImages } from "@/components/AnimalCharacter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import mygroupImg from "@/assets/mygroup.png";
import bearActiveImg from "@/assets/bearactive.png";
import catActiveImg from "@/assets/catactive.png";
import dogActiveImg from "@/assets/dogactive.png";
import chickenActiveImg from "@/assets/chickenactive.png";
import idleTableImg from "@/assets/idletable.png";
import butterflyIcon from "@/assets/butterfly.png";
import musicIcon from "@/assets/music.png";
import fireIcon from "@/assets/fire.png";

const borderIconMap: Record<string, string> = {
  "border-butterfly": butterflyIcon,
  "border-music": musicIcon,
  "border-fire": fireIcon,
};

const activeImages: Record<AnimalType, string> = {
  bear: bearActiveImg,
  cat: catActiveImg,
  dog: dogActiveImg,
  chicken: chickenActiveImg,
};

const rankLabels = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

const Groups = () => {
  const { user } = useAuth();
  const { groups, isLoading, createGroup, joinGroup } = useGroups();
  const [selectedGroup, setSelectedGroup] = useState<GroupWithMembers | null>(null);
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

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    try {
      await joinGroup.mutateAsync(joinCode.trim());
      toast.success("Joined group!");
      setShowCreateJoin(false);
      setJoinCode("");
    } catch (e: any) {
      toast.error(e.message || "Failed to join group");
    }
  };

  const handleCreate = async () => {
    if (!newGroupName.trim()) return;
    try {
      await createGroup.mutateAsync({ name: newGroupName.trim(), icon: newGroupEmoji });
      toast.success("Group created!");
      setShowCreateJoin(false);
      setNewGroupName("");
    } catch (e: any) {
      toast.error(e.message || "Failed to create group");
    }
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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-extrabold text-foreground">My Study Groups</h1>
              <img src={mygroupImg} alt="My Group" className="w-12 h-12 object-contain" />
            </div>
            {isLoading ? (
              <p className="text-muted-foreground text-center py-10">Loading groups...</p>
            ) : groups.length === 0 ? (
              <p className="text-muted-foreground text-center py-10">No groups yet. Create or join one!</p>
            ) : (
              <div className="space-y-3">
                {groups.map((g) => (
                  <motion.button
                    key={g.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedGroup(g)}
                    className="w-full flex items-center gap-4 p-5 bg-card/80 backdrop-blur-sm rounded-2xl shadow-sm border border-border/50 text-left"
                  >
                    <span className="text-4xl">{g.icon}</span>
                    <div className="flex-1">
                      <p className="font-bold text-lg text-foreground">{g.name}</p>
                      <p className="text-base text-muted-foreground">{g.members.length} members</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedGroup(null)} className="p-2 -ml-2">
                  <ChevronLeft className="w-6 h-6 text-foreground" />
                </button>
                <h1 className="text-xl font-extrabold text-foreground">{selectedGroup.name}</h1>
              </div>
              <Button onClick={() => setShowInvite(true)} size="sm" className="rounded-full px-4 gap-1.5">
                <Plus className="w-4 h-4" />
                Invite
              </Button>
            </div>

            <div className="space-y-3">
              {[...selectedGroup.members]
                .sort((a, b) => (b.profile?.hours_studied ?? 0) - (a.profile?.hours_studied ?? 0))
                .map((member, i) => {
                  const p = member.profile;
                  if (!p) return null;
                  const animalType = (p.animal as AnimalType) || "bear";
                  const borderItem = p.equipped_border
                    ? COSMETIC_STORE.find((c) => c.id === p.equipped_border)
                    : null;
                  const statusImg = p.status === "studying"
                    ? activeImages[animalType]
                    : idleTableImg;
                  const isYou = member.user_id === user?.id;

                  return (
                    <motion.div
                      key={member.user_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 p-4 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/30"
                    >
                      <span className="text-base font-bold text-muted-foreground w-8 text-center">
                        {rankLabels[i] || `${i + 1}th`}
                      </span>
                      <div className="relative flex-shrink-0">
                        <div
                          className={`w-14 h-14 rounded-full overflow-hidden bg-muted/50 flex items-center justify-center ${
                            borderItem ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""
                          }`}
                        >
                          <img
                            src={animalIconImages[animalType]}
                            alt={animalType}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        {p.equipped_border && borderIconMap[p.equipped_border] && (
                          <img
                            src={borderIconMap[p.equipped_border]}
                            alt=""
                            className="absolute -bottom-1 -right-1 w-6 h-6 object-contain"
                            draggable={false}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground text-base truncate">
                          {isYou ? "You" : p.username}
                        </p>
                        <p className="text-sm text-muted-foreground">{Number(p.hours_studied).toFixed(1)} hrs</p>
                      </div>
                      <img
                        src={statusImg}
                        alt={p.status === "studying" ? "Studying" : "Idle / Offline"}
                        className="w-20 h-16 object-contain flex-shrink-0"
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
              {selectedGroup?.invite_code || "------"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleCopyCode(selectedGroup?.invite_code || "")}
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
                maxLength={8}
              />
              <Button className="w-full rounded-xl" onClick={handleJoin} disabled={joinGroup.isPending}>
                {joinGroup.isPending ? "Joining..." : "Join Group"}
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
              <Button className="w-full rounded-xl" onClick={handleCreate} disabled={createGroup.isPending}>
                {createGroup.isPending ? "Creating..." : "Create Group"}
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Groups;
