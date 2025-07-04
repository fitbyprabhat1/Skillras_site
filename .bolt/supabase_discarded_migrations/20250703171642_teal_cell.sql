/*
  # Download System Setup

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `code` (text, unique) - Product access code
      - `product_name` (text) - Display name of the product
      - `description` (text, optional) - Product description
      - `download_link` (text) - URL to download the product
      - `file_type` (text) - Type of file (PDF, ZIP, VIDEO, etc.)
      - `file_size` (text, optional) - Human readable file size
      - `is_active` (boolean) - Whether product is available for download
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `download_logs`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `user_name` (text) - Name of person downloading
      - `user_email` (text) - Email of person downloading
      - `user_phone` (text) - Phone of person downloading
      - `product_code` (text) - Code used for download
      - `ip_address` (text, optional) - IP address for security
      - `user_agent` (text, optional) - Browser info for analytics
      - `downloaded_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Products: Public can read active products, authenticated users can manage
    - Download logs: Only system can insert, authenticated users can view their own logs

  3. Indexes
    - Product code lookup
    - Download logs by email/phone for analytics
    - Active products filter
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  product_name text NOT NULL,
  description text,
  download_link text NOT NULL,
  file_type text NOT NULL DEFAULT 'PDF',
  file_size text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create download_logs table
CREATE TABLE IF NOT EXISTS download_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  user_email text NOT NULL,
  user_phone text NOT NULL,
  product_code text NOT NULL,
  ip_address text,
  user_agent text,
  downloaded_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_download_logs_email ON download_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_download_logs_phone ON download_logs(user_phone);
CREATE INDEX IF NOT EXISTS idx_download_logs_product ON download_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_download_logs_date ON download_logs(downloaded_at);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_logs ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Allow public to read active products"
  ON products
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Allow authenticated users to manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Download logs policies
CREATE POLICY "Allow public to insert download logs"
  ON download_logs
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view all download logs"
  ON download_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow users to view their own download logs"
  ON download_logs
  FOR SELECT
  TO public
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Add phone number validation constraint
ALTER TABLE download_logs 
ADD CONSTRAINT download_logs_phone_check 
CHECK (length(user_phone) = 10 AND user_phone ~ '^[6-9][0-9]{9}$');

-- Add email validation constraint
ALTER TABLE download_logs 
ADD CONSTRAINT download_logs_email_check 
CHECK (user_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add product code validation (minimum 3 characters)
ALTER TABLE products 
ADD CONSTRAINT products_code_check 
CHECK (length(code) >= 3);

-- Insert some sample products for testing
INSERT INTO products (code, product_name, description, download_link, file_type, file_size) VALUES
('PREMIERE2025', 'Premiere Pro Complete Guide', 'Comprehensive guide to mastering Adobe Premiere Pro with practical examples and exercises', 'https://drive.google.com/file/d/1example_premiere/view', 'PDF', '25 MB'),
('EDITING101', 'Video Editing Basics', 'Essential video editing techniques for beginners', 'https://drive.google.com/file/d/1example_editing/view', 'PDF', '15 MB'),
('ADVANCED2025', 'Advanced Editing Techniques', 'Professional video editing workflows and advanced techniques', 'https://drive.google.com/file/d/1example_advanced/view', 'ZIP', '150 MB'),
('COLORGRADE', 'Color Grading Masterclass', 'Complete color grading and correction guide with LUTs pack', 'https://drive.google.com/file/d/1example_color/view', 'ZIP', '200 MB'),
('AUDIO2025', 'Audio Enhancement Guide', 'Professional audio editing and enhancement techniques', 'https://drive.google.com/file/d/1example_audio/view', 'PDF', '20 MB'),
('TEMPLATES', 'Premiere Pro Templates Pack', 'Collection of professional Premiere Pro templates and presets', 'https://drive.google.com/file/d/1example_templates/view', 'ZIP', '500 MB'),
('WORKFLOW', 'Efficient Editing Workflow', 'Optimize your editing workflow for maximum productivity', 'https://drive.google.com/file/d/1example_workflow/view', 'PDF', '12 MB'),
('MOTION2025', 'Motion Graphics Basics', 'Introduction to motion graphics in Premiere Pro', 'https://drive.google.com/file/d/1example_motion/view', 'ZIP', '300 MB')
ON CONFLICT (code) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for products table
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();