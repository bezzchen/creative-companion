
-- Fix 1: Add server-side input validation to join_group_by_code
CREATE OR REPLACE FUNCTION public.join_group_by_code(code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  found_group_id uuid;
  sanitized_code text;
BEGIN
  sanitized_code := upper(trim(code));
  
  IF sanitized_code IS NULL OR sanitized_code = '' THEN
    RAISE EXCEPTION 'Invite code cannot be empty';
  END IF;
  
  IF length(sanitized_code) > 8 THEN
    RAISE EXCEPTION 'Invalid invite code format';
  END IF;
  
  IF sanitized_code !~ '^[A-Z0-9]+$' THEN
    RAISE EXCEPTION 'Invalid invite code format';
  END IF;
  
  SELECT id INTO found_group_id FROM public.study_groups WHERE invite_code = sanitized_code;
  IF found_group_id IS NULL THEN
    RAISE EXCEPTION 'Invalid invite code';
  END IF;
  
  INSERT INTO public.group_members (group_id, user_id) VALUES (found_group_id, auth.uid())
    ON CONFLICT (group_id, user_id) DO NOTHING;
  RETURN found_group_id;
END;
$$;

-- Fix 2: Add minimum 60s session duration to prevent reward farming
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
  max_duration integer := 28800;
  min_duration integer := 60;
BEGIN
  SELECT * INTO active_session
  FROM active_study_sessions
  WHERE user_id = auth.uid();
  
  IF active_session IS NULL THEN
    RAISE EXCEPTION 'No active study session found';
  END IF;
  
  actual_duration := LEAST(
    EXTRACT(EPOCH FROM (now() - active_session.started_at))::integer,
    max_duration
  );
  
  IF actual_duration < min_duration THEN
    RAISE EXCEPTION 'Session too short. Study for at least 1 minute to earn rewards.';
  END IF;
  
  calculated_paws := (actual_duration / 60) * 10;
  
  INSERT INTO study_sessions (user_id, duration_seconds, paws_earned, started_at)
  VALUES (auth.uid(), actual_duration, calculated_paws, active_session.started_at);
  
  UPDATE profiles
  SET paws = paws + calculated_paws,
      hours_studied = hours_studied + (actual_duration::numeric / 3600)
  WHERE id = auth.uid();
  
  DELETE FROM active_study_sessions WHERE user_id = auth.uid();
  
  RETURN jsonb_build_object(
    'duration_seconds', actual_duration,
    'paws_earned', calculated_paws
  );
END;
$$;
