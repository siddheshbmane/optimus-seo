"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Link2,
  Eye,
  FileText,
  Download,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { getProjectById } from "@/data/mock-projects";
import { formatNumber, cn } from "@/lib/utils";

const reportTypes = [
  {
    id: "rankings",
    name: "Rankings Report",
    description: "Track keyword position changes",
    icon: Target,
    href: "rankings",
    lastGenerated: "Today",
  },
  {
    id: "traffic",
    name: "Traffic Report",
    description: "Organic traffic analysis",
    icon: TrendingUp,
    href: "traffic",
    lastGenerated: "Today",
  },
  {
    id: "backlinks",
    name: "Backlinks Report",
    description: "Link profile analysis",
    icon: Link2,
    href: "backlinks",
    lastGenerated: "Yesterday",
  },
  {
    id: "visibility",
    name: "Visibility Report",
    description: "Search visibility trends",
    icon: Eye,
    href: "visibility",
    lastGenerated: "Today",
  },
  {
    id: "content",
    name: "Content Report",
    description: "Content performance metrics",
    icon: FileText,
    href: "content",
    lastGenerated: "2 days ago",
  },
  {
    id: "competitor",
    name: "Competitor Report",
    description: "Competitive analysis",
    icon: BarChart3,
    href: "competitor",
    lastGenerated: "3 days ago",
  },
];

const keyMetrics = [
  {
    label: "Organic Traffic",
    value: "45.2K",
    change: 12.5,
    period: "vs last month",
  },
  {
    label: "Keywords in Top 10",
    value: "156",
    change: 23,
    period: "vs last month",
  },
  {
    label: "Backlinks",
    value: "2,345",
    change: 8.2,
    period: "vs last month",
  },
  {
    label: "Domain Rating",
    value: "52",
    change: 3,
    period: "vs last month",
  },
];

const topKeywords = [
  { keyword: "seo services", position: 3, change: 2, volume: 14800 },
  { keyword: "best seo agency", position: 1, change: 1, volume: 8900 },
  { keyword: "technical seo audit", position: 2, change: 1, volume: 5600 },
  { keyword: "local seo optimization", position: 5, change: 3, volume: 6700 },
  { keyword: "seo consultant", position: 6, change: 3, volume: 9800 },
];

const recentReports = [
  {
    id: 1,
    name: "Monthly SEO Report - February 2026",
    type: "Monthly",
    generatedAt: "Mar 1, 2026",
    pages: 24,
  },
  {
    id: 2,
    name: "Weekly Rankings Update - Week 10",
    type: "Weekly",
    generatedAt: "Mar 10, 2026",
    pages: 8,
  },
  {
    id: 3,
    name: "Competitor Analysis Q1 2026",
    type: "Quarterly",
    generatedAt: "Mar 5, 2026",
    pages: 32,
  },
  {
    id: 4,
    name: "Backlink Audit Report",
    type: "On-demand",
    generatedAt: "Mar 12, 2026",
    pages: 15,
  },
];

export default function ReportsOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const project = getProjectById(projectId);
  
  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [showGenerateModal, setShowGenerateModal] = React.useState(false);
  const [showAllReportsModal, setShowAllReportsModal] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationComplete, setGenerationComplete] = React.useState(false);

  if (!project) return null;

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationComplete(true);
    }, 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Reports</h1>
          <p className="text-sm sm:text-base text-text-secondary">
            Track performance and generate client reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="text-xs sm:text-sm" onClick={() => setShowScheduleModal(true)}>
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Schedule Report</span>
            <span className="sm:hidden">Schedule</span>
          </Button>
          <Button variant="accent" size="sm" className="text-xs sm:text-sm" onClick={() => setShowGenerateModal(true)}>
            <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Generate Report</span>
            <span className="sm:hidden">Generate</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics - 2x2 on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {keyMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-muted">{metric.label}</span>
                <span
                  className={cn(
                    "flex items-center text-xs font-medium",
                    metric.change > 0 ? "text-success" : "text-error"
                  )}
                >
                  {metric.change > 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-0.5" />
                  )}
                  {Math.abs(metric.change)}%
                </span>
              </div>
              <p className="text-2xl font-bold text-text-primary font-mono">
                {metric.value}
              </p>
              <p className="text-xs text-text-muted mt-1">{metric.period}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Types */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Report Types
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => (
            <Link
              key={report.id}
              href={`/projects/${projectId}/reports/${report.href}`}
            >
              <Card className="hover:border-accent/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <report.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-text-primary mb-1">
                        {report.name}
                      </h3>
                      <p className="text-sm text-text-muted mb-2">
                        {report.description}
                      </p>
                      <p className="text-xs text-text-secondary">
                        Last generated: {report.lastGenerated}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-text-muted" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Keywords */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Ranking Keywords</CardTitle>
            <Link href={`/projects/${projectId}/reports/rankings`}>
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topKeywords.map((kw, index) => (
                <div
                  key={kw.keyword}
                  className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-text-muted w-6">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-text-primary">
                        {kw.keyword}
                      </p>
                      <p className="text-xs text-text-muted">
                        {formatNumber(kw.volume)} monthly searches
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-mono font-semibold text-text-primary">
                        #{kw.position}
                      </p>
                      <span
                        className={cn(
                          "flex items-center justify-end text-xs",
                          kw.change > 0 ? "text-success" : "text-error"
                        )}
                      >
                        {kw.change > 0 ? (
                          <TrendingUp className="h-3 w-3 mr-0.5" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-0.5" />
                        )}
                        {Math.abs(kw.change)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Reports</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowAllReportsModal(true)}>
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated hover:bg-bg-elevated/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Report Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule Report"
        description="Set up automated report generation"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Report Name
            </label>
            <Input placeholder="e.g., Weekly SEO Report" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Report Type
            </label>
            <select className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent">
              <option>Full SEO Report</option>
              <option>Rankings Report</option>
              <option>Traffic Report</option>
              <option>Backlinks Report</option>
              <option>Competitor Report</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Frequency
            </label>
            <select className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent">
              <option>Weekly</option>
              <option>Bi-weekly</option>
              <option>Monthly</option>
              <option>Quarterly</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Send To (Email)
            </label>
            <Input placeholder="client@example.com" type="email" />
          </div>
          
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowScheduleModal(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={() => setShowScheduleModal(false)}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Generate Report Modal */}
      <Modal
        isOpen={showGenerateModal}
        onClose={() => {
          setShowGenerateModal(false);
          setIsGenerating(false);
          setGenerationComplete(false);
        }}
        title="Generate Report"
        description="Create a new SEO report"
        size="md"
      >
        {!isGenerating && !generationComplete ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Report Type
              </label>
              <select className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent">
                <option>Full SEO Report</option>
                <option>Rankings Report</option>
                <option>Traffic Report</option>
                <option>Backlinks Report</option>
                <option>Competitor Report</option>
                <option>Content Report</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Date Range
              </label>
              <select className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last 12 months</option>
                <option>Custom range</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Include Sections
              </label>
              <div className="space-y-2">
                {["Executive Summary", "Rankings Overview", "Traffic Analysis", "Backlink Profile", "Competitor Comparison", "Recommendations"].map((section) => (
                  <label key={section} className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-border" />
                    <span className="text-sm text-text-primary">{section}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowGenerateModal(false)}>
                Cancel
              </Button>
              <Button variant="accent" onClick={handleGenerateReport}>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </ModalFooter>
          </div>
        ) : isGenerating ? (
          <div className="py-8 text-center">
            <div className="h-12 w-12 rounded-full border-4 border-accent border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-text-primary font-medium">Generating your report...</p>
            <p className="text-sm text-text-muted mt-1">This may take a few moments</p>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <p className="text-text-primary font-medium">Report Generated!</p>
            <p className="text-sm text-text-muted mt-1">Your report is ready to download</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button variant="secondary" onClick={() => {
                setShowGenerateModal(false);
                setGenerationComplete(false);
              }}>
                Close
              </Button>
              <Button variant="accent">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* All Reports Modal */}
      <Modal
        isOpen={showAllReportsModal}
        onClose={() => setShowAllReportsModal(false)}
        title="All Reports"
        description="View and download all generated reports"
        size="lg"
      >
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {[...recentReports, ...recentReports].map((report, index) => (
            <div
              key={`${report.id}-${index}`}
              className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">{report.name}</p>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Badge variant="neutral">{report.type}</Badge>
                    <span>{report.pages} pages</span>
                    <span>•</span>
                    <span>{report.generatedAt}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowAllReportsModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
