
-- Create a security definer function to check group membership
CREATE OR REPLACE FUNCTION public.is_group_member(_group_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = _group_id AND user_id = _user_id
  );
$$;

-- Drop the recursive policy
DROP POLICY IF EXISTS "Members can read group members" ON public.group_members;

-- Recreate with the function
CREATE POLICY "Members can read group members"
ON public.group_members
FOR SELECT
USING (public.is_group_member(group_id, auth.uid()));

-- Also fix the study_groups SELECT policy which has the same issue
DROP POLICY IF EXISTS "Members can read their groups" ON public.study_groups;

CREATE POLICY "Members can read their groups"
ON public.study_groups
FOR SELECT
USING (public.is_group_member(id, auth.uid()));
