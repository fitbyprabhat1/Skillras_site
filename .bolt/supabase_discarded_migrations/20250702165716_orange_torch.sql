/*
  # Payment System with Coupon Codes and KYC

  1. New Tables
    - `coupon_codes` - Store coupon codes with discount percentages
    - `payment_links` - Store different payment links for different discount tiers
    - `user_kyc` - Store KYC information for Indian compliance
    - `course_enrollments` - Track course enrollments with payment details
    - `payment_transactions` - Track all payment attempts and completions

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control

  3. Sample Data
    - Insert sample coupon codes
    - Insert payment links for different discount tiers
*/

-- Coupon codes table
CREATE TABLE IF NOT EXISTS coupon_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_percentage integer NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  max_usage integer DEFAULT NULL, -- NULL means unlimited usage
  current_usage integer DEFAULT 0,
  is_active boolean DEFAULT true,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz DEFAULT NULL,
  created_by text DEFAULT 'admin',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payment links for different discount tiers
CREATE TABLE IF NOT EXISTS payment_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_tier integer NOT NULL UNIQUE CHECK (discount_tier IN (20, 40, 50, 70)),
  payment_url text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- KYC information table (Indian compliance)
CREATE TABLE IF NOT EXISTS user_kyc (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL CHECK (length(phone) = 10 AND phone ~ '^[6-9][0-9]{9}$'),
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  address_line_1 text NOT NULL,
  address_line_2 text,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL CHECK (length(pincode) = 6 AND pincode ~ '^[0-9]{6}$'),
  country text DEFAULT 'India',
  pan_number text CHECK (pan_number ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'),
  aadhar_number text CHECK (aadhar_number ~ '^[0-9]{12}$'),
  occupation text,
  annual_income_range text CHECK (annual_income_range IN ('below_2_lakh', '2_5_lakh', '5_10_lakh', '10_25_lakh', 'above_25_lakh')),
  kyc_status text DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  kyc_verified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Course enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  package_type text, -- 'single_course' or 'package'
  original_price integer NOT NULL,
  coupon_code text REFERENCES coupon_codes(code),
  discount_percentage integer DEFAULT 0,
  final_price integer NOT NULL,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_link_used text,
  enrollment_date timestamptz DEFAULT now(),
  payment_completed_at timestamptz,
  access_granted_at timestamptz,
  UNIQUE(user_id, course_id)
);

-- Payment transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid REFERENCES course_enrollments(id) ON DELETE CASCADE,
  transaction_id text UNIQUE,
  payment_method text,
  amount integer NOT NULL,
  currency text DEFAULT 'INR',
  status text DEFAULT 'initiated' CHECK (status IN ('initiated', 'pending', 'success', 'failed', 'cancelled')),
  gateway_response jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE coupon_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_kyc ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coupon_codes
CREATE POLICY "Allow public to read active coupon codes"
  ON coupon_codes FOR SELECT
  TO public
  USING (is_active = true AND (valid_until IS NULL OR valid_until > now()));

CREATE POLICY "Allow authenticated users to manage coupon codes"
  ON coupon_codes FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for payment_links
CREATE POLICY "Allow public to read active payment links"
  ON payment_links FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage payment links"
  ON payment_links FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for user_kyc
CREATE POLICY "Users can manage their own KYC"
  ON user_kyc FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for course_enrollments
CREATE POLICY "Users can view their own enrollments"
  ON course_enrollments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrollments"
  ON course_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments"
  ON course_enrollments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for payment_transactions
CREATE POLICY "Users can view their own transactions"
  ON payment_transactions FOR SELECT
  TO authenticated
  USING (
    enrollment_id IN (
      SELECT id FROM course_enrollments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own transactions"
  ON payment_transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    enrollment_id IN (
      SELECT id FROM course_enrollments WHERE user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_coupon_codes_code ON coupon_codes(code);
CREATE INDEX IF NOT EXISTS idx_coupon_codes_active ON coupon_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_payment_links_tier ON payment_links(discount_tier);
CREATE INDEX IF NOT EXISTS idx_user_kyc_user_id ON user_kyc(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_enrollment_id ON payment_transactions(enrollment_id);

-- Insert sample coupon codes
INSERT INTO coupon_codes (code, discount_percentage, max_usage, created_by) VALUES
('PRABHAT100', 70, 100, 'admin'),
('WELCOME20', 20, 500, 'admin'),
('STUDENT40', 40, 200, 'admin'),
('PREMIUM50', 50, 50, 'admin'),
('EARLYBIRD30', 30, 300, 'admin'),
('NEWUSER25', 25, 1000, 'admin')
ON CONFLICT (code) DO NOTHING;

-- Insert payment links for different discount tiers
INSERT INTO payment_links (discount_tier, payment_url, description) VALUES
(20, 'https://rzp.io/rzp/skillras-20', 'Payment link for 20% discount'),
(40, 'https://rzp.io/rzp/skillras-40', 'Payment link for 40% discount'),
(50, 'https://rzp.io/rzp/skillras-50', 'Payment link for 50% discount'),
(70, 'https://rzp.io/rzp/skillras-70', 'Payment link for 70% discount')
ON CONFLICT (discount_tier) DO NOTHING;

-- Function to validate and apply coupon code
CREATE OR REPLACE FUNCTION apply_coupon_code(
  p_code text,
  p_user_id uuid,
  p_original_price integer
) RETURNS jsonb AS $$
DECLARE
  coupon_record coupon_codes%ROWTYPE;
  discount_amount integer;
  final_price integer;
BEGIN
  -- Get coupon details
  SELECT * INTO coupon_record
  FROM coupon_codes
  WHERE code = p_code
    AND is_active = true
    AND (valid_until IS NULL OR valid_until > now())
    AND (max_usage IS NULL OR current_usage < max_usage);
  
  -- Check if coupon exists and is valid
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Invalid or expired coupon code'
    );
  END IF;
  
  -- Calculate discount
  discount_amount := FLOOR(p_original_price * coupon_record.discount_percentage / 100.0);
  final_price := p_original_price - discount_amount;
  
  -- Update coupon usage
  UPDATE coupon_codes
  SET current_usage = current_usage + 1,
      updated_at = now()
  WHERE code = p_code;
  
  RETURN jsonb_build_object(
    'success', true,
    'discount_percentage', coupon_record.discount_percentage,
    'discount_amount', discount_amount,
    'final_price', final_price,
    'original_price', p_original_price
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get payment link based on discount tier
CREATE OR REPLACE FUNCTION get_payment_link(p_discount_percentage integer)
RETURNS text AS $$
DECLARE
  payment_url text;
  tier integer;
BEGIN
  -- Determine tier based on discount percentage
  tier := CASE
    WHEN p_discount_percentage >= 70 THEN 70
    WHEN p_discount_percentage >= 50 THEN 50
    WHEN p_discount_percentage >= 40 THEN 40
    ELSE 20
  END;
  
  -- Get payment link for the tier
  SELECT payment_links.payment_url INTO payment_url
  FROM payment_links
  WHERE discount_tier = tier AND is_active = true;
  
  RETURN COALESCE(payment_url, 'https://rzp.io/rzp/skillras-default');
END;
$$ LANGUAGE plpgsql;