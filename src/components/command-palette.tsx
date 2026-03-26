"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FolderKanban,
  LayoutDashboard,
  Settings,
  BarChart3,
  PlayCircle,
  FileText,
  Target,
  Users,
  Eye,
  Wrench,
  Lightbulb,
  TrendingUp,
  Plus,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardProjects, type DashboardProject } from "@/hooks/use-projects";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: "navigation" | "project" | "action" | "tool";
  keywords?: string[];
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // Fetch projects for search
  const { projects, isLoading: projectsLoading } = useDashboardProjects();

  // Reset state when opened
  React.useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  // Navigation commands
  const navigationCommands: CommandItem[] = [
    {
      id: "nav-dashboard",
      label: "Go to Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      action: () => { router.push("/dashboard"); onClose(); },
      category: "navigation",
      keywords: ["home", "overview"],
    },
    {
      id: "nav-projects",
      label: "Go to Projects",
      icon: <FolderKanban className="h-4 w-4" />,
      action: () => { router.push("/projects"); onClose(); },
      category: "navigation",
      keywords: ["list", "all"],
    },
    {
      id: "nav-agents",
      label: "Go to Agents",
      icon: <PlayCircle className="h-4 w-4" />,
      action: () => { router.push("/agents"); onClose(); },
      category: "navigation",
      keywords: ["automation", "tasks"],
    },
    {
      id: "nav-reports",
      label: "Go to Reports",
      icon: <BarChart3 className="h-4 w-4" />,
      action: () => { router.push("/reports"); onClose(); },
      category: "navigation",
      keywords: ["analytics", "data"],
    },
    {
      id: "nav-settings",
      label: "Go to Settings",
      icon: <Settings className="h-4 w-4" />,
      action: () => { router.push("/settings"); onClose(); },
      category: "navigation",
      keywords: ["preferences", "config"],
    },
  ];

  // Action commands
  const actionCommands: CommandItem[] = [
    {
      id: "action-new-project",
      label: "Create New Project",
      description: "Start a new SEO project",
      icon: <Plus className="h-4 w-4" />,
      action: () => { router.push("/projects?new=true"); onClose(); },
      category: "action",
      keywords: ["add", "create", "new"],
    },
  ];

  // Project commands (dynamic based on fetched projects)
  const projectCommands: CommandItem[] = projects.map((project) => ({
    id: `project-${project.id}`,
    label: project.name,
    description: project.url,
    icon: <FolderKanban className="h-4 w-4" />,
    action: () => { router.push(`/projects/${project.id}/sales`); onClose(); },
    category: "project" as const,
    keywords: [project.url, project.status],
  }));

  // Tool commands for quick access
  const toolCommands: CommandItem[] = [
    {
      id: "tool-keyword-research",
      label: "Keyword Research",
      description: "Discover keyword opportunities",
      icon: <Target className="h-4 w-4" />,
      action: () => { 
        if (projects.length > 0) {
          router.push(`/projects/${projects[0].id}/sales/keyword-research`);
        } else {
          router.push("/projects");
        }
        onClose();
      },
      category: "tool",
      keywords: ["keywords", "seo", "search"],
    },
    {
      id: "tool-site-audit",
      label: "Site Audit",
      description: "Technical SEO analysis",
      icon: <Wrench className="h-4 w-4" />,
      action: () => { 
        if (projects.length > 0) {
          router.push(`/projects/${projects[0].id}/sales/site-audit`);
        } else {
          router.push("/projects");
        }
        onClose();
      },
      category: "tool",
      keywords: ["technical", "audit", "crawl"],
    },
    {
      id: "tool-competitor-analysis",
      label: "Competitor Analysis",
      description: "Analyze competitor strategies",
      icon: <Users className="h-4 w-4" />,
      action: () => { 
        if (projects.length > 0) {
          router.push(`/projects/${projects[0].id}/sales/competitor-analysis`);
        } else {
          router.push("/projects");
        }
        onClose();
      },
      category: "tool",
      keywords: ["competitors", "competition", "gap"],
    },
    {
      id: "tool-ai-visibility",
      label: "AI Visibility",
      description: "Track AI search presence",
      icon: <Eye className="h-4 w-4" />,
      action: () => { 
        if (projects.length > 0) {
          router.push(`/projects/${projects[0].id}/sales/ai-visibility`);
        } else {
          router.push("/projects");
        }
        onClose();
      },
      category: "tool",
      keywords: ["ai", "llm", "chatgpt", "claude"],
    },
  ];

  // Combine all commands
  const allCommands = [
    ...actionCommands,
    ...navigationCommands,
    ...projectCommands,
    ...toolCommands,
  ];

  // Filter commands based on query
  const filteredCommands = React.useMemo(() => {
    if (!query.trim()) {
      // Show recent/suggested when no query
      return [
        ...actionCommands,
        ...navigationCommands.slice(0, 3),
        ...projectCommands.slice(0, 3),
      ];
    }

    const lowerQuery = query.toLowerCase();
    return allCommands.filter((cmd) => {
      const matchLabel = cmd.label.toLowerCase().includes(lowerQuery);
      const matchDescription = cmd.description?.toLowerCase().includes(lowerQuery);
      const matchKeywords = cmd.keywords?.some((kw) => kw.toLowerCase().includes(lowerQuery));
      return matchLabel || matchDescription || matchKeywords;
    });
  }, [query, allCommands, actionCommands, navigationCommands, projectCommands]);

  // Group filtered commands by category
  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, CommandItem[]> = {
      action: [],
      navigation: [],
      project: [],
      tool: [],
    };

    filteredCommands.forEach((cmd) => {
      groups[cmd.category].push(cmd);
    });

    return groups;
  }, [filteredCommands]);

  // Handle keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Reset selected index when filtered results change
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const categoryLabels: Record<string, string> = {
    action: "Actions",
    navigation: "Navigation",
    project: "Projects",
    tool: "Tools",
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    action: <Plus className="h-3 w-3" />,
    navigation: <ArrowRight className="h-3 w-3" />,
    project: <FolderKanban className="h-3 w-3" />,
    tool: <Wrench className="h-3 w-3" />,
  };

  let globalIndex = -1;

  return (
    <div 
      className="fixed inset-0 z-[70] bg-black/50 flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-5 w-5 text-text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tools, actions..."
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-base"
          />
          {projectsLoading && (
            <Loader2 className="h-4 w-4 text-text-muted animate-spin" />
          )}
          <button 
            onClick={onClose}
            className="px-2 py-1 text-xs font-mono bg-bg-elevated border border-border rounded text-text-muted hover:text-text-primary transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center">
              <Search className="h-8 w-8 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary">No results found for "{query}"</p>
              <p className="text-sm text-text-muted mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="py-2">
              {Object.entries(groupedCommands).map(([category, commands]) => {
                if (commands.length === 0) return null;
                
                return (
                  <div key={category} className="mb-2">
                    <div className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-text-muted uppercase tracking-wider">
                      {categoryIcons[category]}
                      {categoryLabels[category]}
                    </div>
                    {commands.map((cmd) => {
                      globalIndex++;
                      const isSelected = globalIndex === selectedIndex;
                      
                      return (
                        <button
                          key={cmd.id}
                          onClick={cmd.action}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                            isSelected 
                              ? "bg-accent/10 text-accent" 
                              : "text-text-primary hover:bg-bg-elevated"
                          )}
                        >
                          <span className={cn(
                            "flex-shrink-0",
                            isSelected ? "text-accent" : "text-text-muted"
                          )}>
                            {cmd.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{cmd.label}</p>
                            {cmd.description && (
                              <p className={cn(
                                "text-sm truncate",
                                isSelected ? "text-accent/70" : "text-text-muted"
                              )}>
                                {cmd.description}
                              </p>
                            )}
                          </div>
                          {isSelected && (
                            <kbd className="flex-shrink-0 px-2 py-0.5 text-xs font-mono bg-accent/20 rounded">
                              Enter
                            </kbd>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-bg-elevated/50 text-xs text-text-muted">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-bg-card border border-border rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-bg-card border border-border rounded">↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-bg-card border border-border rounded">Enter</kbd>
              <span>Select</span>
            </span>
          </div>
          <span>{filteredCommands.length} results</span>
        </div>
      </div>
    </div>
  );
}
