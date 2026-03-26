// Bulk Operations Processor
// Handles batch processing of keywords, domains, and other bulk operations
// State persisted in OrgSetting JSON (survives serverless restarts)

import { prisma } from '@/lib/db';
import type { Prisma } from '@/generated/prisma';

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
  organizationId: string;
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

const ORG_BULK_KEY_PREFIX = 'bulk_op_';

async function saveToDB(op: BulkOperation): Promise<void> {
  const key = `${ORG_BULK_KEY_PREFIX}${op.id}`;
  await prisma.orgSetting.upsert({
    where: { organizationId_key: { organizationId: op.organizationId, key } },
    create: { organizationId: op.organizationId, key, value: op as unknown as Prisma.JsonObject },
    update: { value: op as unknown as Prisma.JsonObject },
  });
}

async function loadFromDB(organizationId: string, opId: string): Promise<BulkOperation | undefined> {
  try {
    const key = `${ORG_BULK_KEY_PREFIX}${opId}`;
    const setting = await prisma.orgSetting.findUnique({
      where: { organizationId_key: { organizationId, key } },
    });
    if (!setting) return undefined;
    return setting.value as unknown as BulkOperation;
  } catch {
    return undefined;
  }
}

async function listFromDB(organizationId: string, projectId?: string): Promise<BulkOperation[]> {
  try {
    const settings = await prisma.orgSetting.findMany({
      where: {
        organizationId,
        key: { startsWith: ORG_BULK_KEY_PREFIX },
      },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
    const ops = settings.map(s => s.value as unknown as BulkOperation);
    if (projectId) return ops.filter(op => op.projectId === projectId);
    return ops;
  } catch {
    return [];
  }
}

// Create bulk operation
export async function createBulkOperation(
  type: BulkOperationType,
  items: string[],
  projectId: string,
  userId: string,
  organizationId: string
): Promise<BulkOperation> {
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
    organizationId,
  };
  await saveToDB(operation);
  return operation;
}

// Get operation status
export async function getOperation(organizationId: string, id: string): Promise<BulkOperation | undefined> {
  return loadFromDB(organizationId, id);
}

// List operations
export async function listOperations(organizationId: string, projectId?: string): Promise<BulkOperation[]> {
  return listFromDB(organizationId, projectId);
}

// Cancel operation
export async function cancelOperation(organizationId: string, id: string): Promise<boolean> {
  const operation = await loadFromDB(organizationId, id);
  if (!operation || operation.status !== 'processing') return false;
  operation.status = 'cancelled';
  await saveToDB(operation);
  return true;
}

// Delete operation
export async function deleteOperation(organizationId: string, id: string): Promise<boolean> {
  try {
    const key = `${ORG_BULK_KEY_PREFIX}${id}`;
    await prisma.orgSetting.delete({
      where: { organizationId_key: { organizationId, key } },
    });
    return true;
  } catch {
    return false;
  }
}

// Parse bulk input (handles various formats)
export function parseBulkInput(input: string): string[] {
  const items = input
    .split(/[\n,;]+/)
    .map(item => item.trim())
    .filter(item => item.length > 0);
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
      case 'competitor_analysis': {
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
        if (!domainRegex.test(item)) {
          invalid.push({ item, reason: 'Invalid domain format' });
        } else {
          valid.push(item);
        }
        break;
      }
    }
  }

  return { valid, invalid };
}
