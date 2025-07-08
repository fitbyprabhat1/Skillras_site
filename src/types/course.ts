export interface Course {
  course_id: string;
  title: string;
  description: string;
  instructor_name: string;
  price: number;
  original_price?: number;
  duration: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  thumbnail_image?: string;
  featured_status: boolean;
  is_published: boolean;
  course_status: 'draft' | 'published' | 'archived';
  students_count: number;
  average_rating: number;
  total_lessons: number;
  is_popular: boolean;
  is_coming_soon: boolean;
  last_updated_date: string;
  creation_date: string;
  updated_at: string;
}

export interface CourseSection {
  section_id: string;
  course_id: string;
  section_title: string;
  section_description?: string;
  order_number: number;
  duration?: string;
  created_at: string;
  updated_at: string;
}

export interface CourseChapter {
  chapter_id: string;
  section_id: string;
  chapter_title: string;
  chapter_description?: string;
  video_id?: string;
  duration?: string;
  order_number: number;
  is_preview: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseBenefit {
  benefit_id: string;
  course_id: string;
  title: string;
  description: string;
  icon_name?: string;
  order_number: number;
  created_at: string;
}

export interface CourseTestimonial {
  testimonial_id: string;
  course_id: string;
  student_name: string;
  student_role?: string;
  content: string;
  rating: number;
  student_image?: string;
  order_number: number;
  is_featured: boolean;
  created_at: string;
}

export interface CoursePricingPlan {
  plan_id: string;
  course_id: string;
  plan_name: string;
  plan_description?: string;
  price: number;
  features: string[];
  is_featured: boolean;
  order_number: number;
  created_at: string;
}

export interface CourseFAQ {
  faq_id: string;
  course_id: string;
  question: string;
  answer: string;
  order_number: number;
  created_at: string;
}

export interface CourseResultsImage {
  image_id: string;
  course_id: string;
  title?: string;
  image_url: string;
  description?: string;
  order_number: number;
  created_at: string;
}

export interface CourseEnrollment {
  enrollment_id: string;
  user_id: string;
  course_id: string;
  enrollment_status: 'active' | 'completed' | 'cancelled';
  enrolled_at: string;
  completed_at?: string;
  progress_percentage: number;
}

export interface CourseProgress {
  progress_id: string;
  user_id: string;
  chapter_id: string;
  is_completed: boolean;
  completed_at?: string;
  watch_time_seconds: number;
  created_at: string;
  updated_at: string;
}

export interface CourseWithDetails extends Course {
  sections: (CourseSection & {
    chapters: CourseChapter[];
  })[];
  benefits: CourseBenefit[];
  testimonials: CourseTestimonial[];
  pricing_plans: CoursePricingPlan[];
  faqs: CourseFAQ[];
  results_images: CourseResultsImage[];
}