// API Status Card Component
// Displays the current status of API integrations

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface APIStatus {
  status: string;
  timestamp: string;
  apis: {
    dataForSEO: {
      configured: boolean;
      mockMode: boolean;
    };
    llm: {
      configured: boolean;
      provider: string | null;
      providers: {
        groq: boolean;
        openrouter: boolean;
        openai: boolean;
      };
    };
  };
  features: {
    mockMode: boolean;
    dataForSEO: boolean;
    llm: boolean;
    aiAgents: boolean;
  };
}

export function APIStatusCard() {
  const [status, setStatus] = useState<APIStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch('/api/status');
        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }
        const data = await response.json();
        setStatus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading API Status...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Error Loading Status
          </CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!status) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status.features.mockMode ? (
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
          API Integration Status
        </CardTitle>
        <CardDescription>
          {status.features.mockMode 
            ? 'Running in mock mode - configure API keys for real data'
            : 'Connected to live APIs'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* DataForSEO Status */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">DataForSEO</p>
            <p className="text-sm text-muted-foreground">
              SERP, Keywords, Backlinks, AI Optimization
            </p>
          </div>
          <Badge variant={status.apis.dataForSEO.configured ? 'success' : 'warning'}>
            {status.apis.dataForSEO.configured ? 'Connected' : 'Mock Mode'}
          </Badge>
        </div>

        {/* LLM Status */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">LLM Provider</p>
            <p className="text-sm text-muted-foreground">
              {status.apis.llm.provider 
                ? `Using ${status.apis.llm.provider.toUpperCase()}`
                : 'No provider configured'}
            </p>
          </div>
          <Badge variant={status.apis.llm.configured ? 'success' : 'error'}>
            {status.apis.llm.configured ? 'Active' : 'Not Configured'}
          </Badge>
        </div>

        {/* LLM Providers */}
        {status.apis.llm.configured && (
          <div className="pl-4 border-l-2 border-muted space-y-2">
            <div className="flex items-center gap-2">
              {status.apis.llm.providers.groq ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm">Groq (Free Tier)</span>
            </div>
            <div className="flex items-center gap-2">
              {status.apis.llm.providers.openrouter ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm">OpenRouter</span>
            </div>
            <div className="flex items-center gap-2">
              {status.apis.llm.providers.openai ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm">OpenAI</span>
            </div>
          </div>
        )}

        {/* AI Agents Status */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">AI Agents</p>
            <p className="text-sm text-muted-foreground">
              Autonomous SEO optimization agents
            </p>
          </div>
          <Badge variant={status.features.aiAgents ? 'success' : 'neutral'}>
            {status.features.aiAgents ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
