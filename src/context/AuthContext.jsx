import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail, 
  signOutUser, 
  onAuthStateChangedListener 
} from '../firebaseConfig'; // Using the renamed file

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = onAuthStateChangedListener((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const googleSignIn = async () => {
    try {
      setError('');
      const userData = await signInWithGoogle();
      return userData;
    } catch (error) {
      setError(error.message || 'Failed to sign in with Google');
      throw error;
    }
  };

  // Sign in with email and password
  const emailSignIn = async (email, password) => {
    try {
      setError('');
      const userData = await signInWithEmail(email, password);
      return userData;
    } catch (error) {
      setError(error.message || 'Failed to sign in');
      throw error;
    }
  };

  // Sign up with email and password
  const signUp = async (email, password, name) => {
    try {
      setError('');
      const userData = await signUpWithEmail(email, password, name);
      return userData;
    } catch (error) {
      setError(error.message || 'Failed to create an account');
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOutUser();
      setUser(null);
      // Navigation should be handled by the component that calls logout
    } catch (error) {
      setError('Failed to sign out');
      console.error('Logout error:', error);
      throw error; // Re-throw to allow components to handle the error
    }
  };

  const value = {
    user,
    loading,
    error,
    googleSignIn,
    emailSignIn,
    signUp,
    logout,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
