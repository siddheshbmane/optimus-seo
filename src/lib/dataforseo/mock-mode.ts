// Mock Mode Controller for DataForSEO API
// Manages switching between mock data and real API calls

import { shouldUseMockData } from '@/config/env';
import { features } from '@/config/features';

export type MockModeState = {
  enabled: boolean;
  reason: 'no_credentials' | 'feature_flag' | 'development' | 'manual';
};

class MockModeController {
  private manualOverride: boolean | null = null;

  /**
   * Check if mock mode is currently enabled
   */
  isEnabled(): boolean {
    // Manual override takes precedence
    if (this.manualOverride !== null) {
      return this.manualOverride;
    }

    // Check feature flag
    if (features.mockMode) {
      return true;
    }

    // Check environment
    return shouldUseMockData();
  }

  /**
   * Get the current mock mode state with reason
   */
  getState(): MockModeState {
    if (this.manualOverride !== null) {
      return {
        enabled: this.manualOverride,
        reason: 'manual',
      };
    }

    if (features.mockMode) {
      return {
        enabled: true,
        reason: 'feature_flag',
      };
    }

    if (shouldUseMockData()) {
      return {
        enabled: true,
        reason: process.env.NODE_ENV === 'development' ? 'development' : 'no_credentials',
      };
    }

    return {
      enabled: false,
      reason: 'manual',
    };
  }

  /**
   * Manually enable mock mode
   */
  enable(): void {
    this.manualOverride = true;
    this.notifyChange();
  }

  /**
   * Manually disable mock mode (use real API)
   */
  disable(): void {
    this.manualOverride = false;
    this.notifyChange();
  }

  /**
   * Reset to automatic mode (based on env/features)
   */
  reset(): void {
    this.manualOverride = null;
    this.notifyChange();
  }

  /**
   * Toggle mock mode
   */
  toggle(): boolean {
    const newState = !this.isEnabled();
    this.manualOverride = newState;
    this.notifyChange();
    return newState;
  }

  /**
   * Notify listeners of mock mode change
   */
  private notifyChange(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mockModeChange', {
        detail: this.getState(),
      }));
    }
  }

  /**
   * Subscribe to mock mode changes
   */
  subscribe(callback: (state: MockModeState) => void): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const handler = (event: Event) => {
      callback((event as CustomEvent<MockModeState>).detail);
    };

    window.addEventListener('mockModeChange', handler);
    return () => window.removeEventListener('mockModeChange', handler);
  }
}

// Export singleton instance
export const mockMode = new MockModeController();

// Export class for testing
export { MockModeController };

// React hook for mock mode
export function useMockMode(): MockModeState & { toggle: () => boolean; enable: () => void; disable: () => void } {
  // This would be a proper React hook in a real implementation
  // For now, return the current state
  return {
    ...mockMode.getState(),
    toggle: () => mockMode.toggle(),
    enable: () => mockMode.enable(),
    disable: () => mockMode.disable(),
  };
}
