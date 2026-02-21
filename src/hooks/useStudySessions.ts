import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export const useStudySessions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const startSession = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("start_study_session");
      if (error) throw error;
      return data as string;
    },
  });

  const completeSession = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("complete_study_session");
      if (error) throw error;
      return data as { duration_seconds: number; paws_earned: number };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });

  const cancelSession = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc("cancel_study_session");
      if (error) throw error;
    },
  });

  return { startSession, completeSession, cancelSession };
};
