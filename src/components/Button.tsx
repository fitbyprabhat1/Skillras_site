import React from 'react';
import { cn } from '../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  glowing?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  glowing = false,
  className,
  children,
  ...props 
}) => {
  return (
    <button
      className={cn(
        'font-bold rounded-lg transition-all duration-300 inline-flex items-center justify-center',
        {
          'bg-primary text-white hover:bg-primary-dark': variant === 'primary',
          'bg-dark text-white hover:bg-dark-light': variant === 'secondary',
          'bg-transparent border-2 border-primary text-primary hover:bg-primary/10': variant === 'outline',
          'px-4 py-2 text-sm': size === 'sm',
          'px-6 py-3 text-base': size === 'md',
          'px-8 py-4 text-lg': size === 'lg',
          'animate-glow': glowing,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;