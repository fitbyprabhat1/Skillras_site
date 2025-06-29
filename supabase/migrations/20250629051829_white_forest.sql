/*
  # Comprehensive Referral and Affiliate System

  1. New Tables
    - `user_profiles` - Enhanced user profiles with referral tracking
    - `discount_codes` - User-created discount codes
    - `course_purchases` - Purchase tracking with referral attribution
    - `referral_clicks` - Click tracking for analytics

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Allow public access for referral click tracking

  3. Functions
    - Automatic referral code generation
    - Referral count tracking
    - Commission calculation and earnings updates
*/

-- Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID,
  total_referrals INTEGER DEFAULT 0,
  total_earnings INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Add foreign key constraint for referred_by after table creation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_profiles_referred_by_fkey'
  ) THEN
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_referred_by_fkey 
    FOREIGN KEY (referred_by) REFERENCES user_profiles(user_id);
  END IF;
END $$;

-- Create courses table if it doesn't exist
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  discount_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_trial BOOLEAN DEFAULT false,
  trial_description TEXT,
  difficulty_level TEXT DEFAULT 'Beginner',
  duration_weeks INTEGER DEFAULT 4,
  total_lessons INTEGER DEFAULT 0
);

-- Create discount_codes table
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  usage_count INTEGER DEFAULT 0,
  max_usage INTEGER,
  active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create course_purchases table with referral tracking
CREATE TABLE IF NOT EXISTS course_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id),
  course_id UUID REFERENCES courses(id),
  amount_paid INTEGER NOT NULL,
  discount_code TEXT REFERENCES discount_codes(code),
  referrer_id UUID REFERENCES user_profiles(user_id),
  purchase_date TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create referral_clicks tracking table
CREATE TABLE IF NOT EXISTS referral_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code TEXT NOT NULL,
  referrer_id UUID REFERENCES user_profiles(user_id),
  ip_address INET,
  user_agent TEXT,
  clicked_at TIMESTAMPTZ DEFAULT now()
);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code() RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM user_profiles WHERE referral_code = code) INTO exists;
    
    -- If code doesn't exist, return it
    IF NOT exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to set referral code on user creation
CREATE OR REPLACE FUNCTION set_referral_code() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code = '' OR NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to increment referral count
CREATE OR REPLACE FUNCTION increment_referral_count(referrer_id UUID) RETURNS VOID AS $$
BEGIN
  UPDATE user_profiles 
  SET total_referrals = total_referrals + 1 
  WHERE user_id = referrer_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate and update earnings
CREATE OR REPLACE FUNCTION update_referral_earnings() RETURNS TRIGGER AS $$
DECLARE
  commission_rate DECIMAL := 0.10; -- 10% commission
  commission_amount INTEGER;
BEGIN
  IF NEW.referrer_id IS NOT NULL THEN
    commission_amount := FLOOR(NEW.amount_paid * commission_rate);
    
    UPDATE user_profiles 
    SET total_earnings = total_earnings + commission_amount 
    WHERE user_id = NEW.referrer_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_set_referral_code ON user_profiles;
CREATE TRIGGER trigger_set_referral_code
  BEFORE INSERT ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION set_referral_code();

DROP TRIGGER IF EXISTS trigger_update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER trigger_update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_courses_updated_at ON courses;
CREATE TRIGGER trigger_update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_referral_earnings ON course_purchases;
CREATE TRIGGER trigger_update_referral_earnings
  AFTER INSERT ON course_purchases
  FOR EACH ROW EXECUTE FUNCTION update_referral_earnings();

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_clicks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can manage own discount codes" ON discount_codes;
DROP POLICY IF EXISTS "Users can view own purchases" ON course_purchases;
DROP POLICY IF EXISTS "Users can insert own purchases" ON course_purchases;
DROP POLICY IF EXISTS "Allow referral click tracking" ON referral_clicks;

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for discount_codes
CREATE POLICY "Users can manage own discount codes"
  ON discount_codes FOR ALL
  TO authenticated
  USING (user_id = (SELECT user_profiles.user_id FROM user_profiles WHERE user_profiles.user_id = auth.uid()));

-- RLS Policies for course_purchases
CREATE POLICY "Users can view own purchases"
  ON course_purchases FOR SELECT
  TO authenticated
  USING (user_id = (SELECT user_profiles.user_id FROM user_profiles WHERE user_profiles.user_id = auth.uid()));

CREATE POLICY "Users can insert own purchases"
  ON course_purchases FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT user_profiles.user_id FROM user_profiles WHERE user_profiles.user_id = auth.uid()));

-- RLS Policies for referral_clicks
CREATE POLICY "Allow referral click tracking"
  ON referral_clicks FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_referral_code ON user_profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_discount_codes_user ON discount_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_referrer ON course_purchases(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_clicks_code ON referral_clicks(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_clicks_referrer ON referral_clicks(referrer_id);

-- Insert sample courses for testing
INSERT INTO courses (id, title, description, price, discount_percentage, is_trial, trial_description, difficulty_level, duration_weeks, total_lessons) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001', 
  'Premiere Pro Mastery: Complete Course', 
  'Master Adobe Premiere Pro with step-by-step guidance and real-world projects to elevate your video editing skills and launch your career.', 
  9999, 
  0, 
  true,
  'Start with 3 free chapters to experience our teaching style and see the quality of content you''ll receive.',
  'Beginner',
  5,
  26
),
(
  '550e8400-e29b-41d4-a716-446655440002', 
  'Advanced Video Editing Techniques', 
  'Take your editing skills to the next level with advanced techniques, color grading, and professional workflows used by industry experts.', 
  14999, 
  10,
  false,
  null,
  'Advanced',
  8,
  35
),
(
  '550e8400-e29b-41d4-a716-446655440003', 
  'Social Media Video Creation', 
  'Create engaging content for Instagram, TikTok, and YouTube with platform-specific editing techniques and viral content strategies.', 
  7999, 
  15,
  true,
  'Try 2 free lessons focused on Instagram Reels and TikTok editing.',
  'Intermediate',
  4,
  18
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  discount_percentage = EXCLUDED.discount_percentage,
  is_trial = EXCLUDED.is_trial,
  trial_description = EXCLUDED.trial_description,
  difficulty_level = EXCLUDED.difficulty_level,
  duration_weeks = EXCLUDED.duration_weeks,
  total_lessons = EXCLUDED.total_lessons;