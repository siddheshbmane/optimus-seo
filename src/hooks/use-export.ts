'use client';

import { useState, useCallback } from 'react';

export interface ExportOptions {
  type: 'csv' | 'pdf';
  template?: string;
  data: Record<string, unknown>[];
  columns?: Array<{ key: string; label: string }>;
  filename?: string;
  title?: string;
  subtitle?: string;
  includeTimestamp?: boolean;
}

export function useExport() {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = useCallback(async (options: ExportOptions) => {
    setExporting(true);
    setError(null);

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Export failed');
      }

      // Get the content type
      const contentType = response.headers.get('Content-Type') || '';
      const filename = options.filename || `export-${Date.now()}`;

      if (contentType.includes('text/csv')) {
        // Download CSV
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (contentType.includes('text/html')) {
        // Open HTML in new window for PDF printing
        const html = await response.text();
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          // Auto-trigger print dialog
          printWindow.onload = () => {
            printWindow.print();
          };
        }
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Export failed';
      setError(message);
      return false;
    } finally {
      setExporting(false);
    }
  }, []);

  const exportCSV = useCallback((
    data: Record<string, unknown>[],
    options?: Partial<Omit<ExportOptions, 'type' | 'data'>>
  ) => {
    return exportData({ type: 'csv', data, ...options });
  }, [exportData]);

  const exportPDF = useCallback((
    data: Record<string, unknown>[],
    options?: Partial<Omit<ExportOptions, 'type' | 'data'>>
  ) => {
    return exportData({ type: 'pdf', data, ...options });
  }, [exportData]);

  return {
    exportData,
    exportCSV,
    exportPDF,
    exporting,
    error,
  };
}
