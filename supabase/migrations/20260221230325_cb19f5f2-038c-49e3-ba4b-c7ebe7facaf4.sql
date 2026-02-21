
-- Drop the placeholder table
DROP TABLE IF EXISTS public.buildathon26;

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL DEFAULT 'StudyBuddy',
  animal text,
  status text NOT NULL DEFAULT 'offline',
  paws integer NOT NULL DEFAULT 300,
  hours_studied numeric NOT NULL DEFAULT 0,
  streak integer NOT NULL DEFAULT 0,
  equipped_hat text,
  equipped_border text,
  equipped_background text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Create user_cosmetics table
CREATE TABLE public.user_cosmetics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cosmetic_id text NOT NULL,
  purchased_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, cosmetic_id)
);

ALTER TABLE public.user_cosmetics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own cosmetics" ON public.user_cosmetics FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can buy cosmetics" ON public.user_cosmetics FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own cosmetics" ON public.user_cosmetics FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create study_groups table
CREATE TABLE public.study_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL DEFAULT '📚',
  invite_code text NOT NULL UNIQUE,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;

-- Create group_members table
CREATE TABLE public.group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- study_groups RLS: can read groups you belong to
CREATE POLICY "Members can read their groups" ON public.study_groups FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.group_members WHERE group_members.group_id = study_groups.id AND group_members.user_id = auth.uid()));

CREATE POLICY "Authenticated can create groups" ON public.study_groups FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- group_members RLS
CREATE POLICY "Members can read group members" ON public.group_members FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid()));

CREATE POLICY "Users can join groups" ON public.group_members FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups" ON public.group_members FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Create study_sessions table
CREATE TABLE public.study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  duration_seconds integer NOT NULL,
  paws_earned integer NOT NULL,
  started_at timestamptz NOT NULL,
  ended_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sessions" ON public.study_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.study_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function: generate random invite code
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  code text;
  exists_already boolean;
BEGIN
  LOOP
    code := upper(substr(md5(random()::text), 1, 6));
    SELECT EXISTS(SELECT 1 FROM public.study_groups WHERE invite_code = code) INTO exists_already;
    EXIT WHEN NOT exists_already;
  END LOOP;
  RETURN code;
END;
$$;

-- Function: join group by invite code
CREATE OR REPLACE FUNCTION public.join_group_by_code(code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  found_group_id uuid;
BEGIN
  SELECT id INTO found_group_id FROM public.study_groups WHERE invite_code = upper(code);
  IF found_group_id IS NULL THEN
    RAISE EXCEPTION 'Invalid invite code';
  END IF;
  INSERT INTO public.group_members (group_id, user_id) VALUES (found_group_id, auth.uid())
    ON CONFLICT (group_id, user_id) DO NOTHING;
  RETURN found_group_id;
END;
$$;
