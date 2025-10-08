import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { auth } from "../lib/supabase";

// Supporting our custom error format from the auth helper
interface CustomError {
  message: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ error: AuthError | CustomError | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | CustomError | null }>;
  signOut: () => Promise<{ error: AuthError | CustomError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    auth.getCurrentUser().then(({ user }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes - use async block to avoid deadlocks
    const {
      data: { subscription },
    } = auth.onAuthStateChange((_event, session) => {
      // Use async block inside callback to prevent deadlocks
      (() => {
        if (session) {
          setSession(session as Session);
          setUser(session.user ?? null);
        } else {
          setSession(null);
          setUser(null);
        }
        setLoading(false);
      })();
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    const { data, error } = await auth.signUp(email, password, {
      full_name: fullName,
    });

    // If signup was successful, update the user state
    if (data?.user && !error) {
      setUser(data.user);
      setSession(data.session);
    }

    setLoading(false);
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await auth.signIn(email, password);

    // If login was successful, update the user state
    if (data?.user && !error) {
      setUser(data.user);
      setSession(data.session);
    }

    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await auth.signOut();
    setLoading(false);
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
