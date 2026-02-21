
-- Fix: Change all RLS policies from RESTRICTIVE to PERMISSIVE

-- study_groups
DROP POLICY IF EXISTS "Authenticated can create groups" ON public.study_groups;
CREATE POLICY "Authenticated can create groups" ON public.study_groups
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Members can read their groups" ON public.study_groups;
CREATE POLICY "Members can read their groups" ON public.study_groups
FOR SELECT TO authenticated
USING (public.is_group_member(id, auth.uid()));

-- group_members
DROP POLICY IF EXISTS "Members can read group members" ON public.group_members;
CREATE POLICY "Members can read group members" ON public.group_members
FOR SELECT TO authenticated
USING (public.is_group_member(group_id, auth.uid()));

DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
CREATE POLICY "Users can join groups" ON public.group_members
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave groups" ON public.group_members;
CREATE POLICY "Users can leave groups" ON public.group_members
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- profiles
DROP POLICY IF EXISTS "Anyone can read profiles" ON public.profiles;
CREATE POLICY "Anyone can read profiles" ON public.profiles
FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id);

-- study_sessions
DROP POLICY IF EXISTS "Users can insert own sessions" ON public.study_sessions;
CREATE POLICY "Users can insert own sessions" ON public.study_sessions
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own sessions" ON public.study_sessions;
CREATE POLICY "Users can read own sessions" ON public.study_sessions
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- user_cosmetics
DROP POLICY IF EXISTS "Users can buy cosmetics" ON public.user_cosmetics;
CREATE POLICY "Users can buy cosmetics" ON public.user_cosmetics
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own cosmetics" ON public.user_cosmetics;
CREATE POLICY "Users can delete own cosmetics" ON public.user_cosmetics
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own cosmetics" ON public.user_cosmetics;
CREATE POLICY "Users can read own cosmetics" ON public.user_cosmetics
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- active_study_sessions
DROP POLICY IF EXISTS "Users can delete own active session" ON public.active_study_sessions;
CREATE POLICY "Users can delete own active session" ON public.active_study_sessions
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own active session" ON public.active_study_sessions;
CREATE POLICY "Users can insert own active session" ON public.active_study_sessions
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own active session" ON public.active_study_sessions;
CREATE POLICY "Users can read own active session" ON public.active_study_sessions
FOR SELECT TO authenticated
USING (auth.uid() = user_id);
