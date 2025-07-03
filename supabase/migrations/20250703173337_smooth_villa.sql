/*
  # Payment Form and Coupon/Affiliate Code System

  1. New Tables
    - `coupon_affiliate_codes` - Stores manually created codes with details
    - `payment_form_submissions` - Stores user data from payment form
    
  2. Features
    - Coupon/Affiliate code verification
    - Comprehensive user data collection
    - Usage tracking and analytics
    - Duplicate submission handling
    
  3. Security
    - Enable RLS on all tables
    - Public can verify codes and submit forms
    - Authenticated users can manage codes and view submissions
*/

-- Create coupon_affiliate_codes table for manual code management
CREATE TABLE IF NOT EXISTS coupon_affiliate_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  code_type text NOT NULL CHECK (code_type IN ('coupon', 'affiliate', 'referral')),
  discount_percentage integer,
  discount_amount integer,
  description text,
  affiliate_name text,
  affiliate_email text,
  max_usage integer,
  current_usage integer DEFAULT 0,
  is_active boolean DEFAULT true,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  created_by text DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payment_form_submissions table for user data
CREATE TABLE IF NOT EXISTS payment_form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Basic Info
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  age integer,
  qualification text,
  state text NOT NULL,
  pincode text NOT NULL,
  
  -- Code Info
  code_used text NOT NULL,
  code_type text,
  discount_applied integer DEFAULT 0,
  
  -- Tracking
  ip_address text,
  user_agent text,
  submission_count integer DEFAULT 1,
  first_submission_at timestamptz DEFAULT now(),
  last_submission_at timestamptz DEFAULT now(),
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_coupon_affiliate_codes_code ON coupon_affiliate_codes(code);
CREATE INDEX IF NOT EXISTS idx_coupon_affiliate_codes_type ON coupon_affiliate_codes(code_type);
CREATE INDEX IF NOT EXISTS idx_coupon_affiliate_codes_active ON coupon_affiliate_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_coupon_affiliate_codes_usage ON coupon_affiliate_codes(current_usage, max_usage);

CREATE INDEX IF NOT EXISTS idx_payment_submissions_email ON payment_form_submissions(email);
CREATE INDEX IF NOT EXISTS idx_payment_submissions_phone ON payment_form_submissions(phone);
CREATE INDEX IF NOT EXISTS idx_payment_submissions_code ON payment_form_submissions(code_used);
CREATE INDEX IF NOT EXISTS idx_payment_submissions_state ON payment_form_submissions(state);
CREATE INDEX IF NOT EXISTS idx_payment_submissions_date ON payment_form_submissions(created_at);

-- Enable Row Level Security
ALTER TABLE coupon_affiliate_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_form_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for coupon_affiliate_codes
CREATE POLICY "Allow public to read active codes"
  ON coupon_affiliate_codes
  FOR SELECT
  TO public
  USING (
    is_active = true 
    AND (valid_until IS NULL OR valid_until > now())
    AND (max_usage IS NULL OR current_usage < max_usage)
  );

CREATE POLICY "Allow authenticated users to manage codes"
  ON coupon_affiliate_codes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for payment_form_submissions
CREATE POLICY "Allow public to insert submissions"
  ON payment_form_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to update their submissions"
  ON payment_form_submissions
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view all submissions"
  ON payment_form_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow users to view their own submissions"
  ON payment_form_submissions
  FOR SELECT
  TO public
  USING (
    email = current_setting('request.jwt.claims', true)::json->>'email' OR
    phone = current_setting('request.jwt.claims', true)::json->>'phone'
  );

-- Add validation constraints
-- Phone number: exactly 10 digits, starting with 6-9 (Indian mobile format)
ALTER TABLE payment_form_submissions 
ADD CONSTRAINT payment_submissions_phone_check 
CHECK (length(phone) = 10 AND phone ~ '^[6-9][0-9]{9}$');

-- Email format validation
ALTER TABLE payment_form_submissions 
ADD CONSTRAINT payment_submissions_email_check 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Pincode validation (6 digits)
ALTER TABLE payment_form_submissions 
ADD CONSTRAINT payment_submissions_pincode_check 
CHECK (length(pincode) = 6 AND pincode ~ '^[0-9]{6}$');

-- Age validation (reasonable range)
ALTER TABLE payment_form_submissions 
ADD CONSTRAINT payment_submissions_age_check 
CHECK (age IS NULL OR (age >= 13 AND age <= 100));

-- Name validation (minimum 2 characters)
ALTER TABLE payment_form_submissions 
ADD CONSTRAINT payment_submissions_name_check 
CHECK (length(trim(name)) >= 2);

-- Code validation (minimum 3 characters)
ALTER TABLE payment_form_submissions 
ADD CONSTRAINT payment_submissions_code_check 
CHECK (length(code_used) >= 3);

-- Coupon code validation
ALTER TABLE coupon_affiliate_codes 
ADD CONSTRAINT coupon_codes_code_check 
CHECK (length(code) >= 3);

-- Discount validation
ALTER TABLE coupon_affiliate_codes 
ADD CONSTRAINT coupon_codes_discount_check 
CHECK (
  (discount_percentage IS NULL OR (discount_percentage > 0 AND discount_percentage <= 100)) AND
  (discount_amount IS NULL OR discount_amount > 0) AND
  NOT (discount_percentage IS NOT NULL AND discount_amount IS NOT NULL)
);

-- Create function to handle duplicate submissions
CREATE OR REPLACE FUNCTION handle_duplicate_payment_submission()
RETURNS TRIGGER AS $$
DECLARE
  existing_record payment_form_submissions%ROWTYPE;
BEGIN
  -- Check if user with same email and phone already exists
  SELECT * INTO existing_record 
  FROM payment_form_submissions 
  WHERE email = NEW.email AND phone = NEW.phone
  LIMIT 1;
  
  -- If user exists, update their record instead of creating new one
  IF FOUND THEN
    UPDATE payment_form_submissions 
    SET 
      name = NEW.name,
      age = COALESCE(NEW.age, age),
      qualification = COALESCE(NEW.qualification, qualification),
      state = NEW.state,
      pincode = NEW.pincode,
      code_used = NEW.code_used,
      code_type = NEW.code_type,
      discount_applied = NEW.discount_applied,
      submission_count = submission_count + 1,
      last_submission_at = now(),
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

-- Create trigger to handle duplicate submissions
DROP TRIGGER IF EXISTS handle_duplicate_payment_submission_trigger ON payment_form_submissions;
CREATE TRIGGER handle_duplicate_payment_submission_trigger
  BEFORE INSERT ON payment_form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION handle_duplicate_payment_submission();

-- Create function to update code usage when form is submitted
CREATE OR REPLACE FUNCTION update_code_usage()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update usage for INSERT operations (new submissions)
  IF TG_OP = 'INSERT' THEN
    UPDATE coupon_affiliate_codes 
    SET 
      current_usage = current_usage + 1,
      updated_at = now()
    WHERE code = NEW.code_used AND is_active = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update code usage
DROP TRIGGER IF EXISTS update_code_usage_trigger ON payment_form_submissions;
CREATE TRIGGER update_code_usage_trigger
  AFTER INSERT ON payment_form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_code_usage();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_payment_tables_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_coupon_codes_updated_at ON coupon_affiliate_codes;
CREATE TRIGGER update_coupon_codes_updated_at
    BEFORE UPDATE ON coupon_affiliate_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_tables_updated_at();

DROP TRIGGER IF EXISTS update_payment_submissions_updated_at ON payment_form_submissions;
CREATE TRIGGER update_payment_submissions_updated_at
    BEFORE UPDATE ON payment_form_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_tables_updated_at();

-- Insert sample coupon/affiliate codes for testing
INSERT INTO coupon_affiliate_codes (code, code_type, discount_percentage, description, max_usage) VALUES
('WELCOME50', 'coupon', 50, 'Welcome discount for new users', 100),
('SAVE30', 'coupon', 30, 'Save 30% on all courses', 200),
('STUDENT20', 'coupon', 20, 'Student discount', NULL),
('EARLY25', 'coupon', 25, 'Early bird discount', 50),
('REF001', 'referral', 40, 'Referral code for John Doe', NULL),
('REF002', 'referral', 35, 'Referral code for Jane Smith', NULL),
('AFF001', 'affiliate', 45, 'Affiliate partner discount', 500),
('AFF002', 'affiliate', 40, 'Social media influencer code', 300),
('PREMIUM60', 'coupon', 60, 'Premium course discount', 25),
('FLASH40', 'coupon', 40, 'Flash sale discount', 75)
ON CONFLICT (code) DO NOTHING;

-- Create analytics view for payment submissions
CREATE OR REPLACE VIEW payment_submission_analytics AS
SELECT 
  COUNT(*) as total_submissions,
  COUNT(DISTINCT email) as unique_users,
  COUNT(CASE WHEN submission_count > 1 THEN 1 END) as repeat_submissions,
  AVG(age) as avg_age,
  COUNT(DISTINCT state) as states_covered,
  COUNT(DISTINCT code_used) as unique_codes_used,
  AVG(discount_applied) as avg_discount,
  DATE_TRUNC('day', created_at) as submission_date,
  COUNT(*) as daily_submissions
FROM payment_form_submissions
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY submission_date DESC;

-- Create code usage analytics view
CREATE OR REPLACE VIEW code_usage_analytics AS
SELECT 
  c.code,
  c.code_type,
  c.discount_percentage,
  c.discount_amount,
  c.current_usage,
  c.max_usage,
  CASE 
    WHEN c.max_usage IS NULL THEN 'Unlimited'
    ELSE ROUND((c.current_usage::decimal / c.max_usage::decimal) * 100, 2)::text || '%'
  END as usage_percentage,
  c.is_active,
  COUNT(p.id) as actual_submissions
FROM coupon_affiliate_codes c
LEFT JOIN payment_form_submissions p ON c.code = p.code_used
GROUP BY c.id, c.code, c.code_type, c.discount_percentage, c.discount_amount, c.current_usage, c.max_usage, c.is_active
ORDER BY c.current_usage DESC;

-- Grant access to views for authenticated users
GRANT SELECT ON payment_submission_analytics TO authenticated;
GRANT SELECT ON code_usage_analytics TO authenticated;