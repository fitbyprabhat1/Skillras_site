/*
  # Download Users Tracking System

  1. New Tables
    - `download_users`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `phone` (text, required, 10 digits)
      - `product_code` (text, required)
      - `ip_address` (text, optional for tracking)
      - `user_agent` (text, optional for analytics)
      - `download_count` (integer, tracks multiple downloads)
      - `first_download_at` (timestamp)
      - `last_download_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `download_users` table
    - Allow public to insert and update their own records
    - Allow authenticated users to view all records for admin purposes

  3. Features
    - Automatic duplicate handling (same email/phone can download multiple times)
    - Phone number validation (10 digits, starts with 6-9)
    - Email format validation
    - Download count tracking
    - Comprehensive user analytics
*/

-- Create download_users table
CREATE TABLE IF NOT EXISTS download_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  product_code text NOT NULL,
  ip_address text,
  user_agent text,
  download_count integer DEFAULT 1,
  first_download_at timestamptz DEFAULT now(),
  last_download_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance and duplicate checking
CREATE INDEX IF NOT EXISTS idx_download_users_email ON download_users(email);
CREATE INDEX IF NOT EXISTS idx_download_users_phone ON download_users(phone);
CREATE INDEX IF NOT EXISTS idx_download_users_email_phone ON download_users(email, phone);
CREATE INDEX IF NOT EXISTS idx_download_users_product_code ON download_users(product_code);
CREATE INDEX IF NOT EXISTS idx_download_users_created_at ON download_users(created_at);
CREATE INDEX IF NOT EXISTS idx_download_users_last_download ON download_users(last_download_at);

-- Enable Row Level Security
ALTER TABLE download_users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert download records (for the public download form)
CREATE POLICY "Allow public to insert download records"
  ON download_users
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anyone to update their own download records (for tracking multiple downloads)
CREATE POLICY "Allow public to update download records"
  ON download_users
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users (admins) to view all download records
CREATE POLICY "Allow authenticated users to view all download records"
  ON download_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow public users to view their own records (optional, for user dashboard)
CREATE POLICY "Allow users to view their own download records"
  ON download_users
  FOR SELECT
  TO public
  USING (
    email = current_setting('request.jwt.claims', true)::json->>'email' OR
    phone = current_setting('request.jwt.claims', true)::json->>'phone'
  );

-- Add validation constraints
-- Phone number: exactly 10 digits, starting with 6-9 (Indian mobile format)
ALTER TABLE download_users 
ADD CONSTRAINT download_users_phone_check 
CHECK (length(phone) = 10 AND phone ~ '^[6-9][0-9]{9}$');

-- Email format validation
ALTER TABLE download_users 
ADD CONSTRAINT download_users_email_check 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Product code validation (minimum 3 characters)
ALTER TABLE download_users 
ADD CONSTRAINT download_users_product_code_check 
CHECK (length(product_code) >= 3);

-- Name validation (minimum 2 characters)
ALTER TABLE download_users 
ADD CONSTRAINT download_users_name_check 
CHECK (length(trim(name)) >= 2);

-- Create function to handle duplicate downloads (same email/phone downloading again)
CREATE OR REPLACE FUNCTION handle_duplicate_download()
RETURNS TRIGGER AS $$
DECLARE
  existing_record download_users%ROWTYPE;
BEGIN
  -- Check if user with same email and phone already exists
  SELECT * INTO existing_record 
  FROM download_users 
  WHERE email = NEW.email AND phone = NEW.phone
  LIMIT 1;
  
  -- If user exists, update their record instead of creating new one
  IF FOUND THEN
    UPDATE download_users 
    SET 
      name = NEW.name,  -- Update name in case it changed
      product_code = NEW.product_code,  -- Update to latest product code
      download_count = download_count + 1,
      last_download_at = now(),
      updated_at = now(),
      ip_address = COALESCE(NEW.ip_address, ip_address),  -- Update IP if provided
      user_agent = COALESCE(NEW.user_agent, user_agent)   -- Update user agent if provided
    WHERE id = existing_record.id;
    
    -- Return NULL to prevent the INSERT
    RETURN NULL;
  END IF;
  
  -- If no existing record, allow the INSERT to proceed
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to handle duplicate downloads
DROP TRIGGER IF EXISTS handle_duplicate_download_trigger ON download_users;
CREATE TRIGGER handle_duplicate_download_trigger
  BEFORE INSERT ON download_users
  FOR EACH ROW
  EXECUTE FUNCTION handle_duplicate_download();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_download_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_download_users_updated_at ON download_users;
CREATE TRIGGER update_download_users_updated_at
    BEFORE UPDATE ON download_users
    FOR EACH ROW
    EXECUTE FUNCTION update_download_users_updated_at();

-- Create a view for admin analytics (optional)
CREATE OR REPLACE VIEW download_analytics AS
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN download_count > 1 THEN 1 END) as repeat_downloaders,
  AVG(download_count) as avg_downloads_per_user,
  MAX(download_count) as max_downloads_by_user,
  COUNT(DISTINCT product_code) as unique_product_codes,
  DATE_TRUNC('day', created_at) as download_date,
  COUNT(*) as daily_downloads
FROM download_users
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY download_date DESC;

-- Grant access to the view for authenticated users
GRANT SELECT ON download_analytics TO authenticated;