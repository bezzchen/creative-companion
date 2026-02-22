import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Users, User } from "lucide-react";

const tabs = [
  { path: "/home", label: "Home", icon: Home, layoutId: undefined as string | undefined },
  { path: "/groups", label: "Groups", icon: Users, layoutId: "groups-icon" },
  { path: "/profile", label: "Profile", icon: User, layoutId: "profile-icon" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/" || location.pathname === "/home";

  return (
    <motion.nav
      initial={{ y: 80 }}
      animate={{ y: isHome ? 120 : 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{ pointerEvents: isHome ? "none" : "auto" }}
    >
      <div className="mx-4 mb-4 bg-card/90 backdrop-blur-xl rounded-3xl shadow-xl border border-border/50 flex items-center justify-around py-3 px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.path);
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-full transition-colors ${
                isActive ? "bg-primary/15" : ""
              }`}
            >
              <motion.div layoutId={tab.layoutId}>
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                />
              </motion.div>
              <span
                className={`text-[11px] font-medium ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNav;
