'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);
const supabase = createClient();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFetching = useRef(false);

  useEffect(() => {
    // 1. Optimistic Load from Cache (Client-side only)
    if (typeof window !== 'undefined') {
      const cachedProfile = localStorage.getItem('sh_profile');
      if (cachedProfile) {
        try {
          const parsed = JSON.parse(cachedProfile);
          setProfile(parsed);
          setLoading(false);
          // If we have a cached profile, we can show the dashboard immediately
        } catch (e) {
          localStorage.removeItem('sh_profile');
        }
      }
    }

    const fetchProfile = async (userId) => {
      if (isFetching.current) return;
      isFetching.current = true;
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (profileError) throw profileError;
        
        setProfile(profileData);
        if (typeof window !== 'undefined') {
          localStorage.setItem('sh_profile', JSON.stringify(profileData));
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        isFetching.current = false;
        setLoading(false);
      }
    };

    // Initial Session Check
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Initial session check failed:', err);
        setLoading(false);
      }
    };

    checkUser();

    // Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        if (typeof window !== 'undefined') localStorage.removeItem('sh_profile');
        setLoading(false);
      }
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
