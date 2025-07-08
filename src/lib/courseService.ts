import { supabase } from './supabase';
import type { 
  Course, 
  CourseWithDetails, 
  CourseSection, 
  CourseChapter,
  CourseBenefit,
  CourseTestimonial,
  CoursePricingPlan,
  CourseFAQ,
  CourseResultsImage
} from '../types/course';

export class CourseService {
  // Get all published courses with pagination
  static async getPublishedCourses(
    page: number = 1, 
    limit: number = 10,
    category?: string,
    skill_level?: string,
    search?: string
  ) {
    let query = supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('creation_date', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (skill_level) {
      query = query.eq('skill_level', skill_level);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .range(from, to)
      .select('*', { count: 'exact' });

    if (error) throw error;

    return {
      courses: data as Course[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  // Get featured courses
  static async getFeaturedCourses(limit: number = 3) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .eq('featured_status', true)
      .order('creation_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Course[];
  }

  // Get popular courses
  static async getPopularCourses(limit: number = 6) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .eq('is_popular', true)
      .order('students_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Course[];
  }

  // Get course by ID with all details
  static async getCourseWithDetails(courseId: string): Promise<CourseWithDetails | null> {
    try {
      // Fetch course basic info
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_published', true)
        .single();

      if (courseError || !course) {
        throw new Error('Course not found');
      }

      // Fetch all related data in parallel
      const [
        sectionsResult,
        benefitsResult,
        testimonialsResult,
        pricingResult,
        faqsResult,
        resultsResult
      ] = await Promise.all([
        // Sections with chapters
        supabase
          .from('course_sections')
          .select(`
            *,
            course_chapters (*)
          `)
          .eq('course_id', courseId)
          .order('order_number'),

        // Benefits
        supabase
          .from('course_benefits')
          .select('*')
          .eq('course_id', courseId)
          .order('order_number'),

        // Testimonials
        supabase
          .from('course_testimonials')
          .select('*')
          .eq('course_id', courseId)
          .order('order_number'),

        // Pricing plans
        supabase
          .from('course_pricing_plans')
          .select('*')
          .eq('course_id', courseId)
          .order('order_number'),

        // FAQs
        supabase
          .from('course_faqs')
          .select('*')
          .eq('course_id', courseId)
          .order('order_number'),

        // Results images
        supabase
          .from('course_results_images')
          .select('*')
          .eq('course_id', courseId)
          .order('order_number')
      ]);

      // Check for errors
      if (sectionsResult.error) throw sectionsResult.error;
      if (benefitsResult.error) throw benefitsResult.error;
      if (testimonialsResult.error) throw testimonialsResult.error;
      if (pricingResult.error) throw pricingResult.error;
      if (faqsResult.error) throw faqsResult.error;
      if (resultsResult.error) throw resultsResult.error;

      // Process sections and chapters
      const sections = (sectionsResult.data || []).map(section => ({
        ...section,
        chapters: (section.course_chapters || []).sort((a: any, b: any) => a.order_number - b.order_number)
      }));

      return {
        ...course,
        sections,
        benefits: benefitsResult.data || [],
        testimonials: testimonialsResult.data || [],
        pricing_plans: pricingResult.data || [],
        faqs: faqsResult.data || [],
        results_images: resultsResult.data || []
      } as CourseWithDetails;

    } catch (error) {
      console.error('Error fetching course details:', error);
      return null;
    }
  }

  // Get course categories
  static async getCategories() {
    const { data, error } = await supabase
      .from('courses')
      .select('category')
      .eq('is_published', true);

    if (error) throw error;

    const categories = [...new Set(data.map(item => item.category))];
    return categories;
  }

  // Search courses
  static async searchCourses(query: string, limit: number = 10) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('students_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Course[];
  }

  // Real-time subscription for course updates
  static subscribeToCourseUpdates(courseId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`course-${courseId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'courses',
          filter: `course_id=eq.${courseId}`
        },
        callback
      )
      .subscribe();
  }

  // Admin functions (require authentication)
  static async createCourse(courseData: Partial<Course>) {
    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select()
      .single();

    if (error) throw error;
    return data as Course;
  }

  static async updateCourse(courseId: string, updates: Partial<Course>) {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('course_id', courseId)
      .select()
      .single();

    if (error) throw error;
    return data as Course;
  }

  static async deleteCourse(courseId: string) {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('course_id', courseId);

    if (error) throw error;
  }

  // Section management
  static async createSection(sectionData: Partial<CourseSection>) {
    const { data, error } = await supabase
      .from('course_sections')
      .insert([sectionData])
      .select()
      .single();

    if (error) throw error;
    return data as CourseSection;
  }

  static async updateSection(sectionId: string, updates: Partial<CourseSection>) {
    const { data, error } = await supabase
      .from('course_sections')
      .update(updates)
      .eq('section_id', sectionId)
      .select()
      .single();

    if (error) throw error;
    return data as CourseSection;
  }

  static async deleteSection(sectionId: string) {
    const { error } = await supabase
      .from('course_sections')
      .delete()
      .eq('section_id', sectionId);

    if (error) throw error;
  }

  // Chapter management
  static async createChapter(chapterData: Partial<CourseChapter>) {
    const { data, error } = await supabase
      .from('course_chapters')
      .insert([chapterData])
      .select()
      .single();

    if (error) throw error;
    return data as CourseChapter;
  }

  static async updateChapter(chapterId: string, updates: Partial<CourseChapter>) {
    const { data, error } = await supabase
      .from('course_chapters')
      .update(updates)
      .eq('chapter_id', chapterId)
      .select()
      .single();

    if (error) throw error;
    return data as CourseChapter;
  }

  static async deleteChapter(chapterId: string) {
    const { error } = await supabase
      .from('course_chapters')
      .delete()
      .eq('chapter_id', chapterId);

    if (error) throw error;
  }
}