import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Coffee, X } from "lucide-react";

const BreakReminder = () => {
  const { showBreakReminder, dismissBreakReminder } = useApp();

  return (
    <AnimatePresence>
      {showBreakReminder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-6"
        >
          <motion.div
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 30 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            className="bg-card rounded-3xl p-8 shadow-2xl border border-border max-w-sm w-full text-center"
          >
            <div className="w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center mx-auto mb-4">
              <Coffee className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Take a Break!</h2>
            <p className="text-muted-foreground mb-6">
              You've been studying for 45 minutes. Time to rest your eyes and stretch!
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={dismissBreakReminder}
                className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-opacity"
              >
                Got it!
              </button>
              <button
                onClick={dismissBreakReminder}
                className="px-4 py-3 rounded-2xl bg-muted text-muted-foreground font-medium hover:bg-muted/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BreakReminder;
