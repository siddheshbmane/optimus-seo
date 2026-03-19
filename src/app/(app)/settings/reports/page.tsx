// Scheduled Reports Settings Page
// Manage automated report schedules

"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  Calendar,
  Clock,
  FileText,
  Mail,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Send,
  Settings,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type ScheduledReport,
  type ReportType,
  type ReportFrequency,
  type ReportFormat,
  formatReportType,
  mockScheduledReports,
} from "@/lib/reports/scheduler";

export default function ScheduledReportsPage() {
  const [reports, setReports] = React.useState<ScheduledReport[]>(mockScheduledReports);
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [newReport, setNewReport] = React.useState({
    name: "",
    type: "seo-overview" as ReportType,
    frequency: "weekly" as ReportFrequency,
    format: "pdf" as ReportFormat,
    recipients: "",
    hour: "9",
    dayOfWeek: "1",
  });

  const handleToggleReport = (id: string) => {
    setReports(prev =>
      prev.map(r =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      )
    );
  };

  const handleDeleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const handleRunNow = async (id: string) => {
    try {
      await fetch("/api/reports/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: id }),
      });
    } catch (error) {
      console.error("Failed to run report:", error);
    }
  };

  const handleCreateReport = async () => {
    const report: Partial<ScheduledReport> = {
      name: newReport.name,
      projectId: "acme-corp",
      type: newReport.type,
      frequency: newReport.frequency,
      format: newReport.format,
      recipients: newReport.recipients.split(",").map(e => e.trim()).filter(Boolean),
      customSchedule: {
        hour: parseInt(newReport.hour),
        minute: 0,
        dayOfWeek: parseInt(newReport.dayOfWeek),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    try {
      const response = await fetch("/api/reports/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });
      const data = await response.json();
      if (data.report) {
        setReports(prev => [...prev, data.report]);
        setShowCreateDialog(false);
        setNewReport({
          name: "",
          type: "seo-overview",
          frequency: "weekly",
          format: "pdf",
          recipients: "",
          hour: "9",
          dayOfWeek: "1",
        });
      }
    } catch (error) {
      console.error("Failed to create report:", error);
    }
  };

  const formatNextRun = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Scheduled Reports</h1>
          <p className="text-muted-foreground mt-1">
            Automate report generation and delivery
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Scheduled Report</DialogTitle>
              <DialogDescription>
                Set up automated report generation and email delivery.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Report Name</Label>
                <Input
                  id="name"
                  placeholder="Weekly SEO Overview"
                  value={newReport.name}
                  onChange={(e) => setNewReport(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Report Type</Label>
                  <Select
                    value={newReport.type}
                    onValueChange={(v) => setNewReport(prev => ({ ...prev, type: v as ReportType }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seo-overview">SEO Overview</SelectItem>
                      <SelectItem value="keyword-rankings">Keyword Rankings</SelectItem>
                      <SelectItem value="backlink-analysis">Backlink Analysis</SelectItem>
                      <SelectItem value="competitor-comparison">Competitor Comparison</SelectItem>
                      <SelectItem value="technical-audit">Technical Audit</SelectItem>
                      <SelectItem value="ai-visibility">AI Visibility</SelectItem>
                      <SelectItem value="content-performance">Content Performance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Format</Label>
                  <Select
                    value={newReport.format}
                    onValueChange={(v) => setNewReport(prev => ({ ...prev, format: v as ReportFormat }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Frequency</Label>
                  <Select
                    value={newReport.frequency}
                    onValueChange={(v) => setNewReport(prev => ({ ...prev, frequency: v as ReportFrequency }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Time</Label>
                  <Select
                    value={newReport.hour}
                    onValueChange={(v) => setNewReport(prev => ({ ...prev, hour: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i.toString().padStart(2, "0")}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {newReport.frequency === "weekly" && (
                <div className="grid gap-2">
                  <Label>Day of Week</Label>
                  <Select
                    value={newReport.dayOfWeek}
                    onValueChange={(v) => setNewReport(prev => ({ ...prev, dayOfWeek: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sunday</SelectItem>
                      <SelectItem value="1">Monday</SelectItem>
                      <SelectItem value="2">Tuesday</SelectItem>
                      <SelectItem value="3">Wednesday</SelectItem>
                      <SelectItem value="4">Thursday</SelectItem>
                      <SelectItem value="5">Friday</SelectItem>
                      <SelectItem value="6">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="recipients">Recipients (comma-separated)</Label>
                <Input
                  id="recipients"
                  placeholder="team@company.com, manager@company.com"
                  value={newReport.recipients}
                  onChange={(e) => setNewReport(prev => ({ ...prev, recipients: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateReport} disabled={!newReport.name}>
                Create Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Schedules</CardDescription>
              <CardTitle className="text-3xl">
                {reports.filter(r => r.enabled).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Reports This Month</CardDescription>
              <CardTitle className="text-3xl">24</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Emails Sent</CardDescription>
              <CardTitle className="text-3xl">156</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Next Report</CardDescription>
              <CardTitle className="text-lg">
                {reports.length > 0 
                  ? formatNextRun(reports.sort((a, b) => 
                      new Date(a.nextRun).getTime() - new Date(b.nextRun).getTime()
                    )[0].nextRun)
                  : "No schedules"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Reports</CardTitle>
            <CardDescription>
              Manage your automated report schedules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Next Run</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell>
                      <Badge variant="neutral">{formatReportType(report.type)}</Badge>
                    </TableCell>
                    <TableCell className="capitalize">{report.frequency}</TableCell>
                    <TableCell className="uppercase">{report.format}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{report.recipients.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatNextRun(report.nextRun)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={report.enabled}
                        onCheckedChange={() => handleToggleReport(report.id)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRunNow(report.id)}>
                            <Send className="h-4 w-4 mr-2" />
                            Run Now
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteReport(report.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
