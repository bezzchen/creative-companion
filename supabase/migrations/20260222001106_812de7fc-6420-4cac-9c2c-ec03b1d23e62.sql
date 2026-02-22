
-- Fix: study_groups INSERT policy is RESTRICTIVE, must be PERMISSIVE
DROP POLICY IF EXISTS "Authenticated can create groups" ON public.study_groups;

CREATE POLICY "Authenticated can create groups" ON public.study_groups
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = created_by);
