"use client"
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/lib/db';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id);
        setProfile(profileData && profileData.length > 0 ? profileData[0] : null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.first_name,
          last_name: userData.last_name,
          user_type: userData.user_type,
          phone: userData.phone || null,
        },
      },
    });
    return { user: data.user, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data.user, error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    return { user: data.user, error };
  };

  const signInAdmin = async (email, password) => {
    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: new Error(data.error || 'Admin login failed') };
      }

      // Set the session explicitly after successful login via the API route
      if (data.session) {
        const { error: setSessionError } = await supabase.auth.setSession(data.session);
        if (setSessionError) {
          console.error('Error setting session after admin login:', setSessionError);
          return { error: new Error(setSessionError.message || 'Failed to set user session after admin login.') };
        }
      } else {
        // If for some reason the session is not returned, try to get the user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Error fetching user after admin login (no session in response):', userError);
          return { error: new Error(userError.message || 'Failed to retrieve user session after admin login.') };
        }
        setUser(user);
      }

      return { user: data.user, error: null };
    } catch (error) {
      console.error('Frontend Admin Login Error:', error);
      return { error: new Error('An unexpected error occurred during admin login.') };
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signInAdmin, // Add signInAdmin to the context value
    signInWithGoogle,
    logout,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: profile?.user_type === 'admin',
    isLandlord: profile?.user_type === 'landlord',
    isAgent: profile?.user_type === 'agent'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
