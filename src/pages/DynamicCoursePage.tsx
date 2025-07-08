import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBarWithPackages from '../components/NavBarWithPackages';
import HeroSection from '../sections/HeroSection';
import BenefitsSection from '../sections/BenefitsSection';
import ResultsSection from '../sections/ResultsSection';
import CurriculumSection from '../sections/CurriculumSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import PricingSection from '../sections/PricingSection';
import FAQSection from '../sections/FAQSection';
import FooterSection from '../sections/FooterSection';
import FloatingCTA from '../components/FloatingCTA';
import ScrollToTop from '../components/ScrollToTop';
import { CourseService } from '../lib/courseService';
import type { CourseWithDetails } from '../types/course';
import { Loader, AlertCircle } from 'lucide-react';

const DynamicCoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [courseData, setCourseData] = useState<CourseWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setError('Course ID is required');
      setLoading(false);
      return;
    }

    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await CourseService.getCourseWithDetails(courseId!);
      
      if (!data) {
        setError('Course not found or not published');
        return;
      }

      setCourseData(data);
    } catch (err: any) {
      console.error('Error fetching course data:', err);
      setError(err.message || 'Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-dark">
      <NavBarWithPackages />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero skeleton */}
          <div className="animate-pulse mb-20">
            <div className="h-8 bg-dark-light rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-dark-light rounded w-1/2 mb-8"></div>
            <div className="aspect-video bg-dark-light rounded-xl"></div>
          </div>

          {/* Benefits skeleton */}
          <div className="animate-pulse mb-20">
            <div className="h-6 bg-dark-light rounded w-1/3 mb-8 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-dark-light rounded-lg p-6">
                  <div className="h-4 bg-dark rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-dark rounded w-full mb-1"></div>
                  <div className="h-3 bg-dark rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum skeleton */}
          <div className="animate-pulse mb-20">
            <div className="h-6 bg-dark-light rounded w-1/4 mb-8 mx-auto"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-dark-light rounded-lg p-6">
                  <div className="h-5 bg-dark rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-dark rounded w-full mb-4"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="h-3 bg-dark rounded w-3/4"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Error component
  const ErrorDisplay = () => (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="text-red-500" size={40} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Course Not Found</h1>
        <p className="text-gray-300 mb-8">{error}</p>
        <button 
          onClick={() => window.history.back()}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !courseData) {
    return <ErrorDisplay />;
  }

  // Transform data for existing components
  const transformedData = {
    courseTitle: courseData.title,
    courseSubtitle: courseData.description,
    courseVideoId: courseData.sections[0]?.chapters[0]?.video_id || 'PvTcmse6DDY',
    
    benefits: courseData.benefits.map(benefit => ({
      id: parseInt(benefit.benefit_id.slice(-3)),
      title: benefit.title,
      description: benefit.description,
      icon: benefit.icon_name || 'Star'
    })),

    curriculum: courseData.sections.map(section => ({
      id: parseInt(section.section_id.slice(-3)),
      title: section.section_title,
      description: section.section_description || '',
      duration: section.duration || '1 week',
      lessons: section.chapters.map(chapter => ({
        id: parseInt(chapter.chapter_id.slice(-3)),
        title: chapter.chapter_title,
        duration: chapter.duration || '30 min',
        previewAvailable: chapter.is_preview,
        videoId: chapter.video_id
      }))
    })),

    testimonials: courseData.testimonials.map(testimonial => ({
      id: parseInt(testimonial.testimonial_id.slice(-3)),
      name: testimonial.student_name,
      role: testimonial.student_role || '',
      content: testimonial.content,
      image: testimonial.student_image || 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: testimonial.rating
    })),

    pricingPlans: courseData.pricing_plans.map(plan => ({
      id: parseInt(plan.plan_id.slice(-3)),
      name: plan.plan_name,
      description: plan.plan_description || '',
      price: plan.price,
      features: plan.features,
      featured: plan.is_featured,
      cta: 'Enroll Now',
      purchaseLink: '/enroll'
    })),

    faqs: courseData.faqs.map(faq => ({
      id: parseInt(faq.faq_id.slice(-3)),
      question: faq.question,
      answer: faq.answer
    })),

    courseStats: {
      students: courseData.students_count,
      lessons: courseData.total_lessons,
      hours: parseInt(courseData.duration.split(' ')[0]) || 35,
      rating: courseData.average_rating
    },

    resultsImages: courseData.results_images.map(image => ({
      id: parseInt(image.image_id.slice(-3)),
      image: image.image_url,
      title: image.title || 'Result',
      description: image.description || 'Amazing result achieved by our student'
    }))
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <NavBarWithPackages />
      <HeroSection 
        courseTitle={transformedData.courseTitle}
        courseSubtitle={transformedData.courseSubtitle}
        courseVideoId={transformedData.courseVideoId}
      />
      <BenefitsSection benefits={transformedData.benefits} />
      <ResultsSection resultsImages={transformedData.resultsImages} />
      <CurriculumSection curriculum={transformedData.curriculum} />
      <TestimonialsSection 
        testimonials={transformedData.testimonials}
        courseStats={transformedData.courseStats}
      />
      <PricingSection pricingPlans={transformedData.pricingPlans} />
      <FAQSection faqs={transformedData.faqs} />
      <FooterSection courseTitle={transformedData.courseTitle} />
      <FloatingCTA />
      <ScrollToTop />
    </div>
  );
};

export default DynamicCoursePage;