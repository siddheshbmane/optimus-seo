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
  Loader2,
  Mail,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Send,
  Settings,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
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
} from "@/lib/reports/scheduler";

// ---------------------------------------------------------------------------
// Toast-style feedback banner
// ---------------------------------------------------------------------------
type FeedbackType = "success" | "error" | "info";

interface FeedbackMessage {
  id: number;
  type: FeedbackType;
  text: string;
}

function FeedbackBanner({
  messages,
  onDismiss,
}: {
  messages: FeedbackMessage[];
  onDismiss: (id: number) => void;
}) {
  if (messages.length === 0) return null;
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium border animate-in slide-in-from-top-2 ${
            msg.type === "success"
              ? "bg-success/10 text-success border-success/20"
              : msg.type === "error"
              ? "bg-destructive/10 text-destructive border-destructive/20"
              : "bg-accent/10 text-accent border-accent/20"
          }`}
        >
          {msg.type === "success" ? (
            <CheckCircle className="h-4 w-4 shrink-0" />
          ) : msg.type === "error" ? (
            <AlertCircle className="h-4 w-4 shrink-0" />
          ) : (
            <FileText className="h-4 w-4 shrink-0" />
          )}
          <span className="flex-1">{msg.text}</span>
          <button
            onClick={() => onDismiss(msg.id)}
            className="shrink-0 hover:opacity-70 transition-opacity"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------
export default function ScheduledReportsPage() {
  const [reports, setReports] = React.useState<ScheduledReport[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [togglingIds, setTogglingIds] = React.useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = React.useState<Set<string>>(new Set());
  const [runningIds, setRunningIds] = React.useState<Set<string>>(new Set());
  const [feedbackMessages, setFeedbackMessages] = React.useState<FeedbackMessage[]>([]);
  const feedbackCounter = React.useRef(0);

  const [newReport, setNewReport] = React.useState({
    name: "",
    type: "seo-overview" as ReportType,
    frequency: "weekly" as ReportFrequency,
    format: "pdf" as ReportFormat,
    recipients: "",
    hour: "9",
    dayOfWeek: "1",
  });

  // -------------------------------------------------------------------------
  // Feedback helpers
  // -------------------------------------------------------------------------
  const showFeedback = React.useCallback((type: FeedbackType, text: string) => {
    const id = ++feedbackCounter.current;
    setFeedbackMessages((prev) => [...prev, { id, type, text }]);
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setFeedbackMessages((prev) => prev.filter((m) => m.id !== id));
    }, 4000);
  }, []);

  const dismissFeedback = React.useCallback((id: number) => {
    setFeedbackMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // -------------------------------------------------------------------------
  // Load reports from API on mount
  // -------------------------------------------------------------------------
  const fetchReports = React.useCallback(async () => {
    try {
      const response = await fetch("/api/reports/schedule");
      const data = await response.json();
      setReports(data.reports || []);
    } catch {
      showFeedback("error", "Failed to load scheduled reports");
    } finally {
      setIsLoading(false);
    }
  }, [showFeedback]);

  React.useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // -------------------------------------------------------------------------
  // Toggle enabled/disabled via PUT
  // -------------------------------------------------------------------------
  const handleToggleReport = async (id: string) => {
    const report = reports.find((r) => r.id === id);
    if (!report) return;

    setTogglingIds((prev) => new Set(prev).add(id));

    try {
      const response = await fetch("/api/reports/schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, enabled: !report.enabled }),
      });

      if (!response.ok) throw new Error("Toggle failed");

      const data = await response.json();
      setReports((prev) =>
        prev.map((r) => (r.id === id ? data.report : r))
      );
      showFeedback(
        "success",
        `"${report.name}" ${!report.enabled ? "enabled" : "paused"}`
      );
    } catch {
      showFeedback("error", `Failed to update "${report.name}"`);
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // -------------------------------------------------------------------------
  // Delete report via DELETE
  // -------------------------------------------------------------------------
  const handleDeleteReport = async (id: string) => {
    const report = reports.find((r) => r.id === id);
    if (!report) return;

    setDeletingIds((prev) => new Set(prev).add(id));

    try {
      const response = await fetch(`/api/reports/schedule?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      setReports((prev) => prev.filter((r) => r.id !== id));
      showFeedback("success", `"${report.name}" deleted`);
    } catch {
      showFeedback("error", `Failed to delete "${report.name}"`);
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // -------------------------------------------------------------------------
  // Run report now via POST /api/reports/execute
  // -------------------------------------------------------------------------
  const handleRunNow = async (id: string) => {
    const report = reports.find((r) => r.id === id);

    setRunningIds((prev) => new Set(prev).add(id));
    showFeedback("info", `Generating "${report?.name || "report"}"...`);

    try {
      const response = await fetch("/api/reports/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: id }),
      });

      if (!response.ok) throw new Error("Execute failed");

      showFeedback("success", `"${report?.name || "Report"}" generation started`);
    } catch {
      showFeedback("error", `Failed to run "${report?.name || "report"}"`);
    } finally {
      setRunningIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // -------------------------------------------------------------------------
  // Create new schedule via POST /api/reports/schedule
  // -------------------------------------------------------------------------
  const handleCreateReport = async () => {
    if (!newReport.name.trim()) return;

    setIsCreating(true);

    const report: Partial<ScheduledReport> = {
      name: newReport.name,
      projectId: "acme-corp",
      type: newReport.type,
      frequency: newReport.frequency,
      format: newReport.format,
      recipients: newReport.recipients
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean),
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

      if (!response.ok) throw new Error("Create failed");

      const data = await response.json();
      if (data.report) {
        setReports((prev) => [...prev, data.report]);
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
        showFeedback("success", `"${data.report.name}" schedule created`);
      }
    } catch {
      showFeedback("error", "Failed to create report schedule");
    } finally {
      setIsCreating(false);
    }
  };

  // -------------------------------------------------------------------------
  // Formatting helpers
  // -------------------------------------------------------------------------
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

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="container mx-auto py-8 px-4">
      <FeedbackBanner messages={feedbackMessages} onDismiss={dismissFeedback} />

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
                  onChange={(e) =>
                    setNewReport((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Report Type</Label>
                  <Select
                    value={newReport.type}
                    onValueChange={(v) =>
                      setNewReport((prev) => ({
                        ...prev,
                        type: v as ReportType,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seo-overview">SEO Overview</SelectItem>
                      <SelectItem value="keyword-rankings">
                        Keyword Rankings
                      </SelectItem>
                      <SelectItem value="backlink-analysis">
                        Backlink Analysis
                      </SelectItem>
                      <SelectItem value="competitor-comparison">
                        Competitor Comparison
                      </SelectItem>
                      <SelectItem value="technical-audit">
                        Technical Audit
                      </SelectItem>
                      <SelectItem value="ai-visibility">
                        AI Visibility
                      </SelectItem>
                      <SelectItem value="content-performance">
                        Content Performance
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Format</Label>
                  <Select
                    value={newReport.format}
                    onValueChange={(v) =>
                      setNewReport((prev) => ({
                        ...prev,
                        format: v as ReportFormat,
                      }))
                    }
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
                    onValueChange={(v) =>
                      setNewReport((prev) => ({
                        ...prev,
                        frequency: v as ReportFrequency,
                      }))
                    }
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
                    onValueChange={(v) =>
                      setNewReport((prev) => ({ ...prev, hour: v }))
                    }
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
                    onValueChange={(v) =>
                      setNewReport((prev) => ({ ...prev, dayOfWeek: v }))
                    }
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
                <Label htmlFor="recipients">
                  Recipients (comma-separated)
                </Label>
                <Input
                  id="recipients"
                  placeholder="team@company.com, manager@company.com"
                  value={newReport.recipients}
                  onChange={(e) =>
                    setNewReport((prev) => ({
                      ...prev,
                      recipients: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setShowCreateDialog(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateReport}
                disabled={!newReport.name.trim() || isCreating}
              >
                {isCreating && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {isCreating ? "Creating..." : "Create Schedule"}
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
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  reports.filter((r) => r.enabled).length
                )}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Schedules</CardDescription>
              <CardTitle className="text-3xl">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  reports.length
                )}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Paused</CardDescription>
              <CardTitle className="text-3xl">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  reports.filter((r) => !r.enabled).length
                )}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Next Report</CardDescription>
              <CardTitle className="text-lg">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : reports.length > 0 ? (
                  formatNextRun(
                    [...reports]
                      .filter((r) => r.enabled)
                      .sort(
                        (a, b) =>
                          new Date(a.nextRun).getTime() -
                          new Date(b.nextRun).getTime()
                      )[0]?.nextRun || reports[0].nextRun
                  )
                ) : (
                  "No schedules"
                )}
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
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-3 text-muted-foreground">
                  Loading schedules...
                </span>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-1">
                  No scheduled reports
                </h3>
                <p className="text-muted-foreground mb-4">
                  Create your first automated report schedule to get started.
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Schedule
                </Button>
              </div>
            ) : (
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
                  {reports.map((report) => {
                    const isToggling = togglingIds.has(report.id);
                    const isDeleting = deletingIds.has(report.id);
                    const isRunning = runningIds.has(report.id);

                    return (
                      <TableRow
                        key={report.id}
                        className={isDeleting ? "opacity-50" : ""}
                      >
                        <TableCell className="font-medium">
                          {report.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="neutral">
                            {formatReportType(report.type)}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">
                          {report.frequency}
                        </TableCell>
                        <TableCell className="uppercase">
                          {report.format}
                        </TableCell>
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
                          {isToggling ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : (
                            <Switch
                              checked={report.enabled}
                              onCheckedChange={() =>
                                handleToggleReport(report.id)
                              }
                              disabled={isToggling || isDeleting}
                            />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={isDeleting}
                              >
                                {isDeleting ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <MoreHorizontal className="h-4 w-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleRunNow(report.id)}
                                disabled={isRunning}
                              >
                                {isRunning ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4 mr-2" />
                                )}
                                {isRunning ? "Running..." : "Run Now"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteReport(report.id)}
                                disabled={isDeleting}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
