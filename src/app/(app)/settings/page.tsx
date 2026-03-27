"use client";

import * as React from "react";
import {
  User,
  Bell,
  CreditCard,
  Key,
  Shield,
  Palette,
  Globe,
  Mail,
  Building,
  Save,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "api", label: "API Keys", icon: Key },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
];

const apiKeys = [
  { name: "Production API Key", key: "sk_live_****************************1234", created: "Mar 1, 2026", lastUsed: "2 hours ago" },
  { name: "Development API Key", key: "sk_test_****************************5678", created: "Feb 15, 2026", lastUsed: "1 day ago" },
];

const defaultNotifications = [
  { label: "Weekly ranking reports", description: "Receive weekly email summaries", enabled: true },
  { label: "Agent completion alerts", description: "Get notified when AI agents complete tasks", enabled: true },
  { label: "Critical issue alerts", description: "Immediate alerts for critical SEO issues", enabled: true },
  { label: "Competitor alerts", description: "Notifications when competitors make changes", enabled: false },
  { label: "New feature announcements", description: "Learn about new Optimus SEO features", enabled: true },
  { label: "Marketing emails", description: "Tips, best practices, and case studies", enabled: false },
];

export default function SettingsPage() {
  const [activeTab, setActiveTabRaw] = React.useState("profile");
  const setActiveTab = React.useCallback((tab: string) => {
    React.startTransition(() => { setActiveTabRaw(tab); });
  }, []);
  const [saveFeedback, setSaveFeedback] = React.useState<string | null>(null);
  const [notifications, setNotifications] = React.useState(defaultNotifications);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch for theme
  React.useEffect(() => { setMounted(true); }, []);

  // Map next-themes value to display label
  const selectedTheme = mounted ? (theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System") : "System";

  const handleSave = (section: string) => {
    setSaveFeedback(section);
    setTimeout(() => setSaveFeedback(null), 2500);
  };

  const handleToggleNotification = (index: number) => {
    setNotifications((prev) =>
      prev.map((n, i) => (i === index ? { ...n, enabled: !n.enabled } : n))
    );
  };

  return (
    <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Settings</h1>
          <p className="text-sm sm:text-base text-text-secondary">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="md:hidden mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors",
                  activeTab === tab.id
                    ? "bg-accent text-white"
                    : "bg-bg-elevated text-text-secondary"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-48 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    activeTab === tab.id
                      ? "bg-accent/10 text-accent"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6">
            {activeTab === "profile" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center">
                        <span className="text-accent font-bold text-2xl">JS</span>
                      </div>
                      <div>
                        <Button variant="secondary" size="sm">Change Avatar</Button>
                        <p className="text-xs text-text-muted mt-1">JPG, PNG or GIF. Max 2MB.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">First Name</label>
                        <Input defaultValue="John" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">Last Name</label>
                        <Input defaultValue="Smith" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Email</label>
                      <Input type="email" defaultValue="john@acmecorp.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Job Title</label>
                      <Input defaultValue="SEO Director" />
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      {saveFeedback === "profile" && (
                        <span className="flex items-center gap-1.5 text-sm text-success animate-in fade-in">
                          <CheckCircle className="h-4 w-4" />
                          Changes saved
                        </span>
                      )}
                      <Button variant="accent" onClick={() => handleSave("profile")}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Organization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Organization Name</label>
                      <Input defaultValue="Acme Corp" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Website</label>
                      <Input defaultValue="https://acmecorp.com" />
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      {saveFeedback === "organization" && (
                        <span className="flex items-center gap-1.5 text-sm text-success animate-in fade-in">
                          <CheckCircle className="h-4 w-4" />
                          Changes saved
                        </span>
                      )}
                      <Button variant="accent" onClick={() => handleSave("organization")}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-bg-elevated">
                        <div>
                          <p className="font-medium text-text-primary">{notification.label}</p>
                          <p className="text-sm text-text-muted">{notification.description}</p>
                        </div>
                        <button
                          onClick={() => handleToggleNotification(index)}
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
            )}

            {activeTab === "billing" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Current Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-accent bg-accent/5">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-text-primary">Professional</h3>
                          <Badge variant="accent">Current Plan</Badge>
                        </div>
                        <p className="text-text-secondary">$299/month • Renews on Apr 1, 2026</p>
                      </div>
                      <Button variant="secondary">Change Plan</Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="p-4 rounded-lg bg-bg-elevated text-center">
                        <p className="text-2xl font-bold text-text-primary">12/15</p>
                        <p className="text-sm text-text-muted">Projects Used</p>
                      </div>
                      <div className="p-4 rounded-lg bg-bg-elevated text-center">
                        <p className="text-2xl font-bold text-text-primary">18.5K/25K</p>
                        <p className="text-sm text-text-muted">Keywords Used</p>
                      </div>
                      <div className="p-4 rounded-lg bg-bg-elevated text-center">
                        <p className="text-2xl font-bold text-text-primary">4/5</p>
                        <p className="text-sm text-text-muted">Team Members</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-bg-elevated">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-16 rounded bg-bg-card border border-border flex items-center justify-center">
                          <span className="text-xs font-bold text-text-muted">VISA</span>
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">•••• •••• •••• 4242</p>
                          <p className="text-sm text-text-muted">Expires 12/2027</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Update</Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === "api" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Keys
                  </CardTitle>
                  <Button variant="accent" size="sm">Create New Key</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {apiKeys.map((key, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-bg-elevated">
                        <div>
                          <p className="font-medium text-text-primary">{key.name}</p>
                          <p className="text-sm font-mono text-text-muted">{key.key}</p>
                          <p className="text-xs text-text-muted mt-1">
                            Created {key.created} • Last used {key.lastUsed}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">Copy</Button>
                          <Button variant="ghost" size="sm" className="text-error">Revoke</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Password
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Current Password</label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">New Password</label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Confirm New Password</label>
                      <Input type="password" />
                    </div>
                    <div className="flex justify-end">
                      <Button variant="accent">Update Password</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-bg-elevated">
                      <div>
                        <p className="font-medium text-text-primary">Two-Factor Authentication</p>
                        <p className="text-sm text-text-muted">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant="secondary">Enable 2FA</Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === "appearance" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-text-primary mb-3 block">Theme</label>
                      <div className="grid grid-cols-3 gap-4">
                        {["Light", "Dark", "System"].map((themeOption) => (
                          <button
                            key={themeOption}
                            onClick={() => setTheme(themeOption.toLowerCase())}
                            className={cn(
                              "p-4 rounded-lg border-2 transition-colors",
                              selectedTheme === themeOption ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                            )}
                          >
                            <div className={cn(
                              "h-20 rounded mb-2",
                              themeOption === "Light" ? "bg-white border border-border" :
                              themeOption === "Dark" ? "bg-gray-900" : "bg-gradient-to-r from-white to-gray-900"
                            )} />
                            <p className="text-sm font-medium text-text-primary">{themeOption}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
