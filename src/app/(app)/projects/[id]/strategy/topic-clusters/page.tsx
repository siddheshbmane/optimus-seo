"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Layers,
  Plus,
  Eye,
  Edit,
  Sparkles,
  Link2,
  FileText,
  Target,
  CheckCircle,
  Clock,
  ArrowRight,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { SlidePanel } from "@/components/ui/slide-panel";
import { Input } from "@/components/ui/input";
import { getProjectById } from "@/data/mock-projects";
import { cn } from "@/lib/utils";

interface TopicCluster {
  id: number;
  name: string;
  pillarPage: string;
  pillarStatus: "published" | "draft" | "planned";
  clusterPages: number;
  publishedPages: number;
  totalKeywords: number;
  internalLinks: number;
  traffic: number;
}

interface ClusterPage {
  id: number;
  title: string;
  status: "published" | "draft" | "planned";
  links: number;
  targetKeyword?: string;
}

const initialTopicClusters: TopicCluster[] = [
  {
    id: 1,
    name: "Technical SEO",
    pillarPage: "Complete Guide to Technical SEO",
    pillarStatus: "published",
    clusterPages: 8,
    publishedPages: 6,
    totalKeywords: 45,
    internalLinks: 24,
    traffic: 12500,
  },
  {
    id: 2,
    name: "Local SEO",
    pillarPage: "Local SEO Strategy Guide",
    pillarStatus: "published",
    clusterPages: 6,
    publishedPages: 4,
    totalKeywords: 32,
    internalLinks: 18,
    traffic: 8200,
  },
  {
    id: 3,
    name: "Link Building",
    pillarPage: "Link Building Strategies",
    pillarStatus: "draft",
    clusterPages: 10,
    publishedPages: 3,
    totalKeywords: 56,
    internalLinks: 12,
    traffic: 4500,
  },
  {
    id: 4,
    name: "Content Marketing",
    pillarPage: "Content Marketing Playbook",
    pillarStatus: "published",
    clusterPages: 12,
    publishedPages: 9,
    totalKeywords: 78,
    internalLinks: 36,
    traffic: 18900,
  },
  {
    id: 5,
    name: "E-commerce SEO",
    pillarPage: "E-commerce SEO Guide",
    pillarStatus: "planned",
    clusterPages: 7,
    publishedPages: 0,
    totalKeywords: 41,
    internalLinks: 0,
    traffic: 0,
  },
];

const initialClusterPages: ClusterPage[] = [
  { id: 1, title: "Site Speed Optimization Guide", status: "published", links: 4, targetKeyword: "site speed optimization" },
  { id: 2, title: "XML Sitemap Best Practices", status: "published", links: 3, targetKeyword: "xml sitemap" },
  { id: 3, title: "Robots.txt Configuration", status: "published", links: 3, targetKeyword: "robots.txt" },
  { id: 4, title: "Core Web Vitals Explained", status: "published", links: 5, targetKeyword: "core web vitals" },
  { id: 5, title: "Mobile-First Indexing", status: "published", links: 4, targetKeyword: "mobile-first indexing" },
  { id: 6, title: "Structured Data Implementation", status: "published", links: 3, targetKeyword: "structured data" },
  { id: 7, title: "HTTPS Migration Guide", status: "draft", links: 0, targetKeyword: "https migration" },
  { id: 8, title: "JavaScript SEO", status: "draft", links: 0, targetKeyword: "javascript seo" },
];

export default function TopicClustersPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);
  
  const [topicClusters, setTopicClusters] = React.useState(initialTopicClusters);
  const [clusterPages, setClusterPages] = React.useState(initialClusterPages);
  const [selectedCluster, setSelectedCluster] = React.useState(topicClusters[0]);
  const [showNewClusterModal, setShowNewClusterModal] = React.useState(false);
  const [showAddPageModal, setShowAddPageModal] = React.useState(false);
  const [showEditClusterPanel, setShowEditClusterPanel] = React.useState(false);
  const [showEditPageModal, setShowEditPageModal] = React.useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [editingPage, setEditingPage] = React.useState<ClusterPage | null>(null);
  
  const [newCluster, setNewCluster] = React.useState({
    name: "",
    pillarPage: "",
  });
  const [newPage, setNewPage] = React.useState({
    title: "",
    targetKeyword: "",
    status: "planned" as ClusterPage["status"],
  });
  const [editingCluster, setEditingCluster] = React.useState<TopicCluster | null>(null);

  if (!project) return null;

  const totalClusters = topicClusters.length;
  const totalClusterPages = topicClusters.reduce((sum, c) => sum + c.clusterPages, 0);
  const publishedPages = topicClusters.reduce((sum, c) => sum + c.publishedPages, 0);

  const handleAddCluster = () => {
    const cluster: TopicCluster = {
      id: topicClusters.length + 1,
      name: newCluster.name,
      pillarPage: newCluster.pillarPage,
      pillarStatus: "planned",
      clusterPages: 0,
      publishedPages: 0,
      totalKeywords: 0,
      internalLinks: 0,
      traffic: 0,
    };
    setTopicClusters([...topicClusters, cluster]);
    setShowNewClusterModal(false);
    setNewCluster({ name: "", pillarPage: "" });
  };

  const handleAddPage = () => {
    const page: ClusterPage = {
      id: clusterPages.length + 1,
      title: newPage.title,
      status: newPage.status,
      links: 0,
      targetKeyword: newPage.targetKeyword,
    };
    setClusterPages([...clusterPages, page]);
    setShowAddPageModal(false);
    setNewPage({ title: "", targetKeyword: "", status: "planned" });
  };

  const handleEditCluster = () => {
    setEditingCluster({ ...selectedCluster });
    setShowEditClusterPanel(true);
  };

  const handleSaveCluster = () => {
    if (editingCluster) {
      setTopicClusters(prev => 
        prev.map(c => c.id === editingCluster.id ? editingCluster : c)
      );
      setSelectedCluster(editingCluster);
      setShowEditClusterPanel(false);
      setEditingCluster(null);
    }
  };

  const handleDeleteCluster = () => {
    if (editingCluster) {
      setTopicClusters(prev => prev.filter(c => c.id !== editingCluster.id));
      setSelectedCluster(topicClusters[0]);
      setShowDeleteConfirm(false);
      setShowEditClusterPanel(false);
      setEditingCluster(null);
    }
  };

  const handleEditPage = (page: ClusterPage) => {
    setEditingPage({ ...page });
    setShowEditPageModal(true);
  };

  const handleSavePage = () => {
    if (editingPage) {
      setClusterPages(prev => 
        prev.map(p => p.id === editingPage.id ? editingPage : p)
      );
      setShowEditPageModal(false);
      setEditingPage(null);
    }
  };

  const handleDeletePage = () => {
    if (editingPage) {
      setClusterPages(prev => prev.filter(p => p.id !== editingPage.id));
      setShowEditPageModal(false);
      setEditingPage(null);
    }
  };

  const suggestedPages = [
    { title: "Canonical Tags Best Practices", keyword: "canonical tags", difficulty: 42 },
    { title: "Crawl Budget Optimization", keyword: "crawl budget", difficulty: 55 },
    { title: "Log File Analysis Guide", keyword: "log file analysis", difficulty: 48 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Topic Clusters</h1>
          <p className="text-text-secondary">
            Build topical authority with content clusters
          </p>
        </div>
        <Button variant="accent" onClick={() => setShowNewClusterModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Cluster
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Topic Clusters"
          value={totalClusters}
          trendLabel="active clusters"
          icon={<Layers className="h-5 w-5" />}
        />
        <StatCard
          label="Cluster Pages"
          value={totalClusterPages}
          trend={8}
          trendLabel="this month"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          label="Published"
          value={publishedPages}
          trendLabel={`of ${totalClusterPages} pages`}
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatCard
          label="Internal Links"
          value={topicClusters.reduce((sum, c) => sum + c.internalLinks, 0)}
          trend={15}
          trendLabel="this month"
          icon={<Link2 className="h-5 w-5" />}
          variant="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clusters List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Clusters</h2>
          {topicClusters.map((cluster) => (
            <Card
              key={cluster.id}
              onClick={() => setSelectedCluster(cluster)}
              className={cn(
                "cursor-pointer transition-colors",
                selectedCluster.id === cluster.id ? "border-accent" : "hover:border-accent/50"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-text-primary">{cluster.name}</h3>
                    <p className="text-sm text-text-muted">{cluster.pillarPage}</p>
                  </div>
                  <Badge variant={
                    cluster.pillarStatus === "published" ? "success" :
                    cluster.pillarStatus === "draft" ? "warning" : "neutral"
                  }>
                    {cluster.pillarStatus}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <p className="font-semibold text-text-primary">{cluster.publishedPages}/{cluster.clusterPages}</p>
                    <p className="text-xs text-text-muted">Pages</p>
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{cluster.totalKeywords}</p>
                    <p className="text-xs text-text-muted">Keywords</p>
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{cluster.internalLinks}</p>
                    <p className="text-xs text-text-muted">Links</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cluster Detail */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{selectedCluster.name} Cluster</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleEditCluster}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="accent" size="sm" onClick={() => setShowSuggestionsModal(true)}>
                <Sparkles className="h-4 w-4 mr-2" />
                Suggest Pages
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Pillar Page */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text-muted mb-3">Pillar Page</h3>
              <div className="p-4 rounded-lg border-2 border-accent bg-accent/5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-text-primary">{selectedCluster.pillarPage}</h4>
                    <p className="text-sm text-text-muted">/guides/{selectedCluster.name.toLowerCase().replace(/\s+/g, '-')}</p>
                  </div>
                  <Badge variant={
                    selectedCluster.pillarStatus === "published" ? "success" :
                    selectedCluster.pillarStatus === "draft" ? "warning" : "neutral"
                  }>
                    {selectedCluster.pillarStatus}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                  <span>5,200 words</span>
                  <span>•</span>
                  <span>{selectedCluster.totalKeywords} keywords</span>
                </div>
              </div>
            </div>

            {/* Cluster Pages */}
            <div>
              <h3 className="text-sm font-medium text-text-muted mb-3">Cluster Pages ({clusterPages.length})</h3>
              <div className="space-y-2">
                {clusterPages.map((page) => (
                  <div 
                    key={page.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated hover:bg-bg-elevated/80 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        page.status === "published" ? "bg-success" : page.status === "draft" ? "bg-warning" : "bg-text-muted"
                      )} />
                      <span className="text-text-primary">{page.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-text-muted flex items-center gap-1">
                        <Link2 className="h-3 w-3" />
                        {page.links}
                      </span>
                      <Badge variant={page.status === "published" ? "success" : page.status === "draft" ? "warning" : "neutral"}>
                        {page.status}
                      </Badge>
                      <button 
                        onClick={() => handleEditPage(page)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-bg-card transition-all"
                      >
                        <Edit className="h-4 w-4 text-text-muted hover:text-text-primary" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Page */}
            <Button variant="secondary" className="w-full mt-4" onClick={() => setShowAddPageModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Cluster Page
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* New Cluster Modal */}
      <Modal
        isOpen={showNewClusterModal}
        onClose={() => setShowNewClusterModal(false)}
        title="Create Topic Cluster"
        description="Start building a new content cluster"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Cluster Name
            </label>
            <Input 
              placeholder="e.g., Technical SEO"
              value={newCluster.name}
              onChange={(e) => setNewCluster({ ...newCluster, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Pillar Page Title
            </label>
            <Input 
              placeholder="e.g., Complete Guide to Technical SEO"
              value={newCluster.pillarPage}
              onChange={(e) => setNewCluster({ ...newCluster, pillarPage: e.target.value })}
            />
          </div>
          
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowNewClusterModal(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleAddCluster} disabled={!newCluster.name.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Cluster
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Add Page Modal */}
      <Modal
        isOpen={showAddPageModal}
        onClose={() => setShowAddPageModal(false)}
        title="Add Cluster Page"
        description="Add a new page to this cluster"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Page Title
            </label>
            <Input 
              placeholder="e.g., Site Speed Optimization Guide"
              value={newPage.title}
              onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Target Keyword
            </label>
            <Input 
              placeholder="e.g., site speed optimization"
              value={newPage.targetKeyword}
              onChange={(e) => setNewPage({ ...newPage, targetKeyword: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Status
            </label>
            <select 
              className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              value={newPage.status}
              onChange={(e) => setNewPage({ ...newPage, status: e.target.value as ClusterPage["status"] })}
            >
              <option value="planned">Planned</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowAddPageModal(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleAddPage} disabled={!newPage.title.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Page
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Edit Cluster Panel */}
      <SlidePanel
        isOpen={showEditClusterPanel}
        onClose={() => { setShowEditClusterPanel(false); setEditingCluster(null); }}
        title="Edit Cluster"
        description="Update cluster details"
        size="lg"
      >
        {editingCluster && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Cluster Name
              </label>
              <Input 
                value={editingCluster.name}
                onChange={(e) => setEditingCluster({ ...editingCluster, name: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Pillar Page Title
              </label>
              <Input 
                value={editingCluster.pillarPage}
                onChange={(e) => setEditingCluster({ ...editingCluster, pillarPage: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Pillar Page Status
              </label>
              <select 
                className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                value={editingCluster.pillarStatus}
                onChange={(e) => setEditingCluster({ ...editingCluster, pillarStatus: e.target.value as TopicCluster["pillarStatus"] })}
              >
                <option value="planned">Planned</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Total Keywords
                </label>
                <Input 
                  type="number"
                  value={editingCluster.totalKeywords}
                  onChange={(e) => setEditingCluster({ ...editingCluster, totalKeywords: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Internal Links
                </label>
                <Input 
                  type="number"
                  value={editingCluster.internalLinks}
                  onChange={(e) => setEditingCluster({ ...editingCluster, internalLinks: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button 
                variant="ghost" 
                className="text-error hover:text-error hover:bg-error/10"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Cluster
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => { setShowEditClusterPanel(false); setEditingCluster(null); }}>
                  Cancel
                </Button>
                <Button variant="accent" onClick={handleSaveCluster}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>

      {/* Edit Page Modal */}
      <Modal
        isOpen={showEditPageModal}
        onClose={() => { setShowEditPageModal(false); setEditingPage(null); }}
        title="Edit Cluster Page"
        description="Update page details"
        size="md"
      >
        {editingPage && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Page Title
              </label>
              <Input 
                value={editingPage.title}
                onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Target Keyword
              </label>
              <Input 
                value={editingPage.targetKeyword || ""}
                onChange={(e) => setEditingPage({ ...editingPage, targetKeyword: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Status
              </label>
              <select 
                className="w-full h-10 px-3 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                value={editingPage.status}
                onChange={(e) => setEditingPage({ ...editingPage, status: e.target.value as ClusterPage["status"] })}
              >
                <option value="planned">Planned</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Internal Links
              </label>
              <Input 
                type="number"
                value={editingPage.links}
                onChange={(e) => setEditingPage({ ...editingPage, links: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button 
                variant="ghost" 
                className="text-error hover:text-error hover:bg-error/10"
                onClick={handleDeletePage}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => { setShowEditPageModal(false); setEditingPage(null); }}>
                  Cancel
                </Button>
                <Button variant="accent" onClick={handleSavePage}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* AI Suggestions Modal */}
      <Modal
        isOpen={showSuggestionsModal}
        onClose={() => setShowSuggestionsModal(false)}
        title="AI Page Suggestions"
        description={`Suggested pages for the ${selectedCluster.name} cluster`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="font-medium text-text-primary">AI Analysis Complete</p>
                <p className="text-sm text-text-muted mt-1">
                  Based on your existing content and keyword gaps, here are suggested pages to strengthen your {selectedCluster.name} cluster.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {suggestedPages.map((suggestion, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated">
                <div>
                  <p className="font-medium text-text-primary">{suggestion.title}</p>
                  <p className="text-sm text-text-muted">Target: {suggestion.keyword}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-mono text-text-primary">KD: {suggestion.difficulty}</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowSuggestionsModal(false)}>
              Close
            </Button>
            <Button variant="accent">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate More
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Cluster"
        description={`Are you sure you want to delete the "${editingCluster?.name}" cluster?`}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            This action cannot be undone. All cluster pages will remain but will no longer be associated with this cluster.
          </p>

          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="accent" className="bg-error hover:bg-error/90" onClick={handleDeleteCluster}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}
