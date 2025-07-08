/*
  # Sample Course Data

  Insert comprehensive sample data for the Premiere Pro course
  to demonstrate the new course management system
*/

-- Insert sample course
INSERT INTO courses (
  course_id,
  title,
  description,
  instructor_name,
  price,
  original_price,
  duration,
  skill_level,
  category,
  thumbnail_image,
  featured_status,
  is_published,
  course_status,
  students_count,
  average_rating,
  is_popular,
  is_coming_soon
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Premiere Pro Mastery: Create Professional Videos That Captivate and Convert in 2025',
  'Master Adobe Premiere Pro with step-by-step guidance and real-world projects to elevate your video editing skills and launch your career.',
  'Alex Rodriguez',
  4999,
  9999,
  '35 hours',
  'beginner',
  'Video Editing',
  'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  true,
  'published',
  2547,
  4.8,
  true,
  false
);

-- Insert course sections
INSERT INTO course_sections (section_id, course_id, section_title, section_description, order_number, duration) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Video Editing Essentials: Get Started with Confidence', 'Kickstart your journey with the basics of video editing. Set up your workspace, learn core principles, and maximize your learning experience to create professional-quality videos.', 1, '1 week'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Create Compelling Videos: From Raw Footage to Polished Edits', 'Transform raw footage into captivating stories. Master workspace setup, file organization, timeline tools, and export settings for platforms like Instagram and YouTube.', 2, '1 week'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Advanced Editing Skills: Make Your Videos Stand Out', 'Elevate your edits with pro-level audio, graphics, and effects. Learn to enhance audio, create dynamic titles, apply seamless transitions, and use color grading for maximum impact.', 3, '1 week'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Tailor Your Videos for Social Media and Clients', 'Produce platform-specific content like Instagram Reels, YouTube vlogs, and client promos. Plus, learn to design eye-catching YouTube thumbnails in Canva.', 4, '1 week'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Launch Your Video Editing Career: Portfolio, Clients, and Success', 'Turn your skills into a thriving career. Build a standout portfolio, price your services, find clients on platforms like Instagram and Upwork, and master project delivery.', 5, '1 week');

-- Insert course chapters
INSERT INTO course_chapters (chapter_id, section_id, chapter_title, chapter_description, video_id, duration, order_number, is_preview, is_locked) VALUES
-- Section 1 chapters
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', 'Welcome to Premiere Pro Mastery', 'By the end of this video, you''ll know exactly why this Premiere Pro Masterclass is your ticket to creating jaw-dropping videos that stand out.', 'PvTcmse6DDY', '45 min', 1, true, false),
('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440001', 'What You''ll Achieve in 30 Days', 'By the end of this video, you''ll know exactly what badass video editing skills you''ll have in just 30 days.', 'dQw4w9WgXcQ', '30 min', 2, false, true),
('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440001', 'Software Setup + Download Links', 'By the end of this video, you''ll know exactly how to set up Premiere Pro like a pro and hit the ground running.', 'Ul45Ze-xgSU', '60 min', 3, true, false),
('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440001', 'How to Maximize Your Learning', 'By the end of this video, you''ll know exactly how to crush this Masterclass and become a Premiere Pro pro.', 'dQw4w9WgXcQ', '55 min', 4, false, true),

-- Section 2 chapters
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440002', 'Workspace Setup for Efficiency', 'By the end of this video, you''ll know exactly how to navigate Premiere Pro''s interface and set up your workspace like a pro editor.', 'O0-fVgbijkY', '50 min', 1, true, false),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440002', 'Importing and Organizing Footage', 'By the end of this video, you''ll know exactly how to import footage and organize it so you''re never hunting for files mid-edit.', 'dQw4w9WgXcQ', '65 min', 2, false, true),
('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440002', 'Mastering the Timeline and Tools', 'By the end of this video, you''ll know exactly how to use Premiere Pro''s Timeline and tools to start editing like a pro.', 'njUO84_ygo0', '40 min', 3, true, false),
('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440002', 'Your First Edit: Trimming, Cutting, and Arranging Clips', 'By the end of this video, you''ll know exactly how to trim, cut, and move clips to create your first polished edit.', 'dQw4w9WgXcQ', '35 min', 4, false, true),
('550e8400-e29b-41d4-a716-446655440205', '550e8400-e29b-41d4-a716-446655440002', 'Adding Music and Voiceovers Like a Pro', 'By the end of this video, you''ll know exactly how to add music and voiceovers to make your edit feel alive.', 'dQw4w9WgXcQ', '35 min', 5, false, true),
('550e8400-e29b-41d4-a716-446655440206', '550e8400-e29b-41d4-a716-446655440002', 'Export Settings for Social Media Success', 'By the end of this video, you''ll know exactly how to export your edit for Instagram and YouTube like a pro.', 'dQw4w9WgXcQ', '35 min', 6, false, true),

-- Section 3 chapters
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440003', 'Cleaning and Enhancing Voice Audio', 'By the end of this video, you''ll know exactly how to clean up voice audio so it sounds crisp and professional.', 'jpqETZQZ-mg', '40 min', 1, true, false),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440003', 'Adding Background Music and Sound Effects', 'By the end of this video, you''ll know exactly how to add background music and sound effects to make your video pop.', 'dQw4w9WgXcQ', '55 min', 2, false, true),
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440003', 'Creating Stunning Titles and Lower Thirds', 'By the end of this video, you''ll know exactly how to create lower thirds and titles that make your video look pro.', 'dQw4w9WgXcQ', '50 min', 3, false, true),
('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440003', 'Smooth Transitions and Time-Saving Presets', 'By the end of this video, you''ll know exactly how to add smooth transitions and save presets to speed up your workflow.', 'dQw4w9WgXcQ', '60 min', 4, false, true),
('550e8400-e29b-41d4-a716-446655440305', '550e8400-e29b-41d4-a716-446655440003', 'Color Correction, LUTs, and Grading', 'By the end of this video, you''ll know exactly how to color correct and grade your video for that cinematic look.', 'dQw4w9WgXcQ', '60 min', 5, false, true),
('550e8400-e29b-41d4-a716-446655440306', '550e8400-e29b-41d4-a716-446655440003', 'Speed Ramping and Creative Time Effects', 'By the end of this video, you''ll know exactly how to use speed ramping, reverse, and slow-mo for epic, dynamic edits.', 'dQw4w9WgXcQ', '60 min', 6, false, true);

-- Insert course benefits
INSERT INTO course_benefits (course_id, title, description, icon_name, order_number) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Learn Cutting-Edge Techniques', 'Master the latest video editing strategies used by top professionals to create stunning, high-impact videos that stand out.', 'Rocket', 1),
('550e8400-e29b-41d4-a716-446655440000', 'Hands-On, Real-World Projects', 'Apply your skills immediately with practical exercises that simulate client work, preparing you for a successful career in video editing.', 'Briefcase', 2),
('550e8400-e29b-41d4-a716-446655440000', 'Earn a Recognized Certification', 'Showcase your expertise to clients and employers with a certification that proves your mastery of Premiere Pro.', 'Award', 3);

-- Insert course testimonials
INSERT INTO course_testimonials (course_id, student_name, student_role, content, rating, student_image, order_number, is_featured) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Sarah Johnson', 'Marketing Director', 'This course transformed my editing skills! I went from beginner to confidently creating professional videos for my business in just weeks. Our conversion rates tripled after applying the strategies taught.', 5, 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300', 1, true),
('550e8400-e29b-41d4-a716-446655440000', 'Michael Chen', 'Startup Founder', 'As a complete novice, this course gave me the exact blueprint to create a stunning promo video for my startup—without hiring an expensive editor. The practical projects were a game-changer.', 5, 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300', 2, true),
('550e8400-e29b-41d4-a716-446655440000', 'Emma Rodriguez', 'Social Media Manager', 'The platform-specific editing module helped me create viral content for our social channels, boosting engagement by 300%. I''m still amazed at how effective these techniques are!', 4, 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300', 3, false),
('550e8400-e29b-41d4-a716-446655440000', 'David Thompson', 'E-commerce Entrepreneur', 'The career module was a lifesaver! I built a portfolio and landed my first two clients within a month. This course is hands-down the best investment I''ve made in my business.', 5, 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300', 4, true);

-- Insert course pricing plans
INSERT INTO course_pricing_plans (course_id, plan_name, plan_description, price, features, is_featured, order_number) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Basic Plan', 'Perfect for beginners starting their journey', 4999, ARRAY['Full Course Access', '30-Day Money Back Guarantee', 'Basic Support'], false, 1),
('550e8400-e29b-41d4-a716-446655440000', 'Pro Plan', 'Most popular choice for aspiring editors', 9999, ARRAY['Everything in Basic', '1-on-1 Mentoring Session', 'Priority Support', 'Project Reviews'], true, 2),
('550e8400-e29b-41d4-a716-446655440000', 'Premium Plan', 'For serious editors aiming for excellence', 14999, ARRAY['Everything in Pro', '3 Mentoring Sessions', 'Portfolio Review', 'Job Assistance', 'Lifetime Access'], false, 3);

-- Insert course FAQs
INSERT INTO course_faqs (course_id, question, answer, order_number) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'How long do I have access to the course?', 'With both the Essential and Pro Packs, you get lifetime access to all modules, lessons, and future updates—so you can learn and revisit at your own pace.', 1),
('550e8400-e29b-41d4-a716-446655440000', 'Do I need any prior video editing experience?', 'Nope! Whether you''re a complete beginner or have some experience, this course takes you from zero to pro with step-by-step guidance tailored to all levels.', 2),
('550e8400-e29b-41d4-a716-446655440000', 'What makes this course different from others?', 'We focus on real-world skills and career success. You''ll master Premiere Pro, create platform-specific content, and learn to build a portfolio and find clients—setting you up to succeed as an editor.', 3),
('550e8400-e29b-41d4-a716-446655440000', 'Is there a money-back guarantee?', 'Yes! Try Module 1 risk-free. If you''re not satisfied within 30 days, we''ll refund your investment—no questions asked.', 4),
('550e8400-e29b-41d4-a716-446655440000', 'Can I upgrade my plan later?', 'Absolutely! Upgrade anytime and only pay the difference to unlock Pro Pack benefits like portfolio reviews and job board access.', 5),
('550e8400-e29b-41d4-a716-446655440000', 'How much time should I commit each week?', 'We recommend 4-6 hours per week to fully engage with lessons and projects. But it''s self-paced, so you can learn on your schedule.', 6),
('550e8400-e29b-41d4-a716-446655440000', 'Will this course help me find clients?', 'Yes! Module 5 teaches you how to build a portfolio, price your services, and find clients on platforms like Instagram and Upwork—everything you need to kickstart your career.', 7),
('550e8400-e29b-41d4-a716-446655440000', 'Do I need specific software?', 'We guide you through software setup in Module 1, including free and affordable options, so you can start editing right away—no fancy setup required.', 8);

-- Insert course results images
INSERT INTO course_results_images (course_id, title, image_url, description, order_number) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Professional Instagram Reel', 'https://framerusercontent.com/images/YWQmq3bDrak0r79XuyZBA4gtZGE.png', 'A vibrant reel created by a student using techniques from Module 4.', 1),
('550e8400-e29b-41d4-a716-446655440000', 'YouTube Vlog Edit', 'https://framerusercontent.com/images/8xb7rxMwhL3qRjD9gL958r03nFw.png', 'Professional vlog editing showcasing advanced techniques learned in the course.', 2),
('550e8400-e29b-41d4-a716-446655440000', 'Client Promo Video', 'https://framerusercontent.com/images/xSIEEZarXTZg69FIhWb8fsyZw.png', 'High-impact promotional video created for a client using course methodologies.', 3),
('550e8400-e29b-41d4-a716-446655440000', 'Color Graded Masterpiece', 'https://framerusercontent.com/images/wDL6BS2A0pKjGv2CM2gxGEyfhw.png', 'Before and after showing the power of professional color grading techniques.', 4),
('550e8400-e29b-41d4-a716-446655440000', 'Social Media Success', 'https://framerusercontent.com/images/YBpJvkmTipxcmbdfiGbyXjxaAw.png', 'Viral social media content created using platform-specific editing strategies.', 5);