import { NextRequest, NextResponse } from 'next/server';
import {
  createDashboard,
  listDashboards,
  widgetTemplates,
} from '@/lib/dashboards/widgets';

// GET - List dashboards or templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'dashboards';
    const organizationId = searchParams.get('organizationId') || undefined;
    const projectId = searchParams.get('projectId') || undefined;
    
    if (type === 'templates') {
      // Return widget templates
      const templates = Object.entries(widgetTemplates).map(([key, template]) => ({
        id: key,
        ...template,
      }));
      
      return NextResponse.json({
        success: true,
        data: templates,
      });
    }
    
    // Return dashboards
    const dashboards = listDashboards(organizationId, projectId);
    
    return NextResponse.json({
      success: true,
      data: dashboards,
    });
  } catch (error) {
    console.error('Error listing dashboards:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list dashboards' },
      { status: 500 }
    );
  }
}

// POST - Create dashboard
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, layout, columns, organizationId, projectId, createdBy, widgets } = body;
    
    if (!name || !organizationId || !createdBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, organizationId, createdBy' },
        { status: 400 }
      );
    }
    
    const dashboard = createDashboard({
      name,
      description,
      layout: layout || 'grid',
      columns: columns || 4,
      organizationId,
      projectId,
      createdBy,
      widgets: widgets || [],
    });
    
    return NextResponse.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error('Error creating dashboard:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create dashboard' },
      { status: 500 }
    );
  }
}
