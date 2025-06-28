/*
  # Product Download System

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required, unique)
      - `phone` (text, required)
      - `created_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `code` (text, unique, required)
      - `download_link` (text, required)
      - `product_name` (text, required)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Allow public insert for users (form submissions)
    - Allow public read for products (code verification)
*/

-- Users table for download form submissions
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Products table for download codes and links
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  download_link text NOT NULL,
  product_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Allow public to insert users"
  ON users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for products table
CREATE POLICY "Allow public to read products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (true);

-- Insert sample products for testing
INSERT INTO products (code, download_link, product_name) VALUES
('PREMIERE2025', 'https://drive.google.com/file/d/sample-premiere-course/view', 'Premiere Pro Mastery Course'),
('EDITING101', 'https://drive.google.com/file/d/sample-editing-basics/view', 'Video Editing Fundamentals'),
('ADVANCED2025', 'https://drive.google.com/file/d/sample-advanced-course/view', 'Advanced Video Editing Techniques');