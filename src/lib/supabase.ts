import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are properly configured
const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_url_here' && 
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  isValidUrl(supabaseUrl)

if (!isSupabaseConfigured) {
  console.warn('Supabase is not properly configured. Please set up your environment variables.')
}

// Create a mock client or real client based on configuration
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Auth helper functions with proper error handling
export const auth = {
  // Sign up new user
  signUp: async (email: string, password: string, userData?: { full_name?: string }) => {
    if (!supabase) {
      return { 
        data: null, 
        error: { message: 'Supabase is not configured. Please connect to Supabase first.' } 
      }
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Sign in existing user
  signIn: async (email: string, password: string) => {
    if (!supabase) {
      return { 
        data: null, 
        error: { message: 'Supabase is not configured. Please connect to Supabase first.' } 
      }
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    if (!supabase) {
      return { error: { message: 'Supabase is not configured. Please connect to Supabase first.' } }
    }
    
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    if (!supabase) {
      return { 
        user: null, 
        error: { message: 'Supabase is not configured. Please connect to Supabase first.' } 
      }
    }
    
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    if (!supabase) {
      console.warn('Supabase is not configured. Auth state changes will not be tracked.')
      return { data: { subscription: null }, error: null }
    }
    
    return supabase.auth.onAuthStateChange(callback)
  }
}