/**
 * Better Auth Client
 * 
 * Client-side authentication utilities for React components.
 * 
 * @see https://www.better-auth.com/docs/concepts/client
 */

import { createAuthClient } from 'better-auth/react'
import { organizationClient, magicLinkClient } from 'better-auth/client/plugins'

// Create the auth client
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  plugins: [
    organizationClient(),
    magicLinkClient(),
  ],
})

// Export commonly used hooks and functions
export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
  // Organization methods
  organization,
  // Magic link methods
  magicLink,
} = authClient

// Helper function to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const result = await getSession()
  // Handle the Better Auth response structure
  if ('data' in result && result.data) {
    return !!result.data.user
  }
  return false
}

// Helper function to get current user
export async function getCurrentUser() {
  const result = await getSession()
  if ('data' in result && result.data) {
    return result.data.user ?? null
  }
  return null
}

// Helper function to get current organization
export async function getCurrentOrganization() {
  const result = await getSession()
  if ('data' in result && result.data) {
    return result.data.session?.activeOrganizationId ?? null
  }
  return null
}
