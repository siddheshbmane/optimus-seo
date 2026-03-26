"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  FileText,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Copy,
  Sparkles,
  Clock,
  CheckCircle,
  MoreHorizontal,
  Presentation,
  ChevronLeft,
  ChevronRight,
  X,
  Layout,
  Palette,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { SlidePanel } from "@/components/ui/slide-panel";
import { Input } from "@/components/ui/input";
import { DataSourceIndicator } from "@/components/ui/data-source-indicator";
import { useProjectContext } from "@/contexts/project-context";
import { useSEOAnalysis } from "@/hooks/use-llm";
import { cn } from "@/lib/utils";

const initialPitchDecks = [
  {
    id: 1,
    name: "Q1 2026 SEO Strategy Proposal",
    slides: 24,
    createdAt: "Mar 10, 2026",
    updatedAt: "Mar 15, 2026",
    status: "ready",
    thumbnail: "strategy",
  },
  {
    id: 2,
    name: "Technical SEO Audit Results",
    slides: 18,
    createdAt: "Mar 5, 2026",
    updatedAt: "Mar 5, 2026",
    status: "ready",
    thumbnail: "audit",
  },
  {
    id: 3,
    name: "Competitor Analysis Report",
    slides: 32,
    createdAt: "Feb 28, 2026",
    updatedAt: "Mar 1, 2026",
    status: "ready",
    thumbnail: "competitor",
  },
  {
    id: 4,
    name: "Monthly Performance Review",
    slides: 15,
    createdAt: "Mar 1, 2026",
    updatedAt: "Mar 1, 2026",
    status: "draft",
    thumbnail: "performance",
  },
];

const templates = [
  { id: 1, name: "SEO Strategy Proposal", slides: 20, category: "Sales", description: "Comprehensive SEO strategy presentation for client pitches" },
  { id: 2, name: "Technical Audit Report", slides: 15, category: "Audit", description: "Detailed technical SEO audit findings and recommendations" },
  { id: 3, name: "Monthly Performance", slides: 12, category: "Reports", description: "Monthly SEO performance metrics and insights" },
  { id: 4, name: "Competitor Analysis", slides: 18, category: "Research", description: "In-depth competitor SEO analysis and opportunities" },
  { id: 5, name: "Content Strategy", slides: 16, category: "Strategy", description: "Content marketing and SEO content strategy" },
  { id: 6, name: "Link Building Plan", slides: 14, category: "Execution", description: "Link building strategy and outreach plan" },
];

const mockSlides = [
  { id: 1, title: "Title Slide", type: "title" },
  { id: 2, title: "Executive Summary", type: "content" },
  { id: 3, title: "Current Performance", type: "chart" },
  { id: 4, title: "Keyword Rankings", type: "table" },
  { id: 5, title: "Traffic Analysis", type: "chart" },
  { id: 6, title: "Competitor Overview", type: "content" },
  { id: 7, title: "Recommendations", type: "list" },
  { id: 8, title: "Next Steps", type: "content" },
];

export default function PitchDeckPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { project } = useProjectContext();

  const [pitchDecks, setPitchDecks] = React.useState(initialPitchDecks);
  const [showPreviewModal, setShowPreviewModal] = React.useState(false);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showTemplateModal, setShowTemplateModal] = React.useState(false);
  const [showEditPanel, setShowEditPanel] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [showDeckMenu, setShowDeckMenu] = React.useState<number | null>(null);
  
  const [selectedDeck, setSelectedDeck] = React.useState<typeof initialPitchDecks[0] | null>(null);
  const [selectedTemplate, setSelectedTemplate] = React.useState<typeof templates[0] | null>(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  
  // Create deck form
  const [newDeck, setNewDeck] = React.useState({
    name: "",
    template: null as typeof templates[0] | null,
    aiGenerate: false,
  });
  const [generatedContent, setGeneratedContent] = React.useState<string | null>(null);
  const [showGeneratedContent, setShowGeneratedContent] = React.useState(false);

  // LLM hook for AI generation
  const { analyze, isLoading: llmLoading } = useSEOAnalysis();

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setShowDeckMenu(null);
    if (showDeckMenu !== null) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showDeckMenu]);

  if (!project) return null;

  const handlePreview = (deck: typeof initialPitchDecks[0]) => {
    setSelectedDeck(deck);
    setCurrentSlide(0);
    setShowPreviewModal(true);
  };

  const handleEdit = (deck: typeof initialPitchDecks[0]) => {
    setSelectedDeck(deck);
    setShowEditPanel(true);
    setShowDeckMenu(null);
  };

  const handleDuplicate = (deck: typeof initialPitchDecks[0]) => {
    const newDeckItem = {
      ...deck,
      id: pitchDecks.length + 1,
      name: `${deck.name} (Copy)`,
      status: "draft" as const,
      createdAt: "Mar 18, 2026",
      updatedAt: "Mar 18, 2026",
    };
    setPitchDecks([...pitchDecks, newDeckItem]);
    setShowDeckMenu(null);
  };

  const handleDelete = () => {
    if (selectedDeck) {
      setPitchDecks(pitchDecks.filter(d => d.id !== selectedDeck.id));
      setShowDeleteConfirm(false);
      setSelectedDeck(null);
    }
  };

  const handleTemplateSelect = (template: typeof templates[0]) => {
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };

  const handleCreateFromTemplate = () => {
    if (selectedTemplate) {
      const newDeckItem = {
        id: pitchDecks.length + 1,
        name: newDeck.name || `New ${selectedTemplate.name}`,
        slides: selectedTemplate.slides,
        createdAt: "Mar 18, 2026",
        updatedAt: "Mar 18, 2026",
        status: "draft" as const,
        thumbnail: "new",
      };
      setPitchDecks([...pitchDecks, newDeckItem]);
      setShowTemplateModal(false);
      setSelectedTemplate(null);
      setNewDeck({ name: "", template: null, aiGenerate: false });
    }
  };

  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  const handleGenerateDeck = async () => {
    if (newDeck.aiGenerate) {
      try {
        const result = await analyze('generateContent', {
          topic: `Create a pitch deck outline for: "${newDeck.name || 'SEO Strategy Proposal'}" for project "${project?.name || ''}"`,
          keywords: ['seo strategy', 'performance metrics', 'recommendations'],
          contentType: 'landing' as const,
        });
        setGeneratedContent(result);
        setShowGeneratedContent(true);
      } catch {
        // Error handled by hook
      }
    }

    const newDeckItem = {
      id: pitchDecks.length + 1,
      name: newDeck.name || "AI Generated Deck",
      slides: 20,
      createdAt: "Mar 18, 2026",
      updatedAt: "Mar 18, 2026",
      status: "draft" as const,
      thumbnail: "ai",
    };
    setPitchDecks([...pitchDecks, newDeckItem]);
    setShowCreateModal(false);
    setNewDeck({ name: "", template: null, aiGenerate: false });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-text-primary">Pitch Deck Generator</h1>
            <DataSourceIndicator
              source="mock"
              isLoading={false}
              compact
              showRefreshButton={false}
            />
          </div>
          <p className="text-text-secondary">
            Create AI-powered sales presentations and proposals
          </p>
        </div>
        <Button variant="accent" onClick={handleCreateNew} disabled={llmLoading}>
          <Sparkles className="h-4 w-4 mr-2" />
          {llmLoading ? "Generating..." : "Generate New Deck"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Presentation className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{pitchDecks.length}</p>
                <p className="text-sm text-text-muted">Total Decks</p>
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
                  {pitchDecks.filter(d => d.status === "ready").length}
                </p>
                <p className="text-sm text-text-muted">Ready to Present</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Edit className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {pitchDecks.filter(d => d.status === "draft").length}
                </p>
                <p className="text-sm text-text-muted">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {pitchDecks.reduce((sum, d) => sum + d.slides, 0)}
                </p>
                <p className="text-sm text-text-muted">Total Slides</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decks Grid */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Your Decks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pitchDecks.map((deck) => (
            <Card key={deck.id} className="hover:border-accent/50 transition-colors">
              <CardContent className="p-4">
                <div 
                  className="aspect-video bg-bg-elevated rounded-lg mb-3 flex items-center justify-center cursor-pointer hover:bg-bg-elevated/80 transition-colors"
                  onClick={() => handlePreview(deck)}
                >
                  <Presentation className="h-12 w-12 text-text-muted" />
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 
                    className="font-medium text-text-primary line-clamp-2 cursor-pointer hover:text-accent transition-colors"
                    onClick={() => handlePreview(deck)}
                  >
                    {deck.name}
                  </h3>
                  <div className="relative">
                    <button 
                      className="p-1 rounded hover:bg-bg-elevated text-text-muted"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeckMenu(showDeckMenu === deck.id ? null : deck.id);
                      }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {showDeckMenu === deck.id && (
                      <div 
                        className="absolute right-0 mt-1 w-40 bg-bg-card border border-border rounded-lg shadow-lg z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-1">
                          <button 
                            onClick={() => handleEdit(deck)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-bg-elevated text-left"
                          >
                            <Edit className="h-4 w-4 text-text-muted" />
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDuplicate(deck)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-bg-elevated text-left"
                          >
                            <Copy className="h-4 w-4 text-text-muted" />
                            Duplicate
                          </button>
                          <button 
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-bg-elevated text-left"
                          >
                            <Download className="h-4 w-4 text-text-muted" />
                            Download
                          </button>
                          <div className="border-t border-border my-1" />
                          <button 
                            onClick={() => {
                              setSelectedDeck(deck);
                              setShowDeleteConfirm(true);
                              setShowDeckMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-bg-elevated text-left text-error"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-text-muted mb-3">
                  <span>{deck.slides} slides</span>
                  <Badge variant={deck.status === "ready" ? "success" : "warning"}>
                    {deck.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handlePreview(deck)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    Preview
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Create New Card */}
          <Card 
            className="border-dashed hover:border-accent/50 transition-colors cursor-pointer"
            onClick={handleCreateNew}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[240px]">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                <Plus className="h-6 w-6 text-accent" />
              </div>
              <p className="font-medium text-text-primary mb-1">Create New Deck</p>
              <p className="text-sm text-text-muted text-center">
                Start from scratch or use a template
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer text-center group"
              >
                <div className="h-16 w-16 rounded-lg bg-bg-elevated flex items-center justify-center mx-auto mb-2 group-hover:bg-accent/10 transition-colors">
                  <FileText className="h-8 w-8 text-text-muted group-hover:text-accent transition-colors" />
                </div>
                <p className="font-medium text-text-primary text-sm mb-1">{template.name}</p>
                <p className="text-xs text-text-muted">{template.slides} slides</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => { setShowPreviewModal(false); setSelectedDeck(null); setCurrentSlide(0); }}
        title={selectedDeck?.name || "Preview"}
        size="xl"
      >
        <div className="space-y-4">
          {/* Slide Preview */}
          <div className="aspect-video bg-bg-elevated rounded-lg flex items-center justify-center relative">
            <div className="text-center">
              <Presentation className="h-16 w-16 text-text-muted mx-auto mb-4" />
              <p className="text-lg font-medium text-text-primary">
                {mockSlides[currentSlide]?.title || "Slide Preview"}
              </p>
              <p className="text-sm text-text-muted mt-1">
                Slide {currentSlide + 1} of {mockSlides.length}
              </p>
            </div>
            
            {/* Navigation Arrows */}
            <button
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-bg-card/80 hover:bg-bg-card disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => setCurrentSlide(prev => Math.min(mockSlides.length - 1, prev + 1))}
              disabled={currentSlide === mockSlides.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-bg-card/80 hover:bg-bg-card disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Slide Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {mockSlides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "flex-shrink-0 w-24 h-16 rounded-md border-2 flex items-center justify-center transition-colors",
                  currentSlide === index
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-accent/50"
                )}
              >
                <span className="text-xs text-text-muted">{index + 1}</span>
              </button>
            ))}
          </div>

          <ModalFooter>
            <Button variant="secondary" onClick={() => { setShowPreviewModal(false); setSelectedDeck(null); }}>
              Close
            </Button>
            <Button variant="ghost">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="accent" onClick={() => {
              setShowPreviewModal(false);
              if (selectedDeck) handleEdit(selectedDeck);
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Deck
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Create New Deck Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setNewDeck({ name: "", template: null, aiGenerate: false }); }}
        title="Create New Deck"
        description="Start with AI generation or choose a template"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Deck Name
            </label>
            <Input
              placeholder="e.g., Q2 2026 SEO Strategy"
              value={newDeck.name}
              onChange={(e) => setNewDeck({ ...newDeck, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Creation Method
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setNewDeck({ ...newDeck, aiGenerate: true })}
                className={cn(
                  "p-4 rounded-lg border text-left transition-colors",
                  newDeck.aiGenerate
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">AI Generate</p>
                    <p className="text-xs text-text-muted">Let AI create your deck</p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary">
                  Our AI will analyze your project data and create a customized presentation.
                </p>
              </button>
              <button
                onClick={() => setNewDeck({ ...newDeck, aiGenerate: false })}
                className={cn(
                  "p-4 rounded-lg border text-left transition-colors",
                  !newDeck.aiGenerate
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                    <Layout className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">Use Template</p>
                    <p className="text-xs text-text-muted">Start from a template</p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary">
                  Choose from our library of professional templates.
                </p>
              </button>
            </div>
          </div>

          {!newDeck.aiGenerate && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Select Template
              </label>
              <div className="grid grid-cols-3 gap-3">
                {templates.slice(0, 6).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setNewDeck({ ...newDeck, template })}
                    className={cn(
                      "p-3 rounded-lg border text-center transition-colors",
                      newDeck.template?.id === template.id
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/50"
                    )}
                  >
                    <FileText className="h-6 w-6 text-text-muted mx-auto mb-2" />
                    <p className="text-sm font-medium text-text-primary">{template.name}</p>
                    <p className="text-xs text-text-muted">{template.slides} slides</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={handleGenerateDeck}
              disabled={(!newDeck.name.trim() && !newDeck.aiGenerate) || llmLoading}
            >
              {newDeck.aiGenerate ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Deck
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Deck
                </>
              )}
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Template Detail Modal */}
      <Modal
        isOpen={showTemplateModal}
        onClose={() => { setShowTemplateModal(false); setSelectedTemplate(null); }}
        title={selectedTemplate?.name || "Template"}
        description={selectedTemplate?.description}
        size="md"
      >
        <div className="space-y-4">
          <div className="aspect-video bg-bg-elevated rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-12 w-12 text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-muted">{selectedTemplate?.slides} slides</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-bg-elevated text-center">
              <p className="text-lg font-semibold text-text-primary">{selectedTemplate?.slides}</p>
              <p className="text-xs text-text-muted">Slides</p>
            </div>
            <div className="p-3 rounded-lg bg-bg-elevated text-center">
              <p className="text-lg font-semibold text-text-primary">{selectedTemplate?.category}</p>
              <p className="text-xs text-text-muted">Category</p>
            </div>
            <div className="p-3 rounded-lg bg-bg-elevated text-center">
              <p className="text-lg font-semibold text-text-primary">Pro</p>
              <p className="text-xs text-text-muted">Quality</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Deck Name
            </label>
            <Input
              placeholder={`New ${selectedTemplate?.name}`}
              value={newDeck.name}
              onChange={(e) => setNewDeck({ ...newDeck, name: e.target.value })}
            />
          </div>

          <ModalFooter>
            <Button variant="secondary" onClick={() => { setShowTemplateModal(false); setSelectedTemplate(null); }}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleCreateFromTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              Use Template
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Edit Panel */}
      <SlidePanel
        isOpen={showEditPanel}
        onClose={() => { setShowEditPanel(false); setSelectedDeck(null); }}
        title={`Edit: ${selectedDeck?.name}`}
        description="Customize your presentation"
        size="lg"
      >
        {selectedDeck && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Deck Name
              </label>
              <Input defaultValue={selectedDeck.name} />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Slides ({mockSlides.length})
              </label>
              <div className="space-y-2">
                {mockSlides.map((slide, index) => (
                  <div 
                    key={slide.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-bg-elevated"
                  >
                    <span className="text-sm text-text-muted w-6">{index + 1}</span>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">{slide.title}</p>
                      <p className="text-xs text-text-muted capitalize">{slide.type} slide</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Design Options
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button className="p-3 rounded-lg border border-border hover:border-accent/50 text-center transition-colors">
                  <Palette className="h-5 w-5 text-text-muted mx-auto mb-1" />
                  <p className="text-xs text-text-primary">Theme</p>
                </button>
                <button className="p-3 rounded-lg border border-border hover:border-accent/50 text-center transition-colors">
                  <Type className="h-5 w-5 text-text-muted mx-auto mb-1" />
                  <p className="text-xs text-text-primary">Fonts</p>
                </button>
                <button className="p-3 rounded-lg border border-border hover:border-accent/50 text-center transition-colors">
                  <Layout className="h-5 w-5 text-text-muted mx-auto mb-1" />
                  <p className="text-xs text-text-primary">Layout</p>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <Button variant="secondary" onClick={() => { setShowEditPanel(false); setSelectedDeck(null); }}>
                Cancel
              </Button>
              <Button variant="accent">
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </SlidePanel>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => { setShowDeleteConfirm(false); setSelectedDeck(null); }}
        title="Delete Deck"
        description={`Are you sure you want to delete "${selectedDeck?.name}"?`}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            This action cannot be undone. The deck and all its slides will be permanently deleted.
          </p>

          <ModalFooter>
            <Button variant="secondary" onClick={() => { setShowDeleteConfirm(false); setSelectedDeck(null); }}>
              Cancel
            </Button>
            <Button variant="accent" className="bg-error hover:bg-error/90" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* AI Generated Content Modal */}
      <Modal
        isOpen={showGeneratedContent}
        onClose={() => setShowGeneratedContent(false)}
        title="AI-Generated Deck Content"
        size="lg"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="font-medium text-accent">AI-Generated Slide Content</span>
            </div>
            <div className="text-sm text-text-secondary whitespace-pre-wrap">
              {generatedContent || "No content generated yet."}
            </div>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setShowGeneratedContent(false)}>Close</Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}
