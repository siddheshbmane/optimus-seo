// White-label API Route
// Manages white-label configurations - persisted in OrgSetting JSON

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/auth';
import { prisma } from '@/lib/db';
import type { Prisma } from '@/generated/prisma';
import { type WhitelabelConfig, defaultBranding } from '@/lib/whitelabel/config';

const ORG_WHITELABEL_KEY = 'whitelabel_config';

async function getConfigFromDB(organizationId: string): Promise<WhitelabelConfig | null> {
  try {
    const setting = await prisma.orgSetting.findUnique({
      where: { organizationId_key: { organizationId, key: ORG_WHITELABEL_KEY } },
    });
    if (!setting) return null;
    return setting.value as unknown as WhitelabelConfig;
  } catch {
    return null;
  }
}

async function saveConfigToDB(config: WhitelabelConfig): Promise<void> {
  await prisma.orgSetting.upsert({
    where: { organizationId_key: { organizationId: config.organizationId, key: ORG_WHITELABEL_KEY } },
    create: { organizationId: config.organizationId, key: ORG_WHITELABEL_KEY, value: config as unknown as Prisma.JsonObject },
    update: { value: config as unknown as Prisma.JsonObject },
  });
}

// GET - Get whitelabel config
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || session.organizationId;

    const config = await getConfigFromDB(organizationId);
    return NextResponse.json({
      config: config || null,
      defaultBranding,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create or update whitelabel config
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const organizationId = body.organizationId || session.organizationId;

    const existing = await getConfigFromDB(organizationId);
    const config: WhitelabelConfig = {
      id: existing?.id || `wl-${Date.now()}`,
      organizationId,
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
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveConfigToDB(config);
    return NextResponse.json({ config }, { status: existing ? 200 : 201 });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save config' },
      { status: 400 }
    );
  }
}

// PUT - Update whitelabel config
export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const organizationId = body.organizationId || session.organizationId;

    const existing = await getConfigFromDB(organizationId);
    if (!existing) {
      return NextResponse.json({ error: 'Config not found' }, { status: 404 });
    }

    const updatedConfig: WhitelabelConfig = {
      ...existing,
      ...body,
      branding: { ...existing.branding, ...body.branding },
      organizationId,
      updatedAt: new Date().toISOString(),
    };

    await saveConfigToDB(updatedConfig);
    return NextResponse.json({ config: updatedConfig });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update config' },
      { status: 400 }
    );
  }
}

// DELETE - Delete whitelabel config
export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || session.organizationId;

    await prisma.orgSetting.deleteMany({
      where: { organizationId, key: ORG_WHITELABEL_KEY },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
