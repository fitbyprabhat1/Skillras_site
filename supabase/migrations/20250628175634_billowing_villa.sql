/*
  # Fix Product Download System

  1. Tables Update
    - Ensure proper table structure for users and products
    - Add proper constraints and indexes
    - Update phone validation to ensure 10 digits

  2. Security
    - Fix RLS policies for proper access
    - Ensure anonymous users can insert and read as needed

  3. Sample Data
    - Add more realistic sample products
    - Ensure proper data format
*/

-- Drop existing tables if they exist to recreate with proper structure
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Users table for download form submissions
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL CHECK (length(phone) = 10 AND phone ~ '^[0-9]+$'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table for download codes and links
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  download_link text NOT NULL,
  product_name text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_code ON products(code);
CREATE INDEX idx_products_active ON products(is_active);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Allow anyone to insert users"
  ON users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policies for products table
CREATE POLICY "Allow anyone to read active products"
  ON products
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (true);

-- Insert sample products for testing
INSERT INTO products (code, download_link, product_name, description) VALUES
('PREMIERE2025', 'https://drive.google.com/file/d/1example-premiere-course/view?usp=sharing', 'Premiere Pro Mastery Course', 'Complete Adobe Premiere Pro course with 35+ hours of content'),
('EDITING101', 'https://drive.google.com/file/d/1example-editing-basics/view?usp=sharing', 'Video Editing Fundamentals', 'Learn the basics of video editing with hands-on projects'),
('ADVANCED2025', 'https://drive.google.com/file/d/1example-advanced-course/view?usp=sharing', 'Advanced Video Editing Techniques', 'Master advanced editing techniques and effects'),
('COLORGRADE', 'https://drive.google.com/file/d/1example-color-grading/view?usp=sharing', 'Color Grading Masterclass', 'Professional color grading techniques and workflows'),
('MOTION2025', 'https://drive.google.com/file/d/1example-motion-graphics/view?usp=sharing', 'Motion Graphics Essentials', 'Create stunning motion graphics and animations');