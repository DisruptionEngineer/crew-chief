/**
 * Edge Function: expire-racenight-grants
 *
 * Fallback mechanism (Option B) for deactivating expired racenight grants.
 * Use this if pg_cron is not available on your Supabase instance.
 *
 * Invoke on a schedule via:
 *   - An external cron service (e.g., GitHub Actions, Vercel Cron, cron-job.org)
 *   - Supabase Dashboard > Edge Functions > Schedule (if supported)
 *
 * The client-side check in useSubscription already filters by expires_at > now(),
 * so this function is a cleanup mechanism — not a security boundary.
 */
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data, error } = await supabase
    .from('racenight_grants')
    .update({ is_active: false })
    .lt('expires_at', new Date().toISOString())
    .eq('is_active', true)
    .select('id')

  return new Response(JSON.stringify({
    deactivated: data?.length ?? 0,
    error: error?.message ?? null
  }), { headers: { 'Content-Type': 'application/json' } })
})
