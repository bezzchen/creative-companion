import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface Profile {
  id: string;
  username: string;
  animal: string | null;
  status: string;
  paws: number;
  hours_studied: number;
  streak: number;
  equipped_hat: string | null;
  equipped_border: string | null;
  equipped_background: string | null;
  created_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });

  // Only allow safe fields to be updated directly
  const ALLOWED_FIELDS = new Set([
    "username", "animal", "status",
    "equipped_hat", "equipped_border", "equipped_background",
  ]);

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error("Not authenticated");
      // Strip any protected fields (paws, hours_studied, streak)
      const safeUpdates: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(updates)) {
        if (ALLOWED_FIELDS.has(key)) {
          safeUpdates[key] = value;
        }
      }
      if (Object.keys(safeUpdates).length === 0) return;
      const { error } = await supabase
        .from("profiles")
        .update(safeUpdates)
        .eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });

  return { profile: query.data, isLoading: query.isLoading, updateProfile };
};
