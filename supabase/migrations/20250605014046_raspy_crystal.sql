-- Insert a course
INSERT INTO courses (id, title, description, price, thumbnail_url) VALUES 
('d8f34e1c-9b8a-4f88-9c1a-d4f7d8c2e1b0', 'Premiere Pro Mastery', 'Master Adobe Premiere Pro with step-by-step guidance', 9999, 'https://images.pexels.com/photos/2544554/pexels-photo-2544554.jpeg');

-- Insert modules
INSERT INTO modules (course_id, title, description, order_position) VALUES
('d8f34e1c-9b8a-4f88-9c1a-d4f7d8c2e1b0', 'Getting Started', 'Learn the basics of Premiere Pro', 1),
('d8f34e1c-9b8a-4f88-9c1a-d4f7d8c2e1b0', 'Advanced Editing', 'Master advanced editing techniques', 2);

-- Insert chapters
INSERT INTO chapters (module_id, title, description, video_url, duration, order_position) VALUES
((SELECT id FROM modules WHERE order_position = 1 LIMIT 1), 'Introduction to Premiere Pro', 'Get started with the basics', 'PvTcmse6DDY', '45 minutes', 1),
((SELECT id FROM modules WHERE order_position = 1 LIMIT 1), 'Interface Overview', 'Learn the Premiere Pro interface', 'Ul45Ze-xgSU', '30 minutes', 2),
((SELECT id FROM modules WHERE order_position = 2 LIMIT 1), 'Advanced Transitions', 'Create smooth transitions', 'dQw4w9WgXcQ', '60 minutes', 1),
((SELECT id FROM modules WHERE order_position = 2 LIMIT 1), 'Color Grading', 'Professional color grading techniques', 'dQw4w9WgXcQ', '75 minutes', 2);

-- Insert attachments
INSERT INTO attachments (chapter_id, title, file_url, file_type) VALUES
((SELECT id FROM chapters WHERE title = 'Introduction to Premiere Pro'), 'Course Resources', 'https://example.com/resources.pdf', 'PDF'),
((SELECT id FROM chapters WHERE title = 'Interface Overview'), 'Practice Files', 'https://example.com/practice.zip', 'ZIP');