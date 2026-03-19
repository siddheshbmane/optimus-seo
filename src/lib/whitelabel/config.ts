// White-label Configuration
// Allows customization of branding per organization

export interface WhitelabelConfig {
  id: string;
  organizationId: string;
  enabled: boolean;
  branding: {
    name: string;
    logo: string;
    logoLight?: string;
    logoDark?: string;
    favicon?: string;
    primaryColor: string;
    accentColor: string;
    backgroundColor?: string;
    textColor?: string;
  };
  customDomain?: string;
  emailSettings?: {
    fromName: string;
    fromEmail: string;
    replyTo?: string;
    footerText?: string;
  };
  features?: {
    hideOptimus?: boolean;
    customFooter?: string;
    customCss?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Default Optimus SEO branding
export const defaultBranding: WhitelabelConfig['branding'] = {
  name: 'Optimus SEO',
  logo: '/logo.svg',
  primaryColor: '#FD8C73',
  accentColor: '#FD8C73',
};

// Mock whitelabel configs
export const mockWhitelabelConfigs: WhitelabelConfig[] = [
  {
    id: 'wl-1',
    organizationId: 'org-acme',
    enabled: true,
    branding: {
      name: 'Acme SEO Suite',
      logo: '/logos/acme-logo.svg',
      primaryColor: '#3B82F6',
      accentColor: '#10B981',
    },
    customDomain: 'seo.acmecorp.com',
    emailSettings: {
      fromName: 'Acme SEO',
      fromEmail: 'seo@acmecorp.com',
    },
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-03-01T14:30:00Z',
  },
  {
    id: 'wl-2',
    organizationId: 'org-agency',
    enabled: true,
    branding: {
      name: 'Digital Growth Platform',
      logo: '/logos/agency-logo.svg',
      primaryColor: '#8B5CF6',
      accentColor: '#EC4899',
    },
    emailSettings: {
      fromName: 'Digital Growth',
      fromEmail: 'reports@digitalgrowth.io',
    },
    features: {
      hideOptimus: true,
      customFooter: '© 2026 Digital Growth Agency. All rights reserved.',
    },
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-03-10T09:15:00Z',
  },
];

// Get whitelabel config for organization
export function getWhitelabelConfig(organizationId: string): WhitelabelConfig | null {
  return mockWhitelabelConfigs.find(c => c.organizationId === organizationId) || null;
}

// Apply whitelabel CSS variables
export function applyWhitelabelStyles(config: WhitelabelConfig): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  root.style.setProperty('--primary', config.branding.primaryColor);
  root.style.setProperty('--accent', config.branding.accentColor);
  
  if (config.branding.backgroundColor) {
    root.style.setProperty('--background', config.branding.backgroundColor);
  }
  if (config.branding.textColor) {
    root.style.setProperty('--foreground', config.branding.textColor);
  }
  
  if (config.features?.customCss) {
    const styleEl = document.createElement('style');
    styleEl.id = 'whitelabel-custom-css';
    styleEl.textContent = config.features.customCss;
    document.head.appendChild(styleEl);
  }
}

// Generate CSS from config
export function generateWhitelabelCSS(config: WhitelabelConfig): string {
  return `
    :root {
      --primary: ${config.branding.primaryColor};
      --accent: ${config.branding.accentColor};
      ${config.branding.backgroundColor ? `--background: ${config.branding.backgroundColor};` : ''}
      ${config.branding.textColor ? `--foreground: ${config.branding.textColor};` : ''}
    }
    ${config.features?.customCss || ''}
  `;
}
