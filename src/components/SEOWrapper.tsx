import React from 'react';
import { useSEO } from '../hooks/useSEO';

interface SEOWrapperProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  noIndex?: boolean;
  children: React.ReactNode;
}

const SEOWrapper: React.FC<SEOWrapperProps> = ({
  title,
  description,
  keywords,
  canonical,
  noIndex = false,
  children
}) => {
  useSEO({
    title,
    description,
    keywords,
    canonical,
    noIndex
  });

  return <>{children}</>;
};

export default SEOWrapper; 