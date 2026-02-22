import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

import longLogo from "@/assets/longlogo.png";
import bearImg from "@/assets/bear.png";
import bearLong1 from "@/assets/bearlong1.png";
import catImg from "@/assets/cat.png";
import catLong1 from "@/assets/catlong1.png";
import dogImg from "@/assets/dog.png";
import dogLong1 from "@/assets/doglong1.png";
import duckImg from "@/assets/duck.png";
import duckLong1 from "@/assets/ducklong1.png";

const animals = [
  { idle: bearImg, long: bearLong1 },
  { idle: catImg, long: catLong1 },
  { idle: dogImg, long: dogLong1 },
  { idle: duckImg, long: duckLong1 },
];

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [frame, setFrame] = useState(0);

  const animal = useMemo(() => animals[Math.floor(Math.random() * animals.length)], []);

  useEffect(() => {
    const interval = setInterval(() => setFrame((f) => (f === 0 ? 1 : 0)), 750);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = isLogin ? await signIn(email, password) : await signUp(email, password);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
    } else if (!isLogin) {
      toast.success("Account created! Check your email to confirm, or sign in if email confirmation is disabled.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-10 bg-gradient-to-b from-[hsl(200,80%,92%)] to-background">
      {/* Logo */}
      <motion.img
        src={longLogo}
        alt="Study Buddy"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-12 object-contain mt-4"
      />

      {/* Form Card */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 bg-card rounded-3xl p-6 shadow-lg border border-border"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-2xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-4 py-3 rounded-2xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? "..." : isLogin ? "Sign In" : "Sign Up"}
        </button>
      </motion.form>

      {/* Speech Bubble + Animal */}
      <div className="flex flex-col items-center">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative mb-2"
        >
          <div className="bg-card/90 rounded-2xl px-8 py-4 shadow-lg border border-border text-center">
            <p className="text-foreground font-semibold text-sm">
              {isLogin ? "Welcome back!" : "Create your account"}
            </p>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-card/90 border-r border-b border-border rotate-45" />
        </motion.div>

        <img
          src={frame === 0 ? animal.idle : animal.long}
          alt="Animal character"
          className="w-32 h-32 object-contain"
        />
      </div>

      {/* Toggle */}
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
      </button>
    </div>
  );
};

export default Auth;
