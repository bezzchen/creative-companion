
-- 1. Add group name constraints
ALTER TABLE public.study_groups
ADD CONSTRAINT group_name_length CHECK (length(name) BETWEEN 1 AND 100);

ALTER TABLE public.study_groups
ADD CONSTRAINT group_name_not_empty CHECK (trim(name) != '');

-- 2. Add explicit deny policies for cosmetics write operations
CREATE POLICY "No inserts on cosmetics" ON public.cosmetics
FOR INSERT TO authenticated
WITH CHECK (false);

CREATE POLICY "No updates on cosmetics" ON public.cosmetics
FOR UPDATE TO authenticated
USING (false);

CREATE POLICY "No deletes on cosmetics" ON public.cosmetics
FOR DELETE TO authenticated
USING (false);
