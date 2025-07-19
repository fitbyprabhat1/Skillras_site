import React from 'react';
import { CourseData } from '../data/courses';

interface StructuredDataProps {
  course: CourseData;
  courseId: string;
}

const StructuredData: React.FC<StructuredDataProps> = ({ course, courseId }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.name,
    "description": course.description,
    "provider": {
      "@type": "Organization",
      "name": "SkillRas",
      "url": "https://skillras.com"
    },
    "instructor": {
      "@type": "Person",
      "name": course.author
    },
    "courseMode": "online",
    "educationalLevel": "beginner",
    "url": `https://skillras.com/course/${courseId}`,
    "image": course.thumbnail,
    "category": course.category,
    "teaches": course.skills || [],
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "inLanguage": "en"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
};

export default StructuredData; 