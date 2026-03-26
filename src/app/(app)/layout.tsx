"use client";

import * as React from "react";
import { TopNav } from "@/components/layout/top-nav";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { CommandPalette } from "@/components/command-palette";
import { DemoModeProvider } from "@/contexts/demo-mode-context";

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
    <DemoModeProvider>
      <div className="min-h-screen bg-bg-page">
        <TopNav onCommandPaletteOpen={() => setCommandPaletteOpen(true)} />
        
        {/* Main content - individual pages/layouts handle their own padding, pb-20 for mobile bottom nav clearance */}
        <main className="pb-20 md:pb-0">{children}</main>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
        
        {/* Command Palette */}
        <CommandPalette 
          isOpen={commandPaletteOpen} 
          onClose={() => setCommandPaletteOpen(false)} 
        />
      </div>
    </DemoModeProvider>
  );
}
