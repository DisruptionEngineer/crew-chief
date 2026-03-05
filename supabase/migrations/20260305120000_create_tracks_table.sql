-- Create tracks table for national track database
CREATE TABLE public.tracks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  length NUMERIC(5,3) NOT NULL,
  surface TEXT NOT NULL CHECK (surface IN ('asphalt', 'concrete', 'dirt', 'mixed')),
  surface_details TEXT,
  banking NUMERIC(4,1) NOT NULL DEFAULT 0,
  shape TEXT NOT NULL DEFAULT 'oval',
  elevation INTEGER,
  notes TEXT,
  state TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tracks_read" ON public.tracks FOR SELECT USING (true);
CREATE POLICY "tracks_write" ON public.tracks FOR ALL USING (auth.role() = 'service_role');
CREATE INDEX idx_tracks_state ON public.tracks(state);
CREATE INDEX idx_tracks_surface ON public.tracks(surface);
