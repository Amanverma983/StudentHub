'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);
const supabase = createClient();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(profileData);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      toast.success('Signed in successfully');
      return { user: data.user, error: null };
    } catch (err) {
      if (err.message.toLowerCase().includes('email not confirmed')) {
        toast.error('Please verify your email address before signing in.');
      } else {
        toast.error(err.message);
      }
      return { user: null, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email, password, name, role) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role },
        },
      });

      if (error) throw error;
      
      // Handle Profile creation (triggered by SQL function, but we ensure it)
      toast.success('Account created! Please verify your email.');
      return { user: data.user, error: null };
    } catch (err) {
      toast.error(err.message);
      return { user: null, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    toast.success('Signed out');
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      setProfile(prev => ({ ...prev, ...updates }));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      error,
      isWriter: profile?.role === 'writer',
      isCustomer: profile?.role === 'customer',
      isAdmin: !!profile?.is_admin,
      isAuthenticated: !!user,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
