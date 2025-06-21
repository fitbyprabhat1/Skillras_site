/*
  # Setup Admin User for Blog Management

  1. Admin User Setup
    - Create admin user with specified credentials
    - Set up proper permissions for blog management

  2. Security
    - Ensure admin has proper access to blog management
    - Update RLS policies to allow admin operations

  Note: This migration sets up the foundation. The actual user creation
  will need to be done through Supabase Auth UI or API since we can't
  directly insert into auth.users table via SQL.
*/

-- Update blog posts policy to allow admin operations
DROP POLICY IF EXISTS "Allow authors to manage their own posts" ON blog_posts;

CREATE POLICY "Allow authors to manage their own posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (
    auth.uid() = author_id OR 
    auth.jwt() ->> 'email' = 'admin@skillras.com'
  );

-- Update blog categories policy for admin
DROP POLICY IF EXISTS "Allow authenticated users to manage categories" ON blog_categories;

CREATE POLICY "Allow authenticated users to manage categories"
  ON blog_categories FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'admin@skillras.com' OR
    true
  );

-- Update blog post categories policy for admin
DROP POLICY IF EXISTS "Allow authenticated users to manage post categories" ON blog_post_categories;

CREATE POLICY "Allow authenticated users to manage post categories"
  ON blog_post_categories FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'admin@skillras.com' OR
    true
  );