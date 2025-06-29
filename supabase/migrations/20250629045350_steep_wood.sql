/*
  # Complete Course and Trial System Setup

  1. New Tables
    - `trial_chapters` - Free trial content available to all users
    - `user_course_access` - Track user access to different courses
  
  2. Enhanced Tables
    - `courses` - Added trial and metadata columns
    - `chapters` - Added video integration and preview capabilities
    - `modules` - Course organization structure
  
  3. Sample Data
    - Sample courses with different pricing tiers
    - Trial chapters with YouTube video integration
    - Course modules and chapters structure
  
  4. Security
    - Enable RLS on new tables
    - Add policies for proper access control
    - Create indexes for performance
*/

-- Update courses table with trial and access information
DO $$
BEGIN
  -- Add trial-related columns to courses table
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'is_trial'
  ) THEN
    ALTER TABLE courses ADD COLUMN is_trial BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'trial_description'
  ) THEN
    ALTER TABLE courses ADD COLUMN trial_description TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'difficulty_level'
  ) THEN
    ALTER TABLE courses ADD COLUMN difficulty_level TEXT DEFAULT 'Beginner';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'duration_weeks'
  ) THEN
    ALTER TABLE courses ADD COLUMN duration_weeks INTEGER DEFAULT 4;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'total_lessons'
  ) THEN
    ALTER TABLE courses ADD COLUMN total_lessons INTEGER DEFAULT 0;
  END IF;
END $$;

-- Enhanced trial_chapters table (separate from paid course content)
CREATE TABLE IF NOT EXISTS trial_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  video_id TEXT, -- YouTube video ID
  is_locked BOOLEAN DEFAULT false,
  "order" INTEGER NOT NULL, -- Using "order" to match existing pattern
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User course access tracking
CREATE TABLE IF NOT EXISTS user_course_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  access_type TEXT NOT NULL CHECK (access_type IN ('trial', 'full', 'premium')),
  granted_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- Enhanced chapters table with better organization
DO $$
BEGIN
  -- Add video_id column for YouTube integration
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chapters' AND column_name = 'video_id'
  ) THEN
    ALTER TABLE chapters ADD COLUMN video_id TEXT;
  END IF;

  -- Add is_preview column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chapters' AND column_name = 'is_preview'
  ) THEN
    ALTER TABLE chapters ADD COLUMN is_preview BOOLEAN DEFAULT false;
  END IF;

  -- Add difficulty level
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chapters' AND column_name = 'difficulty'
  ) THEN
    ALTER TABLE chapters ADD COLUMN difficulty TEXT DEFAULT 'Beginner';
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE trial_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_access ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access" ON trial_chapters;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON trial_chapters;
DROP POLICY IF EXISTS "Users can view own course access" ON user_course_access;
DROP POLICY IF EXISTS "Users can manage own course access" ON user_course_access;

-- RLS Policies for trial_chapters
CREATE POLICY "Allow public read access"
  ON trial_chapters FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users full access"
  ON trial_chapters FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for user_course_access
CREATE POLICY "Users can view own course access"
  ON user_course_access FOR SELECT
  TO authenticated
  USING (user_id = (SELECT user_id FROM user_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage own course access"
  ON user_course_access FOR ALL
  TO authenticated
  USING (user_id = (SELECT user_id FROM user_profiles WHERE user_id = auth.uid()));

-- Insert sample courses
INSERT INTO courses (id, title, description, price, is_trial, trial_description, difficulty_level, duration_weeks, total_lessons) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Premiere Pro Mastery: Complete Course', 'Master Adobe Premiere Pro with step-by-step guidance and real-world projects', 9999, false, 'Get a taste of professional video editing with our free trial chapters', 'Beginner to Advanced', 5, 26),
('550e8400-e29b-41d4-a716-446655440002', 'Advanced Video Editing Techniques', 'Take your editing skills to the next level with advanced techniques and workflows', 14999, false, 'Learn advanced editing concepts in this comprehensive course', 'Intermediate to Advanced', 4, 20),
('550e8400-e29b-41d4-a716-446655440003', 'Social Media Video Creation', 'Create engaging content for Instagram, TikTok, and YouTube', 7999, false, 'Master social media video creation with platform-specific techniques', 'Beginner', 3, 15)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  is_trial = EXCLUDED.is_trial,
  trial_description = EXCLUDED.trial_description,
  difficulty_level = EXCLUDED.difficulty_level,
  duration_weeks = EXCLUDED.duration_weeks,
  total_lessons = EXCLUDED.total_lessons;

-- Insert trial chapters (free content available to all users) - Using "order" column
INSERT INTO trial_chapters (title, description, duration, video_id, is_locked, "order") VALUES 
('Welcome to the Masterclass', 'By the end of this video, you''ll know exactly why this Premiere Pro Masterclass is your ticket to creating jaw-dropping videos that stand out.', '3 minutes', '8i34DE0Efec', false, 1),
('What You''ll Be Able to Do After 30 Days', 'By the end of this video, you''ll know exactly what badass video editing skills you''ll have in just 30 days.', '3 minutes', 'Ul45Ze-xgSU', false, 2),
('Software + Setup + Download Links', 'By the end of this video, you''ll know exactly how to set up Premiere Pro like a pro and hit the ground running.', '5 minutes', 'Ul45Ze-xgSU', false, 3),
('How to Get the Most Out of This Course', 'By the end of this video, you''ll know exactly how to crush this Masterclass and become a Premiere Pro pro.', '4 minutes', 'Ul45Ze-xgSU', false, 4),
('Interface + Workspace Setup', 'By the end of this video, you''ll know exactly how to navigate Premiere Pro''s interface and set up your workspace like a pro editor.', '8 minutes', null, true, 5),
('Importing Footage + Organizing Files', 'By the end of this video, you''ll know exactly how to import footage and organize it so you''re never hunting for files mid-edit.', '5 minutes', null, true, 6)
ON CONFLICT DO NOTHING;

-- Insert modules for the main course
INSERT INTO modules (course_id, title, description, order_position) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Video Editing Essentials', 'Kickstart your journey with the basics of video editing. Set up your workspace, learn core principles, and maximize your learning experience.', 1),
('550e8400-e29b-41d4-a716-446655440001', 'Create Compelling Videos', 'Transform raw footage into captivating stories. Master workspace setup, file organization, timeline tools, and export settings.', 2),
('550e8400-e29b-41d4-a716-446655440001', 'Advanced Editing Skills', 'Elevate your edits with pro-level audio, graphics, and effects. Learn to enhance audio, create dynamic titles, and use color grading.', 3),
('550e8400-e29b-41d4-a716-446655440001', 'Social Media Content', 'Produce platform-specific content like Instagram Reels, YouTube vlogs, and client promos.', 4),
('550e8400-e29b-41d4-a716-446655440001', 'Launch Your Career', 'Turn your skills into a thriving career. Build a standout portfolio, price your services, and find clients.', 5)
ON CONFLICT DO NOTHING;

-- Insert sample chapters for the main course
DO $$
DECLARE
  module_1_id UUID;
  module_2_id UUID;
  module_3_id UUID;
BEGIN
  -- Get module IDs
  SELECT id INTO module_1_id FROM modules WHERE course_id = '550e8400-e29b-41d4-a716-446655440001' AND order_position = 1;
  SELECT id INTO module_2_id FROM modules WHERE course_id = '550e8400-e29b-41d4-a716-446655440001' AND order_position = 2;
  SELECT id INTO module_3_id FROM modules WHERE course_id = '550e8400-e29b-41d4-a716-446655440001' AND order_position = 3;

  -- Insert chapters for module 1
  IF module_1_id IS NOT NULL THEN
    INSERT INTO chapters (module_id, title, description, video_id, duration, order_position, is_preview, difficulty) VALUES
    (module_1_id, 'Welcome to Premiere Pro Mastery', 'Get started with the complete course overview and what you''ll achieve', 'PvTcmse6DDY', '45 min', 1, true, 'Beginner'),
    (module_1_id, 'What You''ll Achieve in 30 Days', 'Understand the complete learning path and outcomes', 'dQw4w9WgXcQ', '30 min', 2, false, 'Beginner'),
    (module_1_id, 'Software Setup + Download Links', 'Complete setup guide for Premiere Pro and required tools', 'Ul45Ze-xgSU', '60 min', 3, true, 'Beginner'),
    (module_1_id, 'How to Maximize Your Learning', 'Learn the best practices for getting the most out of this course', 'dQw4w9WgXcQ', '55 min', 4, false, 'Beginner')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Insert chapters for module 2
  IF module_2_id IS NOT NULL THEN
    INSERT INTO chapters (module_id, title, description, video_id, duration, order_position, is_preview, difficulty) VALUES
    (module_2_id, 'Workspace Setup for Efficiency', 'Optimize your Premiere Pro workspace for maximum productivity', 'O0-fVgbijkY', '50 min', 1, true, 'Beginner'),
    (module_2_id, 'Importing and Organizing Footage', 'Master file organization and import workflows', 'dQw4w9WgXcQ', '65 min', 2, false, 'Beginner'),
    (module_2_id, 'Mastering the Timeline and Tools', 'Learn essential timeline navigation and editing tools', 'njUO84_ygo0', '40 min', 3, true, 'Beginner'),
    (module_2_id, 'Your First Edit: Trimming, Cutting, and Arranging Clips', 'Create your first professional edit with proper techniques', 'dQw4w9WgXcQ', '35 min', 4, false, 'Beginner'),
    (module_2_id, 'Adding Music and Voiceovers Like a Pro', 'Professional audio integration techniques', 'dQw4w9WgXcQ', '35 min', 5, false, 'Intermediate'),
    (module_2_id, 'Export Settings for Social Media Success', 'Optimize your exports for different platforms', 'dQw4w9WgXcQ', '35 min', 6, false, 'Beginner')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Insert chapters for module 3
  IF module_3_id IS NOT NULL THEN
    INSERT INTO chapters (module_id, title, description, video_id, duration, order_position, is_preview, difficulty) VALUES
    (module_3_id, 'Cleaning and Enhancing Voice Audio', 'Professional audio cleanup and enhancement techniques', 'jpqETZQZ-mg', '40 min', 1, true, 'Intermediate'),
    (module_3_id, 'Adding Background Music and Sound Effects', 'Create immersive audio experiences', 'dQw4w9WgXcQ', '55 min', 2, false, 'Intermediate'),
    (module_3_id, 'Creating Stunning Titles and Lower Thirds', 'Design professional graphics and text elements', 'dQw4w9WgXcQ', '50 min', 3, false, 'Intermediate'),
    (module_3_id, 'Smooth Transitions and Time-Saving Presets', 'Master transitions and create reusable presets', 'dQw4w9WgXcQ', '60 min', 4, false, 'Intermediate'),
    (module_3_id, 'Color Correction, LUTs, and Grading', 'Professional color grading workflows', 'dQw4w9WgXcQ', '60 min', 5, false, 'Advanced'),
    (module_3_id, 'Speed Ramping and Creative Time Effects', 'Advanced time manipulation techniques', 'dQw4w9WgXcQ', '60 min', 6, false, 'Advanced')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trial_chapters_order ON trial_chapters("order");
CREATE INDEX IF NOT EXISTS idx_user_course_access_user ON user_course_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_access_course ON user_course_access(course_id);
CREATE INDEX IF NOT EXISTS idx_chapters_module ON chapters(module_id);
CREATE INDEX IF NOT EXISTS idx_chapters_order ON chapters(order_position);
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_order ON modules(order_position);

-- Function to grant trial access to new users
CREATE OR REPLACE FUNCTION grant_trial_access_to_user(user_uuid UUID) RETURNS VOID AS $$
BEGIN
  -- Grant trial access to all courses for new users
  INSERT INTO user_course_access (user_id, course_id, access_type)
  SELECT user_uuid, id, 'trial'
  FROM courses
  WHERE is_trial = false
  ON CONFLICT (user_id, course_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;