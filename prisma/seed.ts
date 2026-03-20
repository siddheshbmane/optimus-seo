/**
 * Prisma Seed Script
 * 
 * Creates development data including:
 * - Development organization
 * - Development user
 * - Sample projects (optional)
 * 
 * Run with: npx prisma db seed
 */

// Load environment variables
import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const { Pool } = pg

// Create Prisma client with adapter
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('DATABASE_URL environment variable is required for seeding')
  process.exit(1)
}

const pool = new Pool({ connectionString })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any)

const prisma = new PrismaClient({ adapter })

// Development IDs (must match MOCK_DEV_SESSION in src/lib/api/auth.ts)
// Using valid UUIDs for PostgreSQL
const DEV_ORG_ID = '00000000-0000-0000-0000-000000000001'
const DEV_USER_ID = '00000000-0000-0000-0000-000000000002'

async function main() {
  console.log('🌱 Starting database seed...')

  // Create or update development organization
  const devOrg = await prisma.organization.upsert({
    where: { id: DEV_ORG_ID },
    update: {},
    create: {
      id: DEV_ORG_ID,
      name: 'Development Organization',
      slug: 'dev-org',
    },
  })
  console.log('✅ Development organization:', devOrg.name)

  // Create or update development user
  const devUser = await prisma.user.upsert({
    where: { id: DEV_USER_ID },
    update: {},
    create: {
      id: DEV_USER_ID,
      email: 'dev@optimus-seo.local',
      name: 'Development User',
      role: 'owner',
      organizationId: DEV_ORG_ID,
    },
  })
  console.log('✅ Development user:', devUser.email)

  // Create account record for dev user (Better Auth requires this)
  const devAccount = await prisma.account.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      userId: DEV_USER_ID,
      accountId: DEV_USER_ID,
      providerId: 'credential',
    },
  })
  console.log('✅ Development account:', devAccount.providerId)

  // Create sample projects for development
  const sampleProjects = [
    {
      id: '00000000-0000-0000-0000-000000000101',
      name: 'Acme Corp',
      clientUrl: 'https://acmecorp.com',
      industry: 'SaaS / Software',
      description: 'Enterprise software company SEO project',
      status: 'sales_phase' as const,
      healthScore: 72,
    },
    {
      id: '00000000-0000-0000-0000-000000000102',
      name: 'TechStart Inc',
      clientUrl: 'https://techstart.io',
      industry: 'E-commerce (General)',
      description: 'E-commerce startup SEO optimization',
      status: 'strategy_phase' as const,
      healthScore: 85,
    },
    {
      id: '00000000-0000-0000-0000-000000000103',
      name: 'HealthFirst Clinic',
      clientUrl: 'https://healthfirst.clinic',
      industry: 'Healthcare Services',
      description: 'Local healthcare provider SEO',
      status: 'execution_phase' as const,
      healthScore: 68,
    },
  ]

  for (const project of sampleProjects) {
    const created = await prisma.project.upsert({
      where: { id: project.id },
      update: {
        name: project.name,
        clientUrl: project.clientUrl,
        industry: project.industry,
        description: project.description,
        status: project.status,
        healthScore: project.healthScore,
      },
      create: {
        ...project,
        organizationId: DEV_ORG_ID,
        createdById: DEV_USER_ID,
      },
    })
    console.log('✅ Sample project:', created.name)
  }

  console.log('🎉 Database seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
