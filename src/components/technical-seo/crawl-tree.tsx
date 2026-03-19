"use client";

import * as React from "react";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface CrawlNode {
  id: string;
  name: string;
  url: string;
  type: "folder" | "page";
  statusCode?: number;
  issues?: number;
  children?: CrawlNode[];
  depth: number;
  isIndexable?: boolean;
}

interface CrawlTreeProps {
  data: CrawlNode;
  onNodeClick?: (node: CrawlNode) => void;
  className?: string;
}

interface TreeNodeProps {
  node: CrawlNode;
  onNodeClick?: (node: CrawlNode) => void;
  level?: number;
}

function TreeNode({ node, onNodeClick, level = 0 }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = React.useState(level < 2);
  const hasChildren = node.children && node.children.length > 0;

  const getStatusIcon = () => {
    if (node.type === "folder") return null;
    if (!node.statusCode) return null;

    if (node.statusCode === 200 && (!node.issues || node.issues === 0)) {
      return <CheckCircle className="h-3.5 w-3.5 text-success" />;
    }
    if (node.statusCode === 200 && node.issues && node.issues > 0) {
      return <AlertTriangle className="h-3.5 w-3.5 text-warning" />;
    }
    if (node.statusCode === 301 || node.statusCode === 302) {
      return <AlertTriangle className="h-3.5 w-3.5 text-warning" />;
    }
    return <AlertCircle className="h-3.5 w-3.5 text-error" />;
  };

  const getStatusBadge = () => {
    if (node.type === "folder") return null;
    if (!node.statusCode) return null;

    return (
      <Badge
        variant={
          node.statusCode === 200
            ? "success"
            : node.statusCode === 301 || node.statusCode === 302
            ? "warning"
            : "error"
        }
        className="text-[10px] px-1.5 py-0"
      >
        {node.statusCode}
      </Badge>
    );
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-bg-elevated cursor-pointer transition-colors",
          level > 0 && "ml-4"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          }
          onNodeClick?.(node);
        }}
      >
        {/* Expand/Collapse Icon */}
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="h-4 w-4 text-text-muted flex-shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 text-text-muted flex-shrink-0" />
          )
        ) : (
          <span className="w-4" />
        )}

        {/* Folder/File Icon */}
        {node.type === "folder" ? (
          isExpanded ? (
            <FolderOpen className="h-4 w-4 text-accent flex-shrink-0" />
          ) : (
            <Folder className="h-4 w-4 text-accent flex-shrink-0" />
          )
        ) : (
          <File className="h-4 w-4 text-text-muted flex-shrink-0" />
        )}

        {/* Name */}
        <span className="text-sm text-text-primary flex-1 truncate">{node.name}</span>

        {/* Status */}
        {getStatusIcon()}
        {getStatusBadge()}

        {/* Issues Badge */}
        {node.issues && node.issues > 0 && (
          <Badge variant="warning" className="text-[10px] px-1.5 py-0">
            {node.issues} issues
          </Badge>
        )}

        {/* Indexable Status */}
        {node.type === "page" && node.isIndexable === false && (
          <Badge variant="neutral" className="text-[10px] px-1.5 py-0">
            noindex
          </Badge>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onNodeClick={onNodeClick}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CrawlTree({ data, onNodeClick, className }: CrawlTreeProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Site Structure</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-y-auto p-4">
          <TreeNode node={data} onNodeClick={onNodeClick} />
        </div>
      </CardContent>
    </Card>
  );
}

// Crawl Depth Visualization
export function CrawlDepthVisualization({
  depths,
  className,
}: {
  depths: { depth: number; pages: number; percentage: number }[];
  className?: string;
}) {
  const maxPages = Math.max(...depths.map((d) => d.pages));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Crawl Depth Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {depths.map((item) => (
            <div key={item.depth} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">
                  Depth {item.depth} ({item.depth === 1 ? "Homepage" : `${item.depth} clicks`})
                </span>
                <span className="font-medium text-text-primary">
                  {item.pages} pages ({item.percentage}%)
                </span>
              </div>
              <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    item.depth <= 2
                      ? "bg-success"
                      : item.depth <= 3
                      ? "bg-accent"
                      : item.depth <= 4
                      ? "bg-warning"
                      : "bg-error"
                  )}
                  style={{ width: `${(item.pages / maxPages) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-bg-elevated">
          <p className="text-sm text-text-secondary">
            <strong className="text-text-primary">Recommendation:</strong> Keep important
            pages within 3 clicks from the homepage for better crawlability and user
            experience.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Mock data for crawl tree
export const mockCrawlTree: CrawlNode = {
  id: "root",
  name: "example.com",
  url: "https://example.com",
  type: "folder",
  depth: 0,
  children: [
    {
      id: "home",
      name: "Home",
      url: "/",
      type: "page",
      statusCode: 200,
      issues: 0,
      depth: 1,
      isIndexable: true,
    },
    {
      id: "about",
      name: "about",
      url: "/about",
      type: "folder",
      depth: 1,
      children: [
        {
          id: "about-index",
          name: "About Us",
          url: "/about",
          type: "page",
          statusCode: 200,
          issues: 1,
          depth: 2,
          isIndexable: true,
        },
        {
          id: "team",
          name: "Team",
          url: "/about/team",
          type: "page",
          statusCode: 200,
          issues: 0,
          depth: 2,
          isIndexable: true,
        },
      ],
    },
    {
      id: "services",
      name: "services",
      url: "/services",
      type: "folder",
      depth: 1,
      children: [
        {
          id: "services-index",
          name: "Services",
          url: "/services",
          type: "page",
          statusCode: 200,
          issues: 2,
          depth: 2,
          isIndexable: true,
        },
        {
          id: "seo",
          name: "SEO Services",
          url: "/services/seo",
          type: "page",
          statusCode: 200,
          issues: 0,
          depth: 2,
          isIndexable: true,
        },
        {
          id: "ppc",
          name: "PPC Services",
          url: "/services/ppc",
          type: "page",
          statusCode: 200,
          issues: 1,
          depth: 2,
          isIndexable: true,
        },
      ],
    },
    {
      id: "blog",
      name: "blog",
      url: "/blog",
      type: "folder",
      depth: 1,
      children: [
        {
          id: "blog-index",
          name: "Blog",
          url: "/blog",
          type: "page",
          statusCode: 200,
          issues: 0,
          depth: 2,
          isIndexable: true,
        },
        {
          id: "post-1",
          name: "SEO Tips 2026",
          url: "/blog/seo-tips-2026",
          type: "page",
          statusCode: 200,
          issues: 0,
          depth: 2,
          isIndexable: true,
        },
        {
          id: "post-2",
          name: "AI in Marketing",
          url: "/blog/ai-marketing",
          type: "page",
          statusCode: 200,
          issues: 1,
          depth: 2,
          isIndexable: true,
        },
      ],
    },
    {
      id: "products",
      name: "products",
      url: "/products",
      type: "folder",
      depth: 1,
      children: [
        {
          id: "products-index",
          name: "Products",
          url: "/products",
          type: "page",
          statusCode: 200,
          issues: 3,
          depth: 2,
          isIndexable: true,
        },
        {
          id: "product-1",
          name: "Product A",
          url: "/products/product-a",
          type: "page",
          statusCode: 200,
          issues: 0,
          depth: 2,
          isIndexable: true,
        },
      ],
    },
    {
      id: "old-page",
      name: "Old Page",
      url: "/old-page",
      type: "page",
      statusCode: 301,
      issues: 1,
      depth: 1,
      isIndexable: false,
    },
    {
      id: "broken",
      name: "Broken Link",
      url: "/broken-link",
      type: "page",
      statusCode: 404,
      issues: 1,
      depth: 1,
      isIndexable: false,
    },
    {
      id: "contact",
      name: "Contact",
      url: "/contact",
      type: "page",
      statusCode: 200,
      issues: 2,
      depth: 1,
      isIndexable: true,
    },
  ],
};

export const mockCrawlDepths = [
  { depth: 1, pages: 8, percentage: 5 },
  { depth: 2, pages: 45, percentage: 29 },
  { depth: 3, pages: 67, percentage: 43 },
  { depth: 4, pages: 28, percentage: 18 },
  { depth: 5, pages: 8, percentage: 5 },
];
