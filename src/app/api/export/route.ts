import { NextRequest, NextResponse } from 'next/server';
import {
  generateCSV,
  generatePDFHTML,
  exportTemplates,
  createExportJob,
  listExportJobs,
  type ExportColumn,
} from '@/lib/export/generators';

// GET - List export jobs
export async function GET() {
  try {
    const jobs = listExportJobs();
    return NextResponse.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error('Error listing export jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list export jobs' },
      { status: 500 }
    );
  }
}

// POST - Create export
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type = 'csv', 
      template, 
      data, 
      columns,
      filename,
      title,
      subtitle,
      includeTimestamp = true,
    } = body;
    
    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { success: false, error: 'Data array is required' },
        { status: 400 }
      );
    }
    
    // Get columns from template or use provided columns
    let exportColumns: ExportColumn[];
    if (template && template in exportTemplates) {
      exportColumns = exportTemplates[template as keyof typeof exportTemplates].columns;
    } else if (columns) {
      exportColumns = columns;
    } else {
      // Auto-generate columns from data keys
      const firstRow = data[0] || {};
      exportColumns = Object.keys(firstRow).map(key => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      }));
    }
    
    const exportFilename = filename || `export-${Date.now()}`;
    
    // Create job for tracking
    const job = createExportJob(type, template || 'custom', exportFilename);
    
    // Generate export content
    const options = {
      filename: exportFilename,
      title,
      subtitle,
      columns: exportColumns,
      data,
      includeTimestamp,
    };
    
    if (type === 'csv') {
      const csv = generateCSV(options);
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${exportFilename}.csv"`,
        },
      });
    } else if (type === 'pdf') {
      // Return HTML that can be printed to PDF
      const html = generatePDFHTML(options);
      
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `inline; filename="${exportFilename}.html"`,
        },
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid export type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error creating export:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create export' },
      { status: 500 }
    );
  }
}
