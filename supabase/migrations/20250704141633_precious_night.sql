/*
  # Enrollment System with Coupon/Referral Verification

  1. New Tables
    - `paid_users` - Store enrolled user information
    - `referral_codes` - Store referral/coupon codes with details
    
  2. Features
    - User enrollment tracking
    - Coupon/Referral code validation
    - Discount calculation
    - Referrer information display
    
  3. Security
    - Enable RLS on all tables
    - Public can verify codes and enroll
    - Authenticated users can manage codes
*/

-- Create referral_codes table for coupon/referral management
CREATE TABLE IF NOT EXISTS referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  code_type text NOT NULL CHECK (code_type IN ('coupon', 'referral', 'affiliate')),
  referrer_name text,
  referrer_email text,
  discount_percentage integer NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  max_usage integer,
  current_usage integer DEFAULT 0,
  is_active boolean DEFAULT true,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  description text,
  created_by text DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create paid_users table for enrollment tracking
CREATE TABLE IF NOT EXISTS paid_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- User Information
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  age integer,
  qualification text,
  state text NOT NULL,
  pincode text NOT NULL,
  
  -- Course Information
  course_id text NOT NULL,
  course_name text NOT NULL,
  original_price integer NOT NULL,
  
  -- Referral/Coupon Information
  referral_code text,
  referrer_name text,
  discount_percentage integer DEFAULT 0,
  discount_amount integer DEFAULT 0,
  final_price integer NOT NULL,
  
  -- Payment Information
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed')),
  payment_link text,
  
  -- Tracking
  ip_address text,
  user_agent text,
  enrollment_count integer DEFAULT 1,
  first_enrollment_at timestamptz DEFAULT now(),
  last_enrollment_at timestamptz DEFAULT now(),
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_active ON referral_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_referral_codes_type ON referral_codes(code_type);
CREATE INDEX IF NOT EXISTS idx_referral_codes_usage ON referral_codes(current_usage, max_usage);

CREATE INDEX IF NOT EXISTS idx_paid_users_email ON paid_users(email);
CREATE INDEX IF NOT EXISTS idx_paid_users_phone ON paid_users(phone);
CREATE INDEX IF NOT EXISTS idx_paid_users_referral_code ON paid_users(referral_code);
CREATE INDEX IF NOT EXISTS idx_paid_users_course_id ON paid_users(course_id);
CREATE INDEX IF NOT EXISTS idx_paid_users_payment_status ON paid_users(payment_status);
CREATE INDEX IF NOT EXISTS idx_paid_users_created_at ON paid_users(created_at);

-- Enable Row Level Security
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE paid_users ENABLE ROW LEVEL SECURITY;

-- Policies for referral_codes
CREATE POLICY "Allow public to read active referral codes"
  ON referral_codes
  FOR SELECT
  TO public
  USING (
    is_active = true 
    AND (valid_until IS NULL OR valid_until > now())
    AND (max_usage IS NULL OR current_usage < max_usage)
  );

CREATE POLICY "Allow authenticated users to manage referral codes"
  ON referral_codes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for paid_users
CREATE POLICY "Allow public to insert enrollments"
  ON paid_users
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to update their enrollments"
  ON paid_users
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view all enrollments"
  ON paid_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow users to view their own enrollments"
  ON paid_users
  FOR SELECT
  TO public
  USING (
    email = current_setting('request.jwt.claims', true)::json->>'email' OR
    phone = current_setting('request.jwt.claims', true)::json->>'phone'
  );

-- Add validation constraints
-- Phone number: exactly 10 digits, starting with 6-9 (Indian mobile format)
ALTER TABLE paid_users 
ADD CONSTRAINT paid_users_phone_check 
CHECK (length(phone) = 10 AND phone ~ '^[6-9][0-9]{9}$');

-- Email format validation
ALTER TABLE paid_users 
ADD CONSTRAINT paid_users_email_check 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Pincode validation (6 digits)
ALTER TABLE paid_users 
ADD CONSTRAINT paid_users_pincode_check 
CHECK (length(pincode) = 6 AND pincode ~ '^[0-9]{6}$');

-- Age validation (reasonable range)
ALTER TABLE paid_users 
ADD CONSTRAINT paid_users_age_check 
CHECK (age IS NULL OR (age >= 13 AND age <= 100));

-- Name validation (minimum 2 characters)
ALTER TABLE paid_users 
ADD CONSTRAINT paid_users_name_check 
CHECK (length(trim(name)) >= 2);

-- Referral code validation
ALTER TABLE referral_codes 
ADD CONSTRAINT referral_codes_code_check 
CHECK (length(code) >= 3);

-- Create function to handle duplicate enrollments
CREATE OR REPLACE FUNCTION handle_duplicate_enrollment()
RETURNS TRIGGER AS $$
DECLARE
  existing_record paid_users%ROWTYPE;
BEGIN
  -- Check if user with same email and phone already exists for this course
  SELECT * INTO existing_record 
  FROM paid_users 
  WHERE email = NEW.email AND phone = NEW.phone AND course_id = NEW.course_id
  LIMIT 1;
  
  -- If user exists, update their record instead of creating new one
  IF FOUND THEN
    UPDATE paid_users 
    SET 
      name = NEW.name,
      age = COALESCE(NEW.age, age),
      qualification = COALESCE(NEW.qualification, qualification),
      state = NEW.state,
      pincode = NEW.pincode,
      referral_code = NEW.referral_code,
      referrer_name = NEW.referrer_name,
      discount_percentage = NEW.discount_percentage,
      discount_amount = NEW.discount_amount,
      final_price = NEW.final_price,
      payment_link = NEW.payment_link,
      enrollment_count = enrollment_count + 1,
      last_enrollment_at = now(),
      updated_at = now(),
      ip_address = COALESCE(NEW.ip_address, ip_address),
      user_agent = COALESCE(NEW.user_agent, user_agent)
    WHERE id = existing_record.id;
    
    -- Return NULL to prevent the INSERT
    RETURN NULL;
  END IF;
  
  -- If no existing record, allow the INSERT to proceed
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to handle duplicate enrollments
DROP TRIGGER IF EXISTS handle_duplicate_enrollment_trigger ON paid_users;
CREATE TRIGGER handle_duplicate_enrollment_trigger
  BEFORE INSERT ON paid_users
  FOR EACH ROW
  EXECUTE FUNCTION handle_duplicate_enrollment();

-- Create function to update referral code usage
CREATE OR REPLACE FUNCTION update_referral_usage()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update usage for INSERT operations (new enrollments)
  IF TG_OP = 'INSERT' AND NEW.referral_code IS NOT NULL THEN
    UPDATE referral_codes 
    SET 
      current_usage = current_usage + 1,
      updated_at = now()
    WHERE code = NEW.referral_code AND is_active = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update referral usage
DROP TRIGGER IF EXISTS update_referral_usage_trigger ON paid_users;
CREATE TRIGGER update_referral_usage_trigger
  AFTER INSERT ON paid_users
  FOR EACH ROW
  EXECUTE FUNCTION update_referral_usage();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_enrollment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_referral_codes_updated_at ON referral_codes;
CREATE TRIGGER update_referral_codes_updated_at
    BEFORE UPDATE ON referral_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_enrollment_updated_at();

DROP TRIGGER IF EXISTS update_paid_users_updated_at ON paid_users;
CREATE TRIGGER update_paid_users_updated_at
    BEFORE UPDATE ON paid_users
    FOR EACH ROW
    EXECUTE FUNCTION update_enrollment_updated_at();

-- Insert sample referral/coupon codes for testing
INSERT INTO referral_codes (code, code_type, referrer_name, referrer_email, discount_percentage, description, max_usage) VALUES
('WELCOME50', 'coupon', 'SkillRas Team', 'admin@skillras.com', 50, 'Welcome discount for new students', 100),
('SAVE30', 'coupon', 'SkillRas Team', 'admin@skillras.com', 30, 'Save 30% on all courses', 200),
('STUDENT25', 'coupon', 'SkillRas Team', 'admin@skillras.com', 25, 'Student discount', NULL),
('EARLY40', 'coupon', 'SkillRas Team', 'admin@skillras.com', 40, 'Early bird discount', 50),
('REF001', 'referral', 'John Doe', 'john@example.com', 35, 'Referral code for John Doe', NULL),
('REF002', 'referral', 'Jane Smith', 'jane@example.com', 30, 'Referral code for Jane Smith', NULL),
('AFF001', 'affiliate', 'Tech Blogger', 'blogger@techsite.com', 45, 'Affiliate partner discount', 500),
('AFF002', 'affiliate', 'YouTube Creator', 'creator@youtube.com', 40, 'YouTube influencer code', 300),
('PREMIUM60', 'coupon', 'SkillRas Team', 'admin@skillras.com', 60, 'Premium course discount', 25),
('FLASH35', 'coupon', 'SkillRas Team', 'admin@skillras.com', 35, 'Flash sale discount', 75)
ON CONFLICT (code) DO NOTHING;

-- Create analytics view for enrollments
CREATE OR REPLACE VIEW enrollment_analytics AS
SELECT 
  COUNT(*) as total_enrollments,
  COUNT(DISTINCT email) as unique_users,
  COUNT(CASE WHEN enrollment_count > 1 THEN 1 END) as repeat_enrollments,
  AVG(age) as avg_age,
  COUNT(DISTINCT state) as states_covered,
  COUNT(DISTINCT referral_code) as unique_codes_used,
  AVG(discount_percentage) as avg_discount,
  COUNT(DISTINCT course_id) as courses_enrolled,
  DATE_TRUNC('day', created_at) as enrollment_date,
  COUNT(*) as daily_enrollments
FROM paid_users
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY enrollment_date DESC;

-- Create referral code analytics view
CREATE OR REPLACE VIEW referral_analytics AS
SELECT 
  r.code,
  r.code_type,
  r.referrer_name,
  r.discount_percentage,
  r.current_usage,
  r.max_usage,
  CASE 
    WHEN r.max_usage IS NULL THEN 'Unlimited'
    ELSE ROUND((r.current_usage::decimal / r.max_usage::decimal) * 100, 2)::text || '%'
  END as usage_percentage,
  r.is_active,
  COUNT(p.id) as actual_enrollments,
  SUM(p.discount_amount) as total_discount_given
FROM referral_codes r
LEFT JOIN paid_users p ON r.code = p.referral_code
GROUP BY r.id, r.code, r.code_type, r.referrer_name, r.discount_percentage, r.current_usage, r.max_usage, r.is_active
ORDER BY r.current_usage DESC;

-- Grant access to views for authenticated users
GRANT SELECT ON enrollment_analytics TO authenticated;
GRANT SELECT ON referral_analytics TO authenticated;