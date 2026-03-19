// Export Generators - CSV and PDF generation utilities

export interface ExportColumn {
  key: string;
  label: string;
  format?: (value: unknown) => string;
}

export interface ExportOptions {
  filename: string;
  title?: string;
  subtitle?: string;
  columns: ExportColumn[];
  data: Record<string, unknown>[];
  includeTimestamp?: boolean;
}

// Generate CSV content
export function generateCSV(options: ExportOptions): string {
  const { columns, data, includeTimestamp } = options;
  
  // Header row
  const headers = columns.map(col => `"${col.label}"`).join(',');
  
  // Data rows
  const rows = data.map(row => {
    return columns.map(col => {
      const value = row[col.key];
      const formatted = col.format ? col.format(value) : String(value ?? '');
      // Escape quotes and wrap in quotes
      return `"${formatted.replace(/"/g, '""')}"`;
    }).join(',');
  });
  
  let csv = [headers, ...rows].join('\n');
  
  if (includeTimestamp) {
    csv = `# Generated: ${new Date().toISOString()}\n${csv}`;
  }
  
  return csv;
}

// Generate HTML for PDF (to be converted by browser or server)
export function generatePDFHTML(options: ExportOptions): string {
  const { title, subtitle, columns, data, includeTimestamp } = options;
  
  const tableRows = data.map(row => {
    const cells = columns.map(col => {
      const value = row[col.key];
      const formatted = col.format ? col.format(value) : String(value ?? '');
      return `<td style="padding: 8px; border: 1px solid #ddd;">${formatted}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  
  const headerCells = columns.map(col => 
    `<th style="padding: 8px; border: 1px solid #ddd; background: #f5f5f5; font-weight: bold;">${col.label}</th>`
  ).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title || 'Export'}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #333; margin-bottom: 5px; }
        h2 { color: #666; font-weight: normal; margin-top: 0; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        .timestamp { color: #999; font-size: 12px; margin-top: 20px; }
        @media print {
          body { padding: 0; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      ${title ? `<h1>${title}</h1>` : ''}
      ${subtitle ? `<h2>${subtitle}</h2>` : ''}
      <table>
        <thead>
          <tr>${headerCells}</tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      ${includeTimestamp ? `<p class="timestamp">Generated: ${new Date().toLocaleString()}</p>` : ''}
    </body>
    </html>
  `;
}

// Common column formatters
export const formatters = {
  number: (value: unknown) => {
    const num = Number(value);
    return isNaN(num) ? '0' : num.toLocaleString();
  },
  
  currency: (value: unknown, currency = 'USD') => {
    const num = Number(value);
    return isNaN(num) ? '$0.00' : new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(num);
  },
  
  percentage: (value: unknown) => {
    const num = Number(value);
    return isNaN(num) ? '0%' : `${num.toFixed(1)}%`;
  },
  
  date: (value: unknown) => {
    if (!value) return '';
    const date = new Date(String(value));
    return isNaN(date.getTime()) ? '' : date.toLocaleDateString();
  },
  
  datetime: (value: unknown) => {
    if (!value) return '';
    const date = new Date(String(value));
    return isNaN(date.getTime()) ? '' : date.toLocaleString();
  },
  
  boolean: (value: unknown) => {
    return value ? 'Yes' : 'No';
  },
  
  truncate: (maxLength: number) => (value: unknown) => {
    const str = String(value ?? '');
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
  },
};

// Predefined export templates
export const exportTemplates = {
  keywords: {
    columns: [
      { key: 'keyword', label: 'Keyword' },
      { key: 'searchVolume', label: 'Search Volume', format: formatters.number },
      { key: 'difficulty', label: 'Difficulty', format: formatters.percentage },
      { key: 'cpc', label: 'CPC', format: formatters.currency },
      { key: 'competition', label: 'Competition' },
      { key: 'trend', label: 'Trend' },
    ],
  },
  
  backlinks: {
    columns: [
      { key: 'sourceUrl', label: 'Source URL', format: formatters.truncate(50) },
      { key: 'targetUrl', label: 'Target URL', format: formatters.truncate(50) },
      { key: 'anchorText', label: 'Anchor Text' },
      { key: 'domainRating', label: 'Domain Rating', format: formatters.number },
      { key: 'dofollow', label: 'Dofollow', format: formatters.boolean },
      { key: 'firstSeen', label: 'First Seen', format: formatters.date },
    ],
  },
  
  rankings: {
    columns: [
      { key: 'keyword', label: 'Keyword' },
      { key: 'position', label: 'Position', format: formatters.number },
      { key: 'previousPosition', label: 'Previous', format: formatters.number },
      { key: 'change', label: 'Change', format: formatters.number },
      { key: 'url', label: 'URL', format: formatters.truncate(50) },
      { key: 'searchVolume', label: 'Volume', format: formatters.number },
    ],
  },
  
  siteAudit: {
    columns: [
      { key: 'url', label: 'URL', format: formatters.truncate(60) },
      { key: 'issue', label: 'Issue' },
      { key: 'severity', label: 'Severity' },
      { key: 'category', label: 'Category' },
      { key: 'recommendation', label: 'Recommendation', format: formatters.truncate(100) },
    ],
  },
  
  competitors: {
    columns: [
      { key: 'domain', label: 'Domain' },
      { key: 'organicTraffic', label: 'Organic Traffic', format: formatters.number },
      { key: 'organicKeywords', label: 'Keywords', format: formatters.number },
      { key: 'domainRating', label: 'DR', format: formatters.number },
      { key: 'backlinks', label: 'Backlinks', format: formatters.number },
      { key: 'commonKeywords', label: 'Common Keywords', format: formatters.number },
    ],
  },
};

// Export job tracking
export interface ExportJob {
  id: string;
  type: 'csv' | 'pdf';
  template: keyof typeof exportTemplates | 'custom';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  filename: string;
  downloadUrl?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

const exportJobs: Map<string, ExportJob> = new Map();

export function createExportJob(
  type: 'csv' | 'pdf',
  template: keyof typeof exportTemplates | 'custom',
  filename: string
): ExportJob {
  const job: ExportJob = {
    id: `export-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    template,
    status: 'pending',
    filename,
    createdAt: new Date().toISOString(),
  };
  
  exportJobs.set(job.id, job);
  return job;
}

export function getExportJob(id: string): ExportJob | undefined {
  return exportJobs.get(id);
}

export function updateExportJob(id: string, updates: Partial<ExportJob>): ExportJob | undefined {
  const job = exportJobs.get(id);
  if (job) {
    Object.assign(job, updates);
  }
  return job;
}

export function listExportJobs(): ExportJob[] {
  return Array.from(exportJobs.values());
}
