import React from 'react';
import NavBarWithPackages from '../components/NavBarWithPackages';
import PackageCourseDashboard from '../components/PackageCourseDashboard';
import { useSEO } from '../hooks/useSEO';

const DashboardPage: React.FC = () => {
  useSEO({
    title: 'Dashboard - My Learning Center | SkillRas',
    description: 'Access your courses, track your progress, and manage your learning journey with SkillRas dashboard.',
    keywords: 'dashboard, learning center, course progress, student portal, skillras dashboard',
    noIndex: true // Dashboard should not be indexed
  });

  return (
    <div className="min-h-screen bg-dark">
      <NavBarWithPackages />
      <div className="pt-20">
        <PackageCourseDashboard />
      </div>
    </div>
  );
};

export default DashboardPage; 