import packageCourses from '../data/packageCourses';
import { UserPackage } from '../hooks/useUserPackage';

export interface CourseAccessInfo {
  hasAccess: boolean;
  requiredPackage?: string;
  userPackage?: string;
  availableCourses: string[];
}

/**
 * Check if a user has access to a specific course
 */
export const checkCourseAccess = (
  courseId: string,
  userPackage: UserPackage | null
): CourseAccessInfo => {
  if (!userPackage) {
    return {
      hasAccess: false,
      availableCourses: []
    };
  }

  const userPackageType = userPackage.package_selected;
  const availableCourses = packageCourses[userPackageType] || [];

  return {
    hasAccess: availableCourses.includes(courseId),
    userPackage: userPackageType,
    availableCourses
  };
};

/**
 * Get the minimum package required for a course
 */
export const getRequiredPackageForCourse = (courseId: string): string | null => {
  // Check starter package first
  if (packageCourses.starter.includes(courseId)) {
    return 'starter';
  }
  
  // Check professional package
  if (packageCourses.professional.includes(courseId)) {
    return 'professional';
  }
  
  // Check enterprise package
  if (packageCourses.enterprise.includes(courseId)) {
    return 'enterprise';
  }
  
  return null;
};

/**
 * Get all courses available for a specific package
 */
export const getCoursesForPackage = (packageType: string): string[] => {
  return packageCourses[packageType] || [];
};

/**
 * Check if user can upgrade to access a course
 */
export const canUpgradeToAccessCourse = (
  courseId: string,
  userPackage: UserPackage | null
): boolean => {
  if (!userPackage) return true; // User can upgrade if not logged in
  
  const requiredPackage = getRequiredPackageForCourse(courseId);
  if (!requiredPackage) return false;
  
  const packageHierarchy = {
    'starter': 1,
    'professional': 2,
    'enterprise': 3
  };
  
  const userPackageLevel = packageHierarchy[userPackage.package_selected as keyof typeof packageHierarchy] || 0;
  const requiredPackageLevel = packageHierarchy[requiredPackage as keyof typeof packageHierarchy] || 0;
  
  return userPackageLevel < requiredPackageLevel;
}; 