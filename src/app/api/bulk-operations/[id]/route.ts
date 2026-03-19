import { NextRequest, NextResponse } from 'next/server';
import {
  getOperation,
  cancelOperation,
  deleteOperation,
  processOperation,
} from '@/lib/bulk-operations/processor';

// GET - Get operation status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const operation = getOperation(id);
    
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
    console.error('Error getting operation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get operation' },
      { status: 500 }
    );
  }
}

// POST - Start processing operation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const operation = getOperation(id);
    
    if (!operation) {
      return NextResponse.json(
        { success: false, error: 'Operation not found' },
        { status: 404 }
      );
    }
    
    if (operation.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Operation already started or completed' },
        { status: 400 }
      );
    }
    
    // Start processing in background (simulated)
    // In production, this would be a queue job
    processOperation(id, async (item) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data based on operation type
      return {
        item,
        searchVolume: Math.floor(Math.random() * 10000),
        difficulty: Math.floor(Math.random() * 100),
        cpc: (Math.random() * 5).toFixed(2),
        processedAt: new Date().toISOString(),
      };
    });
    
    return NextResponse.json({
      success: true,
      message: 'Operation started',
      data: getOperation(id),
    });
  } catch (error) {
    console.error('Error starting operation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to start operation' },
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
    const { id } = await params;
    const body = await request.json();
    const { action } = body;
    
    if (action === 'cancel') {
      const cancelled = cancelOperation(id);
      
      if (!cancelled) {
        return NextResponse.json(
          { success: false, error: 'Cannot cancel operation' },
          { status: 400 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Operation cancelled',
        data: getOperation(id),
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
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
    const { id } = await params;
    const deleted = deleteOperation(id);
    
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
    console.error('Error deleting operation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete operation' },
      { status: 500 }
    );
  }
}
