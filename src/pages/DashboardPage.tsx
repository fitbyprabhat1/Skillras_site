import React from 'react';
import NavBarWithPackages from '../components/NavBarWithPackages';
import PackageCourseDashboard from '../components/PackageCourseDashboard';

const DashboardPage: React.FC = () => {
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