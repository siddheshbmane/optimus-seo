"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  LayoutGrid,
  List,
  Clock,
  CheckCircle,
  AlertCircle,
  PenTool,
  FileText,
  Users,
  X,
  Trash2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { SlidePanel } from "@/components/ui/slide-panel";
import { Input } from "@/components/ui/input";
import { useProjectContext } from "@/contexts/project-context";
import { cn } from "@/lib/utils";

type ViewMode = "calendar" | "list";
type ContentStatus = "planned" | "in_progress" | "review" | "published";

interface ContentItem {
  id: number;
  title: string;
  type: "blog" | "pillar" | "landing" | "guide";
  status: ContentStatus;
  dueDate: string;
  assignee: string;
  keywords: string[];
}

const initialContentItems: ContentItem[] = [
  {
    id: 1,
    title: "Complete Guide to Technical SEO in 2026",
    type: "pillar",
    status: "in_progress",
    dueDate: "2026-03-20",
    assignee: "AI Writer",
    keywords: ["technical seo", "seo audit", "site speed"],
  },
  {
    id: 2,
    title: "Local SEO Checklist for Small Businesses",
    type: "blog",
    status: "review",
    dueDate: "2026-03-22",
    assignee: "Content Team",
    keywords: ["local seo", "google business profile"],
  },
  {
    id: 3,
    title: "How to Optimize for Voice Search",
    type: "blog",
    status: "planned",
    dueDate: "2026-03-25",
    assignee: "AI Writer",
    keywords: ["voice search", "conversational seo"],
  },
  {
    id: 4,
    title: "E-commerce SEO Best Practices",
    type: "guide",
    status: "planned",
    dueDate: "2026-03-28",
    assignee: "Content Team",
    keywords: ["ecommerce seo", "product pages"],
  },
  {
    id: 5,
    title: "Link Building Strategies That Work",
    type: "pillar",
    status: "in_progress",
    dueDate: "2026-03-30",
    assignee: "AI Writer",
    keywords: ["link building", "backlinks", "outreach"],
  },
  {
    id: 6,
    title: "Core Web Vitals Optimization Guide",
    type: "guide",
    status: "published",
    dueDate: "2026-03-15",
    assignee: "Content Team",
    keywords: ["core web vitals", "page experience"],
  },
  {
    id: 7,
    title: "SEO for SaaS Companies",
    type: "landing",
    status: "planned",
    dueDate: "2026-04-02",
    assignee: "AI Writer",
    keywords: ["saas seo", "b2b marketing"],
  },
  {
    id: 8,
    title: "Mobile-First Indexing Explained",
    type: "blog",
    status: "published",
    dueDate: "2026-03-10",
    assignee: "Content Team",
    keywords: ["mobile seo", "mobile-first"],
  },
];

const statusConfig = {
  planned: { label: "Planned", variant: "neutral" as const, icon: Calendar },
  in_progress: { label: "In Progress", variant: "info" as const, icon: PenTool },
  review: { label: "In Review", variant: "warning" as const, icon: AlertCircle },
  published: { label: "Published", variant: "success" as const, icon: CheckCircle },
};

const typeConfig = {
  blog: { label: "Blog Post", color: "bg-info/10 text-info" },
  pillar: { label: "Pillar Page", color: "bg-accent/10 text-accent" },
  landing: { label: "Landing Page", color: "bg-success/10 text-success" },
  guide: { label: "Guide", color: "bg-warning/10 text-warning" },
};

export default function ContentCalendarPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { project } = useProjectContext();

  const [contentItems, setContentItems] = React.useState(initialContentItems);
  const [viewMode, setViewMode] = React.useState<ViewMode>("calendar");
  const [currentMonth, setCurrentMonth] = React.useState(new Date(2026, 2, 1)); // March 2026
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [showContentDetail, setShowContentDetail] = React.useState<ContentItem | null>(null);
  const [showEditPanel, setShowEditPanel] = React.useState(false);
  const [editingContent, setEditingContent] = React.useState<ContentItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [filterStatus, setFilterStatus] = React.useState<ContentStatus | "all">("all");
  const [newContent, setNewContent] = React.useState({
    title: "",
    type: "blog" as ContentItem["type"],
    dueDate: "",
    assignee: "AI Writer",
    keywords: "",
  });

  if (!project) return null;

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  const getContentForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return contentItems.filter((item) => item.dueDate === dateStr);
  };

  const filteredContent = filterStatus === "all" 
    ? contentItems 
    : contentItems.filter(item => item.status === filterStatus);

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleAddContent = () => {
    const newItem: ContentItem = {
      id: contentItems.length + 1,
      title: newContent.title,
      type: newContent.type,
      status: "planned",
      dueDate: newContent.dueDate,
      assignee: newContent.assignee,
      keywords: newContent.keywords.split(",").map(k => k.trim()),
    };
    setContentItems([...contentItems, newItem]);
    setShowAddModal(false);
    setNewContent({ title: "", type: "blog", dueDate: "", assignee: "AI Writer", keywords: "" });
  };

  const handleEditContent = (content: ContentItem) => {
    setEditingContent({ ...content });
    setShowContentDetail(null);
    setShowEditPanel(true);
  };

  const handleSaveEdit = () => {
    if (editingContent) {
      setContentItems(prev => 
        prev.map(item => item.id === editingContent.id ? editingContent : item)
      );
      setShowEditPanel(false);
      setEditingContent(null);
    }
  };

  const handleDeleteContent = () => {
    if (editingContent) {
      setContentItems(prev => prev.filter(item => item.id !== editingContent.id));
      setShowDeleteConfirm(false);
      setShowEditPanel(false);
      setEditingContent(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Content Calendar
          </h1>
          <p className="text-text-secondary">
            Plan and schedule your content production
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Filter Dropdown */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {filterStatus !== "all" && (
                <Badge variant="accent" className="ml-2">{filterStatus}</Badge>
              )}
            </Button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <button
                    onClick={() => { setFilterStatus("all"); setShowFilterDropdown(false); }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-md",
                      filterStatus === "all" ? "bg-accent/10 text-accent" : "hover:bg-bg-elevated"
                    )}
                  >
                    All Status
                  </button>
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <button
                      key={status}
                      onClick={() => { setFilterStatus(status as ContentStatus); setShowFilterDropdown(false); }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded-md",
                        filterStatus === status ? "bg-accent/10 text-accent" : "hover:bg-bg-elevated"
                      )}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button variant="ghost" size="sm" onClick={() => setShowInviteModal(true)}>
            <Users className="h-4 w-4 mr-2" />
            Invite
          </Button>

          <div className="flex items-center gap-1 p-1 bg-bg-elevated rounded-lg">
            <button
              onClick={() => setViewMode("calendar")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "calendar"
                  ? "bg-bg-card text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "list"
                  ? "bg-bg-card text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button variant="accent" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = contentItems.filter((i) => i.status === status).length;
          const Icon = config.icon;
          return (
            <Card key={status}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      status === "planned" && "bg-bg-elevated",
                      status === "in_progress" && "bg-info/10",
                      status === "review" && "bg-warning/10",
                      status === "published" && "bg-success/10"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        status === "planned" && "text-text-muted",
                        status === "in_progress" && "text-info",
                        status === "review" && "text-warning",
                        status === "published" && "text-success"
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{count}</p>
                    <p className="text-sm text-text-muted">{config.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {viewMode === "calendar" ? (
        /* Calendar View */
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle>
                {monthName} {year}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date(2026, 2, 1))}>
              Today
            </Button>
          </CardHeader>
          <CardContent>
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-px mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-xs font-medium text-text-muted"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
              {/* Empty cells for days before the first of the month */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-bg-card p-2 min-h-[100px]" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const content = getContentForDate(day);
                const isToday = day === 17 && currentMonth.getMonth() === 2; // March 17

                return (
                  <div
                    key={day}
                    onClick={() => content.length > 0 && setShowContentDetail(content[0])}
                    className={cn(
                      "bg-bg-card p-2 min-h-[100px] hover:bg-bg-elevated transition-colors cursor-pointer",
                      isToday && "ring-2 ring-accent ring-inset"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isToday
                          ? "text-accent"
                          : content.length > 0
                          ? "text-text-primary"
                          : "text-text-muted"
                      )}
                    >
                      {day}
                    </span>
                    <div className="mt-1 space-y-1">
                      {content.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            "text-xs p-1 rounded truncate",
                            typeConfig[item.type].color
                          )}
                        >
                          {item.title}
                        </div>
                      ))}
                      {content.length > 2 && (
                        <div className="text-xs text-text-muted">
                          +{content.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* List View */
        <Card>
          <CardHeader>
            <CardTitle>All Content</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredContent
                .sort(
                  (a, b) =>
                    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                )
                .map((item) => {
                  const status = statusConfig[item.status];
                  const type = typeConfig[item.type];
                  const StatusIcon = status.icon;

                  return (
                    <div
                      key={item.id}
                      onClick={() => setShowContentDetail(item)}
                      className="flex items-center justify-between p-4 hover:bg-bg-elevated transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center",
                            item.status === "planned" && "bg-bg-elevated",
                            item.status === "in_progress" && "bg-info/10",
                            item.status === "review" && "bg-warning/10",
                            item.status === "published" && "bg-success/10"
                          )}
                        >
                          <StatusIcon
                            className={cn(
                              "h-5 w-5",
                              item.status === "planned" && "text-text-muted",
                              item.status === "in_progress" && "text-info",
                              item.status === "review" && "text-warning",
                              item.status === "published" && "text-success"
                            )}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="neutral" className="text-xs">
                              {type.label}
                            </Badge>
                            <span className="text-xs text-text-muted">
                              {item.assignee}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {item.keywords.slice(0, 2).map((kw) => (
                            <Badge key={kw} variant="neutral" className="text-xs">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-text-primary">
                            {new Date(item.dueDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <Badge variant={status.variant} className="text-xs">
                            {status.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Content Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Content"
        description="Schedule new content for your calendar"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Content Title
            </label>
            <Input 
              placeholder="e.g., Complete Guide to Technical SEO"
              value={newContent.title}
              onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Content Type
            </label>
            <select 
              className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              value={newContent.type}
              onChange={(e) => setNewContent({ ...newContent, type: e.target.value as ContentItem["type"] })}
            >
              <option value="blog">Blog Post</option>
              <option value="pillar">Pillar Page</option>
              <option value="landing">Landing Page</option>
              <option value="guide">Guide</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Due Date
            </label>
            <Input 
              type="date"
              value={newContent.dueDate}
              onChange={(e) => setNewContent({ ...newContent, dueDate: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Assignee
            </label>
            <select 
              className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              value={newContent.assignee}
              onChange={(e) => setNewContent({ ...newContent, assignee: e.target.value })}
            >
              <option value="AI Writer">AI Writer</option>
              <option value="Content Team">Content Team</option>
              <option value="External Writer">External Writer</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Target Keywords (comma separated)
            </label>
            <Input 
              placeholder="e.g., technical seo, seo audit"
              value={newContent.keywords}
              onChange={(e) => setNewContent({ ...newContent, keywords: e.target.value })}
            />
          </div>
          
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleAddContent}>
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Team Members"
        description="Add collaborators to your content calendar"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Email Address
            </label>
            <Input placeholder="colleague@company.com" type="email" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Role
            </label>
            <select className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent">
              <option>Editor</option>
              <option>Viewer</option>
              <option>Admin</option>
            </select>
          </div>
          
          <div className="p-3 rounded-lg bg-bg-elevated">
            <p className="text-sm font-medium text-text-primary mb-2">Current Team</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-accent text-white text-xs font-medium flex items-center justify-center">RS</div>
                  <span className="text-sm text-text-primary">Rahul Sharma</span>
                </div>
                <Badge variant="neutral">Admin</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-info text-white text-xs font-medium flex items-center justify-center">JD</div>
                  <span className="text-sm text-text-primary">John Doe</span>
                </div>
                <Badge variant="neutral">Editor</Badge>
              </div>
            </div>
          </div>
          
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button variant="accent">
              <Users className="h-4 w-4 mr-2" />
              Send Invite
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Content Detail Modal */}
      <Modal
        isOpen={!!showContentDetail}
        onClose={() => setShowContentDetail(null)}
        title={showContentDetail?.title || "Content Details"}
        size="md"
      >
        {showContentDetail && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={statusConfig[showContentDetail.status].variant}>
                {statusConfig[showContentDetail.status].label}
              </Badge>
              <Badge variant="neutral">{typeConfig[showContentDetail.type].label}</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-muted">Due Date</p>
                <p className="font-medium text-text-primary">
                  {new Date(showContentDetail.dueDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Assignee</p>
                <p className="font-medium text-text-primary">{showContentDetail.assignee}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-text-muted mb-2">Target Keywords</p>
              <div className="flex flex-wrap gap-2">
                {showContentDetail.keywords.map((kw) => (
                  <Badge key={kw} variant="neutral">{kw}</Badge>
                ))}
              </div>
            </div>
            
            <ModalFooter>
              <Button variant="secondary" onClick={() => setShowContentDetail(null)}>
                Close
              </Button>
              <Button variant="accent" onClick={() => handleEditContent(showContentDetail)}>
                <PenTool className="h-4 w-4 mr-2" />
                Edit Content
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>

      {/* Edit Content Panel */}
      <SlidePanel
        isOpen={showEditPanel}
        onClose={() => { setShowEditPanel(false); setEditingContent(null); }}
        title="Edit Content"
        description="Update content details"
        size="lg"
      >
        {editingContent && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Content Title
              </label>
              <Input 
                value={editingContent.title}
                onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Content Type
              </label>
              <select 
                className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                value={editingContent.type}
                onChange={(e) => setEditingContent({ ...editingContent, type: e.target.value as ContentItem["type"] })}
              >
                <option value="blog">Blog Post</option>
                <option value="pillar">Pillar Page</option>
                <option value="landing">Landing Page</option>
                <option value="guide">Guide</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Status
              </label>
              <select 
                className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                value={editingContent.status}
                onChange={(e) => setEditingContent({ ...editingContent, status: e.target.value as ContentStatus })}
              >
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="published">Published</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Due Date
              </label>
              <Input 
                type="date"
                value={editingContent.dueDate}
                onChange={(e) => setEditingContent({ ...editingContent, dueDate: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Assignee
              </label>
              <select 
                className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                value={editingContent.assignee}
                onChange={(e) => setEditingContent({ ...editingContent, assignee: e.target.value })}
              >
                <option value="AI Writer">AI Writer</option>
                <option value="Content Team">Content Team</option>
                <option value="External Writer">External Writer</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Target Keywords
              </label>
              <Input 
                value={editingContent.keywords.join(", ")}
                onChange={(e) => setEditingContent({ 
                  ...editingContent, 
                  keywords: e.target.value.split(",").map(k => k.trim()).filter(k => k) 
                })}
                placeholder="Comma separated keywords"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button 
                variant="ghost" 
                className="text-error hover:text-error hover:bg-error/10"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => { setShowEditPanel(false); setEditingContent(null); }}>
                  Cancel
                </Button>
                <Button variant="accent" onClick={handleSaveEdit}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Content"
        description={`Are you sure you want to delete "${editingContent?.title}"?`}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            This action cannot be undone. The content will be permanently removed from your calendar.
          </p>

          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="accent" className="bg-error hover:bg-error/90" onClick={handleDeleteContent}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}
