'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Play, 
  Pause, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  FileText,
  Search,
  Link,
  Globe,
  Users
} from 'lucide-react';

interface BulkOperation {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  items: string[];
  processedCount: number;
  totalCount: number;
  results: Array<{ item: string; data: Record<string, unknown>; processedAt: string }>;
  errors: Array<{ item: string; error: string }>;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

const operationTypes = [
  { value: 'keyword_research', label: 'Keyword Research', icon: Search, description: 'Analyze search volume, difficulty, and CPC for keywords' },
  { value: 'rank_check', label: 'Rank Tracking', icon: FileText, description: 'Check rankings for keywords across search engines' },
  { value: 'backlink_analysis', label: 'Backlink Analysis', icon: Link, description: 'Analyze backlink profiles for domains' },
  { value: 'site_audit', label: 'Site Audit', icon: Globe, description: 'Run technical SEO audits on domains' },
  { value: 'competitor_analysis', label: 'Competitor Analysis', icon: Users, description: 'Analyze competitor domains' },
];

export default function BulkOperationsPage() {
  const [operations, setOperations] = useState<BulkOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedType, setSelectedType] = useState('keyword_research');
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch operations
  const fetchOperations = async () => {
    try {
      const response = await fetch('/api/bulk-operations');
      const data = await response.json();
      if (data.success) {
        setOperations(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch operations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperations();
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchOperations, 5000);
    return () => clearInterval(interval);
  }, []);

  // Create operation
  const handleCreate = async () => {
    if (!inputText.trim()) {
      setError('Please enter items to process');
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/bulk-operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          input: inputText,
          projectId: 'default',
          userId: 'current-user',
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setInputText('');
        fetchOperations();
      } else {
        setError(data.error || 'Failed to create operation');
      }
    } catch (err) {
      setError('Failed to create operation');
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  // Start operation
  const handleStart = async (id: string) => {
    try {
      await fetch(`/api/bulk-operations/${id}`, {
        method: 'POST',
      });
      fetchOperations();
    } catch (err) {
      console.error('Failed to start operation:', err);
    }
  };

  // Cancel operation
  const handleCancel = async (id: string) => {
    try {
      await fetch(`/api/bulk-operations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      });
      fetchOperations();
    } catch (err) {
      console.error('Failed to cancel operation:', err);
    }
  };

  // Delete operation
  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/bulk-operations/${id}`, {
        method: 'DELETE',
      });
      fetchOperations();
    } catch (err) {
      console.error('Failed to delete operation:', err);
    }
  };

  const getStatusBadge = (status: BulkOperation['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="neutral"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'processing':
        return <Badge variant="info"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Processing</Badge>;
      case 'completed':
        return <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'failed':
        return <Badge variant="error"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case 'cancelled':
        return <Badge variant="warning"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    const opType = operationTypes.find(t => t.value === type);
    if (opType) {
      const Icon = opType.icon;
      return <Icon className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bulk Operations</h1>
          <p className="text-muted-foreground">
            Process multiple keywords or domains at once
          </p>
        </div>
        <Button variant="ghost" onClick={fetchOperations}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Create New Operation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Create New Operation
          </CardTitle>
          <CardDescription>
            Enter keywords or domains (one per line, or comma-separated)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Operation Type Selection */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {operationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    selectedType === type.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <div className="text-sm font-medium">{type.label}</div>
                </button>
              );
            })}
          </div>

          {/* Input Area */}
          <div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                selectedType.includes('keyword')
                  ? 'Enter keywords:\nseo tools\nkeyword research\ncontent optimization'
                  : 'Enter domains:\nexample.com\ncompetitor.com\nanothersite.org'
              }
              className="w-full h-40 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {inputText.split(/[\n,;]+/).filter(i => i.trim()).length} items detected
            </p>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button onClick={handleCreate} disabled={creating}>
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Create Operation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Operations List */}
      <Card>
        <CardHeader>
          <CardTitle>Operations History</CardTitle>
          <CardDescription>
            View and manage your bulk operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : operations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No operations yet. Create one above to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {operations.map((op) => (
                <div
                  key={op.id}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(op.type)}
                      <div>
                        <div className="font-medium">
                          {operationTypes.find(t => t.value === op.type)?.label || op.type}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {op.totalCount} items
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(op.status)}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {(op.status === 'processing' || op.status === 'completed') && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{op.processedCount} / {op.totalCount}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${(op.processedCount / op.totalCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Errors */}
                  {op.errors.length > 0 && (
                    <div className="text-sm text-destructive">
                      {op.errors.length} error(s)
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {op.status === 'pending' && (
                      <Button size="sm" onClick={() => handleStart(op.id)}>
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </Button>
                    )}
                    {op.status === 'processing' && (
                      <Button size="sm" variant="secondary" onClick={() => handleCancel(op.id)}>
                        <Pause className="w-3 h-3 mr-1" />
                        Cancel
                      </Button>
                    )}
                    {(op.status === 'completed' || op.status === 'failed' || op.status === 'cancelled') && (
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(op.id)}>
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>

                  {/* Timestamps */}
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(op.createdAt).toLocaleString()}
                    {op.completedAt && ` | Completed: ${new Date(op.completedAt).toLocaleString()}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
