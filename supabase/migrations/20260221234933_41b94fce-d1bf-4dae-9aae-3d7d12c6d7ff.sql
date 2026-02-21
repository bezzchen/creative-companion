
-- Replace the profiles UPDATE policy to prevent direct modification of protected fields
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  paws = (SELECT paws FROM public.profiles WHERE id = auth.uid()) AND
  hours_studied = (SELECT hours_studied FROM public.profiles WHERE id = auth.uid()) AND
  streak = (SELECT streak FROM public.profiles WHERE id = auth.uid())
);
