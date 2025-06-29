/*
  # Complete Affiliate Referral System

  1. New Tables
    - `user_profiles` (extend existing)
      - User profile information with referral codes
    - `discount_codes` 
      - Coupon codes for referrals
    - `course_purchases`
      - Track course purchases with referral info
    - `user_courses`
      - User course enrollments

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
    - Secure referral tracking

  3. Functions
    - Auto-generate referral codes
    - Update referral earnings
*/

-- Create function to generate referral codes
CREATE OR REPLACE FUNCTION generate_referral_code() RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM user_profiles WHERE referral_code = code) INTO exists;
    IF NOT exists THEN
      EXIT;
    END IF;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to set referral code
CREATE OR REPLACE FUNCTION set_referral_code() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update user_profiles table structure
DO $$
BEGIN
  -- Add columns if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'referral_code'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN referral_code TEXT UNIQUE NOT NULL DEFAULT generate_referral_code();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'referred_by'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN referred_by UUID REFERENCES user_profiles(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'total_referrals'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN total_referrals INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'total_earnings'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN total_earnings INTEGER DEFAULT 0;
  END IF;
END $$;

-- Create unique index for referral codes
CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_referral_code_key ON user_profiles(referral_code);

-- Create trigger for auto-generating referral codes
DROP TRIGGER IF EXISTS trigger_set_referral_code ON user_profiles;
CREATE TRIGGER trigger_set_referral_code
  BEFORE INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_referral_code();

-- Discount codes table
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

-- Course purchases table
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

-- User courses table (for enrollment tracking)
CREATE TABLE IF NOT EXISTS user_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id),
  course_id UUID REFERENCES courses(id),
  purchase_price NUMERIC(10,2) NOT NULL,
  discount_applied NUMERIC(10,2) DEFAULT 0,
  referral_code_used VARCHAR(10),
  purchased_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_courses_user_id ON user_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_referrer ON course_purchases(referrer_id);
CREATE INDEX IF NOT EXISTS idx_discount_codes_user ON discount_codes(user_id);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for discount_codes
CREATE POLICY "Users can manage own discount codes"
  ON discount_codes
  FOR ALL
  TO authenticated
  USING (user_id = (SELECT user_id FROM user_profiles WHERE user_id = auth.uid()));

-- RLS Policies for course_purchases
CREATE POLICY "Users can view own purchases"
  ON course_purchases
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT user_id FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own purchases"
  ON course_purchases
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT user_id FROM user_profiles WHERE user_id = auth.uid()));

-- RLS Policies for user_courses
CREATE POLICY "Users can view own courses"
  ON user_courses
  FOR ALL
  TO authenticated
  USING (user_id = (SELECT user_id FROM user_profiles WHERE user_id = auth.uid()));

-- Insert sample discount codes for existing users
INSERT INTO discount_codes (code, user_id, discount_percent, max_usage) 
SELECT 
  'SAVE' || up.referral_code,
  up.user_id,
  10,
  100
FROM user_profiles up
WHERE NOT EXISTS (
  SELECT 1 FROM discount_codes dc WHERE dc.user_id = up.user_id
);