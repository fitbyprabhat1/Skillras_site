/*
  # Remove Authentication Requirements from Payment System

  1. Changes
    - Remove user_id foreign key constraints that require authentication
    - Update RLS policies to allow anonymous access
    - Modify functions to work without user authentication
    - Add email field to enrollments for tracking without auth

  2. Security
    - Still maintain data integrity
    - Allow anonymous users to complete payments
    - Track users by email instead of auth.users
*/

-- Drop existing foreign key constraints that require authentication
ALTER TABLE user_kyc DROP CONSTRAINT IF EXISTS user_kyc_user_id_fkey;
ALTER TABLE course_enrollments DROP CONSTRAINT IF EXISTS course_enrollments_user_id_fkey;

-- Modify user_kyc table to work without authentication
ALTER TABLE user_kyc ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE user_kyc ADD COLUMN IF NOT EXISTS session_id text;

-- Modify course_enrollments table to work without authentication  
ALTER TABLE course_enrollments ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS session_id text;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can manage their own KYC" ON user_kyc;
DROP POLICY IF EXISTS "Users can view their own enrollments" ON course_enrollments;
DROP POLICY IF EXISTS "Users can create their own enrollments" ON course_enrollments;
DROP POLICY IF EXISTS "Users can update their own enrollments" ON course_enrollments;
DROP POLICY IF EXISTS "Users can view their own transactions" ON payment_transactions;
DROP POLICY IF EXISTS "Users can create their own transactions" ON payment_transactions;

-- Create new RLS policies that allow anonymous access
CREATE POLICY "Allow anonymous KYC submissions"
  ON user_kyc FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous course enrollments"
  ON course_enrollments FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous payment transactions"
  ON payment_transactions FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Update the apply_coupon_code function to work without authentication
CREATE OR REPLACE FUNCTION apply_coupon_code(
  p_code text,
  p_user_email text DEFAULT NULL,
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

-- Create indexes for the new fields
CREATE INDEX IF NOT EXISTS idx_course_enrollments_email ON course_enrollments(customer_email);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_session ON course_enrollments(session_id);
CREATE INDEX IF NOT EXISTS idx_user_kyc_email ON user_kyc(email);
CREATE INDEX IF NOT EXISTS idx_user_kyc_session ON user_kyc(session_id);