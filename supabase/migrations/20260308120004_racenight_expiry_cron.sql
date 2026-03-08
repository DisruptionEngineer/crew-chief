-- Automatic deactivation of expired racenight grants via pg_cron
--
-- Option A (preferred): Runs as a scheduled database job every hour.
-- Requires pg_cron to be enabled in the Supabase dashboard first on hosted projects.
-- If pg_cron is not available, use Option B: the Edge Function at
-- supabase/functions/expire-racenight-grants/index.ts instead.
--
-- The client-side check in useSubscription already filters by expires_at > now(),
-- so this cron is a cleanup mechanism — not a security boundary.

-- Enable pg_cron extension (must be pre-enabled in dashboard on hosted Supabase)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a function that deactivates expired grants.
-- Uses the partial index idx_racenight_grants_expiry (WHERE is_active = true)
-- for efficient lookups.
CREATE OR REPLACE FUNCTION deactivate_expired_racenight_grants()
RETURNS void AS $$
BEGIN
  UPDATE public.racenight_grants
  SET is_active = false
  WHERE expires_at < now() AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule the cleanup to run every hour at the top of the hour
SELECT cron.schedule(
  'deactivate-expired-racenight-grants',
  '0 * * * *',
  'SELECT deactivate_expired_racenight_grants()'
);
