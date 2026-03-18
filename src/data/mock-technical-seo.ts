// Mock Technical SEO Data
// For Site Audit and Technical SEO Agent

export interface TechnicalIssue {
  id: string;
  type: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  affectedPages: number;
  fixSuggestion: string;
  fixCode?: string;
  category: 'crawlability' | 'indexability' | 'performance' | 'content' | 'links' | 'security' | 'mobile' | 'structured-data';
}

export interface PageAudit {
  url: string;
  title: string;
  statusCode: number;
  loadTime: number;
  wordCount: number;
  issues: string[];
  score: number;
  lastCrawled: string;
}

export interface CrawlSummary {
  totalPages: number;
  crawledPages: number;
  indexablePages: number;
  nonIndexablePages: number;
  brokenPages: number;
  redirectedPages: number;
  healthScore: number;
  lastCrawl: string;
}

export interface CoreWebVitals {
  lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  fid: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  ttfb: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
}

export interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

// Mock crawl summary
export const mockCrawlSummary: CrawlSummary = {
  totalPages: 1247,
  crawledPages: 1198,
  indexablePages: 1052,
  nonIndexablePages: 146,
  brokenPages: 23,
  redirectedPages: 78,
  healthScore: 72,
  lastCrawl: '2026-03-17T14:30:00Z',
};

// Mock technical issues
export const mockTechnicalIssues: TechnicalIssue[] = [
  {
    id: '1',
    type: 'missing_meta_description',
    severity: 'critical',
    title: 'Missing Meta Descriptions',
    description: 'Pages without meta descriptions may have lower click-through rates in search results.',
    affectedPages: 45,
    fixSuggestion: 'Add unique, compelling meta descriptions (150-160 characters) to each page.',
    fixCode: `<meta name="description" content="Your compelling description here (150-160 chars)">`,
    category: 'content',
  },
  {
    id: '2',
    type: 'duplicate_title',
    severity: 'critical',
    title: 'Duplicate Title Tags',
    description: 'Multiple pages share the same title tag, which can confuse search engines.',
    affectedPages: 12,
    fixSuggestion: 'Create unique, descriptive title tags for each page.',
    category: 'content',
  },
  {
    id: '3',
    type: 'broken_links',
    severity: 'critical',
    title: 'Broken Internal Links',
    description: 'Links pointing to non-existent pages create poor user experience and waste crawl budget.',
    affectedPages: 23,
    fixSuggestion: 'Update or remove broken links. Consider implementing 301 redirects for moved content.',
    category: 'links',
  },
  {
    id: '4',
    type: 'slow_pages',
    severity: 'critical',
    title: 'Slow Loading Pages (>3s)',
    description: 'Pages taking more than 3 seconds to load may have higher bounce rates.',
    affectedPages: 18,
    fixSuggestion: 'Optimize images, enable compression, minimize CSS/JS, use browser caching.',
    category: 'performance',
  },
  {
    id: '5',
    type: 'missing_h1',
    severity: 'warning',
    title: 'Missing H1 Tags',
    description: 'Pages without H1 tags may not clearly communicate their main topic to search engines.',
    affectedPages: 8,
    fixSuggestion: 'Add a single, descriptive H1 tag to each page.',
    fixCode: `<h1>Your Main Page Heading</h1>`,
    category: 'content',
  },
  {
    id: '6',
    type: 'multiple_h1',
    severity: 'warning',
    title: 'Multiple H1 Tags',
    description: 'Pages with multiple H1 tags may dilute the main topic signal.',
    affectedPages: 15,
    fixSuggestion: 'Use only one H1 tag per page. Use H2-H6 for subheadings.',
    category: 'content',
  },
  {
    id: '7',
    type: 'missing_alt_text',
    severity: 'warning',
    title: 'Images Missing Alt Text',
    description: 'Images without alt text are not accessible and miss SEO opportunities.',
    affectedPages: 67,
    fixSuggestion: 'Add descriptive alt text to all images.',
    fixCode: `<img src="image.jpg" alt="Descriptive text about the image">`,
    category: 'content',
  },
  {
    id: '8',
    type: 'redirect_chains',
    severity: 'warning',
    title: 'Redirect Chains',
    description: 'Multiple redirects in sequence slow down page loading and waste crawl budget.',
    affectedPages: 34,
    fixSuggestion: 'Update redirects to point directly to the final destination.',
    fixCode: `# .htaccess - Direct redirect
Redirect 301 /old-page /final-destination`,
    category: 'links',
  },
  {
    id: '9',
    type: 'thin_content',
    severity: 'warning',
    title: 'Thin Content Pages (<300 words)',
    description: 'Pages with very little content may not provide enough value to rank well.',
    affectedPages: 28,
    fixSuggestion: 'Expand content to provide comprehensive coverage of the topic.',
    category: 'content',
  },
  {
    id: '10',
    type: 'missing_canonical',
    severity: 'warning',
    title: 'Missing Canonical Tags',
    description: 'Pages without canonical tags may cause duplicate content issues.',
    affectedPages: 56,
    fixSuggestion: 'Add self-referencing canonical tags to all pages.',
    fixCode: `<link rel="canonical" href="https://example.com/current-page">`,
    category: 'indexability',
  },
  {
    id: '11',
    type: 'http_pages',
    severity: 'warning',
    title: 'Non-HTTPS Pages',
    description: 'Pages served over HTTP are not secure and may be penalized in rankings.',
    affectedPages: 5,
    fixSuggestion: 'Implement HTTPS across the entire site and redirect HTTP to HTTPS.',
    fixCode: `# .htaccess - Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`,
    category: 'security',
  },
  {
    id: '12',
    type: 'missing_schema',
    severity: 'info',
    title: 'Missing Structured Data',
    description: 'Pages without structured data miss opportunities for rich snippets.',
    affectedPages: 89,
    fixSuggestion: 'Implement relevant schema markup (Organization, Article, Product, FAQ, etc.).',
    fixCode: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png"
}
</script>`,
    category: 'structured-data',
  },
  {
    id: '13',
    type: 'orphan_pages',
    severity: 'info',
    title: 'Orphan Pages',
    description: 'Pages with no internal links pointing to them are hard to discover.',
    affectedPages: 12,
    fixSuggestion: 'Add internal links from relevant pages to orphan pages.',
    category: 'links',
  },
  {
    id: '14',
    type: 'low_text_ratio',
    severity: 'info',
    title: 'Low Text-to-HTML Ratio',
    description: 'Pages with very little text relative to HTML code may be seen as low quality.',
    affectedPages: 19,
    fixSuggestion: 'Add more meaningful content and reduce unnecessary HTML/CSS/JS.',
    category: 'content',
  },
  {
    id: '15',
    type: 'mobile_issues',
    severity: 'warning',
    title: 'Mobile Usability Issues',
    description: 'Pages with mobile usability problems may rank lower in mobile search.',
    affectedPages: 7,
    fixSuggestion: 'Ensure responsive design, appropriate font sizes, and tap targets.',
    category: 'mobile',
  },
];

// Mock page audits
export const mockPageAudits: PageAudit[] = [
  { url: '/', title: 'Home', statusCode: 200, loadTime: 1.2, wordCount: 850, issues: [], score: 95, lastCrawled: '2026-03-17' },
  { url: '/about', title: 'About Us', statusCode: 200, loadTime: 1.5, wordCount: 1200, issues: ['missing_schema'], score: 88, lastCrawled: '2026-03-17' },
  { url: '/services', title: 'Our Services', statusCode: 200, loadTime: 2.1, wordCount: 950, issues: ['missing_alt_text'], score: 82, lastCrawled: '2026-03-17' },
  { url: '/blog', title: 'Blog', statusCode: 200, loadTime: 1.8, wordCount: 450, issues: ['thin_content'], score: 75, lastCrawled: '2026-03-17' },
  { url: '/contact', title: 'Contact Us', statusCode: 200, loadTime: 1.1, wordCount: 320, issues: ['thin_content', 'missing_schema'], score: 70, lastCrawled: '2026-03-17' },
  { url: '/products', title: 'Products', statusCode: 200, loadTime: 3.2, wordCount: 1500, issues: ['slow_pages'], score: 68, lastCrawled: '2026-03-17' },
  { url: '/old-page', title: 'Old Page', statusCode: 301, loadTime: 0.5, wordCount: 0, issues: ['redirect_chains'], score: 50, lastCrawled: '2026-03-17' },
  { url: '/broken-link', title: 'Not Found', statusCode: 404, loadTime: 0.3, wordCount: 0, issues: ['broken_links'], score: 0, lastCrawled: '2026-03-17' },
  { url: '/pricing', title: 'Pricing', statusCode: 200, loadTime: 1.4, wordCount: 680, issues: ['missing_meta_description'], score: 78, lastCrawled: '2026-03-17' },
  { url: '/faq', title: 'FAQ', statusCode: 200, loadTime: 1.6, wordCount: 2100, issues: [], score: 92, lastCrawled: '2026-03-17' },
];

// Mock Core Web Vitals
export const mockCoreWebVitals: CoreWebVitals = {
  lcp: { value: 2.1, rating: 'good' },
  fid: { value: 85, rating: 'needs-improvement' },
  cls: { value: 0.08, rating: 'good' },
  ttfb: { value: 420, rating: 'needs-improvement' },
};

// Mock Lighthouse scores
export const mockLighthouseScores: LighthouseScores = {
  performance: 78,
  accessibility: 92,
  bestPractices: 85,
  seo: 88,
};

// Issue counts by severity
export const getIssueCounts = () => {
  const critical = mockTechnicalIssues.filter(i => i.severity === 'critical').length;
  const warning = mockTechnicalIssues.filter(i => i.severity === 'warning').length;
  const info = mockTechnicalIssues.filter(i => i.severity === 'info').length;
  return { critical, warning, info, total: critical + warning + info };
};

// Issue counts by category
export const getIssuesByCategory = () => {
  const categories: Record<string, number> = {};
  mockTechnicalIssues.forEach(issue => {
    categories[issue.category] = (categories[issue.category] || 0) + 1;
  });
  return categories;
};

// Generate fix code for common issues
export const generateFixCode = (issueType: string, context?: Record<string, string>): string => {
  const fixes: Record<string, string> = {
    missing_meta_description: `<meta name="description" content="${context?.description || 'Your compelling meta description here'}">`,
    missing_h1: `<h1>${context?.title || 'Your Main Heading'}</h1>`,
    missing_alt_text: `<img src="${context?.src || 'image.jpg'}" alt="${context?.alt || 'Descriptive alt text'}">`,
    missing_canonical: `<link rel="canonical" href="${context?.url || 'https://example.com/page'}">`,
    missing_schema: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "${context?.type || 'WebPage'}",
  "name": "${context?.name || 'Page Title'}",
  "description": "${context?.description || 'Page description'}"
}
</script>`,
    redirect_301: `Redirect 301 ${context?.from || '/old-url'} ${context?.to || '/new-url'}`,
    robots_noindex: `<meta name="robots" content="noindex, nofollow">`,
    hreflang: `<link rel="alternate" hreflang="${context?.lang || 'en'}" href="${context?.url || 'https://example.com'}">`,
  };
  
  return fixes[issueType] || '// No auto-fix available for this issue type';
};
