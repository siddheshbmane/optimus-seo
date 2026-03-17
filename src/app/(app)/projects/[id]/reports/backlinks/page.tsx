"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Link2,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Globe,
  Shield,
  AlertTriangle,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { getProjectById } from "@/data/mock-projects";
import { formatNumber, cn } from "@/lib/utils";

const backlinksData = {
  total: 2345,
  newThisMonth: 156,
  lost: 23,
  dofollow: 1890,
  nofollow: 455,
  domainRating: 52,
  referringDomains: 456,
};

const topBacklinks = [
  {
    id: 1,
    sourceUrl: "techcrunch.com/article/seo-trends",
    targetUrl: "/blog/seo-guide",
    domainRating: 94,
    traffic: 125000,
    type: "dofollow",
    anchor: "SEO best practices",
    firstSeen: "Feb 15, 2026",
  },
  {
    id: 2,
    sourceUrl: "forbes.com/business/marketing",
    targetUrl: "/services",
    domainRating: 95,
    traffic: 890000,
    type: "dofollow",
    anchor: "digital marketing agency",
    firstSeen: "Jan 28, 2026",
  },
  {
    id: 3,
    sourceUrl: "moz.com/blog/link-building",
    targetUrl: "/blog/link-building-guide",
    domainRating: 91,
    traffic: 45000,
    type: "dofollow",
    anchor: "link building strategies",
    firstSeen: "Mar 5, 2026",
  },
  {
    id: 4,
    sourceUrl: "searchenginejournal.com/seo",
    targetUrl: "/blog/technical-seo",
    domainRating: 89,
    traffic: 78000,
    type: "dofollow",
    anchor: "technical SEO guide",
    firstSeen: "Mar 10, 2026",
  },
  {
    id: 5,
    sourceUrl: "hubspot.com/marketing",
    targetUrl: "/",
    domainRating: 93,
    traffic: 560000,
    type: "nofollow",
    anchor: "Acme Corp",
    firstSeen: "Feb 20, 2026",
  },
];

const newBacklinks = [
  { domain: "entrepreneur.com", dr: 92, date: "Mar 15, 2026" },
  { domain: "inc.com", dr: 91, date: "Mar 14, 2026" },
  { domain: "businessinsider.com", dr: 94, date: "Mar 12, 2026" },
  { domain: "wired.com", dr: 93, date: "Mar 10, 2026" },
];

const lostBacklinks = [
  { domain: "smallbiz.com", dr: 45, date: "Mar 13, 2026", reason: "Page removed" },
  { domain: "marketingblog.net", dr: 38, date: "Mar 11, 2026", reason: "Link removed" },
];

export default function BacklinksReportPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  if (!project) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Backlinks Report</h1>
          <p className="text-text-secondary">
            Analyze your link profile and track new backlinks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="accent">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Backlinks"
          value={formatNumber(backlinksData.total)}
          trend={12}
          trendLabel="this month"
          icon={<Link2 className="h-5 w-5" />}
        />
        <StatCard
          label="Referring Domains"
          value={backlinksData.referringDomains}
          trend={8}
          trendLabel="this month"
          icon={<Globe className="h-5 w-5" />}
        />
        <StatCard
          label="Domain Rating"
          value={backlinksData.domainRating}
          trend={3}
          trendLabel="vs last month"
          icon={<Shield className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Dofollow Links"
          value={`${Math.round((backlinksData.dofollow / backlinksData.total) * 100)}%`}
          trendLabel={`${formatNumber(backlinksData.dofollow)} links`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Link Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Backlinks</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Source</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">DR</th>
                    <th className="p-4 text-right text-xs font-medium text-text-muted uppercase">Traffic</th>
                    <th className="p-4 text-center text-xs font-medium text-text-muted uppercase">Type</th>
                    <th className="p-4 text-left text-xs font-medium text-text-muted uppercase">Anchor</th>
                  </tr>
                </thead>
                <tbody>
                  {topBacklinks.map((link) => (
                    <tr key={link.id} className="border-b border-border hover:bg-bg-elevated">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-text-muted" />
                          <span className="text-text-primary">{link.sourceUrl}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-mono font-semibold text-success">{link.domainRating}</span>
                      </td>
                      <td className="p-4 text-right font-mono text-text-primary">
                        {formatNumber(link.traffic)}
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant={link.type === "dofollow" ? "success" : "neutral"}>
                          {link.type}
                        </Badge>
                      </td>
                      <td className="p-4 text-text-secondary">{link.anchor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* New Backlinks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-success" />
                New Backlinks
              </CardTitle>
              <Badge variant="success">{newBacklinks.length}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {newBacklinks.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-bg-elevated">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{link.domain}</p>
                      <p className="text-xs text-text-muted">{link.date}</p>
                    </div>
                    <Badge variant="success">DR {link.dr}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lost Backlinks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ArrowDownRight className="h-4 w-4 text-error" />
                Lost Backlinks
              </CardTitle>
              <Badge variant="error">{lostBacklinks.length}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lostBacklinks.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-bg-elevated">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{link.domain}</p>
                      <p className="text-xs text-text-muted">{link.reason}</p>
                    </div>
                    <Badge variant="neutral">DR {link.dr}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
