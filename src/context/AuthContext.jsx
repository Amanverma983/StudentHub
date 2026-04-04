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
    // 1. Safety Timeout: Never hang for more than 5 seconds
    const safetyTimer = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ Auth initialization timed out. Forcing load state.');
        setLoading(false);
      }
    }, 5000);

    // 2. Initial Cache Load (Instant UI)
    if (typeof window !== 'undefined') {
      const cachedProfile = localStorage.getItem('sh_profile');
      if (cachedProfile) {
        try {
          const parsed = JSON.parse(cachedProfile);
          setProfile(parsed);
          setLoading(false); 
        } catch (e) {
          localStorage.removeItem('sh_profile');
        }
      }
    }

    const fetchProfile = async (userId) => {
      // Avoid duplicate parallel fetches
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
        clearTimeout(safetyTimer);
      }
    };

    // 3. Single Unified Listener (Initialize + Changes)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        // We only trigger fetch if it's a significant event or we don't have a profile yet
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        if (typeof window !== 'undefined') localStorage.removeItem('sh_profile');
        setLoading(false);
        clearTimeout(safetyTimer);
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimer);
    };
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
    try {
      // 1. Clear local state and cache immediately (Optimistic UI)
      setUser(null);
      setProfile(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sh_profile');
        // Clear all session storage as well
        sessionStorage.clear();
      }
      
      // 2. Background signout from Supabase
      await supabase.auth.signOut();
      
      toast.success('Signed out successfully');
    } catch (err) {
      console.error('Sign out error:', err);
      // Even if server call fails, we ensure the local state is cleared
      setUser(null);
      setProfile(null);
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user) return;
    
    // 1. Optimistic Update (Instant UI Response)
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('sh_profile', JSON.stringify(newProfile));
    }

    // 2. Background Sync
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Profile synced');
    } catch (err) {
      toast.error('Sync error: ' + err.message);
      // Optional: setProfile(oldProfile) if rollback is needed
    }
  }, [user, profile]);

  const updateEmail = useCallback(async (newEmail) => {
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      toast.success('Verification email sent to new address');
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  const updatePassword = useCallback(async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password updated successfully');
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

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
      updateEmail,
      updatePassword,
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
