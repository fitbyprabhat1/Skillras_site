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
  before: string;
  after: string;
  description: string;
}
