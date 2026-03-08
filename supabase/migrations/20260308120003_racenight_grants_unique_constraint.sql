-- Prevent duplicate racenight claims (same user + same promo code)
ALTER TABLE public.racenight_grants
  ADD CONSTRAINT unique_user_promo_code UNIQUE(user_id, promo_code);
