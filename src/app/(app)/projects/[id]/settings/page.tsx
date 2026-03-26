"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Globe,
  MapPin,
  Users,
  Bell,
  Key,
  Trash2,
  Save,
  ExternalLink,
  Plus,
  X,
  Target,
  Building2,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Info,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { useProjectContext } from "@/contexts/project-context";
import { useProjectConfig } from "@/contexts/project-config-context";
import { cn } from "@/lib/utils";

// --- Team Member types and helpers ---

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
  avatar?: string;
}

const ROLE_OPTIONS = [
  { value: "owner", label: "Owner", description: "Full access to all settings and billing" },
  { value: "admin", label: "Admin", description: "Can manage members, settings, and all projects" },
  { value: "strategist", label: "Strategist", description: "Can create and manage SEO strategies" },
  { value: "executive", label: "Executive", description: "View-only access to reports and dashboards" },
  { value: "sales", label: "Sales", description: "Access to lead and conversion data" },
  { value: "viewer", label: "Viewer", description: "Read-only access to project data" },
] as const;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getRoleBadgeVariant(role: string): "accent" | "info" | "warning" | "success" | "neutral" | "error" {
  switch (role.toLowerCase()) {
    case "owner": return "accent";
    case "admin": return "info";
    case "strategist": return "success";
    case "executive": return "warning";
    case "sales": return "warning";
    default: return "neutral";
  }
}

function getTeamStorageKey(projectId: string) {
  return `optimus_team_${projectId}`;
}

function loadTeamMembers(projectId: string): TeamMember[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getTeamStorageKey(projectId));
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors
  }
  return [];
}

function saveTeamMembers(projectId: string, members: TeamMember[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getTeamStorageKey(projectId), JSON.stringify(members));
}

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "owner-1",
    name: "John Smith",
    email: "john@acmecorp.com",
    role: "owner",
    joinedAt: new Date("2024-01-15").toISOString(),
    avatar: "JS",
  },
  {
    id: "member-2",
    name: "Sarah Johnson",
    email: "sarah@acmecorp.com",
    role: "admin",
    joinedAt: new Date("2024-02-10").toISOString(),
    avatar: "SJ",
  },
  {
    id: "member-3",
    name: "Mike Chen",
    email: "mike@acmecorp.com",
    role: "strategist",
    joinedAt: new Date("2024-03-05").toISOString(),
    avatar: "MC",
  },
];

// --- Integration types and helpers ---

const INTEGRATION_DEFINITIONS = [
  {
    id: "google_search_console",
    name: "Google Search Console",
    description: "Track search performance and indexing",
  },
  {
    id: "google_analytics",
    name: "Google Analytics 4",
    description: "Monitor traffic and user behavior",
  },
  {
    id: "google_business_profile",
    name: "Google Business Profile",
    description: "Manage local SEO presence",
  },
] as const;

interface IntegrationStatus {
  connected: boolean;
  lastSync?: string;
}

function getIntegrationStorageKey(projectId: string) {
  return `optimus_integrations_${projectId}`;
}

function loadIntegrations(projectId: string): Record<string, IntegrationStatus> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(getIntegrationStorageKey(projectId));
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors
  }
  return {};
}

function saveIntegrations(projectId: string, data: Record<string, IntegrationStatus>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getIntegrationStorageKey(projectId), JSON.stringify(data));
}

export default function SettingsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { project } = useProjectContext();
  const {
    config,
    isLoading: configLoading,
    addKeyword,
    addKeywords,
    removeKeyword,
    addCompetitor,
    removeCompetitor,
    updateBusinessInfo,
  } = useProjectConfig();

  const [projectName, setProjectName] = React.useState(project?.name || "");
  const [projectUrl, setProjectUrl] = React.useState(project?.url || "");
  const [location, setLocation] = React.useState(project?.location || "");

  // Keywords input
  const [newKeyword, setNewKeyword] = React.useState("");
  const [bulkKeywords, setBulkKeywords] = React.useState("");
  const [showBulkKeywords, setShowBulkKeywords] = React.useState(false);

  // Competitors input
  const [newCompetitor, setNewCompetitor] = React.useState("");

  // Business info
  const [businessName, setBusinessName] = React.useState(config?.businessInfo?.name || "");
  const [businessAddress, setBusinessAddress] = React.useState(config?.businessInfo?.address || "");
  const [businessCity, setBusinessCity] = React.useState(config?.businessInfo?.city || "");
  const [businessState, setBusinessState] = React.useState(config?.businessInfo?.state || "");
  const [businessPhone, setBusinessPhone] = React.useState(config?.businessInfo?.phone || "");
  const [businessCategory, setBusinessCategory] = React.useState(config?.businessInfo?.category || "");

  // Integration state
  const [integrationStatuses, setIntegrationStatuses] = React.useState<Record<string, IntegrationStatus>>({
    google_search_console: { connected: false },
    google_analytics: { connected: false },
    google_business_profile: { connected: false },
  });
  const [connectingIntegration, setConnectingIntegration] = React.useState<string | null>(null);
  const [syncingIntegration, setSyncingIntegration] = React.useState<string | null>(null);
  const [disconnectConfirm, setDisconnectConfirm] = React.useState<string | null>(null);
  const [integrationFeedback, setIntegrationFeedback] = React.useState<{ id: string; message: string; type: "success" | "error" } | null>(null);

  // Team members state
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([]);
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteName, setInviteName] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState("viewer");
  const [isInviting, setIsInviting] = React.useState(false);
  const [inviteFeedback, setInviteFeedback] = React.useState<string | null>(null);

  // Notification toggles state
  const [projectNotifications, setProjectNotifications] = React.useState([
    { label: "Weekly ranking reports", description: "Receive weekly email summaries of ranking changes", enabled: true },
    { label: "Agent completion alerts", description: "Get notified when AI agents complete tasks", enabled: true },
    { label: "Critical issue alerts", description: "Immediate alerts for critical SEO issues", enabled: true },
    { label: "Competitor alerts", description: "Notifications when competitors make significant changes", enabled: false },
  ]);

  const handleToggleProjectNotification = (index: number) => {
    setProjectNotifications((prev) =>
      prev.map((n, i) => (i === index ? { ...n, enabled: !n.enabled } : n))
    );
  };

  // Load integration status from localStorage on mount
  React.useEffect(() => {
    const saved = loadIntegrations(projectId);
    setIntegrationStatuses((prev) => ({
      ...prev,
      ...saved,
    }));
  }, [projectId]);

  // Load team members from localStorage on mount
  React.useEffect(() => {
    const saved = loadTeamMembers(projectId);
    if (saved.length > 0) {
      setTeamMembers(saved);
    } else {
      setTeamMembers(DEFAULT_TEAM_MEMBERS);
      saveTeamMembers(projectId, DEFAULT_TEAM_MEMBERS);
    }
  }, [projectId]);

  const showIntegrationFeedback = React.useCallback((id: string, message: string, type: "success" | "error" = "success") => {
    setIntegrationFeedback({ id, message, type });
    setTimeout(() => setIntegrationFeedback(null), 3000);
  }, []);

  const handleConnect = React.useCallback(async (integrationId: string) => {
    setConnectingIntegration(integrationId);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const now = new Date().toISOString();
    setIntegrationStatuses((prev) => {
      const updated = {
        ...prev,
        [integrationId]: { connected: true, lastSync: now },
      };
      saveIntegrations(projectId, updated);
      return updated;
    });
    setConnectingIntegration(null);
    showIntegrationFeedback(integrationId, "Connected successfully");
  }, [projectId, showIntegrationFeedback]);

  const handleDisconnect = React.useCallback((integrationId: string) => {
    setIntegrationStatuses((prev) => {
      const updated = {
        ...prev,
        [integrationId]: { connected: false, lastSync: undefined },
      };
      saveIntegrations(projectId, updated);
      return updated;
    });
    setDisconnectConfirm(null);
    showIntegrationFeedback(integrationId, "Disconnected");
  }, [projectId, showIntegrationFeedback]);

  const handleSyncNow = React.useCallback(async (integrationId: string) => {
    setSyncingIntegration(integrationId);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const now = new Date().toISOString();
    setIntegrationStatuses((prev) => {
      const updated = {
        ...prev,
        [integrationId]: { ...prev[integrationId], lastSync: now },
      };
      saveIntegrations(projectId, updated);
      return updated;
    });
    setSyncingIntegration(null);
    showIntegrationFeedback(integrationId, "Sync complete");
  }, [projectId, showIntegrationFeedback]);

  // Team member handlers
  const handleInviteMember = React.useCallback(async () => {
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setInviteFeedback("Please enter a valid email address.");
      return;
    }

    if (teamMembers.some((m) => m.email.toLowerCase() === email)) {
      setInviteFeedback("This email is already a team member.");
      return;
    }

    setIsInviting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const name = inviteName.trim() || email.split("@")[0];
    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name,
      email,
      role: inviteRole,
      joinedAt: new Date().toISOString(),
      avatar: getInitials(name),
    };

    const updated = [...teamMembers, newMember];
    setTeamMembers(updated);
    saveTeamMembers(projectId, updated);

    setIsInviting(false);
    setInviteEmail("");
    setInviteName("");
    setInviteRole("viewer");
    setInviteFeedback(`Invitation sent to ${email}`);

    setTimeout(() => {
      setShowInviteModal(false);
      setInviteFeedback(null);
    }, 1500);
  }, [inviteEmail, inviteName, inviteRole, teamMembers, projectId]);

  const handleRemoveMember = React.useCallback((memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (!member || member.role === "owner") return;

    const updated = teamMembers.filter((m) => m.id !== memberId);
    setTeamMembers(updated);
    saveTeamMembers(projectId, updated);
  }, [teamMembers, projectId]);

  const handleChangeRole = React.useCallback((memberId: string, newRole: string) => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (!member || member.role === "owner") return;

    const updated = teamMembers.map((m) =>
      m.id === memberId ? { ...m, role: newRole } : m
    );
    setTeamMembers(updated);
    saveTeamMembers(projectId, updated);
  }, [teamMembers, projectId]);

  // Update business info fields when config loads
  React.useEffect(() => {
    if (config?.businessInfo) {
      setBusinessName(config.businessInfo.name || "");
      setBusinessAddress(config.businessInfo.address || "");
      setBusinessCity(config.businessInfo.city || "");
      setBusinessState(config.businessInfo.state || "");
      setBusinessPhone(config.businessInfo.phone || "");
      setBusinessCategory(config.businessInfo.category || "");
    }
  }, [config?.businessInfo]);

  if (!project) return null;

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      addKeyword(newKeyword.trim());
      setNewKeyword("");
    }
  };

  const handleAddBulkKeywords = () => {
    const keywords = bulkKeywords
      .split("\n")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
    if (keywords.length > 0) {
      addKeywords(keywords);
      setBulkKeywords("");
      setShowBulkKeywords(false);
    }
  };

  const handleAddCompetitor = () => {
    if (newCompetitor.trim()) {
      addCompetitor(newCompetitor.trim());
      setNewCompetitor("");
    }
  };

  const handleSaveBusinessInfo = () => {
    updateBusinessInfo({
      name: businessName,
      address: businessAddress,
      city: businessCity,
      state: businessState,
      phone: businessPhone,
      category: businessCategory,
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Project Settings</h1>
        <p className="text-sm sm:text-base text-text-secondary">
          Manage your project configuration, tracked keywords, and competitors
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                Project Name
              </label>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                Website URL
              </label>
              <div className="relative">
                <Input
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  placeholder="https://example.com"
                />
                <a
                  href={projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Target Location
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., United States, New York, NY"
            />
            <p className="text-xs text-text-muted">
              This affects keyword research and ranking tracking
            </p>
          </div>
          <div className="flex justify-end">
            <Button variant="accent">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Target Keywords */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Target Keywords
            </CardTitle>
            <p className="text-sm text-text-muted mt-1">
              Keywords you want to track rankings for
            </p>
          </div>
          <Badge variant="neutral">
            {config?.keywords.length || 0} keywords
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add keyword input */}
          <div className="flex gap-2">
            <Input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Enter a keyword to track..."
              onKeyDown={(e) => e.key === "Enter" && handleAddKeyword()}
            />
            <Button variant="accent" onClick={handleAddKeyword}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowBulkKeywords(!showBulkKeywords)}
            >
              Bulk Add
            </Button>
          </div>

          {/* Bulk add textarea */}
          {showBulkKeywords && (
            <div className="space-y-2 p-4 rounded-lg bg-bg-elevated">
              <label className="text-sm font-medium text-text-primary">
                Add multiple keywords (one per line)
              </label>
              <textarea
                value={bulkKeywords}
                onChange={(e) => setBulkKeywords(e.target.value)}
                placeholder={"seo services\ndigital marketing\ncontent marketing\nlink building"}
                className="w-full h-32 px-3 py-2 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowBulkKeywords(false)}>
                  Cancel
                </Button>
                <Button variant="accent" onClick={handleAddBulkKeywords}>
                  Add Keywords
                </Button>
              </div>
            </div>
          )}

          {/* Keywords list */}
          {configLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : config?.keywords.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No keywords added yet</p>
              <p className="text-sm">Add keywords to track your search rankings</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {config?.keywords.map((keyword) => (
                <div
                  key={keyword.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated group"
                >
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4 text-text-muted" />
                    <span className="text-text-primary">{keyword.keyword}</span>
                    {keyword.volume && (
                      <Badge variant="neutral" className="text-xs">
                        {keyword.volume.toLocaleString()} vol
                      </Badge>
                    )}
                    {keyword.currentPosition && (
                      <Badge variant="success" className="text-xs">
                        #{keyword.currentPosition}
                      </Badge>
                    )}
                  </div>
                  <button
                    onClick={() => removeKeyword(keyword.id)}
                    className="p-1.5 rounded hover:bg-bg-card text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Competitors */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Competitors
            </CardTitle>
            <p className="text-sm text-text-muted mt-1">
              Competitor domains to analyze and compare against
            </p>
          </div>
          <Badge variant="neutral">
            {config?.competitors.length || 0} competitors
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add competitor input */}
          <div className="flex gap-2">
            <Input
              value={newCompetitor}
              onChange={(e) => setNewCompetitor(e.target.value)}
              placeholder="Enter competitor domain (e.g., competitor.com)"
              onKeyDown={(e) => e.key === "Enter" && handleAddCompetitor()}
            />
            <Button variant="accent" onClick={handleAddCompetitor}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Competitors list */}
          {configLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : config?.competitors.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No competitors added yet</p>
              <p className="text-sm">Add competitor domains to analyze their SEO strategy</p>
            </div>
          ) : (
            <div className="space-y-2">
              {config?.competitors.map((competitor) => (
                <div
                  key={competitor.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated group"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-text-muted" />
                    <span className="text-text-primary">{competitor.domain}</span>
                    {competitor.name && (
                      <span className="text-text-muted text-sm">({competitor.name})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://${competitor.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded hover:bg-bg-card text-text-muted hover:text-text-primary"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => removeCompetitor(competitor.id)}
                      className="p-1.5 rounded hover:bg-bg-card text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Information (for Local SEO) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Business Information
          </CardTitle>
          <p className="text-sm text-text-muted">
            Required for Google Business Profile analysis and local SEO
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                Business Name
              </label>
              <Input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your Business Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                Business Category
              </label>
              <Input
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
                placeholder="e.g., Digital Marketing Agency"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              Street Address
            </label>
            <Input
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              placeholder="123 Main Street"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                City
              </label>
              <Input
                value={businessCity}
                onChange={(e) => setBusinessCity(e.target.value)}
                placeholder="New York"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                State
              </label>
              <Input
                value={businessState}
                onChange={(e) => setBusinessState(e.target.value)}
                placeholder="NY"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                Phone
              </label>
              <Input
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="accent" onClick={handleSaveBusinessInfo}>
              <Save className="h-4 w-4 mr-2" />
              Save Business Info
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Integrations
          </CardTitle>
          <p className="text-sm text-text-muted">
            Connect external services for enhanced data
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {INTEGRATION_DEFINITIONS.map((integration) => {
              const status = integrationStatuses[integration.id];
              const isConnected = status?.connected ?? false;
              const isConnecting = connectingIntegration === integration.id;
              const isSyncing = syncingIntegration === integration.id;
              const feedback = integrationFeedback?.id === integration.id ? integrationFeedback : null;

              return (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center",
                        isConnected ? "bg-success/10" : "bg-bg-card"
                      )}
                    >
                      {isConnected ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-text-muted" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">
                        {integration.name}
                      </p>
                      <p className="text-xs text-text-muted">
                        {feedback ? (
                          <span className={feedback.type === "success" ? "text-success" : "text-error"}>
                            {feedback.message}
                          </span>
                        ) : status?.lastSync ? (
                          <>Last synced: {new Date(status.lastSync).toLocaleDateString()}</>
                        ) : (
                          integration.description
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={isConnected ? "success" : "neutral"}>
                      {isConnected ? "Connected" : "Not Connected"}
                    </Badge>
                    {isConnected && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSyncNow(integration.id)}
                        disabled={isSyncing}
                      >
                        <RefreshCw className={cn("h-4 w-4 mr-1", isSyncing && "animate-spin")} />
                        {isSyncing ? "Syncing..." : "Sync"}
                      </Button>
                    )}
                    {isConnected ? (
                      disconnectConfirm === integration.id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDisconnect(integration.id)}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDisconnectConfirm(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDisconnectConfirm(integration.id)}
                        >
                          Disconnect
                        </Button>
                      )
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleConnect(integration.id)}
                        disabled={isConnecting}
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          "Connect"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-text-muted mt-4">
            Note: Integration connections are coming soon. Currently using DataForSEO API for all data.
          </p>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members
            </CardTitle>
            <p className="text-sm text-text-muted mt-1">
              Manage who has access to this project
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="neutral">
              {teamMembers.length} {teamMembers.length === 1 ? "member" : "members"}
            </Badge>
            <Button
              variant="accent"
              size="sm"
              onClick={() => {
                setShowInviteModal(true);
                setInviteFeedback(null);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-accent font-semibold text-sm">
                      {member.avatar || getInitials(member.name)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{member.name}</p>
                    <p className="text-sm text-text-muted">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {member.role === "owner" ? (
                    <Badge variant="accent">Owner</Badge>
                  ) : (
                    <>
                      <select
                        value={member.role}
                        onChange={(e) => handleChangeRole(member.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded-md border border-border bg-bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                      >
                        {ROLE_OPTIONS.filter((r) => r.value !== "owner").map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      <Badge variant={getRoleBadgeVariant(member.role)}>
                        {ROLE_OPTIONS.find((r) => r.value === member.role)?.label || member.role}
                      </Badge>
                    </>
                  )}
                  {member.role !== "owner" && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-1.5 rounded hover:bg-bg-card text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove member"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invite Member Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          setInviteEmail("");
          setInviteName("");
          setInviteRole("viewer");
          setInviteFeedback(null);
        }}
        title="Invite Team Member"
        description="Send an invitation to collaborate on this project"
        size="md"
      >
        <div className="space-y-4">
          {/* Success feedback */}
          {inviteFeedback && inviteFeedback.startsWith("Invitation sent") && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success text-sm">
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
              {inviteFeedback}
            </div>
          )}

          {/* Error feedback */}
          {inviteFeedback && !inviteFeedback.startsWith("Invitation sent") && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-error/10 text-error text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {inviteFeedback}
            </div>
          )}

          {/* Email input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                value={inviteEmail}
                onChange={(e) => {
                  setInviteEmail(e.target.value);
                  if (inviteFeedback) setInviteFeedback(null);
                }}
                placeholder="colleague@company.com"
                type="email"
                className="pl-10"
                onKeyDown={(e) => e.key === "Enter" && handleInviteMember()}
              />
            </div>
          </div>

          {/* Name input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              Full Name <span className="text-text-muted font-normal">(optional)</span>
            </label>
            <Input
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="Jane Doe"
            />
          </div>

          {/* Role selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              Role
            </label>
            <div className="space-y-2">
              {ROLE_OPTIONS.filter((r) => r.value !== "owner").map((role) => (
                <label
                  key={role.value}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                    inviteRole === role.value
                      ? "border-accent bg-accent/5"
                      : "border-border bg-bg-elevated hover:border-text-muted"
                  )}
                >
                  <input
                    type="radio"
                    name="invite-role"
                    value={role.value}
                    checked={inviteRole === role.value}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="mt-0.5 accent-accent"
                  />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{role.label}</p>
                    <p className="text-xs text-text-muted">{role.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Info note */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-bg-elevated text-text-muted text-xs">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              Email delivery requires configuring an email service (e.g., Resend).
              The member will be added to the project immediately and can sign in
              once the invitation email is set up.
            </p>
          </div>

          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setShowInviteModal(false);
                setInviteEmail("");
                setInviteName("");
                setInviteRole("viewer");
                setInviteFeedback(null);
              }}
              disabled={isInviting}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={handleInviteMember}
              disabled={isInviting || !inviteEmail.trim()}
            >
              {isInviting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectNotifications.map((notification, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated"
              >
                <div>
                  <p className="font-medium text-text-primary">
                    {notification.label}
                  </p>
                  <p className="text-sm text-text-muted">
                    {notification.description}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleProjectNotification(index)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    notification.enabled ? "bg-accent" : "bg-border"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      notification.enabled ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-error/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-error">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-error/5 border border-error/20">
            <div>
              <p className="font-medium text-text-primary">Delete Project</p>
              <p className="text-sm text-text-muted">
                Permanently delete this project and all its data. This action
                cannot be undone.
              </p>
            </div>
            <Button variant="destructive">Delete Project</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
