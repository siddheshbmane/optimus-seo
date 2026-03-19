"use client";

import * as React from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Target,
  Link2,
  Eye,
  FileText,
  Calendar,
  Download,
  ArrowRight,
  FolderKanban,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { mockProjects } from "@/data/mock-projects";

const globalStats = {
  totalReports: 156,
  scheduledReports: 12,
  projectsCovered: 5,
  avgGenerationTime: "2.5 min",
};

const recentReports = [
  {
    id: 1,
    name: "Monthly SEO Report - Acme Corp",
    project: "Acme Corp",
    projectId: "acme-corp",
    type: "Monthly",
    generatedAt: "Mar 15, 2026",
    pages: 24,
  },
  {
    id: 2,
    name: "Weekly Rankings - TechStart Inc",
    project: "TechStart Inc",
    projectId: "techstart-inc",
    type: "Weekly",
    generatedAt: "Mar 14, 2026",
    pages: 8,
  },
  {
    id: 3,
    name: "Competitor Analysis - Local Biz Pro",
    project: "Local Biz Pro",
    projectId: "local-biz-pro",
    type: "On-demand",
    generatedAt: "Mar 13, 2026",
    pages: 18,
  },
  {
    id: 4,
    name: "Backlink Audit - E-Shop Global",
    project: "E-Shop Global",
    projectId: "eshop-global",
    type: "Monthly",
    generatedAt: "Mar 12, 2026",
    pages: 15,
  },
  {
    id: 5,
    name: "Traffic Report - Health & Wellness Co",
    project: "Health & Wellness Co",
    projectId: "health-wellness-co",
    type: "Weekly",
    generatedAt: "Mar 11, 2026",
    pages: 12,
  },
];

const scheduledReports = [
  {
    id: 1,
    name: "Weekly Rankings Report",
    frequency: "Weekly",
    nextRun: "Mar 21, 2026",
    projects: ["Acme Corp", "TechStart Inc"],
    status: "active",
  },
  {
    id: 2,
    name: "Monthly SEO Summary",
    frequency: "Monthly",
    nextRun: "Apr 1, 2026",
    projects: ["All Projects"],
    status: "active",
  },
  {
    id: 3,
    name: "Competitor Tracking",
    frequency: "Bi-weekly",
    nextRun: "Mar 24, 2026",
    projects: ["Acme Corp", "E-Shop Global"],
    status: "active",
  },
];

export default function GlobalReportsPage() {
  return (
    <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Reports</h1>
          <p className="text-sm sm:text-base text-text-secondary">
            View and manage reports across all projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="sm:size-md">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Schedule</span>
          </Button>
          <Button variant="accent" size="sm" className="sm:size-md">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Generate</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Reports"
          value={globalStats.totalReports}
          trend={12}
          trendLabel="this month"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          label="Scheduled Reports"
          value={globalStats.scheduledReports}
          trendLabel="active schedules"
          icon={<Calendar className="h-5 w-5" />}
        />
        <StatCard
          label="Projects Covered"
          value={globalStats.projectsCovered}
          trendLabel="with reports"
          icon={<FolderKanban className="h-5 w-5" />}
        />
        <StatCard
          label="Avg Generation Time"
          value={globalStats.avgGenerationTime}
          trendLabel="per report"
          icon={<Clock className="h-5 w-5" />}
          variant="accent"
        />
      </div>

      {/* Projects with Reports */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Project Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockProjects.slice(0, 6).map((project) => (
            <Link key={project.id} href={`/projects/${project.id}/reports`}>
              <Card className="hover:border-accent/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-text-primary mb-1">
                        {project.name}
                      </h3>
                      <p className="text-sm text-text-muted mb-2">
                        {project.url.replace('https://', '')}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <span>{Math.floor(Math.random() * 20) + 5} reports</span>
                        <span>•</span>
                        <span>Last: 2 days ago</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-text-muted" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Reports</CardTitle>
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <Link
                  key={report.id}
                  href={`/projects/${report.projectId}/reports`}
                >
                  <div className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated hover:bg-bg-elevated/80 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary text-sm">
                          {report.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <Badge variant="neutral">{report.type}</Badge>
                          <span>{report.pages} pages</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-muted">
                        {report.generatedAt}
                      </span>
                      <button className="p-1.5 rounded hover:bg-bg-card text-text-muted hover:text-text-primary">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Scheduled Reports</CardTitle>
            <Button variant="ghost" size="sm">
              Manage
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduledReports.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary text-sm">
                        {schedule.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <Badge variant="neutral">{schedule.frequency}</Badge>
                        <span>{schedule.projects.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-text-primary">
                      {schedule.nextRun}
                    </p>
                    <Badge variant="success" className="text-xs">
                      {schedule.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
