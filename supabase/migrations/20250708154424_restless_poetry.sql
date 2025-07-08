/*
  # Comprehensive Course Management System

  1. New Tables
    - `courses` - Main course information with enhanced metadata
    - `course_sections` - Course sections/modules organization
    - `course_chapters` - Individual lessons within sections
    - `course_benefits` - Course benefits and features
    - `course_testimonials` - Student testimonials
    - `course_pricing_plans` - Pricing tiers for courses
    - `course_faqs` - Frequently asked questions
    - `course_results_images` - Before/after or result showcase images
    - `course_enrollments` - Student enrollment tracking
    - `course_progress` - Student progress tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access and admin management
    - Implement role-based access control

  3. Performance
    - Add comprehensive indexes
    - Optimize for real-time subscriptions
    - Enable efficient pagination
*/

-- Create enum types
CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'cancelled');

-- Main courses table
CREATE TABLE IF NOT EXISTS courses (
  course_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(255) NOT NULL,
  description text NOT NULL,
  instructor_name varchar(255) NOT NULL,
  price decimal(10,2) NOT NULL,
  original_price decimal(10,2),
  duration varchar(50) NOT NULL, -- e.g., "35 hours", "8 weeks"
  skill_level skill_level NOT NULL DEFAULT 'beginner',
  category varchar(100) NOT NULL,
  thumbnail_image varchar(500),
  featured_status boolean DEFAULT false,
  is_published boolean DEFAULT false,
  course_status course_status DEFAULT 'draft',
  students_count integer DEFAULT 0,
  average_rating decimal(3,2) DEFAULT 0.0,
  total_lessons integer DEFAULT 0,
  is_popular boolean DEFAULT false,
  is_coming_soon boolean DEFAULT false,
  last_updated_date timestamptz DEFAULT now(),
  creation_date timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Course sections (modules)
CREATE TABLE IF NOT EXISTS course_sections (
  section_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  section_title varchar(255) NOT NULL,
  section_description text,
  order_number integer NOT NULL,
  duration varchar(50), -- e.g., "1 week"
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(course_id, order_number)
);

-- Course chapters (individual lessons)
CREATE TABLE IF NOT EXISTS course_chapters (
  chapter_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES course_sections(section_id) ON DELETE CASCADE,
  chapter_title varchar(255) NOT NULL,
  chapter_description text,
  video_id varchar(100), -- YouTube video ID
  duration varchar(20), -- e.g., "45 min"
  order_number integer NOT NULL,
  is_preview boolean DEFAULT false,
  is_locked boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section_id, order_number)
);

-- Course benefits
CREATE TABLE IF NOT EXISTS course_benefits (
  benefit_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  description text NOT NULL,
  icon_name varchar(50), -- Lucide icon name
  order_number integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, order_number)
);

-- Course testimonials
CREATE TABLE IF NOT EXISTS course_testimonials (
  testimonial_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  student_name varchar(255) NOT NULL,
  student_role varchar(255),
  content text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  student_image varchar(500),
  order_number integer NOT NULL,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, order_number)
);

-- Course pricing plans
CREATE TABLE IF NOT EXISTS course_pricing_plans (
  plan_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  plan_name varchar(100) NOT NULL,
  plan_description text,
  price decimal(10,2) NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  is_featured boolean DEFAULT false,
  order_number integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, order_number)
);

-- Course FAQs
CREATE TABLE IF NOT EXISTS course_faqs (
  faq_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  order_number integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, order_number)
);

-- Course results images
CREATE TABLE IF NOT EXISTS course_results_images (
  image_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  title varchar(255),
  image_url varchar(500) NOT NULL,
  description text,
  order_number integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, order_number)
);

-- Course enrollments
CREATE TABLE IF NOT EXISTS course_enrollments (
  enrollment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
  enrollment_status enrollment_status DEFAULT 'active',
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  UNIQUE(user_id, course_id)
);

-- Course progress tracking
CREATE TABLE IF NOT EXISTS course_progress (
  progress_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id uuid NOT NULL REFERENCES course_chapters(chapter_id) ON DELETE CASCADE,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  watch_time_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, chapter_id)
);

-- Create comprehensive indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published, creation_date DESC);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category, is_published);
CREATE INDEX IF NOT EXISTS idx_courses_featured ON courses(featured_status, is_published);
CREATE INDEX IF NOT EXISTS idx_courses_popular ON courses(is_popular, is_published);
CREATE INDEX IF NOT EXISTS idx_courses_skill_level ON courses(skill_level, is_published);

CREATE INDEX IF NOT EXISTS idx_course_sections_course_order ON course_sections(course_id, order_number);
CREATE INDEX IF NOT EXISTS idx_course_chapters_section_order ON course_chapters(section_id, order_number);
CREATE INDEX IF NOT EXISTS idx_course_benefits_course_order ON course_benefits(course_id, order_number);
CREATE INDEX IF NOT EXISTS idx_course_testimonials_course_order ON course_testimonials(course_id, order_number);
CREATE INDEX IF NOT EXISTS idx_course_pricing_course_order ON course_pricing_plans(course_id, order_number);
CREATE INDEX IF NOT EXISTS idx_course_faqs_course_order ON course_faqs(course_id, order_number);
CREATE INDEX IF NOT EXISTS idx_course_results_course_order ON course_results_images(course_id, order_number);

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON course_enrollments(user_id, enrollment_status);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON course_enrollments(course_id, enrollment_status);
CREATE INDEX IF NOT EXISTS idx_progress_user_chapter ON course_progress(user_id, chapter_id);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_results_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Allow public to read published courses"
  ON courses FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Allow authenticated users to manage courses"
  ON courses FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for course_sections
CREATE POLICY "Allow public to read sections of published courses"
  ON course_sections FOR SELECT
  TO public
  USING (
    course_id IN (SELECT course_id FROM courses WHERE is_published = true)
  );

CREATE POLICY "Allow authenticated users to manage sections"
  ON course_sections FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for course_chapters
CREATE POLICY "Allow public to read chapters of published courses"
  ON course_chapters FOR SELECT
  TO public
  USING (
    section_id IN (
      SELECT section_id FROM course_sections 
      WHERE course_id IN (SELECT course_id FROM courses WHERE is_published = true)
    )
  );

CREATE POLICY "Allow authenticated users to manage chapters"
  ON course_chapters FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for course_benefits
CREATE POLICY "Allow public to read benefits of published courses"
  ON course_benefits FOR SELECT
  TO public
  USING (
    course_id IN (SELECT course_id FROM courses WHERE is_published = true)
  );

CREATE POLICY "Allow authenticated users to manage benefits"
  ON course_benefits FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for course_testimonials
CREATE POLICY "Allow public to read testimonials of published courses"
  ON course_testimonials FOR SELECT
  TO public
  USING (
    course_id IN (SELECT course_id FROM courses WHERE is_published = true)
  );

CREATE POLICY "Allow authenticated users to manage testimonials"
  ON course_testimonials FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for course_pricing_plans
CREATE POLICY "Allow public to read pricing of published courses"
  ON course_pricing_plans FOR SELECT
  TO public
  USING (
    course_id IN (SELECT course_id FROM courses WHERE is_published = true)
  );

CREATE POLICY "Allow authenticated users to manage pricing"
  ON course_pricing_plans FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for course_faqs
CREATE POLICY "Allow public to read FAQs of published courses"
  ON course_faqs FOR SELECT
  TO public
  USING (
    course_id IN (SELECT course_id FROM courses WHERE is_published = true)
  );

CREATE POLICY "Allow authenticated users to manage FAQs"
  ON course_faqs FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for course_results_images
CREATE POLICY "Allow public to read results of published courses"
  ON course_results_images FOR SELECT
  TO public
  USING (
    course_id IN (SELECT course_id FROM courses WHERE is_published = true)
  );

CREATE POLICY "Allow authenticated users to manage results"
  ON course_results_images FOR ALL
  TO authenticated
  USING (true);

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

-- RLS Policies for course_progress
CREATE POLICY "Users can manage their own progress"
  ON course_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_sections_updated_at
    BEFORE UPDATE ON course_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_chapters_updated_at
    BEFORE UPDATE ON course_chapters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_progress_updated_at
    BEFORE UPDATE ON course_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update course statistics
CREATE OR REPLACE FUNCTION update_course_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total lessons count
    UPDATE courses 
    SET total_lessons = (
        SELECT COUNT(*)
        FROM course_chapters cc
        JOIN course_sections cs ON cc.section_id = cs.section_id
        WHERE cs.course_id = COALESCE(NEW.course_id, OLD.course_id)
    ),
    students_count = (
        SELECT COUNT(*)
        FROM course_enrollments
        WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
        AND enrollment_status = 'active'
    )
    WHERE course_id = COALESCE(NEW.course_id, OLD.course_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update course stats
CREATE TRIGGER update_course_stats_on_chapter_change
    AFTER INSERT OR UPDATE OR DELETE ON course_chapters
    FOR EACH ROW
    EXECUTE FUNCTION update_course_stats();

CREATE TRIGGER update_course_stats_on_enrollment_change
    AFTER INSERT OR UPDATE OR DELETE ON course_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_course_stats();