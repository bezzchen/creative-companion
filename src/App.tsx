import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/context/AppContext";
import BottomNav from "@/components/BottomNav";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Groups from "./pages/Groups";
import Profile from "./pages/Profile";
import Store from "./pages/Store";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { animal } = useApp();

  return (
    <>
      <Routes>
        <Route path="/" element={animal ? <Navigate to="/home" replace /> : <Onboarding />} />
        <Route path="/home" element={animal ? <Home /> : <Navigate to="/" replace />} />
        <Route path="/groups" element={animal ? <Groups /> : <Navigate to="/" replace />} />
        <Route path="/profile" element={animal ? <Profile /> : <Navigate to="/" replace />} />
        <Route path="/store" element={animal ? <Store /> : <Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNav />
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppProvider>
            <AppRoutes />
          </AppProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
