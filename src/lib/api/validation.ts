/**
 * API Validation Utilities
 * 
 * Request validation using Zod schemas.
 */

import { z } from 'zod'
import { errors } from './response'

/**
 * Validate request body against a Zod schema
 */
export async function validateBody<T extends z.ZodSchema>(
  request: Request,
  schema: T
): Promise<z.infer<T>> {
  try {
    const body = await request.json()
    const result = schema.safeParse(body)
    
    if (!result.success) {
      throw errors.validationError(result.error.flatten())
    }
    
    return result.data
  } catch (error) {
    if (error instanceof Response) {
      throw error
    }
    throw errors.badRequest('Invalid JSON body')
  }
}

/**
 * Validate query parameters against a Zod schema
 */
export function validateQuery<T extends z.ZodSchema>(
  searchParams: URLSearchParams,
  schema: T
): z.infer<T> {
  const params: Record<string, string | string[]> = {}
  
  searchParams.forEach((value, key) => {
    if (params[key]) {
      // Multiple values for same key
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value)
      } else {
        params[key] = [params[key] as string, value]
      }
    } else {
      params[key] = value
    }
  })
  
  const result = schema.safeParse(params)
  
  if (!result.success) {
    throw errors.validationError(result.error.flatten())
  }
  
  return result.data
}

// Common validation schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export const sortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const searchSchema = z.object({
  search: z.string().optional(),
})

// Project schemas
export const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  clientUrl: z.string().url(),
  industry: z.string().max(100).optional(),
  description: z.string().optional(),
  locationCodes: z.array(z.number()).optional(),
  competitorUrls: z.array(z.string().url()).max(10).optional(),
})

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  clientUrl: z.string().url().optional(),
  industry: z.string().max(100).optional(),
  description: z.string().optional(),
  status: z.enum([
    'created',
    'sales_phase',
    'strategy_phase',
    'execution_phase',
    'reporting',
    'completed',
    'paused',
    'archived',
  ]).optional(),
})

export const projectQuerySchema = paginationSchema.merge(sortSchema).merge(searchSchema).extend({
  status: z.enum([
    'created',
    'sales_phase',
    'strategy_phase',
    'execution_phase',
    'reporting',
    'completed',
    'paused',
    'archived',
  ]).optional(),
})

// Organization schemas
export const createOrganizationSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
})

export const updateOrganizationSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  logoUrl: z.string().url().optional().nullable(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
})

// User schemas
export const inviteUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'strategist', 'executive', 'sales', 'viewer']),
  name: z.string().min(1).max(255).optional(),
})

export const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  role: z.enum(['admin', 'strategist', 'executive', 'sales', 'viewer']).optional(),
  isActive: z.boolean().optional(),
})
