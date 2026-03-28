-- Migration onboarding
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS onboarded BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.brand_profiles
  ADD COLUMN IF NOT EXISTS account_type      TEXT DEFAULT 'business',
  ADD COLUMN IF NOT EXISTS target_audience   TEXT,
  ADD COLUMN IF NOT EXISTS audience_age      TEXT,
  ADD COLUMN IF NOT EXISTS audience_interests TEXT,
  ADD COLUMN IF NOT EXISTS audience_location TEXT,
  ADD COLUMN IF NOT EXISTS content_pillars   TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS avoid_words       TEXT,
  ADD COLUMN IF NOT EXISTS objectives        TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS posts_per_week    INTEGER DEFAULT 5;
