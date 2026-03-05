-- Create cars table for common short-track car platforms
CREATE TABLE public.cars (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  eligible_divisions TEXT[] NOT NULL DEFAULT '{}',
  engine_family_id TEXT,
  weight JSONB NOT NULL,
  wheelbase NUMERIC(5,1) NOT NULL,
  track_width_front NUMERIC(5,1) NOT NULL,
  track_width_rear NUMERIC(5,1) NOT NULL,
  suspension_front JSONB NOT NULL,
  suspension_rear JSONB NOT NULL,
  engine JSONB NOT NULL,
  tires JSONB NOT NULL,
  alignment JSONB NOT NULL,
  notes TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cars_read" ON public.cars FOR SELECT USING (true);
CREATE POLICY "cars_write" ON public.cars FOR ALL USING (auth.role() = 'service_role');
CREATE INDEX idx_cars_make ON public.cars(make);
