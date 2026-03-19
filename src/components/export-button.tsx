'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useExport } from '@/hooks/use-export';
import { Download, FileText, Table, Loader2, ChevronDown } from 'lucide-react';

interface ExportButtonProps {
  data: Record<string, unknown>[];
  filename?: string;
  title?: string;
  subtitle?: string;
  template?: string;
  columns?: Array<{ key: string; label: string }>;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function ExportButton({
  data,
  filename,
  title,
  subtitle,
  template,
  columns,
  variant = 'secondary',
  size = 'md',
}: ExportButtonProps) {
  const { exportCSV, exportPDF, exporting, error } = useExport();
  const [showMenu, setShowMenu] = useState(false);

  const handleExportCSV = async () => {
    setShowMenu(false);
    await exportCSV(data, { filename, title, subtitle, template, columns });
  };

  const handleExportPDF = async () => {
    setShowMenu(false);
    await exportPDF(data, { filename, title, subtitle, template, columns });
  };

  if (data.length === 0) {
    return (
      <Button variant={variant} size={size} disabled>
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowMenu(!showMenu)}
        disabled={exporting}
      >
        {exporting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Export
            <ChevronDown className="w-4 h-4 ml-1" />
          </>
        )}
      </Button>

      {showMenu && !exporting && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-background border rounded-lg shadow-lg z-20">
            <button
              onClick={handleExportCSV}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors rounded-t-lg"
            >
              <Table className="w-4 h-4" />
              Export as CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors rounded-b-lg"
            >
              <FileText className="w-4 h-4" />
              Export as PDF
            </button>
          </div>
        </>
      )}

      {error && (
        <div className="absolute right-0 mt-2 p-2 bg-destructive/10 text-destructive text-sm rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
