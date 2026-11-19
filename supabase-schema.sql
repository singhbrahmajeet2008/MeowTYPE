-- ====================================================================
-- MEOW-TYPING • SUPABASE PRODUCTION DATABASE SCHEMA
-- ====================================================================
-- How to apply:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project -> Click "SQL Editor" in the left sidebar
-- 3. Click "New Query", paste this entire script, and click "RUN" (▶)
-- ====================================================================

-- 1. USER PROFILES TABLE
-- Automatically populated when a user signs in with Google OAuth
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  highest_wpm INTEGER DEFAULT 0,
  total_tests INTEGER DEFAULT 0,
  total_practice_seconds INTEGER DEFAULT 0,
  total_chars INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  avg_accuracy INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TYPING TEST RECORDS TABLE
-- Stores every completed typing session with full telemetry
CREATE TABLE IF NOT EXISTS public.typing_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  wpm INTEGER NOT NULL,
  raw_wpm INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL,
  mode TEXT DEFAULT 'quotes',
  difficulty TEXT DEFAULT 'normal',
  errors_count INTEGER DEFAULT 0,
  total_chars INTEGER DEFAULT 0,
  correct_chars INTEGER DEFAULT 0,
  is_new_record BOOLEAN DEFAULT FALSE,
  test_type TEXT DEFAULT 'time',
  target_value INTEGER DEFAULT 60,
  words_typed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Upgrade existing tables if columns missing
ALTER TABLE public.typing_records ADD COLUMN IF NOT EXISTS test_type TEXT DEFAULT 'time';
ALTER TABLE public.typing_records ADD COLUMN IF NOT EXISTS target_value INTEGER DEFAULT 60;
ALTER TABLE public.typing_records ADD COLUMN IF NOT EXISTS words_typed INTEGER DEFAULT 0;

-- 3. SPEED INDEXES
CREATE INDEX IF NOT EXISTS idx_typing_records_user_id ON public.typing_records(user_id);
CREATE INDEX IF NOT EXISTS idx_typing_records_created_at ON public.typing_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_typing_records_wpm ON public.typing_records(wpm DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_highest_wpm ON public.profiles(highest_wpm DESC);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_records ENABLE ROW LEVEL SECURITY;

-- Profiles: Allow anyone to view profiles (for leaderboards), users can update their own
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Typing Records: Users can view, insert, and delete only their own records
DROP POLICY IF EXISTS "Users can view their own records" ON public.typing_records;
CREATE POLICY "Users can view their own records"
  ON public.typing_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own records" ON public.typing_records;
CREATE POLICY "Users can insert their own records"
  ON public.typing_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own records" ON public.typing_records;
CREATE POLICY "Users can delete their own records"
  ON public.typing_records FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 5. AUTOMATIC PROFILE CREATION TRIGGER
-- When a user logs in via Google OAuth, this trigger ensures their profile exists
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      SPLIT_PART(NEW.email, '@', 1),
      'Cyber Typist'
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture',
      ''
    ),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = COALESCE(NULLIF(EXCLUDED.display_name, ''), public.profiles.display_name),
    avatar_url = COALESCE(NULLIF(EXCLUDED.avatar_url, ''), public.profiles.avatar_url),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- SUCCESS! Your Supabase database is now configured for meow-typing.
-- ====================================================================
