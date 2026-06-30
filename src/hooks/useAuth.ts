"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  logout as firebaseLogout,
  signInWithGoogle,
  subscribeToAuth,
} from "@/services/firebase/authService";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = subscribeToAuth((nextUser) => {
        setUser(nextUser);
        setLoading(false);
      });

      return unsubscribe;
    } catch (authError) {
      setError(
        authError instanceof Error ? authError.message : "Unable to initialize authentication. Check your Firebase configuration."
      );
      setLoading(false);
    }
  }, []);

  const login = useCallback(async () => {
    setError(null);

    try {
      await signInWithGoogle();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Unable to sign in.");
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);

    try {
      await firebaseLogout();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Unable to sign out.");
    }
  }, []);

  return {
    user,
    loading,
    error,
    isConfigured: isFirebaseConfigured,
    login,
    logout,
  };
};
