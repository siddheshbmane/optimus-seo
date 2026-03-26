import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/auth';
import {
  getOperation,
  cancelOperation,
  deleteOperation,
} from '@/lib/bulk-operations/processor';

// GET - Get operation status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const operation = await getOperation(session.organizationId, id);

    if (!operation) {
      return NextResponse.json(
        { success: false, error: 'Operation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: operation,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Error getting operation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get operation' },
      { status: 500 }
    );
  }
}

// PATCH - Cancel operation
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    if (action === 'cancel') {
      const cancelled = await cancelOperation(session.organizationId, id);

      if (!cancelled) {
        return NextResponse.json(
          { success: false, error: 'Cannot cancel operation' },
          { status: 400 }
        );
      }

      const operation = await getOperation(session.organizationId, id);
      return NextResponse.json({
        success: true,
        message: 'Operation cancelled',
        data: operation,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Error updating operation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update operation' },
      { status: 500 }
    );
  }
}

// DELETE - Delete operation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const deleted = await deleteOperation(session.organizationId, id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Operation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Operation deleted',
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Error deleting operation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete operation' },
      { status: 500 }
    );
  }
}
