import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserPackage } from '../hooks/useUserPackage';
import { Lock, Crown, Star } from 'lucide-react';
import Button from './Button';

interface PackageProtectedRouteProps {
  children: React.ReactNode;
  requiredPackage: string;
  fallbackPath?: string;
}

const PackageProtectedRoute: React.FC<PackageProtectedRouteProps> = ({ 
  children, 
  requiredPackage, 
  fallbackPath = '/packages' 
}) => {
  const { user, loading: authLoading } = useAuth();
  const { userPackage, loading: packageLoading, hasAccessToPackage } = useUserPackage();
  const location = useLocation();

  if (authLoading || packageLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!userPackage) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-red-500" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Payment Required</h2>
          <p className="text-gray-300 mb-6">
            You need to complete your enrollment and payment to access this content.
          </p>
          <Button onClick={() => window.location.href = '/enroll'}>
            Complete Enrollment
          </Button>
        </div>
      </div>
    );
  }

  if (!hasAccessToPackage(requiredPackage)) {
    const packageNames = {
      'starter': 'Starter',
      'professional': 'Professional', 
      'enterprise': 'Enterprise'
    };

    const currentPackage = packageNames[userPackage.package_selected as keyof typeof packageNames] || 'Current';
    const requiredPackageName = packageNames[requiredPackage as keyof typeof packageNames] || 'Required';

    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="text-primary" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Upgrade Required</h2>
          <p className="text-gray-300 mb-4">
            This content requires the <span className="text-primary font-semibold">{requiredPackageName}</span> package.
          </p>
          <p className="text-gray-400 text-sm mb-6">
            You currently have the <span className="text-gray-300">{currentPackage}</span> package.
          </p>
          <div className="space-y-3">
            <Button onClick={() => window.location.href = '/packages'}>
              View Packages
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/enroll'}
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PackageProtectedRoute; 