/*
  # Comprehensive Referral and Affiliate System

  1. Enhanced User Profiles
    - Add referral tracking fields
    - Add earnings tracking
    - Add referral code generation

  2. Referral Tracking
    - Track referral clicks and conversions
    - Store referral relationships
    - Calculate commissions

  3. Discount Codes System
    - User-generated discount codes
    - Usage tracking and limits
    - Expiration dates

  4. Course Purchases
    - Track purchases with referral information
    - Commission calculations
    - Payment status tracking

  5. Security
    - RLS policies for all tables
    - Proper access controls
    - Data integrity constraints
*/

-- Enhanced user profiles with referral system
DO $$
BEGIN
  -- Add referral tracking columns if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'referral_code'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN referral_code TEXT UNIQUE NOT NULL DEFAULT '';
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

-- Course purchases table with referral tracking
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

-- Referral clicks tracking
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

-- Triggers
DROP TRIGGER IF EXISTS trigger_set_referral_code ON user_profiles;
CREATE TRIGGER trigger_set_referral_code
  BEFORE INSERT ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION set_referral_code();

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
  USING (user_id = (SELECT user_id FROM user_profiles WHERE user_id = auth.uid()));

-- RLS Policies for course_purchases
CREATE POLICY "Users can view own purchases"
  ON course_purchases FOR SELECT
  TO authenticated
  USING (user_id = (SELECT user_id FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own purchases"
  ON course_purchases FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT user_id FROM user_profiles WHERE user_id = auth.uid()));

-- RLS Policies for referral_clicks
CREATE POLICY "Allow referral click tracking"
  ON referral_clicks FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_referral_code ON user_profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_user ON discount_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_course_purchases_referrer ON course_purchases(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_clicks_code ON referral_clicks(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_clicks_referrer ON referral_clicks(referrer_id);

-- Insert sample data for testing
INSERT INTO courses (id, title, description, price, discount_percentage) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Premiere Pro Mastery: Complete Course', 'Master Adobe Premiere Pro with step-by-step guidance and real-world projects', 9999, 0),
('550e8400-e29b-41d4-a716-446655440002', 'Advanced Video Editing Techniques', 'Take your editing skills to the next level with advanced techniques and workflows', 14999, 10),
('550e8400-e29b-41d4-a716-446655440003', 'Social Media Video Creation', 'Create engaging content for Instagram, TikTok, and YouTube', 7999, 15)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  discount_percentage = EXCLUDED.discount_percentage;