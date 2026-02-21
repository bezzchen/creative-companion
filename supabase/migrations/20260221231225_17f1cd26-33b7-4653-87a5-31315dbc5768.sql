
-- Table to track active (in-progress) study sessions server-side
CREATE TABLE public.active_study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.active_study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own active session" ON public.active_study_sessions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own active session" ON public.active_study_sessions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own active session" ON public.active_study_sessions
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Function: start a study session (server records the start time)
CREATE OR REPLACE FUNCTION public.start_study_session()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_id uuid;
BEGIN
  -- Remove any existing active session for this user
  DELETE FROM active_study_sessions WHERE user_id = auth.uid();
  
  INSERT INTO active_study_sessions (user_id)
  VALUES (auth.uid())
  RETURNING id INTO session_id;
  
  -- Set status to studying
  UPDATE profiles SET status = 'studying' WHERE id = auth.uid();
  
  RETURN session_id;
END;
$$;

-- Function: complete a study session (server calculates duration and rewards)
CREATE OR REPLACE FUNCTION public.complete_study_session()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  active_session record;
  actual_duration integer;
  calculated_paws integer;
  max_duration integer := 28800; -- 8 hour cap
BEGIN
  -- Get the active session
  SELECT * INTO active_session
  FROM active_study_sessions
  WHERE user_id = auth.uid();
  
  IF active_session IS NULL THEN
    RAISE EXCEPTION 'No active study session found';
  END IF;
  
  -- Calculate actual duration server-side
  actual_duration := LEAST(
    EXTRACT(EPOCH FROM (now() - active_session.started_at))::integer,
    max_duration
  );
  
  -- Calculate rewards server-side: 10 paws per minute
  calculated_paws := (actual_duration / 60) * 10;
  
  -- Insert completed session
  INSERT INTO study_sessions (user_id, duration_seconds, paws_earned, started_at)
  VALUES (auth.uid(), actual_duration, calculated_paws, active_session.started_at);
  
  -- Update profile with server-calculated values
  UPDATE profiles
  SET paws = paws + calculated_paws,
      hours_studied = hours_studied + (actual_duration::numeric / 3600)
  WHERE id = auth.uid();
  
  -- Remove active session
  DELETE FROM active_study_sessions WHERE user_id = auth.uid();
  
  RETURN jsonb_build_object(
    'duration_seconds', actual_duration,
    'paws_earned', calculated_paws
  );
END;
$$;

-- Function: cancel a study session without rewards
CREATE OR REPLACE FUNCTION public.cancel_study_session()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM active_study_sessions WHERE user_id = auth.uid();
END;
$$;
