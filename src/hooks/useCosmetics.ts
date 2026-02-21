import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export const useCosmetics = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["cosmetics", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_cosmetics")
        .select("cosmetic_id")
        .eq("user_id", user.id);
      if (error) throw error;
      return data.map((r) => r.cosmetic_id);
    },
    enabled: !!user,
  });

  const buyCosmetic = useMutation({
    mutationFn: async (cosmeticId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase.rpc("purchase_cosmetic", { cosmetic_id_input: cosmeticId });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cosmetics", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
    },
  });

  const unownCosmetic = useMutation({
    mutationFn: async (cosmeticId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("user_cosmetics")
        .delete()
        .eq("user_id", user.id)
        .eq("cosmetic_id", cosmeticId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cosmetics", user?.id] });
    },
  });

  return { ownedCosmetics: query.data ?? [], isLoading: query.isLoading, buyCosmetic, unownCosmetic };
};
