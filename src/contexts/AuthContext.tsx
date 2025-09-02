import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { auth } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Temporary: Create a mock user for testing without Supabase
    const mockUser = {
      id: 'mock-user-id',
      email: 'jane.doe@example.com',
      user_metadata: {
        full_name: 'Jane Doe'
      }
    } as User
    
    setUser(mockUser)
    setLoading(false)
    return
    
    // Get initial session
    auth.getCurrentUser().then(({ user }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Temporary: Mock successful signup
    const mockUser = {
      id: 'mock-user-id',
      email: email,
      user_metadata: {
        full_name: fullName || 'New User'
      }
    } as User
    
    setUser(mockUser)
    return { error: null }
    
    setLoading(true)
    const { error } = await auth.signUp(email, password, { full_name: fullName })
    setLoading(false)
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    // Temporary: Mock successful signin
    const mockUser = {
      id: 'mock-user-id',
      email: email,
      user_metadata: {
        full_name: 'Jane Doe'
      }
    } as User
    
    setUser(mockUser)
    return { error: null }
    
    setLoading(true)
    const { error } = await auth.signIn(email, password)
    setLoading(false)
    return { error }
  }

  const signOut = async () => {
    // Clear the user to redirect to login page
    setUser(null)
    return { error: null }
    
    setLoading(true)
    const { error } = await auth.signOut()
    setLoading(false)
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}