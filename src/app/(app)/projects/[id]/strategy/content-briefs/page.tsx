"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  FileText,
  Plus,
  Download,
  Eye,
  Edit,
  Copy,
  Sparkles,
  Clock,
  CheckCircle,
  Target,
  BarChart2,
  List,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { SlidePanel } from "@/components/ui/slide-panel";
import { Input } from "@/components/ui/input";
import { getProjectById } from "@/data/mock-projects";
import { formatNumber, cn } from "@/lib/utils";

interface ContentBrief {
  id: number;
  title: string;
  targetKeyword: string;
  wordCount: number;
  headings: number;
  status: "draft" | "in_review" | "approved";
  createdAt: string;
  assignee: string;
}

const initialBriefs: ContentBrief[] = [
  {
    id: 1,
    title: "Complete Guide to Technical SEO in 2026",
    targetKeyword: "technical seo guide",
    wordCount: 3500,
    headings: 12,
    status: "approved",
    createdAt: "Mar 10, 2026",
    assignee: "AI Writer",
  },
  {
    id: 2,
    title: "Local SEO Checklist for Small Businesses",
    targetKeyword: "local seo checklist",
    wordCount: 2200,
    headings: 8,
    status: "in_review",
    createdAt: "Mar 12, 2026",
    assignee: "Content Team",
  },
  {
    id: 3,
    title: "How to Optimize for Voice Search",
    targetKeyword: "voice search optimization",
    wordCount: 2800,
    headings: 10,
    status: "draft",
    createdAt: "Mar 14, 2026",
    assignee: "AI Writer",
  },
  {
    id: 4,
    title: "E-commerce SEO Best Practices",
    targetKeyword: "ecommerce seo",
    wordCount: 4000,
    headings: 15,
    status: "approved",
    createdAt: "Mar 8, 2026",
    assignee: "Content Team",
  },
  {
    id: 5,
    title: "Link Building Strategies That Work",
    targetKeyword: "link building strategies",
    wordCount: 3200,
    headings: 11,
    status: "draft",
    createdAt: "Mar 15, 2026",
    assignee: "AI Writer",
  },
];

const briefPreview = {
  title: "Complete Guide to Technical SEO in 2026",
  targetKeyword: "technical seo guide",
  secondaryKeywords: ["technical seo checklist", "technical seo audit", "site speed optimization"],
  wordCount: 3500,
  outline: [
    { h2: "What is Technical SEO?", h3s: ["Definition", "Why It Matters"] },
    { h2: "Technical SEO Checklist", h3s: ["Site Architecture", "URL Structure", "XML Sitemaps"] },
    { h2: "Site Speed Optimization", h3s: ["Core Web Vitals", "Image Optimization", "Caching"] },
    { h2: "Mobile Optimization", h3s: ["Mobile-First Indexing", "Responsive Design"] },
    { h2: "Crawlability & Indexing", h3s: ["Robots.txt", "Canonical Tags", "Pagination"] },
  ],
  competitors: [
    { url: "moz.com/technical-seo-guide", wordCount: 4200 },
    { url: "ahrefs.com/technical-seo", wordCount: 3800 },
    { url: "semrush.com/technical-seo", wordCount: 3500 },
  ],
};

const statusConfig = {
  draft: { label: "Draft", variant: "neutral" as const },
  in_review: { label: "In Review", variant: "warning" as const },
  approved: { label: "Approved", variant: "success" as const },
};

export default function ContentBriefsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);
  const [briefs, setBriefs] = React.useState(initialBriefs);
  const [selectedBrief, setSelectedBrief] = React.useState(briefs[0]);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showEditPanel, setShowEditPanel] = React.useState(false);
  const [newBrief, setNewBrief] = React.useState({
    title: "",
    targetKeyword: "",
    wordCount: 2500,
    assignee: "AI Writer",
  });

  if (!project) return null;

  const handleAddBrief = () => {
    const brief: ContentBrief = {
      id: briefs.length + 1,
      title: newBrief.title,
      targetKeyword: newBrief.targetKeyword,
      wordCount: newBrief.wordCount,
      headings: Math.floor(newBrief.wordCount / 300),
      status: "draft",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      assignee: newBrief.assignee,
    };
    setBriefs([brief, ...briefs]);
    setShowAddModal(false);
    setNewBrief({ title: "", targetKeyword: "", wordCount: 2500, assignee: "AI Writer" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Content Briefs</h1>
          <p className="text-text-secondary">
            AI-generated content outlines and briefs
          </p>
        </div>
        <Button variant="accent" onClick={() => setShowAddModal(true)}>
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Brief
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{briefs.length}</p>
                <p className="text-sm text-text-muted">Total Briefs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {briefs.filter(b => b.status === "approved").length}
                </p>
                <p className="text-sm text-text-muted">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {briefs.filter(b => b.status === "in_review").length}
                </p>
                <p className="text-sm text-text-muted">In Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                <BarChart2 className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {formatNumber(briefs.reduce((sum, b) => sum + b.wordCount, 0))}
                </p>
                <p className="text-sm text-text-muted">Total Words</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Briefs List */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Briefs</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {briefs.map((brief) => (
                <div
                  key={brief.id}
                  onClick={() => setSelectedBrief(brief)}
                  className={cn(
                    "p-4 cursor-pointer transition-colors",
                    selectedBrief.id === brief.id ? "bg-accent/5 border-l-2 border-accent" : "hover:bg-bg-elevated"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-text-primary text-sm line-clamp-2">{brief.title}</h3>
                    <Badge variant={statusConfig[brief.status].variant} className="text-xs ml-2">
                      {statusConfig[brief.status].label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span>{formatNumber(brief.wordCount)} words</span>
                    <span>•</span>
                    <span>{brief.headings} headings</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Brief Preview */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Brief Preview</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowEditPanel(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Title & Meta */}
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-2">{briefPreview.title}</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-text-muted">Target: <span className="text-accent">{briefPreview.targetKeyword}</span></span>
                  <span className="text-text-muted">Words: <span className="text-text-primary">{formatNumber(briefPreview.wordCount)}</span></span>
                </div>
              </div>

              {/* Secondary Keywords */}
              <div>
                <h3 className="text-sm font-medium text-text-muted mb-2">Secondary Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {briefPreview.secondaryKeywords.map((kw) => (
                    <Badge key={kw} variant="neutral">{kw}</Badge>
                  ))}
                </div>
              </div>

              {/* Outline */}
              <div>
                <h3 className="text-sm font-medium text-text-muted mb-3">Content Outline</h3>
                <div className="space-y-3">
                  {briefPreview.outline.map((section, index) => (
                    <div key={index} className="p-3 rounded-lg bg-bg-elevated">
                      <p className="font-medium text-text-primary mb-2">H2: {section.h2}</p>
                      <div className="ml-4 space-y-1">
                        {section.h3s.map((h3, i) => (
                          <p key={i} className="text-sm text-text-secondary">• H3: {h3}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitor Analysis */}
              <div>
                <h3 className="text-sm font-medium text-text-muted mb-3">Competitor Content</h3>
                <div className="space-y-2">
                  {briefPreview.competitors.map((comp, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded bg-bg-elevated">
                      <span className="text-sm text-text-secondary">{comp.url}</span>
                      <span className="text-sm text-text-muted">{formatNumber(comp.wordCount)} words</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="accent" className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Full Content
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Brief Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Generate New Brief"
        description="AI will create a content brief based on your inputs"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Content Title
            </label>
            <Input 
              placeholder="e.g., Complete Guide to Technical SEO"
              value={newBrief.title}
              onChange={(e) => setNewBrief({ ...newBrief, title: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Target Keyword
            </label>
            <Input 
              placeholder="e.g., technical seo guide"
              value={newBrief.targetKeyword}
              onChange={(e) => setNewBrief({ ...newBrief, targetKeyword: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Target Word Count
            </label>
            <Input 
              type="number"
              value={newBrief.wordCount}
              onChange={(e) => setNewBrief({ ...newBrief, wordCount: parseInt(e.target.value) || 0 })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Assignee
            </label>
            <select 
              className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              value={newBrief.assignee}
              onChange={(e) => setNewBrief({ ...newBrief, assignee: e.target.value })}
            >
              <option value="AI Writer">AI Writer</option>
              <option value="Content Team">Content Team</option>
              <option value="External Writer">External Writer</option>
            </select>
          </div>
          
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleAddBrief}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Brief
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Edit Brief Panel */}
      <SlidePanel
        isOpen={showEditPanel}
        onClose={() => setShowEditPanel(false)}
        title="Edit Brief"
        description="Modify the content brief"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Content Title
            </label>
            <Input defaultValue={briefPreview.title} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Target Keyword
            </label>
            <Input defaultValue={briefPreview.targetKeyword} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Secondary Keywords
            </label>
            <Input defaultValue={briefPreview.secondaryKeywords.join(", ")} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Target Word Count
            </label>
            <Input type="number" defaultValue={briefPreview.wordCount} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Content Outline
            </label>
            <div className="space-y-2">
              {briefPreview.outline.map((section, index) => (
                <div key={index} className="p-3 rounded-lg bg-bg-elevated">
                  <Input defaultValue={section.h2} className="mb-2" />
                  {section.h3s.map((h3, i) => (
                    <Input key={i} defaultValue={h3} className="ml-4 mb-1" />
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowEditPanel(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={() => setShowEditPanel(false)}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </SlidePanel>
    </div>
  );
}
