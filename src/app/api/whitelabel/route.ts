// White-label API Route
// Manages white-label configurations

import { NextRequest, NextResponse } from 'next/server';
import { 
  mockWhitelabelConfigs, 
  type WhitelabelConfig,
  defaultBranding,
} from '@/lib/whitelabel/config';

// In-memory storage
let whitelabelConfigs = [...mockWhitelabelConfigs];

// GET - Get whitelabel config
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get('organizationId');
  const domain = searchParams.get('domain');

  // Find by domain
  if (domain) {
    const config = whitelabelConfigs.find(c => c.customDomain === domain);
    if (config) {
      return NextResponse.json({ config });
    }
    // Return default branding if no custom domain
    return NextResponse.json({ 
      config: null, 
      defaultBranding 
    });
  }

  // Find by organization
  if (organizationId) {
    const config = whitelabelConfigs.find(c => c.organizationId === organizationId);
    return NextResponse.json({ 
      config: config || null,
      defaultBranding,
    });
  }

  // Return all configs (admin only)
  return NextResponse.json({ 
    configs: whitelabelConfigs,
    total: whitelabelConfigs.length,
  });
}

// POST - Create whitelabel config
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newConfig: WhitelabelConfig = {
      id: `wl-${Date.now()}`,
      organizationId: body.organizationId,
      enabled: body.enabled ?? true,
      branding: {
        name: body.branding?.name || defaultBranding.name,
        logo: body.branding?.logo || defaultBranding.logo,
        primaryColor: body.branding?.primaryColor || defaultBranding.primaryColor,
        accentColor: body.branding?.accentColor || defaultBranding.accentColor,
        ...body.branding,
      },
      customDomain: body.customDomain,
      emailSettings: body.emailSettings,
      features: body.features,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    whitelabelConfigs.push(newConfig);

    return NextResponse.json({ config: newConfig }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create config' },
      { status: 400 }
    );
  }
}

// PUT - Update whitelabel config
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const index = whitelabelConfigs.findIndex(c => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Config not found' }, { status: 404 });
    }

    const updatedConfig: WhitelabelConfig = {
      ...whitelabelConfigs[index],
      ...updates,
      branding: {
        ...whitelabelConfigs[index].branding,
        ...updates.branding,
      },
      updatedAt: new Date().toISOString(),
    };

    whitelabelConfigs[index] = updatedConfig;

    return NextResponse.json({ config: updatedConfig });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update config' },
      { status: 400 }
    );
  }
}

// DELETE - Delete whitelabel config
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Config ID required' }, { status: 400 });
  }

  const index = whitelabelConfigs.findIndex(c => c.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Config not found' }, { status: 404 });
  }

  whitelabelConfigs.splice(index, 1);

  return NextResponse.json({ success: true });
}
