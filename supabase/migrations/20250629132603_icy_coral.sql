/*
  # Create blog system tables

  1. New Tables
    - `blog_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `description` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `excerpt` (text, optional)
      - `content` (text)
      - `featured_image` (text, optional)
      - `published` (boolean, default false)
      - `published_at` (timestamp, optional)
      - `tags` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `blog_post_categories`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key to blog_posts)
      - `category_id` (uuid, foreign key to blog_categories)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to published content
    - Add policies for authenticated users to manage content

  3. Indexes
    - Add indexes for performance on commonly queried fields
*/

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  featured_image text,
  published boolean DEFAULT false,
  published_at timestamptz,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_post_categories junction table
CREATE TABLE IF NOT EXISTS blog_post_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, category_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_post_categories_post_id ON blog_post_categories(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_categories_category_id ON blog_post_categories(category_id);

-- Enable Row Level Security
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_categories
CREATE POLICY "Allow public to read categories"
  ON blog_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage categories"
  ON blog_categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for blog_posts
CREATE POLICY "Allow public to read published posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Allow authenticated users to manage posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for blog_post_categories
CREATE POLICY "Allow public to read post categories"
  ON blog_post_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage post categories"
  ON blog_post_categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert some sample categories
INSERT INTO blog_categories (name, slug, description) VALUES
  ('Web Development', 'web-development', 'Articles about web development technologies and best practices'),
  ('Digital Marketing', 'digital-marketing', 'Tips and strategies for digital marketing success'),
  ('Career Growth', 'career-growth', 'Advice for advancing your professional career'),
  ('Technology Trends', 'technology-trends', 'Latest trends and innovations in technology'),
  ('Tutorials', 'tutorials', 'Step-by-step guides and tutorials')
ON CONFLICT (slug) DO NOTHING;

-- Insert some sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, published, published_at, tags) VALUES
  (
    'Getting Started with React Development',
    'getting-started-react-development',
    'Learn the fundamentals of React development and build your first application.',
    '<h2>Introduction to React</h2><p>React is a powerful JavaScript library for building user interfaces. In this comprehensive guide, we''ll explore the fundamentals of React development and help you build your first application.</p><h3>What is React?</h3><p>React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components".</p><h3>Setting Up Your Development Environment</h3><p>Before we start coding, let''s set up our development environment. You''ll need Node.js installed on your machine.</p><h3>Creating Your First Component</h3><p>Components are the building blocks of React applications. Let''s create a simple component to get started.</p>',
    'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg',
    true,
    now(),
    ARRAY['react', 'javascript', 'web-development', 'frontend']
  ),
  (
    'Digital Marketing Strategies for 2024',
    'digital-marketing-strategies-2024',
    'Discover the most effective digital marketing strategies to grow your business in 2024.',
    '<h2>The Digital Marketing Landscape in 2024</h2><p>Digital marketing continues to evolve rapidly, with new technologies and platforms emerging constantly. In this article, we''ll explore the most effective strategies for 2024.</p><h3>Content Marketing Excellence</h3><p>Content remains king in digital marketing. Creating valuable, relevant content that resonates with your audience is crucial for success.</p><h3>Social Media Optimization</h3><p>Social media platforms are constantly updating their algorithms. Stay ahead by understanding these changes and adapting your strategy accordingly.</p>',
    'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg',
    true,
    now() - interval '1 day',
    ARRAY['digital-marketing', 'social-media', 'content-marketing', 'strategy']
  ),
  (
    'Building a Successful Career in Tech',
    'building-successful-career-tech',
    'Essential tips and strategies for advancing your career in the technology industry.',
    '<h2>Your Path to Tech Success</h2><p>The technology industry offers incredible opportunities for career growth and development. Here''s how to make the most of them.</p><h3>Continuous Learning</h3><p>Technology evolves rapidly, making continuous learning essential for career success. Stay updated with the latest trends and technologies in your field.</p><h3>Building a Strong Network</h3><p>Networking is crucial in the tech industry. Attend conferences, join professional organizations, and connect with peers in your field.</p>',
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    true,
    now() - interval '2 days',
    ARRAY['career', 'technology', 'professional-development', 'networking']
  )
ON CONFLICT (slug) DO NOTHING;

-- Link posts to categories
INSERT INTO blog_post_categories (post_id, category_id)
SELECT 
  bp.id,
  bc.id
FROM blog_posts bp, blog_categories bc
WHERE 
  (bp.slug = 'getting-started-react-development' AND bc.slug IN ('web-development', 'tutorials'))
  OR (bp.slug = 'digital-marketing-strategies-2024' AND bc.slug IN ('digital-marketing', 'technology-trends'))
  OR (bp.slug = 'building-successful-career-tech' AND bc.slug IN ('career-growth', 'technology-trends'))
ON CONFLICT (post_id, category_id) DO NOTHING;