CREATE TABLE public.racenight_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  promo_code TEXT NOT NULL,
  track_name TEXT NOT NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Index for checking active grants by user
CREATE INDEX idx_racenight_grants_user_active
  ON public.racenight_grants (user_id, is_active) WHERE is_active = true;

-- Index for expiry cleanup
CREATE INDEX idx_racenight_grants_expiry
  ON public.racenight_grants (expires_at) WHERE is_active = true;

-- RLS policies
ALTER TABLE public.racenight_grants ENABLE ROW LEVEL SECURITY;

-- Users can read their own grants
CREATE POLICY "Users can read own grants"
  ON public.racenight_grants FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can do everything (for the social manager bot)
CREATE POLICY "Service role full access"
  ON public.racenight_grants FOR ALL
  USING (auth.role() = 'service_role');
