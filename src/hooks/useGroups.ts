import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface GroupWithMembers {
  id: string;
  name: string;
  icon: string;
  invite_code: string;
  members: {
    user_id: string;
    profile: {
      id: string;
      username: string;
      animal: string | null;
      hours_studied: number;
      status: string;
      equipped_hat: string | null;
      equipped_border: string | null;
    };
  }[];
}

export const useGroups = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["groups", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("study_groups")
        .select(`
          id, name, icon, invite_code,
          group_members (
            user_id,
            profiles:user_id (
              id, username, animal, hours_studied, status, equipped_hat, equipped_border
            )
          )
        `);
      if (error) throw error;
      return (data ?? []).map((g: any) => ({
        id: g.id,
        name: g.name,
        icon: g.icon,
        invite_code: g.invite_code,
        members: (g.group_members ?? []).map((m: any) => ({
          user_id: m.user_id,
          profile: m.profiles,
        })),
      })) as GroupWithMembers[];
    },
    enabled: !!user,
  });

  const createGroup = useMutation({
    mutationFn: async ({ name, icon }: { name: string; icon: string }) => {
      if (!user) throw new Error("Not authenticated");
      const trimmedName = name.trim();
      if (trimmedName.length < 1 || trimmedName.length > 100) {
        throw new Error("Group name must be 1-100 characters");
      }
      // Generate invite code
      const { data: code, error: codeErr } = await supabase.rpc("generate_invite_code");
      if (codeErr) throw codeErr;

      const { data: group, error } = await supabase
        .from("study_groups")
        .insert({ name, icon, invite_code: code, created_by: user.id })
        .select()
        .single();
      if (error) throw error;

      // Auto-join creator
      await supabase.from("group_members").insert({ group_id: group.id, user_id: user.id });
      return group;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups", user?.id] });
    },
  });

  const joinGroup = useMutation({
    mutationFn: async (code: string) => {
      const { data, error } = await supabase.rpc("join_group_by_code", { code });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups", user?.id] });
    },
  });

  return { groups: query.data ?? [], isLoading: query.isLoading, createGroup, joinGroup };
};
