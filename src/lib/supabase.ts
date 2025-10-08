import { createClient, User } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isSupabaseConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "your_supabase_url_here" &&
  supabaseAnonKey !== "your_supabase_anon_key_here" &&
  isValidUrl(supabaseUrl);

if (!isSupabaseConfigured) {
  console.warn(
    "Supabase is not properly configured. Please set up your environment variables in .env.local file."
  );
}

// Create a mock client or real client based on configuration
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Auth helper functions with proper error handling
export const auth = {
  // Sign up new user and create profile in profiles table
  signUp: async (
    email: string,
    password: string,
    userData?: { full_name?: string }
  ) => {
    if (!supabase) {
      return {
        data: null,
        error: {
          message:
            "Supabase is not configured. Please check your .env.local file.",
        },
      };
    }

    // First register the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData?.full_name || "",
          role: "student", // Default user role
        },
      },
    });

    // If auth registration was successful, store user profile in profiles table
    if (data?.user && !error) {
      try {
        // The profiles table will be populated by the database trigger,
        // but we can ensure the data is set correctly here as a fallback
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email: email,
          full_name: userData?.full_name || "",
          role: "student",
        });
      } catch (err) {
        console.error("Error creating user profile:", err);
      }
    }

    return { data, error };
  },

  // Sign in existing user
  signIn: async (email: string, password: string) => {
    if (!supabase) {
      return {
        data: null,
        error: {
          message:
            "Supabase is not configured. Please check your .env.local file.",
        },
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    if (!supabase) {
      return {
        error: {
          message:
            "Supabase is not configured. Please check your .env.local file.",
        },
      };
    }

    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    if (!supabase) {
      return {
        user: null,
        error: {
          message:
            "Supabase is not configured. Please check your .env.local file.",
        },
      };
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // If we have a user, also fetch their profile data from the profiles table
    if (user && !error) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          // Merge profile data into user metadata
          user.user_metadata = {
            ...user.user_metadata,
            ...profile,
          };
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    }

    return { user, error };
  },

  // Listen to auth changes
  onAuthStateChange: (
    callback: (event: string, session: { user: User } | null) => void
  ) => {
    if (!supabase) {
      console.warn(
        "Supabase is not configured. Auth state changes will not be tracked."
      );
      return { data: { subscription: null }, error: null };
    }

    return supabase.auth.onAuthStateChange(callback);
  },

  // Get user profile data from profiles table
  getUserProfile: async (userId: string) => {
    if (!supabase) {
      return {
        profile: null,
        error: {
          message:
            "Supabase is not configured. Please check your .env.local file.",
        },
      };
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    return { profile, error };
  },
};
