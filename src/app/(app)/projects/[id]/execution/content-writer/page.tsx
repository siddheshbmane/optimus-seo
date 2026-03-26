"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  PenTool,
  Plus,
  Pause,
  CheckCircle,
  Clock,
  FileText,
  Target,
  Sparkles,
  Eye,
  Edit,
  Download,
  Copy,
  Loader2,
  BookOpen,
  FileCode,
  LayoutTemplate,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { useProjectContext } from "@/contexts/project-context";
import { useContentGeneration } from "@/hooks/use-llm";
import { formatNumber, cn } from "@/lib/utils";

const completedContent = [
  {
    id: 1,
    title: "SEO Trends 2026: What You Need to Know",
    type: "Blog Post",
    wordCount: 2500,
    completedAt: "2 hours ago",
    score: 92,
  },
  {
    id: 2,
    title: "Link Building Strategies That Actually Work",
    type: "Guide",
    wordCount: 3200,
    completedAt: "5 hours ago",
    score: 88,
  },
  {
    id: 3,
    title: "Core Web Vitals Optimization Guide",
    type: "Pillar Page",
    wordCount: 4500,
    completedAt: "1 day ago",
    score: 95,
  },
  {
    id: 4,
    title: "Mobile-First Indexing Explained",
    type: "Blog Post",
    wordCount: 1800,
    completedAt: "2 days ago",
    score: 85,
  },
];

const contentTypeOptions = [
  { value: "blog" as const, label: "Blog Post", icon: BookOpen },
  { value: "meta" as const, label: "Meta / Guide", icon: FileCode },
  { value: "landing" as const, label: "Landing Page", icon: LayoutTemplate },
  { value: "product" as const, label: "Product Page", icon: ShoppingBag },
];

export default function ContentWriterPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { project } = useProjectContext();

  // Content generation state
  const [showNewContent, setShowNewContent] = React.useState(false);
  const [contentTopic, setContentTopic] = React.useState("");
  const [contentKeyword, setContentKeyword] = React.useState("");
  const [contentType, setContentType] = React.useState<"blog" | "landing" | "product" | "meta">("blog");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState("");
  const [generationProgress, setGenerationProgress] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const [generationError, setGenerationError] = React.useState("");

  const { generateContent } = useContentGeneration();
  const progressIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const wordCount = React.useMemo(() => {
    if (!generatedContent) return 0;
    return generatedContent.trim().split(/\s+/).filter(Boolean).length;
  }, [generatedContent]);

  const handleGenerateContent = React.useCallback(async () => {
    if (!contentTopic.trim()) return;

    setIsGenerating(true);
    setGeneratedContent("");
    setGenerationProgress(0);
    setGenerationError("");

    // Simulate progress while waiting for API
    progressIntervalRef.current = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 8;
      });
    }, 500);

    try {
      const result = await generateContent(
        contentTopic,
        contentKeyword ? [contentKeyword] : [],
        contentType
      );
      setGeneratedContent(result);
      setGenerationProgress(100);
    } catch (err) {
      setGenerationError(
        err instanceof Error ? err.message : "Failed to generate content. Please try again."
      );
    } finally {
      setIsGenerating(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  }, [contentTopic, contentKeyword, contentType, generateContent]);

  // Cleanup interval on unmount
  React.useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleCopyContent = React.useCallback(async () => {
    if (!generatedContent) return;
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = generatedContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [generatedContent]);

  const handleDownloadContent = React.useCallback(() => {
    if (!generatedContent) return;
    const slug = contentTopic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const filename = `${slug || "content"}.md`;
    const blob = new Blob([generatedContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generatedContent, contentTopic]);

  const handleCloseModal = React.useCallback(() => {
    if (isGenerating) return; // Don't close while generating
    setShowNewContent(false);
    setContentTopic("");
    setContentKeyword("");
    setContentType("blog");
    setGeneratedContent("");
    setGenerationProgress(0);
    setGenerationError("");
  }, [isGenerating]);

  if (!project) return null;

  const totalWords = completedContent.reduce((sum, c) => sum + c.wordCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">AI Content Writer</h1>
          <p className="text-text-secondary">
            Generate SEO-optimized content automatically
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="accent" onClick={() => setShowNewContent(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Content
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Content Generated"
          value={completedContent.length}
          trendLabel="articles completed"
          icon={<PenTool className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          label="Completed Today"
          value={completedContent.length}
          trend={25}
          trendLabel="vs yesterday"
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatCard
          label="Words Written"
          value={formatNumber(totalWords)}
          trend={18}
          trendLabel="this week"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          label="Avg. Content Score"
          value="90"
          trendLabel="out of 100"
          icon={<Target className="h-5 w-5" />}
        />
      </div>

      {/* Generated Content Display (shows when content has been generated) */}
      {generatedContent && !showNewContent && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Generated Content</CardTitle>
              <p className="text-sm text-text-muted mt-1">
                {wordCount.toLocaleString()} words
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopyContent}>
                <Copy className="h-4 w-4 mr-2" />
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button variant="secondary" size="sm" onClick={handleDownloadContent}>
                <Download className="h-4 w-4 mr-2" />
                Download .md
              </Button>
              <Button variant="accent" size="sm" onClick={() => setShowNewContent(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Generate More
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-[500px] overflow-y-auto rounded-lg border border-border bg-bg-elevated p-4">
              <pre className="whitespace-pre-wrap text-sm text-text-primary font-sans leading-relaxed">
                {generatedContent}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Content */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recently Completed</CardTitle>
          <Button variant="ghost" size="sm">View All</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {completedContent.map((content) => (
              <div key={content.id} className="flex items-center justify-between p-4 hover:bg-bg-elevated">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{content.title}</p>
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <Badge variant="neutral">{content.type}</Badge>
                      <span>{formatNumber(content.wordCount)} words</span>
                      <span>-</span>
                      <span>{content.completedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold",
                    content.score >= 90 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  )}>
                    {content.score}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Content Modal */}
      <Modal
        isOpen={showNewContent}
        onClose={handleCloseModal}
        title="Generate New Content"
        description="Create SEO-optimized content with AI"
        size="lg"
      >
        {!generatedContent ? (
          <div className="space-y-4">
            {/* Topic */}
            <div className="space-y-2">
              <Label htmlFor="content-topic">Topic</Label>
              <Input
                id="content-topic"
                placeholder="e.g., Complete Guide to On-Page SEO"
                value={contentTopic}
                onChange={(e) => setContentTopic(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            {/* Target Keyword */}
            <div className="space-y-2">
              <Label htmlFor="content-keyword">Target Keyword</Label>
              <Input
                id="content-keyword"
                placeholder="e.g., on-page seo"
                value={contentKeyword}
                onChange={(e) => setContentKeyword(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            {/* Content Type */}
            <div className="space-y-2">
              <Label>Content Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {contentTypeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setContentType(option.value)}
                      disabled={isGenerating}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors",
                        contentType === option.value
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border text-text-secondary hover:border-accent/50 hover:bg-bg-elevated",
                        isGenerating && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progress */}
            {isGenerating && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating content...
                  </span>
                  <span className="text-text-muted">
                    {Math.round(generationProgress)}%
                  </span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {generationError && (
              <div className="rounded-lg border border-error/30 bg-error/5 p-3 text-sm text-error">
                {generationError}
              </div>
            )}

            <ModalFooter>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCloseModal}
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button
                variant="accent"
                size="sm"
                onClick={handleGenerateContent}
                disabled={isGenerating || !contentTopic.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </ModalFooter>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Generated content preview in modal */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-muted">
                {wordCount.toLocaleString()} words generated
              </p>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={handleCopyContent}>
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button variant="secondary" size="sm" onClick={handleDownloadContent}>
                  <Download className="h-4 w-4 mr-2" />
                  Download .md
                </Button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto rounded-lg border border-border bg-bg-elevated p-4">
              <pre className="whitespace-pre-wrap text-sm text-text-primary font-sans leading-relaxed">
                {generatedContent}
              </pre>
            </div>

            <ModalFooter>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setGeneratedContent("");
                  setGenerationProgress(0);
                  setContentTopic("");
                  setContentKeyword("");
                  setGenerationError("");
                }}
              >
                Generate Another
              </Button>
              <Button
                variant="accent"
                size="sm"
                onClick={handleCloseModal}
              >
                Done
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>
    </div>
  );
}
