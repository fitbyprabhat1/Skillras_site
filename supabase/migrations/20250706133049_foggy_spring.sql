/*
  # Authentication Integration

  1. Database Changes
    - Modify users table to integrate with Supabase Auth
    - Add password field and proper constraints
    - Create function to handle new user registration
    - Set up triggers for automatic profile creation

  2. Security
    - Enable RLS on users table
    - Add policies for user data access
    - Ensure users can only access their own data
*/

-- First, let's modify the existing users table to work with Supabase Auth
-- We'll keep the existing structure but add password and integrate with auth.users

-- Add password field to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'password'
  ) THEN
    ALTER TABLE users ADD COLUMN password text;
  END IF;
END $$;

-- Add auth_user_id field to link with Supabase Auth
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'auth_user_id'
  ) THEN
    ALTER TABLE users ADD COLUMN auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Make email and phone unique if not already
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'users_email_unique'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
  END IF;
EXCEPTION
  WHEN duplicate_table THEN
    -- Constraint already exists, ignore
    NULL;
END $$;

-- Add phone validation constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'users_phone_format_check'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_phone_format_check 
    CHECK (phone ~ '^[0-9]{10}$');
  END IF;
EXCEPTION
  WHEN duplicate_table THEN
    -- Constraint already exists, ignore
    NULL;
END $$;

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Allow anyone to insert users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to read users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to update users" ON users;

-- Create new RLS policies
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

-- Allow public access for registration
CREATE POLICY "Allow public registration"
  ON users FOR INSERT
  TO anon
  WITH CHECK (true);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This function will be called when a new user signs up
  -- It creates a profile entry in the users table
  INSERT INTO public.users (auth_user_id, name, email, phone)
  VALUES (NEW.id, '', NEW.email, '');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert some test users for development
-- Note: These will be created through the application's sign-up process
-- This is just for reference of the data structure

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email_auth ON users(email);