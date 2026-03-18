/**
 * Prisma Client Singleton
 * 
 * This module provides a singleton instance of the Prisma client
 * to prevent multiple instances during development hot reloading.
 * 
 * Prisma 7 requires passing the database URL via adapter.
 * 
 * @see https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 * @see https://pris.ly/d/prisma7-client-config
 */

import { PrismaClient } from '@/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const { Pool } = pg

// Create a connection pool
const connectionString = process.env.DATABASE_URL

// For development without a database, we'll create a mock client
// In production, this should always have a valid DATABASE_URL
const createPrismaClient = () => {
  if (!connectionString) {
    console.warn('DATABASE_URL not set. Database operations will fail.')
    // Return a client that will fail on actual queries
    // This allows the app to start without a database for frontend-only development
    return new PrismaClient()
  }

  const pool = new Pool({ connectionString })
  // Type assertion needed due to @types/pg version mismatch with @prisma/adapter-pg
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaPg(pool as any)
  
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma

// Re-export types for convenience
export * from '@/generated/prisma'
