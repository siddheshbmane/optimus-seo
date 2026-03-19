// Bulk Operations Processor
// Handles batch processing of keywords, domains, and other bulk operations

export type BulkOperationType = 
  | 'keyword_research'
  | 'rank_check'
  | 'backlink_analysis'
  | 'site_audit'
  | 'competitor_analysis';

export interface BulkOperation {
  id: string;
  type: BulkOperationType;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  items: string[];
  processedCount: number;
  totalCount: number;
  results: BulkOperationResult[];
  errors: BulkOperationError[];
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  projectId: string;
  userId: string;
}

export interface BulkOperationResult {
  item: string;
  data: Record<string, unknown>;
  processedAt: string;
}

export interface BulkOperationError {
  item: string;
  error: string;
  code?: string;
}

// In-memory storage
const operations: Map<string, BulkOperation> = new Map();

// Create bulk operation
export function createBulkOperation(
  type: BulkOperationType,
  items: string[],
  projectId: string,
  userId: string
): BulkOperation {
  const operation: BulkOperation = {
    id: `bulk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    status: 'pending',
    items,
    processedCount: 0,
    totalCount: items.length,
    results: [],
    errors: [],
    createdAt: new Date().toISOString(),
    projectId,
    userId,
  };
  
  operations.set(operation.id, operation);
  return operation;
}

// Get operation status
export function getOperation(id: string): BulkOperation | undefined {
  return operations.get(id);
}

// List operations
export function listOperations(projectId?: string): BulkOperation[] {
  const all = Array.from(operations.values());
  if (projectId) {
    return all.filter(op => op.projectId === projectId);
  }
  return all;
}

// Process operation (simulated)
export async function processOperation(
  id: string,
  processor: (item: string) => Promise<Record<string, unknown>>
): Promise<BulkOperation> {
  const operation = operations.get(id);
  if (!operation) {
    throw new Error('Operation not found');
  }
  
  operation.status = 'processing';
  operation.startedAt = new Date().toISOString();
  
  for (const item of operation.items) {
    // Check if cancelled (status can change during processing)
    const currentOp = operations.get(id);
    if (currentOp?.status === 'cancelled') break;
    
    try {
      const data = await processor(item);
      operation.results.push({
        item,
        data,
        processedAt: new Date().toISOString(),
      });
    } catch (error) {
      operation.errors.push({
        item,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
    
    operation.processedCount++;
  }
  
  operation.status = operation.errors.length === operation.totalCount ? 'failed' : 'completed';
  operation.completedAt = new Date().toISOString();
  
  return operation;
}

// Cancel operation
export function cancelOperation(id: string): boolean {
  const operation = operations.get(id);
  if (!operation || operation.status !== 'processing') {
    return false;
  }
  operation.status = 'cancelled';
  return true;
}

// Delete operation
export function deleteOperation(id: string): boolean {
  return operations.delete(id);
}

// Parse bulk input (handles various formats)
export function parseBulkInput(input: string): string[] {
  // Split by newlines, commas, or semicolons
  const items = input
    .split(/[\n,;]+/)
    .map(item => item.trim())
    .filter(item => item.length > 0);
  
  // Remove duplicates
  return [...new Set(items)];
}

// Validate items based on operation type
export function validateItems(
  type: BulkOperationType,
  items: string[]
): { valid: string[]; invalid: { item: string; reason: string }[] } {
  const valid: string[] = [];
  const invalid: { item: string; reason: string }[] = [];
  
  for (const item of items) {
    switch (type) {
      case 'keyword_research':
      case 'rank_check':
        if (item.length < 2) {
          invalid.push({ item, reason: 'Keyword too short' });
        } else if (item.length > 100) {
          invalid.push({ item, reason: 'Keyword too long' });
        } else {
          valid.push(item);
        }
        break;
        
      case 'backlink_analysis':
      case 'site_audit':
      case 'competitor_analysis':
        // Basic domain validation
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
        if (!domainRegex.test(item)) {
          invalid.push({ item, reason: 'Invalid domain format' });
        } else {
          valid.push(item);
        }
        break;
    }
  }
  
  return { valid, invalid };
}
