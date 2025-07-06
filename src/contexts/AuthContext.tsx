import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, phone: string, name: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, phone: string, name: string) => {
    try {
      // First, try Supabase Auth signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            phone: phone
          }
        }
      });

      if (error) {
        // If Supabase Auth fails, try our custom demo user creation
        console.log('Supabase Auth signup failed, trying demo user creation:', error.message);
        
        // For demo purposes, create user directly in our users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert([
            {
              name: name,
              email: email,
              phone: phone,
              password: password // In production, this would be properly hashed
            }
          ])
          .select()
          .single();

        if (userError) {
          throw userError;
        }

        // Create a mock user object for demo purposes
        const mockUser = {
          id: userData.id,
          email: email,
          user_metadata: { name, phone }
        } as User;

        setUser(mockUser);
        return { data: { user: mockUser }, error: null };
      }

      // If Supabase Auth succeeds, update the user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .upsert({ 
            auth_user_id: data.user.id,
            name: name,
            phone: phone,
            email: email
          });

        if (profileError) {
          console.error('Error updating profile:', profileError);
        }
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // First, try Supabase Auth signin
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If Supabase Auth fails, try our demo user authentication
        console.log('Supabase Auth signin failed, trying demo user authentication:', error.message);
        
        // Check if user exists in our users table (for demo accounts)
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .eq('password', password) // In production, this would be properly hashed and compared
          .single();

        if (userError || !userData) {
          throw new Error('Invalid login credentials');
        }

        // Create a mock user object for demo purposes
        const mockUser = {
          id: userData.id,
          email: email,
          user_metadata: { 
            name: userData.name, 
            phone: userData.phone 
          }
        } as User;

        setUser(mockUser);
        return { data: { user: mockUser }, error: null };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log('Supabase Auth signout failed:', error.message);
      }
    } catch (error) {
      console.log('Error during signout:', error);
    } finally {
      // Always clear local state
      setUser(null);
      setSession(null);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};