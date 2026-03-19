"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Search,
  Bell,
  Sun,
  Moon,
  LayoutDashboard,
  FolderKanban,
  PlayCircle,
  BarChart3,
  Settings,
  Command,
  User,
  LogOut,
  CreditCard,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useSession, signOut } from "@/lib/auth/client";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/agents", label: "Agents", icon: PlayCircle },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

const notifications = [
  {
    id: 1,
    title: "Site audit completed",
    description: "Acme Corp audit found 23 issues",
    time: "5 min ago",
    type: "success",
    read: false,
  },
  {
    id: 2,
    title: "Content published",
    description: "Technical SEO Guide is now live",
    time: "1 hour ago",
    type: "success",
    read: false,
  },
  {
    id: 3,
    title: "Ranking drop detected",
    description: "3 keywords dropped in position",
    time: "2 hours ago",
    type: "warning",
    read: false,
  },
  {
    id: 4,
    title: "Link building campaign",
    description: "5 new backlinks acquired",
    time: "5 hours ago",
    type: "info",
    read: true,
  },
  {
    id: 5,
    title: "Weekly report ready",
    description: "Your weekly SEO report is ready",
    time: "1 day ago",
    type: "info",
    read: true,
  },
];

interface TopNavProps {
  onCommandPaletteOpen?: () => void;
}

export function TopNav({ onCommandPaletteOpen }: TopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const notificationRef = React.useRef<HTMLDivElement>(null);
  const profileRef = React.useRef<HTMLDivElement>(null);
  
  // Get session data
  const { data: session, isPending: isSessionLoading } = useSession();
  const user = session?.user;

  // Get user initials
  const getUserInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      const parts = name.split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      setShowProfile(false);
    }
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-info" />;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 h-[var(--topnav-height)] border-b border-border bg-bg-card">
        <div className="flex h-full items-center justify-between px-3 sm:px-4">
          {/* Left side - Logo and Nav */}
          <div className="flex items-center gap-2 sm:gap-6">
            {/* Logo - minimal on mobile */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-accent sm:w-5 sm:h-5"
              >
                <path
                  d="M4 4L12 20L20 4"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-mono font-bold text-text-primary hidden sm:inline">
                Optimus SEO
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors",
                    isActive(item.href)
                      ? "text-text-primary font-medium bg-bg-elevated"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search / Command Palette - Hidden on mobile */}
            <button
              onClick={onCommandPaletteOpen}
              className="hidden sm:flex items-center gap-2 h-8 px-3 text-sm text-text-muted bg-bg-elevated border border-border rounded-md hover:border-text-muted transition-colors"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Search...</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-bg-card border border-border rounded">
                <Command className="h-3 w-3" />K
              </kbd>
            </button>

            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="sm:hidden"
              onClick={onCommandPaletteOpen}
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <Button
                variant="ghost"
                size="icon-sm"
                className="relative"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfile(false);
                }}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-[10px] font-medium text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-bg-card border border-border rounded-lg shadow-xl z-50">
                  <div className="flex items-center justify-between p-3 border-b border-border">
                    <h3 className="font-semibold text-text-primary">Notifications</h3>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Mark all read
                    </Button>
                  </div>
                  <div className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "flex items-start gap-3 p-3 hover:bg-bg-elevated cursor-pointer transition-colors border-b border-border last:border-0",
                          !notification.read && "bg-accent/5"
                        )}
                      >
                        <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm",
                            notification.read ? "text-text-secondary" : "text-text-primary font-medium"
                          )}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-text-muted truncate">
                            {notification.description}
                          </p>
                          <p className="text-xs text-text-muted mt-1">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-accent mt-1.5" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-accent"
                      onClick={() => {
                        setShowNotifications(false);
                        router.push("/settings?tab=notifications");
                      }}
                    >
                      View all notifications
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              {isSessionLoading ? (
                <div className="h-8 w-8 rounded-full bg-bg-elevated flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-text-muted" />
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowProfile(!showProfile);
                    setShowNotifications(false);
                  }}
                  className="h-8 w-8 rounded-full bg-accent text-white text-sm font-medium flex items-center justify-center hover:ring-2 hover:ring-accent/50 transition-all"
                >
                  {getUserInitials(user?.name, user?.email)}
                </button>
              )}

              {/* Profile Dropdown */}
              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 bg-bg-card border border-border rounded-lg shadow-xl z-50">
                  <div className="p-3 border-b border-border">
                    <p className="font-medium text-text-primary">
                      {user?.name || "User"}
                    </p>
                    <p className="text-sm text-text-muted truncate">
                      {user?.email || "No email"}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        router.push("/settings?tab=profile");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-bg-elevated transition-colors"
                    >
                      <User className="h-4 w-4 text-text-muted" />
                      Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        router.push("/settings?tab=billing");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-bg-elevated transition-colors"
                    >
                      <CreditCard className="h-4 w-4 text-text-muted" />
                      Billing
                    </button>
                    <button
                      onClick={() => {
                        setShowProfile(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-bg-elevated transition-colors"
                    >
                      <HelpCircle className="h-4 w-4 text-text-muted" />
                      Help & Support
                    </button>
                  </div>
                  <div className="py-1 border-t border-border">
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                    >
                      {isLoggingOut ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="h-4 w-4" />
                      )}
                      {isLoggingOut ? "Signing out..." : "Sign out"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
