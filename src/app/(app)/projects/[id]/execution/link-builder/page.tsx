"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Link2,
  Plus,
  Send,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Globe,
  TrendingUp,
  Target,
  RefreshCw,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { getProjectById } from "@/data/mock-projects";
import { cn } from "@/lib/utils";

const outreachCampaigns = [
  {
    id: 1,
    name: "Tech Blog Outreach",
    type: "Guest Post",
    status: "active",
    sent: 45,
    opened: 28,
    replied: 12,
    acquired: 3,
    startedAt: "Mar 10, 2026",
  },
  {
    id: 2,
    name: "Resource Page Links",
    type: "Resource Link",
    status: "active",
    sent: 32,
    opened: 18,
    replied: 8,
    acquired: 2,
    startedAt: "Mar 12, 2026",
  },
  {
    id: 3,
    name: "Broken Link Building",
    type: "Broken Link",
    status: "paused",
    sent: 28,
    opened: 15,
    replied: 5,
    acquired: 1,
    startedAt: "Mar 5, 2026",
  },
];

const recentLinks = [
  {
    id: 1,
    domain: "techcrunch.com",
    dr: 94,
    page: "/guest-post/seo-trends-2026",
    anchor: "SEO trends",
    type: "Guest Post",
    acquiredAt: "2 hours ago",
  },
  {
    id: 2,
    domain: "forbes.com",
    dr: 95,
    page: "/business/digital-marketing-guide",
    anchor: "digital marketing experts",
    type: "Editorial",
    acquiredAt: "1 day ago",
  },
  {
    id: 3,
    domain: "searchenginejournal.com",
    dr: 89,
    page: "/resources/seo-tools",
    anchor: "Acme Corp",
    type: "Resource",
    acquiredAt: "2 days ago",
  },
  {
    id: 4,
    domain: "hubspot.com",
    dr: 93,
    page: "/marketing/seo-statistics",
    anchor: "according to research",
    type: "Citation",
    acquiredAt: "3 days ago",
  },
];

const pendingOutreach = [
  {
    id: 1,
    domain: "moz.com",
    dr: 91,
    contact: "editor@moz.com",
    status: "sent",
    sentAt: "2 hours ago",
    subject: "Guest Post: Technical SEO Guide",
  },
  {
    id: 2,
    domain: "ahrefs.com",
    dr: 92,
    contact: "content@ahrefs.com",
    status: "opened",
    sentAt: "1 day ago",
    subject: "Link Building Case Study",
  },
  {
    id: 3,
    domain: "semrush.com",
    dr: 90,
    contact: "partnerships@semrush.com",
    status: "replied",
    sentAt: "2 days ago",
    subject: "Collaboration Opportunity",
  },
];

const statusConfig = {
  sent: { label: "Sent", variant: "neutral" as const, icon: Send },
  opened: { label: "Opened", variant: "info" as const, icon: Eye },
  replied: { label: "Replied", variant: "warning" as const, icon: Mail },
  acquired: { label: "Acquired", variant: "success" as const, icon: CheckCircle },
  rejected: { label: "Rejected", variant: "error" as const, icon: XCircle },
};

export default function LinkBuilderPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  if (!project) return null;

  const totalSent = outreachCampaigns.reduce((sum, c) => sum + c.sent, 0);
  const totalAcquired = outreachCampaigns.reduce((sum, c) => sum + c.acquired, 0);
  const avgDR = Math.round(recentLinks.reduce((sum, l) => sum + l.dr, 0) / recentLinks.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Link Builder</h1>
          <p className="text-text-secondary">
            Automated outreach and link acquisition
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync
          </Button>
          <Button variant="accent">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Links Acquired"
          value={totalAcquired}
          trend={25}
          trendLabel="this month"
          icon={<Link2 className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Emails Sent"
          value={totalSent}
          trendLabel="total outreach"
          icon={<Send className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. DR"
          value={avgDR}
          trendLabel="of acquired links"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Response Rate"
          value="24%"
          trend={5}
          trendLabel="vs last month"
          icon={<Mail className="h-5 w-5" />}
        />
      </div>

      {/* Campaigns */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Outreach Campaigns</CardTitle>
          <Button variant="ghost" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {outreachCampaigns.map((campaign) => (
              <div key={campaign.id} className="p-4 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-text-primary">{campaign.name}</h3>
                      <Badge variant={campaign.status === "active" ? "success" : "neutral"}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-text-muted">{campaign.type} • Started {campaign.startedAt}</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    {campaign.status === "active" ? "Pause" : "Resume"}
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="p-2 rounded bg-bg-elevated">
                    <p className="text-lg font-semibold text-text-primary">{campaign.sent}</p>
                    <p className="text-xs text-text-muted">Sent</p>
                  </div>
                  <div className="p-2 rounded bg-bg-elevated">
                    <p className="text-lg font-semibold text-info">{campaign.opened}</p>
                    <p className="text-xs text-text-muted">Opened</p>
                  </div>
                  <div className="p-2 rounded bg-bg-elevated">
                    <p className="text-lg font-semibold text-warning">{campaign.replied}</p>
                    <p className="text-xs text-text-muted">Replied</p>
                  </div>
                  <div className="p-2 rounded bg-bg-elevated">
                    <p className="text-lg font-semibold text-success">{campaign.acquired}</p>
                    <p className="text-xs text-text-muted">Acquired</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Links */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Acquired Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-text-primary">{link.domain}</p>
                        <Badge variant="accent">DR {link.dr}</Badge>
                      </div>
                      <p className="text-xs text-text-muted">Anchor: &quot;{link.anchor}&quot;</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="neutral">{link.type}</Badge>
                    <p className="text-xs text-text-muted mt-1">{link.acquiredAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Outreach */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Outreach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingOutreach.map((outreach) => {
                const status = statusConfig[outreach.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                return (
                  <div key={outreach.id} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center",
                        outreach.status === "sent" && "bg-bg-card",
                        outreach.status === "opened" && "bg-info/10",
                        outreach.status === "replied" && "bg-warning/10"
                      )}>
                        <StatusIcon className={cn(
                          "h-5 w-5",
                          outreach.status === "sent" && "text-text-muted",
                          outreach.status === "opened" && "text-info",
                          outreach.status === "replied" && "text-warning"
                        )} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-text-primary">{outreach.domain}</p>
                          <Badge variant="neutral">DR {outreach.dr}</Badge>
                        </div>
                        <p className="text-xs text-text-muted">{outreach.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <p className="text-xs text-text-muted mt-1">{outreach.sentAt}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
