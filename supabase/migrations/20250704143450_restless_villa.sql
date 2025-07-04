/*
  # Add Payment Link to Referral Codes

  1. Table Updates
    - Add `payment_link` column to `referral_codes` table
    - Update existing sample data with payment links
    - Add validation for payment link format

  2. Features
    - Each referral/coupon code can have its own custom payment link
    - When code is verified, the specific payment link is used
    - Fallback to default payment link if none specified
*/

-- Add payment_link column to referral_codes table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'referral_codes' AND column_name = 'payment_link'
  ) THEN
    ALTER TABLE referral_codes ADD COLUMN payment_link text;
  END IF;
END $$;

-- Add validation constraint for payment link (should be a valid URL)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'referral_codes_payment_link_check'
  ) THEN
    ALTER TABLE referral_codes 
    ADD CONSTRAINT referral_codes_payment_link_check 
    CHECK (payment_link IS NULL OR payment_link ~* '^https?://');
  END IF;
END $$;

-- Update existing referral codes with payment links
UPDATE referral_codes SET payment_link = 'https://rzp.io/rzp/skillras-welcome50' WHERE code = 'WELCOME50';
UPDATE referral_codes SET payment_link = 'https://rzp.io/rzp/skillras-save30' WHERE code = 'SAVE30';
UPDATE referral_codes SET payment_link = 'https://rzp.io/rzp/skillras-student25' WHERE code = 'STUDENT25';
UPDATE referral_codes SET payment_link = 'https://rzp.io/rzp/skillras-early40' WHERE code = 'EARLY40';
UPDATE referral_codes SET payment_link = 'https://rzp.io/rzp/skillras-ref001' WHERE code = 'REF001';
UPDATE referral_codes SET payment_link = 'https://rzp.io/rzp/skillras-ref002' WHERE code = 'REF002';
UPDATE referral_codes SET payment_link = 'https://rzp.io/rzp/skillras-aff001' WHERE code = 'AFF001';
UPDATE referral_codes SET payment_link = 'https://rzp.io/rzp/skillras-aff002' WHERE code = 'AFF002';
UPDATE referral_codes SET payment_link = 'https://rzp.io/rzp/skillras-premium60' WHERE code = 'PREMIUM60';
UPDATE referral_codes SET payment_link = 'https://rzp.io/rzp/skillras-flash35' WHERE code = 'FLASH35';

-- Insert additional sample codes with payment links
INSERT INTO referral_codes (code, code_type, referrer_name, referrer_email, discount_percentage, description, max_usage, payment_link) VALUES
('PRABHAT70', 'referral', 'Prabhat Kumar', 'prabhat@example.com', 70, 'Special referral code from Prabhat', 100, 'https://rzp.io/rzp/skillras-prabhat70'),
('YOUTUBE50', 'affiliate', 'YouTube Channel', 'youtube@skillras.com', 50, 'YouTube subscriber discount', 500, 'https://rzp.io/rzp/skillras-youtube50'),
('INSTAGRAM40', 'affiliate', 'Instagram Page', 'instagram@skillras.com', 40, 'Instagram follower discount', 300, 'https://rzp.io/rzp/skillras-instagram40'),
('FRIEND35', 'referral', 'Friend Referral', 'friend@skillras.com', 35, 'Friend referral program', NULL, 'https://rzp.io/rzp/skillras-friend35'),
('NEWUSER20', 'coupon', 'SkillRas Team', 'admin@skillras.com', 20, 'New user welcome discount', 1000, 'https://rzp.io/rzp/skillras-newuser20')
ON CONFLICT (code) DO UPDATE SET
  payment_link = EXCLUDED.payment_link,
  updated_at = now();

-- Create function to get payment link from referral code
CREATE OR REPLACE FUNCTION get_payment_link_from_code(p_code text)
RETURNS text AS $$
DECLARE
  link text;
BEGIN
  -- Get payment link for the specific code
  SELECT payment_link INTO link
  FROM referral_codes
  WHERE code = p_code AND is_active = true;
  
  -- Return the specific link or a default one
  RETURN COALESCE(link, 'https://rzp.io/rzp/skillras-default');
END;
$$ LANGUAGE plpgsql;

-- Update the referral analytics view to include payment link info
DROP VIEW IF EXISTS referral_analytics;
CREATE OR REPLACE VIEW referral_analytics AS
SELECT 
  r.code,
  r.code_type,
  r.referrer_name,
  r.discount_percentage,
  r.current_usage,
  r.max_usage,
  r.payment_link,
  CASE 
    WHEN r.max_usage IS NULL THEN 'Unlimited'
    ELSE ROUND((r.current_usage::decimal / r.max_usage::decimal) * 100, 2)::text || '%'
  END as usage_percentage,
  r.is_active,
  COUNT(p.id) as actual_enrollments,
  SUM(p.discount_amount) as total_discount_given
FROM referral_codes r
LEFT JOIN paid_users p ON r.code = p.referral_code
GROUP BY r.id, r.code, r.code_type, r.referrer_name, r.discount_percentage, r.current_usage, r.max_usage, r.payment_link, r.is_active
ORDER BY r.current_usage DESC;

-- Grant access to the updated view and function
GRANT SELECT ON referral_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION get_payment_link_from_code(text) TO public;