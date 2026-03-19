"use client";

import * as React from "react";
import { TopNav } from "@/components/layout/top-nav";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);

  // Handle keyboard shortcut for command palette
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-bg-page">
      <TopNav onCommandPaletteOpen={() => setCommandPaletteOpen(true)} />
      
      {/* Main content - individual pages/layouts handle their own padding, pb-20 for mobile bottom nav clearance */}
      <main className="pb-20 md:pb-0">{children}</main>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
      
      {/* Command Palette Modal */}
      {commandPaletteOpen && (
        <div 
          className="fixed inset-0 z-[70] bg-black/50 flex items-start justify-center pt-[10vh] sm:pt-[20vh] px-4"
          onClick={() => setCommandPaletteOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-bg-card border border-border rounded-lg shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search projects, keywords, actions..."
                className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-base"
                autoFocus
              />
              <button 
                onClick={() => setCommandPaletteOpen(false)}
                className="px-2 py-1 text-xs font-mono bg-bg-elevated border border-border rounded text-text-muted hover:text-text-primary"
              >
                ESC
              </button>
            </div>
            <div className="p-4 text-sm text-text-muted text-center py-8">
              Start typing to search...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
