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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getProjectById } from "@/data/mock-projects";
import { cn } from "@/lib/utils";

const teamMembers = [
  {
    id: 1,
    name: "John Smith",
    email: "john@acmecorp.com",
    role: "Owner",
    avatar: "JS",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@acmecorp.com",
    role: "Admin",
    avatar: "SJ",
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike@acmecorp.com",
    role: "Editor",
    avatar: "MC",
  },
];

const integrations = [
  {
    id: "gsc",
    name: "Google Search Console",
    status: "connected",
    lastSync: "5 min ago",
  },
  {
    id: "ga4",
    name: "Google Analytics 4",
    status: "connected",
    lastSync: "5 min ago",
  },
  {
    id: "semrush",
    name: "SEMrush",
    status: "disconnected",
    lastSync: null,
  },
  {
    id: "ahrefs",
    name: "Ahrefs",
    status: "connected",
    lastSync: "1 hour ago",
  },
];

export default function SettingsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const project = getProjectById(projectId);

  const [projectName, setProjectName] = React.useState(project?.name || "");
  const [projectUrl, setProjectUrl] = React.useState(project?.url || "");
  const [location, setLocation] = React.useState(project?.location || "");

  if (!project) return null;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Project Settings</h1>
        <p className="text-sm sm:text-base text-text-secondary">
          Manage your project configuration and integrations
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

      {/* Team Members */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
          <Button variant="secondary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-accent font-semibold text-sm">
                      {member.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{member.name}</p>
                    <p className="text-sm text-text-muted">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      member.role === "Owner"
                        ? "accent"
                        : member.role === "Admin"
                        ? "info"
                        : "neutral"
                    }
                  >
                    {member.role}
                  </Badge>
                  {member.role !== "Owner" && (
                    <button className="p-1.5 rounded hover:bg-bg-card text-text-muted hover:text-error">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
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
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      integration.status === "connected"
                        ? "bg-success/10"
                        : "bg-bg-card"
                    )}
                  >
                    <Key
                      className={cn(
                        "h-5 w-5",
                        integration.status === "connected"
                          ? "text-success"
                          : "text-text-muted"
                      )}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">
                      {integration.name}
                    </p>
                    {integration.lastSync && (
                      <p className="text-xs text-text-muted">
                        Last synced: {integration.lastSync}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      integration.status === "connected" ? "success" : "neutral"
                    }
                  >
                    {integration.status === "connected"
                      ? "Connected"
                      : "Disconnected"}
                  </Badge>
                  <Button
                    variant={
                      integration.status === "connected" ? "ghost" : "secondary"
                    }
                    size="sm"
                  >
                    {integration.status === "connected" ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
            {[
              {
                label: "Weekly ranking reports",
                description: "Receive weekly email summaries of ranking changes",
                enabled: true,
              },
              {
                label: "Agent completion alerts",
                description: "Get notified when AI agents complete tasks",
                enabled: true,
              },
              {
                label: "Critical issue alerts",
                description: "Immediate alerts for critical SEO issues",
                enabled: true,
              },
              {
                label: "Competitor alerts",
                description: "Notifications when competitors make significant changes",
                enabled: false,
              },
            ].map((notification, index) => (
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
