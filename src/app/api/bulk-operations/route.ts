import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/auth';
import {
  createBulkOperation,
  listOperations,
  parseBulkInput,
  validateItems,
  type BulkOperationType,
} from '@/lib/bulk-operations/processor';

// GET - List all bulk operations
export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId') || undefined;
    
    const operations = listOperations(projectId);
    
    return NextResponse.json({
      success: true,
      data: operations,
      count: operations.length,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Error listing bulk operations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list operations' },
      { status: 500 }
    );
  }
}

// POST - Create a new bulk operation
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const { type, input, projectId, userId } = body;
    
    if (!type || !input) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type, input' },
        { status: 400 }
      );
    }
    
    // Parse input into items
    const items = parseBulkInput(input);
    
    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid items found in input' },
        { status: 400 }
      );
    }
    
    // Validate items
    const validation = validateItems(type as BulkOperationType, items);
    
    if (validation.valid.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'All items failed validation',
          invalid: validation.invalid,
        },
        { status: 400 }
      );
    }
    
    // Create operation
    const operation = createBulkOperation(
      type as BulkOperationType,
      validation.valid,
      projectId || 'default',
      userId || 'anonymous'
    );
    
    return NextResponse.json({
      success: true,
      data: operation,
      validation: {
        validCount: validation.valid.length,
        invalidCount: validation.invalid.length,
        invalid: validation.invalid,
      },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Error creating bulk operation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create operation' },
      { status: 500 }
    );
  }
}
