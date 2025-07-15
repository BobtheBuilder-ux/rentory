"use client"
import { useState, useEffect, createContext, useContext } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Get user profile from Firestore
        const profileRef = doc(db, 'profiles', user.uid);
        const profileSnap = await getDoc(profileRef);
        setProfile(profileSnap.exists() ? profileSnap.data() : null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email, password, userData) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'profiles', user.uid), {
        ...userData,
        user_id: user.uid,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // Update display name
      await updateProfile(user, {
        displayName: `${userData.first_name} ${userData.last_name}`
      });

      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
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
