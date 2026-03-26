/**
 * API Response Utilities
 * 
 * Standardized response helpers for API routes.
 * All API responses follow a consistent format.
 */

import { NextResponse } from 'next/server'

// Standard API response type
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
  meta?: {
    page?: number
    pageSize?: number
    total?: number
    totalPages?: number
  }
}

// Success response
export function success<T>(data: T, meta?: ApiResponse['meta'], status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    meta,
  }, { status })
}

export function created<T>(data: T): NextResponse<ApiResponse<T>> {
  return success(data, undefined, 201)
}

// Error response
export function error(
  code: string,
  message: string,
  status: number = 400,
  details?: unknown
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  )
}

// Common error responses
export const errors = {
  unauthorized: () => error('UNAUTHORIZED', 'Authentication required', 401),
  forbidden: () => error('FORBIDDEN', 'You do not have permission to perform this action', 403),
  notFound: (resource: string = 'Resource') => error('NOT_FOUND', `${resource} not found`, 404),
  badRequest: (message: string, details?: unknown) => error('BAD_REQUEST', message, 400, details),
  conflict: (message: string) => error('CONFLICT', message, 409),
  internalError: (message: string = 'An unexpected error occurred') => 
    error('INTERNAL_ERROR', message, 500),
  validationError: (details: unknown) => 
    error('VALIDATION_ERROR', 'Validation failed', 400, details),
  rateLimited: () => error('RATE_LIMITED', 'Too many requests', 429),
}

// Pagination helper
export function paginated<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): NextResponse<ApiResponse<T[]>> {
  return success(data, {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  })
}
