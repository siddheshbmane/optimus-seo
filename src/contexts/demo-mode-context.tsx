"use client";

import * as React from "react";

interface DemoModeContextType {
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  toggleDemoMode: () => void;
}

const DemoModeContext = React.createContext<DemoModeContextType | undefined>(undefined);

const DEMO_MODE_KEY = "optimus-demo-mode";

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Load from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem(DEMO_MODE_KEY);
    // Default to false (show real data)
    setIsDemoMode(stored === "true");
    setIsInitialized(true);
  }, []);

  // Save to localStorage when changed
  React.useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(DEMO_MODE_KEY, String(isDemoMode));
    }
  }, [isDemoMode, isInitialized]);

  const setDemoMode = React.useCallback((enabled: boolean) => {
    setIsDemoMode(enabled);
  }, []);

  const toggleDemoMode = React.useCallback(() => {
    setIsDemoMode(prev => !prev);
  }, []);

  return (
    <DemoModeContext.Provider value={{ isDemoMode, setDemoMode, toggleDemoMode }}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  const context = React.useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error("useDemoMode must be used within a DemoModeProvider");
  }
  return context;
}

// Safe hook that doesn't throw if used outside provider (returns false)
export function useDemoModeSafe() {
  const context = React.useContext(DemoModeContext);
  return context?.isDemoMode ?? false;
}
