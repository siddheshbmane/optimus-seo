// Technical SEO Agent
// Autonomous agent for analyzing sites and generating fix code

import { mockTechnicalIssues, type TechnicalIssue } from '@/data/mock-technical-seo';

// Types
export interface PageData {
  url: string;
  title: string;
  description?: string;
  content?: string;
  statusCode: number;
  loadTime: number;
  wordCount: number;
  h1?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  images?: { src: string; alt?: string }[];
}

export interface SiteAnalysis {
  healthScore: number;
  totalPages: number;
  indexablePages: number;
  issues: TechnicalIssue[];
  recommendations: Recommendation[];
  coreWebVitals: CoreWebVitalsAnalysis;
  schemaStatus: SchemaStatus[];
}

export interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  fixCode?: string;
}

export interface CoreWebVitalsAnalysis {
  lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor'; suggestion: string };
  fid: { value: number; rating: 'good' | 'needs-improvement' | 'poor'; suggestion: string };
  cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor'; suggestion: string };
  ttfb: { value: number; rating: 'good' | 'needs-improvement' | 'poor'; suggestion: string };
}

export interface SchemaStatus {
  type: string;
  status: 'valid' | 'warning' | 'missing' | 'error';
  pages: number;
  issues: string[];
}

export interface RedirectChain {
  id: string;
  originalUrl: string;
  chain: { url: string; statusCode: number }[];
  finalUrl: string;
  hops: number;
}

export interface FixCode {
  type: string;
  language: 'html' | 'htaccess' | 'json' | 'javascript' | 'nginx';
  code: string;
  description: string;
  affectedPages: string[];
}

export interface PrioritizedIssue extends TechnicalIssue {
  priorityScore: number;
  estimatedImpact: 'high' | 'medium' | 'low';
  estimatedEffort: 'low' | 'medium' | 'high';
  roi: number; // Impact / Effort ratio
}

// Technical SEO Agent Implementation
export class TechnicalSEOAgent {
  private siteUrl: string;

  constructor(siteUrl: string = 'https://example.com') {
    this.siteUrl = siteUrl;
  }

  /**
   * Analyze a site and return comprehensive analysis
   */
  analyzeSite(url: string): SiteAnalysis {
    // In production, this would crawl the site and analyze it
    // For now, we return mock data with intelligent analysis
    
    const issues = this.detectIssues();
    const healthScore = this.calculateHealthScore(issues);
    
    return {
      healthScore,
      totalPages: 1247,
      indexablePages: 1052,
      issues,
      recommendations: this.generateRecommendations(issues),
      coreWebVitals: this.analyzeCoreWebVitals(),
      schemaStatus: this.analyzeSchema(),
    };
  }

  /**
   * Detect technical SEO issues
   */
  private detectIssues(): TechnicalIssue[] {
    return mockTechnicalIssues;
  }

  /**
   * Calculate site health score based on issues
   */
  private calculateHealthScore(issues: TechnicalIssue[]): number {
    let score = 100;
    
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical':
          score -= 8;
          break;
        case 'warning':
          score -= 3;
          break;
        case 'info':
          score -= 1;
          break;
      }
    });
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate meta tag for a page
   */
  generateMetaTag(page: PageData): string {
    const title = page.title || 'Page Title';
    const description = page.description || this.generateDescription(page);
    
    return `<!-- Meta Tags for ${page.url} -->
<title>${this.truncate(title, 60)}</title>
<meta name="description" content="${this.truncate(description, 160)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${page.canonicalUrl || page.url}">

<!-- Open Graph -->
<meta property="og:title" content="${this.truncate(title, 60)}">
<meta property="og:description" content="${this.truncate(description, 160)}">
<meta property="og:url" content="${page.url}">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${this.truncate(title, 60)}">
<meta name="twitter:description" content="${this.truncate(description, 160)}">`;
  }

  /**
   * Generate schema markup for a page
   */
  generateSchemaMarkup(page: PageData, schemaType: string = 'WebPage'): string {
    const schemas: Record<string, object> = {
      WebPage: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: page.title,
        description: page.description || '',
        url: page.url,
      },
      Article: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: page.title,
        description: page.description || '',
        url: page.url,
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        author: {
          '@type': 'Organization',
          name: 'Your Company',
        },
      },
      Product: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: page.title,
        description: page.description || '',
        url: page.url,
        offers: {
          '@type': 'Offer',
          price: '0.00',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
      },
      Organization: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Your Company Name',
        url: this.siteUrl,
        logo: `${this.siteUrl}/logo.png`,
        sameAs: [
          'https://twitter.com/yourcompany',
          'https://linkedin.com/company/yourcompany',
          'https://facebook.com/yourcompany',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+1-XXX-XXX-XXXX',
          contactType: 'customer service',
        },
      },
      FAQ: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Sample Question 1?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sample answer to question 1.',
            },
          },
          {
            '@type': 'Question',
            name: 'Sample Question 2?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sample answer to question 2.',
            },
          },
        ],
      },
      BreadcrumbList: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: this.siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.title,
            item: page.url,
          },
        ],
      },
      LocalBusiness: {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Your Business Name',
        url: this.siteUrl,
        telephone: '+1-XXX-XXX-XXXX',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '123 Main Street',
          addressLocality: 'City',
          addressRegion: 'State',
          postalCode: '12345',
          addressCountry: 'US',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 40.7128,
          longitude: -74.006,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '17:00',
          },
        ],
      },
    };

    const schema = schemas[schemaType] || schemas.WebPage;
    
    return `<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>`;
  }

  /**
   * Generate redirect rules for redirect chains
   */
  generateRedirectRules(chains: RedirectChain[], format: 'htaccess' | 'nginx' = 'htaccess'): string {
    if (format === 'nginx') {
      return this.generateNginxRedirects(chains);
    }
    return this.generateHtaccessRedirects(chains);
  }

  private generateHtaccessRedirects(chains: RedirectChain[]): string {
    let rules = `# .htaccess Redirect Rules
# Generated by Technical SEO Agent
# Date: ${new Date().toISOString()}

RewriteEngine On

`;

    chains.forEach(chain => {
      rules += `# Fix redirect chain: ${chain.originalUrl} -> ${chain.finalUrl} (${chain.hops} hops)\n`;
      rules += `Redirect 301 ${new URL(chain.originalUrl).pathname} ${chain.finalUrl}\n\n`;
    });

    return rules;
  }

  private generateNginxRedirects(chains: RedirectChain[]): string {
    let rules = `# Nginx Redirect Rules
# Generated by Technical SEO Agent
# Date: ${new Date().toISOString()}

`;

    chains.forEach(chain => {
      const path = new URL(chain.originalUrl).pathname;
      rules += `# Fix redirect chain: ${chain.originalUrl} -> ${chain.finalUrl} (${chain.hops} hops)\n`;
      rules += `location = ${path} {\n`;
      rules += `    return 301 ${chain.finalUrl};\n`;
      rules += `}\n\n`;
    });

    return rules;
  }

  /**
   * Prioritize issues by impact and effort
   */
  prioritizeFixes(issues: TechnicalIssue[]): PrioritizedIssue[] {
    return issues.map(issue => {
      const impactScore = this.calculateImpactScore(issue);
      const effortScore = this.calculateEffortScore(issue);
      const roi = impactScore / effortScore;

      const estimatedImpact: 'high' | 'medium' | 'low' = impactScore >= 3 ? 'high' : impactScore >= 2 ? 'medium' : 'low';
      const estimatedEffort: 'high' | 'medium' | 'low' = effortScore >= 3 ? 'high' : effortScore >= 2 ? 'medium' : 'low';

      return {
        ...issue,
        priorityScore: roi * 100,
        estimatedImpact,
        estimatedEffort,
        roi,
      };
    }).sort((a, b) => b.priorityScore - a.priorityScore);
  }

  private calculateImpactScore(issue: TechnicalIssue): number {
    let score = 1;
    
    // Severity impact
    switch (issue.severity) {
      case 'critical': score += 3; break;
      case 'warning': score += 2; break;
      case 'info': score += 1; break;
    }
    
    // Pages affected impact
    if (issue.affectedPages > 50) score += 2;
    else if (issue.affectedPages > 20) score += 1;
    
    // Category impact
    if (['crawlability', 'indexability', 'performance'].includes(issue.category)) {
      score += 1;
    }
    
    return score;
  }

  private calculateEffortScore(issue: TechnicalIssue): number {
    let score = 1;
    
    // Has auto-fix code = lower effort
    if (issue.fixCode) score -= 0.5;
    
    // More pages = more effort
    if (issue.affectedPages > 50) score += 2;
    else if (issue.affectedPages > 20) score += 1;
    
    // Category effort
    if (['security', 'performance'].includes(issue.category)) {
      score += 1; // These typically require more effort
    }
    
    return Math.max(1, score);
  }

  /**
   * Generate fix code for a specific issue
   */
  generateFixCode(issue: TechnicalIssue): FixCode {
    const fixCodes: Record<string, FixCode> = {
      missing_meta_description: {
        type: 'meta_description',
        language: 'html',
        code: `<meta name="description" content="Your compelling meta description here. Keep it between 150-160 characters for optimal display in search results.">`,
        description: 'Add this meta description tag to the <head> section of your HTML.',
        affectedPages: [],
      },
      duplicate_title: {
        type: 'title_tag',
        language: 'html',
        code: `<title>Unique Page Title | Brand Name</title>`,
        description: 'Ensure each page has a unique, descriptive title tag.',
        affectedPages: [],
      },
      broken_links: {
        type: 'redirect',
        language: 'htaccess',
        code: `# Redirect broken links to appropriate pages
Redirect 301 /old-broken-page /new-working-page
Redirect 301 /another-broken-link /relevant-page`,
        description: 'Add these redirects to your .htaccess file or update the links directly.',
        affectedPages: [],
      },
      slow_pages: {
        type: 'performance',
        language: 'html',
        code: `<!-- Preload critical resources -->
<link rel="preload" href="/critical.css" as="style">
<link rel="preload" href="/hero-image.webp" as="image">

<!-- Defer non-critical JavaScript -->
<script src="/non-critical.js" defer></script>

<!-- Lazy load images -->
<img src="image.jpg" loading="lazy" alt="Description">`,
        description: 'Implement these performance optimizations to improve page load time.',
        affectedPages: [],
      },
      missing_h1: {
        type: 'heading',
        language: 'html',
        code: `<h1>Your Main Page Heading</h1>`,
        description: 'Add a single, descriptive H1 tag to each page.',
        affectedPages: [],
      },
      missing_alt_text: {
        type: 'accessibility',
        language: 'html',
        code: `<img src="image.jpg" alt="Descriptive text explaining the image content" width="800" height="600">`,
        description: 'Add descriptive alt text to all images for accessibility and SEO.',
        affectedPages: [],
      },
      redirect_chains: {
        type: 'redirect',
        language: 'htaccess',
        code: `# Fix redirect chains - point directly to final destination
Redirect 301 /old-page-1 /final-destination
Redirect 301 /old-page-2 /final-destination
# Remove intermediate redirects`,
        description: 'Update redirects to point directly to the final destination URL.',
        affectedPages: [],
      },
      missing_canonical: {
        type: 'canonical',
        language: 'html',
        code: `<link rel="canonical" href="https://example.com/current-page">`,
        description: 'Add self-referencing canonical tags to prevent duplicate content issues.',
        affectedPages: [],
      },
      http_pages: {
        type: 'security',
        language: 'htaccess',
        code: `# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`,
        description: 'Add this to your .htaccess file to redirect all HTTP traffic to HTTPS.',
        affectedPages: [],
      },
      missing_schema: {
        type: 'structured_data',
        language: 'json',
        code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Page Title",
  "description": "Page description",
  "url": "https://example.com/page"
}
</script>`,
        description: 'Add structured data markup to enable rich snippets in search results.',
        affectedPages: [],
      },
    };

    return fixCodes[issue.type] || {
      type: issue.type,
      language: 'html',
      code: `<!-- Fix for ${issue.title} -->\n<!-- ${issue.fixSuggestion} -->`,
      description: issue.fixSuggestion,
      affectedPages: [],
    };
  }

  /**
   * Generate recommendations based on issues
   */
  private generateRecommendations(issues: TechnicalIssue[]): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Group issues by category
    const issuesByCategory = issues.reduce((acc, issue) => {
      acc[issue.category] = acc[issue.category] || [];
      acc[issue.category].push(issue);
      return acc;
    }, {} as Record<string, TechnicalIssue[]>);

    // Generate recommendations per category
    if (issuesByCategory.content?.length > 3) {
      recommendations.push({
        id: 'content-audit',
        priority: 'high',
        category: 'content',
        title: 'Conduct Content Audit',
        description: 'Multiple content issues detected. Perform a comprehensive content audit to identify and fix meta descriptions, title tags, and thin content.',
        impact: 'Improved click-through rates and better search visibility',
        effort: 'medium',
      });
    }

    if (issuesByCategory.performance?.length > 0) {
      recommendations.push({
        id: 'performance-optimization',
        priority: 'high',
        category: 'performance',
        title: 'Optimize Page Performance',
        description: 'Slow pages detected. Implement image optimization, code minification, and caching strategies.',
        impact: 'Better user experience and improved Core Web Vitals',
        effort: 'medium',
      });
    }

    if (issuesByCategory.links?.length > 0) {
      recommendations.push({
        id: 'link-cleanup',
        priority: 'medium',
        category: 'links',
        title: 'Clean Up Link Structure',
        description: 'Fix broken links and redirect chains to improve crawl efficiency and user experience.',
        impact: 'Better crawl budget utilization and reduced bounce rates',
        effort: 'low',
      });
    }

    if (issuesByCategory['structured-data']?.length > 0) {
      recommendations.push({
        id: 'schema-implementation',
        priority: 'medium',
        category: 'structured-data',
        title: 'Implement Schema Markup',
        description: 'Add structured data to enable rich snippets and improve search appearance.',
        impact: 'Enhanced search listings and potential CTR improvement',
        effort: 'low',
      });
    }

    return recommendations;
  }

  /**
   * Analyze Core Web Vitals
   */
  private analyzeCoreWebVitals(): CoreWebVitalsAnalysis {
    return {
      lcp: {
        value: 2.1,
        rating: 'good',
        suggestion: 'LCP is good. Continue monitoring and optimize images for even better performance.',
      },
      fid: {
        value: 85,
        rating: 'needs-improvement',
        suggestion: 'Reduce JavaScript execution time. Consider code splitting and deferring non-critical scripts.',
      },
      cls: {
        value: 0.08,
        rating: 'good',
        suggestion: 'CLS is good. Ensure all images and embeds have explicit dimensions.',
      },
      ttfb: {
        value: 420,
        rating: 'needs-improvement',
        suggestion: 'Optimize server response time. Consider using a CDN and implementing caching.',
      },
    };
  }

  /**
   * Analyze schema status
   */
  private analyzeSchema(): SchemaStatus[] {
    return [
      { type: 'Organization', status: 'valid', pages: 1, issues: [] },
      { type: 'WebSite', status: 'valid', pages: 1, issues: [] },
      { type: 'BreadcrumbList', status: 'warning', pages: 45, issues: ['Missing on 12 pages'] },
      { type: 'Article', status: 'valid', pages: 28, issues: [] },
      { type: 'Product', status: 'missing', pages: 0, issues: ['Not implemented on product pages'] },
      { type: 'FAQ', status: 'missing', pages: 0, issues: ['Could benefit FAQ pages'] },
      { type: 'LocalBusiness', status: 'warning', pages: 1, issues: ['Missing opening hours'] },
    ];
  }

  /**
   * Helper: Generate description from page content
   */
  private generateDescription(page: PageData): string {
    if (page.content) {
      return this.truncate(page.content.replace(/\s+/g, ' ').trim(), 160);
    }
    return `Learn more about ${page.title} on our website.`;
  }

  /**
   * Helper: Truncate string to max length
   */
  private truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + '...';
  }

  /**
   * Export all fixes as a bundle
   */
  exportFixes(issues: TechnicalIssue[], format: 'json' | 'html' | 'csv' = 'json'): string {
    const fixes = issues.map(issue => ({
      id: issue.id,
      type: issue.type,
      title: issue.title,
      severity: issue.severity,
      affectedPages: issue.affectedPages,
      fixCode: issue.fixCode || this.generateFixCode(issue).code,
    }));

    switch (format) {
      case 'html':
        return this.exportAsHtml(fixes);
      case 'csv':
        return this.exportAsCsv(fixes);
      default:
        return JSON.stringify(fixes, null, 2);
    }
  }

  private exportAsHtml(fixes: Array<{ id: string; type: string; title: string; severity: string; affectedPages: number; fixCode: string }>): string {
    return `<!DOCTYPE html>
<html>
<head>
  <title>Technical SEO Fixes</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    .fix { border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .fix h3 { margin: 0 0 8px 0; }
    .severity { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
    .critical { background: #fee2e2; color: #dc2626; }
    .warning { background: #fef3c7; color: #d97706; }
    .info { background: #dbeafe; color: #2563eb; }
    pre { background: #f3f4f6; padding: 12px; border-radius: 4px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>Technical SEO Fixes</h1>
  <p>Generated: ${new Date().toISOString()}</p>
  ${fixes.map(fix => `
  <div class="fix">
    <h3>${fix.title}</h3>
    <span class="severity ${fix.severity}">${fix.severity}</span>
    <p>Affected pages: ${fix.affectedPages}</p>
    <pre><code>${fix.fixCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
  </div>
  `).join('')}
</body>
</html>`;
  }

  private exportAsCsv(fixes: Array<{ id: string; type: string; title: string; severity: string; affectedPages: number; fixCode: string }>): string {
    const headers = ['ID', 'Type', 'Title', 'Severity', 'Affected Pages', 'Fix Code'];
    const rows = fixes.map(fix => [
      fix.id,
      fix.type,
      `"${fix.title}"`,
      fix.severity,
      fix.affectedPages.toString(),
      `"${fix.fixCode.replace(/"/g, '""')}"`,
    ]);
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
}

// Export singleton instance
export const technicalSEOAgent = new TechnicalSEOAgent();

// Export convenience functions
export const analyzeSite = (url: string) => technicalSEOAgent.analyzeSite(url);
export const generateMetaTag = (page: PageData) => technicalSEOAgent.generateMetaTag(page);
export const generateSchemaMarkup = (page: PageData, type?: string) => technicalSEOAgent.generateSchemaMarkup(page, type);
export const generateRedirectRules = (chains: RedirectChain[], format?: 'htaccess' | 'nginx') => technicalSEOAgent.generateRedirectRules(chains, format);
export const prioritizeFixes = (issues: TechnicalIssue[]) => technicalSEOAgent.prioritizeFixes(issues);
export const generateFixCode = (issue: TechnicalIssue) => technicalSEOAgent.generateFixCode(issue);
export const exportFixes = (issues: TechnicalIssue[], format?: 'json' | 'html' | 'csv') => technicalSEOAgent.exportFixes(issues, format);
