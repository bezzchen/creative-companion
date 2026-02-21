import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useApp, AnimalType } from "@/context/AppContext";
import bearImg from "@/assets/bear.png";
import catImg from "@/assets/cat.png";
import dogImg from "@/assets/dog.png";
import duckImg from "@/assets/duck.png";

const animals: { type: AnimalType; label: string; img: string; colors: string }[] = [
  { type: "dog", label: "Dog", img: dogImg, colors: "from-red-400/30 to-yellow-300/30" },
  { type: "cat", label: "Cat", img: catImg, colors: "from-purple-500/30 to-gray-400/30" },
  { type: "bear", label: "Bear", img: bearImg, colors: "from-sky-300/30 to-white/30" },
  { type: "chicken", label: "Chicken", img: duckImg, colors: "from-yellow-200/30 to-green-200/30" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 120, damping: 14 } },
};

const Onboarding = () => {
  const { setAnimal } = useApp();
  const navigate = useNavigate();

  const pick = (a: AnimalType) => {
    setAnimal(a);
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-muted to-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Choose Your Study Buddy
        </h1>
        <p className="mt-2 text-muted-foreground text-base">
          Pick a companion to join your study sessions!
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-5 w-full max-w-sm"
      >
        {animals.map((a) => (
          <motion.button
            key={a.type}
            variants={item}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => pick(a.type)}
            className={`relative flex flex-col items-center gap-3 p-6 rounded-3xl bg-gradient-to-br ${a.colors} backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-shadow`}
          >
            <img src={a.img} alt={a.label} className="w-24 h-24 object-contain drop-shadow-md" />
            <span className="font-bold text-foreground text-lg">{a.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default Onboarding;
