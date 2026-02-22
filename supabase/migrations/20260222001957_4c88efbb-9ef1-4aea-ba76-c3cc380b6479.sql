
-- Fix: All study_groups policies are RESTRICTIVE, need at least one PERMISSIVE for each command

-- INSERT
DROP POLICY IF EXISTS "Authenticated can create groups" ON public.study_groups;
CREATE POLICY "Authenticated can create groups" ON public.study_groups
AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (auth.uid() = created_by);

-- SELECT
DROP POLICY IF EXISTS "Members can read their groups" ON public.study_groups;
CREATE POLICY "Members can read their groups" ON public.study_groups
AS PERMISSIVE FOR SELECT TO authenticated
USING (is_group_member(id, auth.uid()));

-- UPDATE
DROP POLICY IF EXISTS "Creators can update groups" ON public.study_groups;
CREATE POLICY "Creators can update groups" ON public.study_groups
AS PERMISSIVE FOR UPDATE TO authenticated
USING (auth.uid() = created_by);

-- DELETE
DROP POLICY IF EXISTS "Creators can delete groups" ON public.study_groups;
CREATE POLICY "Creators can delete groups" ON public.study_groups
AS PERMISSIVE FOR DELETE TO authenticated
USING (auth.uid() = created_by);
