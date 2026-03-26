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
  Search,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { useProjectContext } from "@/contexts/project-context";
import { useBacklinksSummary, useBacklinks } from "@/hooks/use-seo-data";
import { DataSourceIndicator } from "@/components/ui/data-source-indicator";
import { formatNumber, cn } from "@/lib/utils";

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

// Mock competitor gap opportunities (user-managed, not from API)
const competitorGapOpportunities = [
  {
    id: 1,
    domain: "neilpatel.com",
    dr: 91,
    linksToCompetitors: 5,
    relevance: "high" as const,
    topic: "SEO Strategy",
  },
  {
    id: 2,
    domain: "backlinko.com",
    dr: 89,
    linksToCompetitors: 3,
    relevance: "high" as const,
    topic: "Link Building",
  },
  {
    id: 3,
    domain: "searchengineland.com",
    dr: 88,
    linksToCompetitors: 4,
    relevance: "medium" as const,
    topic: "Technical SEO",
  },
  {
    id: 4,
    domain: "contentmarketinginstitute.com",
    dr: 85,
    linksToCompetitors: 2,
    relevance: "medium" as const,
    topic: "Content Marketing",
  },
  {
    id: 5,
    domain: "copyblogger.com",
    dr: 82,
    linksToCompetitors: 3,
    relevance: "low" as const,
    topic: "Copywriting",
  },
];

const statusConfig = {
  sent: { label: "Sent", variant: "neutral" as const, icon: Send },
  opened: { label: "Opened", variant: "info" as const, icon: Eye },
  replied: { label: "Replied", variant: "warning" as const, icon: Mail },
  acquired: { label: "Acquired", variant: "success" as const, icon: CheckCircle },
  rejected: { label: "Rejected", variant: "error" as const, icon: XCircle },
};

const relevanceConfig = {
  high: { label: "High", variant: "success" as const },
  medium: { label: "Medium", variant: "warning" as const },
  low: { label: "Low", variant: "neutral" as const },
};

export default function LinkBuilderPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { project } = useProjectContext();

  // Fetch real backlink data from DataForSEO API
  const {
    data: backlinksSummary,
    isLoading: summaryLoading,
    source: summarySource,
    refetch: refetchSummary,
  } = useBacklinksSummary(project?.url || "");

  const {
    data: backlinks,
    isLoading: backlinksLoading,
    source: backlinksSource,
    refetch: refetchBacklinks,
  } = useBacklinks(project?.url || "", 20);

  const isLoading = summaryLoading || backlinksLoading;
  const source = summarySource || backlinksSource;

  const handleRefresh = React.useCallback(() => {
    refetchSummary();
    refetchBacklinks();
  }, [refetchSummary, refetchBacklinks]);

  if (!project) return null;

  // Outreach stats (user-managed campaigns, kept as mock)
  const totalSent = outreachCampaigns.reduce((sum, c) => sum + c.sent, 0);
  const totalAcquired = outreachCampaigns.reduce((sum, c) => sum + c.acquired, 0);

  // Real stats from API
  const totalBacklinks = backlinksSummary?.totalBacklinks ?? 0;
  const referringDomains = backlinksSummary?.referringDomains ?? 0;
  const newBacklinks30d = backlinksSummary?.newBacklinks30d ?? 0;
  const domainRating = backlinksSummary?.domainRating ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-text-primary">Link Builder</h1>
            <DataSourceIndicator
              source={source}
              isLoading={isLoading}
              onRefresh={handleRefresh}
              compact
            />
          </div>
          <p className="text-text-secondary">
            Automated outreach and link acquisition
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="accent" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats - Wired to real backlink data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Backlinks"
          value={summaryLoading ? "..." : formatNumber(totalBacklinks)}
          trendLabel="from API"
          icon={<Link2 className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Referring Domains"
          value={summaryLoading ? "..." : formatNumber(referringDomains)}
          trendLabel="unique domains"
          icon={<Globe className="h-5 w-5" />}
        />
        <StatCard
          label="New Backlinks (30d)"
          value={summaryLoading ? "..." : formatNumber(newBacklinks30d)}
          trend={newBacklinks30d > 0 ? 12 : 0}
          trendLabel="this month"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Outreach Sent"
          value={totalSent}
          trendLabel={`${totalAcquired} acquired`}
          icon={<Send className="h-5 w-5" />}
        />
      </div>

      {/* Referring Domains / Link Opportunities from API */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Link Opportunities</CardTitle>
            <p className="text-sm text-text-muted mt-1">
              Referring domains linking to your site — ranked by domain rating
            </p>
          </div>
          <DataSourceIndicator
            source={backlinksSource}
            isLoading={backlinksLoading}
            onRefresh={refetchBacklinks}
            compact
          />
        </CardHeader>
        <CardContent>
          {backlinksLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
              <span className="ml-2 text-text-muted">Loading backlink data...</span>
            </div>
          ) : backlinks && backlinks.length > 0 ? (
            <div className="space-y-3">
              {backlinks.map((link, index) => (
                <div
                  key={link.id || index}
                  className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-text-primary">
                          {link.sourceDomain}
                        </p>
                        <Badge variant="accent">DR {link.domainRating}</Badge>
                        {link.isDoFollow ? (
                          <Badge variant="success">dofollow</Badge>
                        ) : (
                          <Badge variant="neutral">nofollow</Badge>
                        )}
                      </div>
                      <p className="text-xs text-text-muted">
                        Anchor: &quot;{link.anchorText}&quot;
                        {link.targetUrl && (
                          <span className="ml-2">
                            &rarr; {link.targetUrl}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <div>
                      <p className="text-xs text-text-muted">
                        First seen: {link.firstSeen}
                      </p>
                    </div>
                    <a
                      href={`https://${link.sourceUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded hover:bg-bg-card text-text-muted hover:text-text-primary transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-bg-elevated mb-4">
                <Link2 className="h-8 w-8 text-text-muted" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">
                No backlink data yet
              </h3>
              <p className="text-text-muted max-w-md mb-4">
                Backlink data will appear here once we fetch it from the API.
              </p>
              <Button variant="accent" size="sm" onClick={refetchBacklinks}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Fetch Backlinks
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
                    <p className="text-sm text-text-muted">{campaign.type} &bull; Started {campaign.startedAt}</p>
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

      {/* Find Opportunities (mock competitor gap data) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Opportunities
            </CardTitle>
            <p className="text-sm text-text-muted mt-1">
              Domains linking to competitors but not to you — mock data, competitor analysis coming soon
            </p>
          </div>
          <Badge variant="warning">Demo Data</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {competitorGapOpportunities.map((opp) => {
              const relevance = relevanceConfig[opp.relevance];
              return (
                <div
                  key={opp.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Target className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-text-primary">{opp.domain}</p>
                        <Badge variant="accent">DR {opp.dr}</Badge>
                        <Badge variant={relevance.variant}>{relevance.label}</Badge>
                      </div>
                      <p className="text-xs text-text-muted">
                        {opp.topic} &bull; Links to {opp.linksToCompetitors} competitor{opp.linksToCompetitors !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Mail className="h-4 w-4 mr-1" />
                    Outreach
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* Backlink Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Backlink Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
              </div>
            ) : backlinksSummary ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-bg-elevated">
                    <p className="text-sm text-text-muted">Domain Rating</p>
                    <p className="text-2xl font-bold text-text-primary">{domainRating}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-bg-elevated">
                    <p className="text-sm text-text-muted">Referring Domains</p>
                    <p className="text-2xl font-bold text-text-primary">{formatNumber(referringDomains)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-bg-elevated">
                    <p className="text-sm text-text-muted">DoFollow</p>
                    <p className="text-2xl font-bold text-success">{formatNumber(backlinksSummary.doFollowLinks)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-bg-elevated">
                    <p className="text-sm text-text-muted">NoFollow</p>
                    <p className="text-2xl font-bold text-text-muted">{formatNumber(backlinksSummary.noFollowLinks)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm text-text-primary">New (30d)</span>
                  </div>
                  <span className="font-semibold text-success">+{formatNumber(backlinksSummary.newBacklinks30d)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-error" />
                    <span className="text-sm text-text-primary">Lost (30d)</span>
                  </div>
                  <span className="font-semibold text-error">-{formatNumber(backlinksSummary.lostBacklinks30d)}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-text-muted">No backlink profile data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
