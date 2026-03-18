'use client'

/**
 * Auth Provider
 * 
 * Provides authentication context to the application.
 * Wraps the app with session management.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authClient } from '@/lib/auth/client'

// Session type from Better Auth
type Session = {
  user: {
    id: string
    email: string
    name: string
    avatarUrl?: string | null
    role?: string
  }
  session: {
    id: string
    expiresAt: Date
    activeOrganizationId?: string | null
  }
} | null

// Auth context type
interface AuthContextType {
  session: Session
  isLoading: boolean
  isAuthenticated: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider props
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch session on mount
  useEffect(() => {
    fetchSession()
  }, [])

  const fetchSession = async () => {
    try {
      setIsLoading(true)
      const result = await authClient.getSession()
      setSession(result.data as Session)
    } catch (error) {
      console.error('Failed to fetch session:', error)
      setSession(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await authClient.signOut()
      setSession(null)
      // Redirect to home page
      window.location.href = '/'
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  const value: AuthContextType = {
    session,
    isLoading,
    isAuthenticated: !!session?.user,
    signOut: handleSignOut,
    refreshSession: fetchSession,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook to require authentication
export function useRequireAuth() {
  const { session, isLoading, isAuthenticated } = useAuth()
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login
      const currentPath = window.location.pathname
      window.location.href = `/login?callbackUrl=${encodeURIComponent(currentPath)}`
    }
  }, [isLoading, isAuthenticated])
  
  return { session, isLoading }
}
