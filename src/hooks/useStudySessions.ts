import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export const useStudySessions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const logSession = useMutation({
    mutationFn: async ({
      durationSeconds,
      pawsEarned,
      startedAt,
    }: {
      durationSeconds: number;
      pawsEarned: number;
      startedAt: Date;
    }) => {
      if (!user) throw new Error("Not authenticated");

      // Insert session
      const { error: sessionErr } = await supabase.from("study_sessions").insert({
        user_id: user.id,
        duration_seconds: durationSeconds,
        paws_earned: pawsEarned,
        started_at: startedAt.toISOString(),
      });
      if (sessionErr) throw sessionErr;

      // Update profile: add paws and hours
      const hoursToAdd = durationSeconds / 3600;
      const { data: profile } = await supabase
        .from("profiles")
        .select("paws, hours_studied")
        .eq("id", user.id)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({
            paws: (profile.paws ?? 0) + pawsEarned,
            hours_studied: Number(profile.hours_studied ?? 0) + hoursToAdd,
          })
          .eq("id", user.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });

  return { logSession };
};
