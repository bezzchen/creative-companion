import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApp, COSMETIC_STORE, CosmeticItem } from "@/context/AppContext";
import { ChevronLeft, Check, ShoppingBag, X } from "lucide-react";

type Category = "hat" | "border" | "background";

const categoryLabels: Record<Category, { label: string; emoji: string }> = {
  hat: { label: "Hats", emoji: "🎩" },
  border: { label: "Borders", emoji: "🖼️" },
  background: { label: "Backgrounds", emoji: "🌄" },
};

const Store = () => {
  const { paws, ownedCosmetics, equippedHat, equippedBorder, equippedBackground, buyCosmetic, equipCosmetic, unequipCosmetic } = useApp();
  const [category, setCategory] = useState<Category>("hat");
  const navigate = useNavigate();

  const items = COSMETIC_STORE.filter((i) => i.category === category);
  const equipped = category === "hat" ? equippedHat : category === "border" ? equippedBorder : equippedBackground;

  const handleAction = (item: CosmeticItem) => {
    if (ownedCosmetics.includes(item.id)) {
      if (equipped === item.id) {
        unequipCosmetic(item.category);
      } else {
        equipCosmetic(item.id, item.category);
      }
    } else {
      buyCosmetic(item);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-xl font-extrabold text-foreground flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" /> Shop
        </h1>
        <div className="flex items-center gap-1.5 bg-card rounded-full px-3 py-1.5 border border-border/50 shadow-sm">
          <span>🐾</span>
          <span className="font-bold text-sm text-foreground">{paws}</span>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 px-5 mt-4">
        {(Object.keys(categoryLabels) as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-1 py-2.5 rounded-2xl font-semibold text-sm transition-colors ${
              category === cat
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {categoryLabels[cat].emoji} {categoryLabels[cat].label}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="px-5 mt-5 grid grid-cols-2 gap-3 pb-8">
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => {
            const owned = ownedCosmetics.includes(item.id);
            const isEquipped = equipped === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm flex flex-col items-center"
              >
                <span className="text-4xl mb-3">{item.preview}</span>
                <p className="font-bold text-foreground text-sm">{item.name}</p>
                <button
                  onClick={() => handleAction(item)}
                  disabled={!owned && paws < item.price}
                  className={`mt-3 w-full py-2 rounded-xl font-semibold text-sm transition-colors ${
                    isEquipped
                      ? "bg-destructive/15 text-destructive hover:bg-destructive/25"
                      : owned
                      ? "bg-accent text-accent-foreground hover:bg-accent/80"
                      : paws >= item.price
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                  }`}
                >
                  {isEquipped ? (
                    <span className="flex items-center justify-center gap-1"><X className="w-4 h-4" /> Unequip</span>
                  ) : owned ? (
                    "Equip"
                  ) : (
                    `${item.price} 🐾`
                  )}
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Store;
