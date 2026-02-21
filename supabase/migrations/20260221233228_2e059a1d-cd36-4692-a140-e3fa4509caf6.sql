
-- 1. study_groups: Add missing UPDATE and DELETE policies
CREATE POLICY "Creators can update groups" ON public.study_groups
FOR UPDATE TO authenticated
USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete groups" ON public.study_groups
FOR DELETE TO authenticated
USING (auth.uid() = created_by);

-- 2. Username validation constraints
ALTER TABLE public.profiles
ADD CONSTRAINT username_length CHECK (length(username) <= 50);

ALTER TABLE public.profiles
ADD CONSTRAINT username_not_empty CHECK (trim(username) != '');

-- 3. Improve invite codes: use 8 characters instead of 6
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  code text;
  exists_already boolean;
BEGIN
  LOOP
    code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
    SELECT EXISTS(SELECT 1 FROM public.study_groups WHERE invite_code = code) INTO exists_already;
    EXIT WHEN NOT exists_already;
  END LOOP;
  RETURN code;
END;
$$;

-- 4. Create cosmetics table with prices (source of truth)
CREATE TABLE public.cosmetics (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('hat', 'border', 'background')),
  price integer NOT NULL CHECK (price > 0),
  preview text NOT NULL
);

-- No RLS needed - public read-only catalog
ALTER TABLE public.cosmetics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cosmetics" ON public.cosmetics
FOR SELECT TO authenticated
USING (true);

-- Seed the cosmetics catalog
INSERT INTO public.cosmetics (id, name, category, price, preview) VALUES
  ('hat-crown', 'Royal Crown', 'hat', 50, '👑'),
  ('hat-tophat', 'Top Hat', 'hat', 30, '🎩'),
  ('hat-cap', 'Baseball Cap', 'hat', 20, '🧢'),
  ('hat-party', 'Party Hat', 'hat', 15, '🥳'),
  ('hat-wizard', 'Wizard Hat', 'hat', 40, '🧙'),
  ('border-gold', 'Gold Frame', 'border', 60, '🟡'),
  ('border-rainbow', 'Rainbow Frame', 'border', 45, '🌈'),
  ('border-fire', 'Fire Frame', 'border', 55, '🔥'),
  ('border-ice', 'Ice Frame', 'border', 40, '❄️'),
  ('bg-sunset', 'Sunset', 'background', 80, '🌅'),
  ('bg-forest', 'Forest', 'background', 70, '🌲'),
  ('bg-space', 'Space', 'background', 100, '🚀'),
  ('bg-ocean', 'Ocean', 'background', 75, '🌊');

-- 5. Server-side purchase function
CREATE OR REPLACE FUNCTION public.purchase_cosmetic(cosmetic_id_input text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item record;
  current_paws integer;
BEGIN
  -- Validate cosmetic exists
  SELECT * INTO item FROM public.cosmetics WHERE id = cosmetic_id_input;
  IF item IS NULL THEN
    RAISE EXCEPTION 'Invalid cosmetic item';
  END IF;

  -- Check if already owned
  IF EXISTS (SELECT 1 FROM public.user_cosmetics WHERE user_id = auth.uid() AND cosmetic_id = cosmetic_id_input) THEN
    RAISE EXCEPTION 'Already owned';
  END IF;

  -- Atomically check and deduct paws
  SELECT paws INTO current_paws FROM public.profiles WHERE id = auth.uid() FOR UPDATE;
  
  IF current_paws < item.price THEN
    RAISE EXCEPTION 'Insufficient paws';
  END IF;

  UPDATE public.profiles SET paws = paws - item.price WHERE id = auth.uid();
  INSERT INTO public.user_cosmetics (user_id, cosmetic_id) VALUES (auth.uid(), cosmetic_id_input);

  RETURN jsonb_build_object('success', true, 'paws_remaining', current_paws - item.price);
END;
$$;
