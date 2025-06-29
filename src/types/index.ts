export interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface CurriculumModule {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  duration: string;
}

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  previewAvailable: boolean;
  videoId?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  image: string;
  rating: number;
}

export interface PricingPlan {
  id: number;
  name: string;
  price: number;
  featured: boolean;
  description: string;
  features: string[];
  cta: string;
  purchaseLink: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface CourseStats {
  students: number;
  lessons: number;
  hours: number;
  rating: number;
}

export interface ResultsImage {
  id: number;
  title: string;
  image: string;
  description: string;
}

// Blog-related types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  meta_title?: string;
  meta_description?: string;
  tags: string[];
  published: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  categories?: BlogCategory[];
  author?: {
    name: string;
    email: string;
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface BlogPostCategory {
  post_id: string;
  category_id: string;
}