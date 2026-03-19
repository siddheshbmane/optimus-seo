"use client";

import * as React from "react";
import {
  FileText,
  Sparkles,
  Target,
  List,
  Hash,
  Link2,
  ExternalLink,
  CheckCircle,
  Circle,
  Copy,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  BookOpen,
  MessageSquare,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ContentBrief, OutlineSection } from "@/agents/content-intel-agent";

interface BriefGeneratorProps {
  brief?: ContentBrief;
  onGenerate?: (keyword: string) => void;
  onExport?: (brief: ContentBrief) => void;
  isGenerating?: boolean;
}

export function BriefGenerator({
  brief,
  onGenerate,
  onExport,
  isGenerating = false,
}: BriefGeneratorProps) {
  const [keyword, setKeyword] = React.useState("");
  const [expandedSections, setExpandedSections] = React.useState<Set<number>>(new Set([0, 1, 2]));
  const [checkedItems, setCheckedItems] = React.useState<Set<string>>(new Set());

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const toggleCheckItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const handleGenerate = () => {
    if (keyword.trim() && onGenerate) {
      onGenerate(keyword.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* Generator Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Content Brief Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Enter target keyword (e.g., 'content marketing strategy')"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              className="flex-1"
            />
            <Button onClick={handleGenerate} disabled={isGenerating || !keyword.trim()}>
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Brief
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Brief */}
      {brief && (
        <>
          {/* Brief Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{brief.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Target Keyword: <span className="font-medium">{brief.targetKeyword}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => onExport?.(brief)}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Recommended Word Count</p>
                  <p className="text-2xl font-bold">
                    {brief.recommendedWordCount.optimal.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Range: {brief.recommendedWordCount.min.toLocaleString()} - {brief.recommendedWordCount.max.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Semantic Keywords</p>
                  <p className="text-2xl font-bold">{brief.semanticKeywords.length}</p>
                  <p className="text-xs text-muted-foreground">To include in content</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Questions to Answer</p>
                  <p className="text-2xl font-bold">{brief.questionsToAnswer.length}</p>
                  <p className="text-xs text-muted-foreground">For comprehensive coverage</p>
                </div>
              </div>

              {/* Meta Description */}
              <div className="mt-4 p-4 rounded-lg border">
                <p className="text-sm font-medium mb-2">Suggested Meta Description</p>
                <p className="text-sm text-muted-foreground">{brief.metaDescription}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {brief.metaDescription.length} / 160 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Outline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Content Outline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Introduction */}
              <div className="mb-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="font-medium text-blue-500">Introduction</p>
                <p className="text-sm text-muted-foreground mt-1">{brief.outline.introduction}</p>
              </div>

              {/* Sections */}
              <div className="space-y-3">
                {brief.outline.sections.map((section, index) => (
                  <div key={index} className="border rounded-lg">
                    <button
                      className="w-full flex items-center justify-between p-4 hover:bg-muted/50"
                      onClick={() => toggleSection(index)}
                    >
                      <div className="flex items-center gap-3">
                        {expandedSections.has(index) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <Badge className="text-xs">
                          {section.level.toUpperCase()}
                        </Badge>
                        <span className="font-medium">{section.heading}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ~{section.suggestedWordCount} words
                      </span>
                    </button>
                    {expandedSections.has(index) && (
                      <div className="px-4 pb-4 border-t">
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">Key Points:</p>
                          <ul className="space-y-1">
                            {section.keyPoints.map((point, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">Semantic Keywords:</p>
                          <div className="flex flex-wrap gap-1">
                            {section.semanticKeywords.map((kw, i) => (
                              <Badge key={i} className="text-xs">
                                {kw}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Conclusion */}
              <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="font-medium text-green-500">Conclusion</p>
                <p className="text-sm text-muted-foreground mt-1">{brief.outline.conclusion}</p>
              </div>
            </CardContent>
          </Card>

          {/* Semantic Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Semantic Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">Keyword</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Relevance</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Search Volume</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Usage</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Context</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brief.semanticKeywords.map((kw, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="px-4 py-3 font-medium text-sm">{kw.keyword}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{ width: `${kw.relevance}%` }}
                              />
                            </div>
                            <span className="text-sm">{kw.relevance}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{kw.searchVolume.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm">{kw.suggestedUsage}x</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{kw.context}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Questions to Answer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Questions to Answer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {brief.questionsToAnswer.map((question, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/30 cursor-pointer"
                    onClick={() => toggleCheckItem(`q-${index}`)}
                  >
                    {checkedItems.has(`q-${index}`) ? (
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                    <p className={cn(
                      "text-sm",
                      checkedItems.has(`q-${index}`) && "line-through text-muted-foreground"
                    )}>
                      {question}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Internal & External Links */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  Internal Link Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {brief.internalLinkSuggestions.map((link, index) => (
                    <div key={index} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{link.targetTitle}</p>
                        <Badge>{link.relevance}% relevant</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Anchor: "{link.anchorText}"
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Context: {link.context}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  External Source Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {brief.externalSourceSuggestions.map((source, index) => (
                    <div key={index} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{source.title}</p>
                        <Badge>{source.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Authority: {source.authority}/100
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {source.suggestedUsage}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SEO Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                SEO Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(
                  brief.seoChecklist.reduce((acc, item) => {
                    if (!acc[item.category]) acc[item.category] = [];
                    acc[item.category].push(item);
                    return acc;
                  }, {} as Record<string, typeof brief.seoChecklist>)
                ).map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    <p className="font-medium text-sm">{category}</p>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-2 cursor-pointer"
                        onClick={() => toggleCheckItem(item.id)}
                      >
                        {checkedItems.has(item.id) ? (
                          <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                        <span className={cn(
                          "text-sm",
                          checkedItems.has(item.id) && "line-through text-muted-foreground"
                        )}>
                          {item.item}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default BriefGenerator;
