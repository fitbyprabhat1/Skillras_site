/*
  # Blog System for SEO

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `slug` (text, unique, for SEO-friendly URLs)
      - `excerpt` (text, short description)
      - `content` (text, full blog content)
      - `featured_image` (text, URL to featured image)
      - `meta_title` (text, SEO title)
      - `meta_description` (text, SEO description)
      - `tags` (text array, for categorization)
      - `published` (boolean, draft/published status)
      - `author_id` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `published_at` (timestamp)
    
    - `blog_categories`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `slug` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)

    - `blog_post_categories`
      - Junction table for many-to-many relationship
      - `post_id` (uuid, references blog_posts)
      - `category_id` (uuid, references blog_categories)

  2. Security
    - Enable RLS on all tables
    - Public read access for published posts
    - Authenticated users can manage their own posts
*/

-- Blog Categories
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  featured_image text,
  meta_title text,
  meta_description text,
  tags text[] DEFAULT '{}',
  published boolean DEFAULT false,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

-- Blog Post Categories (Junction Table)
CREATE TABLE IF NOT EXISTS blog_post_categories (
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id uuid REFERENCES blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Enable RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;

-- Policies for blog_categories
CREATE POLICY "Allow public read access to categories"
  ON blog_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage categories"
  ON blog_categories FOR ALL
  TO authenticated
  USING (true);

-- Policies for blog_posts
CREATE POLICY "Allow public read access to published posts"
  ON blog_posts FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Allow authors to manage their own posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (auth.uid() = author_id);

-- Policies for blog_post_categories
CREATE POLICY "Allow public read access to post categories"
  ON blog_post_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage post categories"
  ON blog_post_categories FOR ALL
  TO authenticated
  USING (true);

-- Insert some default categories
INSERT INTO blog_categories (name, slug, description) VALUES
('Video Editing', 'video-editing', 'Tips and tutorials about video editing'),
('Premiere Pro', 'premiere-pro', 'Adobe Premiere Pro specific content'),
('Career Tips', 'career-tips', 'Advice for building a video editing career'),
('Industry News', 'industry-news', 'Latest news in video editing industry'),
('Tutorials', 'tutorials', 'Step-by-step tutorials and guides');