/*
  # Freelancing Applications System

  1. New Table
    - `freelancing_applications` - Store user applications for freelancing opportunities

  2. Security
    - Enable RLS on the table
    - Add policies for authenticated users to manage their own applications
    - Allow users to create and read their own applications

  3. Performance
    - Add indexes for efficient querying
    - Optimize for user-specific queries
*/

-- Create freelancing applications table
CREATE TABLE IF NOT EXISTS freelancing_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  contact_number text NOT NULL CHECK (length(contact_number) = 10 AND contact_number ~ '^[0-9]+$'),
  highest_qualification text NOT NULL,
  resume_link text,
  project_link text,
  skills text NOT NULL,
  favorite_course text NOT NULL,
  favorite_course_reason text NOT NULL,
  application_status text DEFAULT 'pending' CHECK (application_status IN ('pending', 'reviewed', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_freelancing_applications_user_id ON freelancing_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_freelancing_applications_status ON freelancing_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_freelancing_applications_created_at ON freelancing_applications(created_at DESC);

-- Enable Row Level Security
ALTER TABLE freelancing_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for freelancing_applications
CREATE POLICY "Users can create their own applications"
  ON freelancing_applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own applications"
  ON freelancing_applications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON freelancing_applications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_freelancing_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_freelancing_applications_updated_at
    BEFORE UPDATE ON freelancing_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_freelancing_applications_updated_at(); 