import React, { useState, useEffect } from 'react';
import Button from './Button';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface WelcomePopupProps {
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    // Show popup immediately when component mounts
    setIsOpen(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Insert popup user data into Supabase
      const { data, error: supabaseError } = await supabase
        .from('leads')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
        ])
        .select();

      if (supabaseError) {
        // Handle unique constraint violation for email
        if (supabaseError.code === '23505') {
          throw new Error('This email is already registered. Please use a different email.');
        }
        throw supabaseError;
      }

      setSuccess(true);
      onSubmit(formData);
      
      // Close popup after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to submit form. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-light rounded-lg p-8 max-w-md w-full animate-slideUp relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close popup"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6">Welcome to Skill Ras</h2>
        
        {success ? (
          <div className="text-center">
            <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded mb-4">
              <p className="font-medium">Thank you for joining us!</p>
              <p className="text-sm mt-1">Your information has been saved successfully.</p>
            </div>
            <p className="text-gray-300">This popup will close automatically...</p>
          </div>
        ) : (
          <>
            <p className="text-gray-300 mb-6">
              Enter your details to get started, or click the X to continue without registering.
            </p>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-white mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-2 rounded bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none transition-colors"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-white mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-2 rounded bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none transition-colors"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-white mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  className="w-full px-4 py-2 rounded bg-dark border border-gray-600 text-white focus:border-primary focus:outline-none transition-colors"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                glowing
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Get Started'
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default WelcomePopup;