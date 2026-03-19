"use client";

import * as React from "react";
import {
  Treemap,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface LinkNode {
  name: string;
  url: string;
  incomingLinks: number;
  outgoingLinks: number;
  pageRank: number;
  depth: number;
}

export interface LinkGraphData {
  nodes: LinkNode[];
  totalLinks: number;
  avgLinksPerPage: number;
  orphanPages: number;
}

interface LinkGraphProps {
  data: LinkGraphData;
  className?: string;
}

// Custom content for treemap cells
const CustomizedContent = (props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  incomingLinks?: number;
}) => {
  const { x = 0, y = 0, width = 0, height = 0, name, incomingLinks } = props;

  if (width < 50 || height < 30) return null;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: getColorByLinks(incomingLinks || 0),
          stroke: "#1F2937",
          strokeWidth: 2,
        }}
      />
      {width > 80 && height > 40 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 8}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
            fontWeight="bold"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            fill="#fff"
            fontSize={10}
          >
            {incomingLinks} links
          </text>
        </>
      )}
    </g>
  );
};

function getColorByLinks(links: number): string {
  if (links >= 100) return "#10B981"; // green - high authority
  if (links >= 50) return "#3B82F6"; // blue - good
  if (links >= 20) return "#F59E0B"; // yellow - moderate
  if (links >= 5) return "#F97316"; // orange - low
  return "#EF4444"; // red - very low
}

export function LinkGraph({ data, className }: LinkGraphProps) {
  const treemapData = data.nodes.map((node) => ({
    name: node.name,
    size: node.incomingLinks + 1, // +1 to avoid zero size
    incomingLinks: node.incomingLinks,
    outgoingLinks: node.outgoingLinks,
    pageRank: node.pageRank,
    url: node.url,
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Internal Link Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#1F2937"
              content={<CustomizedContent />}
            >
              <Tooltip
                content={({ payload }) => {
                  if (!payload || !payload.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-bg-card border border-border rounded-lg p-3 shadow-lg">
                      <p className="font-medium text-text-primary">{data.name}</p>
                      <p className="text-sm text-text-muted">{data.url}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          <span className="text-text-muted">Incoming:</span>{" "}
                          <span className="font-medium">{data.incomingLinks}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-text-muted">Outgoing:</span>{" "}
                          <span className="font-medium">{data.outgoingLinks}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-text-muted">PageRank:</span>{" "}
                          <span className="font-medium">{data.pageRank.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                  );
                }}
              />
            </Treemap>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#10B981" }} />
            <span className="text-xs text-text-muted">100+ links</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#3B82F6" }} />
            <span className="text-xs text-text-muted">50-99 links</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#F59E0B" }} />
            <span className="text-xs text-text-muted">20-49 links</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#F97316" }} />
            <span className="text-xs text-text-muted">5-19 links</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#EF4444" }} />
            <span className="text-xs text-text-muted">&lt;5 links</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// PageRank Distribution Component
export function PageRankDistribution({
  nodes,
  className,
}: {
  nodes: LinkNode[];
  className?: string;
}) {
  const sortedNodes = [...nodes].sort((a, b) => b.pageRank - a.pageRank).slice(0, 10);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Top Pages by PageRank</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedNodes.map((node, index) => (
            <div
              key={node.url}
              className="flex items-center gap-3 p-3 rounded-lg border border-border"
            >
              <span className="text-lg font-bold text-accent">#{index + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary truncate">{node.name}</p>
                <p className="text-sm text-text-muted truncate">{node.url}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-text-primary">
                  {node.pageRank.toFixed(2)}
                </p>
                <p className="text-xs text-text-muted">{node.incomingLinks} links</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Mock data for link graph
export const mockLinkGraphData: LinkGraphData = {
  nodes: [
    { name: "Home", url: "/", incomingLinks: 156, outgoingLinks: 45, pageRank: 1.0, depth: 0 },
    { name: "Services", url: "/services", incomingLinks: 89, outgoingLinks: 32, pageRank: 0.85, depth: 1 },
    { name: "About", url: "/about", incomingLinks: 67, outgoingLinks: 18, pageRank: 0.72, depth: 1 },
    { name: "Blog", url: "/blog", incomingLinks: 54, outgoingLinks: 120, pageRank: 0.68, depth: 1 },
    { name: "Contact", url: "/contact", incomingLinks: 45, outgoingLinks: 8, pageRank: 0.55, depth: 1 },
    { name: "Products", url: "/products", incomingLinks: 38, outgoingLinks: 65, pageRank: 0.52, depth: 1 },
    { name: "Pricing", url: "/pricing", incomingLinks: 32, outgoingLinks: 12, pageRank: 0.48, depth: 2 },
    { name: "FAQ", url: "/faq", incomingLinks: 28, outgoingLinks: 15, pageRank: 0.42, depth: 2 },
    { name: "Careers", url: "/careers", incomingLinks: 15, outgoingLinks: 8, pageRank: 0.28, depth: 2 },
    { name: "Privacy", url: "/privacy", incomingLinks: 12, outgoingLinks: 3, pageRank: 0.22, depth: 3 },
    { name: "Terms", url: "/terms", incomingLinks: 10, outgoingLinks: 3, pageRank: 0.18, depth: 3 },
    { name: "Blog Post 1", url: "/blog/post-1", incomingLinks: 8, outgoingLinks: 5, pageRank: 0.15, depth: 2 },
    { name: "Blog Post 2", url: "/blog/post-2", incomingLinks: 6, outgoingLinks: 4, pageRank: 0.12, depth: 2 },
    { name: "Blog Post 3", url: "/blog/post-3", incomingLinks: 4, outgoingLinks: 3, pageRank: 0.08, depth: 2 },
  ],
  totalLinks: 4523,
  avgLinksPerPage: 12.4,
  orphanPages: 12,
};
