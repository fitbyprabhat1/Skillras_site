import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface UserPackage {
  package_selected: string;
  payment_status: string;
  email: string;
  name: string;
}

export const useUserPackage = () => {
  const { user } = useAuth();
  const [userPackage, setUserPackage] = useState<UserPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPackage = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('paid_users')
          .select('package_selected, payment_status, email, name')
          .eq('email', user.email.toLowerCase().trim())
          .eq('payment_status', 'completed')
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No rows returned - user not found or payment not completed
            setUserPackage(null);
          } else {
            setError(error.message);
          }
        } else {
          setUserPackage(data);
        }
      } catch (err) {
        setError('Failed to fetch user package information');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPackage();
  }, [user?.email]);

  const hasAccessToPackage = (requiredPackage: string): boolean => {
    if (!userPackage) return false;
    
    const packageHierarchy = {
      'starter': 1,
      'professional': 2,
      'enterprise': 3
    };

    const userPackageLevel = packageHierarchy[userPackage.package_selected as keyof typeof packageHierarchy] || 0;
    const requiredPackageLevel = packageHierarchy[requiredPackage as keyof typeof packageHierarchy] || 0;

    return userPackageLevel >= requiredPackageLevel;
  };

  const getAvailableCourses = (): string[] => {
    if (!userPackage) return [];

    const courseAccess = {
      'starter': ['premiere-pro'],
      'professional': ['premiere-pro', 'after-effects'],
      'enterprise': ['premiere-pro', 'after-effects', 'excel']
    };

    return courseAccess[userPackage.package_selected as keyof typeof courseAccess] || [];
  };

  return {
    userPackage,
    loading,
    error,
    hasAccessToPackage,
    getAvailableCourses
  };
}; 