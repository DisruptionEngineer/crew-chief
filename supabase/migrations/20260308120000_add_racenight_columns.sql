-- Add racenight support columns to tracks table
ALTER TABLE public.tracks
  ADD COLUMN IF NOT EXISTS facebook_page_url TEXT,
  ADD COLUMN IF NOT EXISTS abbreviation TEXT,
  ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;

-- Add racenight flag to promotions table
ALTER TABLE public.promotions
  ADD COLUMN IF NOT EXISTS racenight BOOLEAN DEFAULT false;

-- Index for looking up racenight promos
CREATE INDEX IF NOT EXISTS idx_promotions_racenight
  ON public.promotions (racenight) WHERE racenight = true;
