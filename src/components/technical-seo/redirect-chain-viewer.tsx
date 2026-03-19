"use client";

import * as React from "react";
import { ArrowRight, AlertTriangle, CheckCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface RedirectChain {
  id: string;
  originalUrl: string;
  chain: { url: string; statusCode: number }[];
  finalUrl: string;
  hops: number;
}

interface RedirectChainViewerProps {
  chains: RedirectChain[];
  onGenerateFix?: (chain: RedirectChain) => void;
  className?: string;
}

export function RedirectChainViewer({
  chains,
  onGenerateFix,
  className,
}: RedirectChainViewerProps) {
  const [expandedChain, setExpandedChain] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyRedirectRule = (chain: RedirectChain) => {
    const rule = `Redirect 301 ${new URL(chain.originalUrl).pathname} ${chain.finalUrl}`;
    navigator.clipboard.writeText(rule);
    setCopiedId(chain.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {chains.map((chain) => (
        <Card key={chain.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <CardTitle className="text-sm font-medium">
                  {chain.hops} Hop Redirect Chain
                </CardTitle>
                <Badge variant="warning">{chain.hops} redirects</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyRedirectRule(chain)}
                >
                  {copiedId === chain.id ? (
                    <Check className="h-3.5 w-3.5 mr-1 text-success" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 mr-1" />
                  )}
                  {copiedId === chain.id ? "Copied!" : "Copy Fix"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setExpandedChain(expandedChain === chain.id ? null : chain.id)
                  }
                >
                  {expandedChain === chain.id ? "Hide" : "Show"} Chain
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Summary View */}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-mono text-text-muted truncate max-w-[200px]">
                {chain.originalUrl}
              </span>
              <ArrowRight className="h-4 w-4 text-text-muted flex-shrink-0" />
              <span className="text-warning">({chain.hops} hops)</span>
              <ArrowRight className="h-4 w-4 text-text-muted flex-shrink-0" />
              <span className="font-mono text-success truncate max-w-[200px]">
                {chain.finalUrl}
              </span>
            </div>

            {/* Expanded Chain View */}
            {expandedChain === chain.id && (
              <div className="mt-4 p-4 bg-bg-elevated rounded-lg">
                <div className="space-y-3">
                  {chain.chain.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                          index === chain.chain.length - 1
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        )}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm text-text-primary truncate">
                          {step.url}
                        </p>
                      </div>
                      <Badge
                        variant={
                          step.statusCode === 200
                            ? "success"
                            : step.statusCode === 301 || step.statusCode === 302
                            ? "warning"
                            : "error"
                        }
                      >
                        {step.statusCode}
                      </Badge>
                      {index < chain.chain.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-text-muted" />
                      )}
                      {index === chain.chain.length - 1 && (
                        <CheckCircle className="h-4 w-4 text-success" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Fix Code */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                    Recommended Fix (.htaccess)
                  </p>
                  <pre className="p-3 bg-bg-primary rounded text-sm font-mono text-text-secondary">
                    {`# Fix redirect chain
Redirect 301 ${new URL(chain.originalUrl).pathname} ${chain.finalUrl}`}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Mock data for redirect chains
export const mockRedirectChains: RedirectChain[] = [
  {
    id: "1",
    originalUrl: "https://example.com/old-blog-post",
    chain: [
      { url: "https://example.com/old-blog-post", statusCode: 301 },
      { url: "https://example.com/blog/old-post", statusCode: 301 },
      { url: "https://example.com/blog/new-post", statusCode: 200 },
    ],
    finalUrl: "https://example.com/blog/new-post",
    hops: 2,
  },
  {
    id: "2",
    originalUrl: "https://example.com/services/old-service",
    chain: [
      { url: "https://example.com/services/old-service", statusCode: 301 },
      { url: "https://example.com/our-services", statusCode: 301 },
      { url: "https://example.com/services", statusCode: 301 },
      { url: "https://example.com/services/", statusCode: 200 },
    ],
    finalUrl: "https://example.com/services/",
    hops: 3,
  },
  {
    id: "3",
    originalUrl: "https://example.com/about-us",
    chain: [
      { url: "https://example.com/about-us", statusCode: 302 },
      { url: "https://example.com/about", statusCode: 200 },
    ],
    finalUrl: "https://example.com/about",
    hops: 1,
  },
];
