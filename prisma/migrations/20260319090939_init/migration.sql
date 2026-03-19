-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'admin', 'strategist', 'executive', 'sales', 'viewer');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('created', 'sales_phase', 'strategy_phase', 'execution_phase', 'reporting', 'completed', 'paused', 'archived');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('pending', 'approved', 'rejected', 'revision_requested');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('draft', 'in_review', 'revision_needed', 'approved', 'published', 'archived');

-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('queued', 'running', 'completed', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "KeywordType" AS ENUM ('short_tail', 'long_tail', 'generic', 'branded');

-- CreateEnum
CREATE TYPE "KeywordIntent" AS ENUM ('commercial', 'informational', 'navigational', 'transactional');

-- CreateEnum
CREATE TYPE "BacklinkType" AS ENUM ('directory', 'profile', 'social_bookmarking', 'image_submission', 'guest_post', 'resource_page', 'forum', 'comment', 'web2', 'press_release');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('queued', 'scheduled', 'submitting', 'submitted', 'pending_approval', 'approved', 'rejected', 'failed');

-- CreateEnum
CREATE TYPE "AuditIssueSeverity" AS ENUM ('critical', 'high', 'medium', 'low', 'info');

-- CreateEnum
CREATE TYPE "ReportFormat" AS ENUM ('pdf', 'ppt', 'html');

-- CreateEnum
CREATE TYPE "GmbPostType" AS ENUM ('update', 'offer', 'event', 'product');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('in_app', 'email', 'slack', 'webhook');

-- CreateEnum
CREATE TYPE "LlmProvider" AS ENUM ('anthropic', 'openai', 'google', 'mistral', 'cohere', 'deepseek', 'groq');

-- CreateTable
CREATE TABLE "Organization" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "logoUrl" TEXT,
    "primaryColor" VARCHAR(7) DEFAULT '#FD8C73',
    "customDomain" VARCHAR(255),
    "stripeCustomerId" VARCHAR(255),
    "stripeSubscriptionId" VARCHAR(255),
    "subscriptionStatus" VARCHAR(50) NOT NULL DEFAULT 'trial',
    "planId" UUID,
    "trialEndsAt" TIMESTAMP(3),
    "dataforseoLogin" TEXT,
    "dataforseoPassword" TEXT,
    "monthlyApiBudget" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organizationId" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "avatarUrl" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'executive',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "token" VARCHAR(500) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organizationId" UUID NOT NULL,
    "provider" "LlmProvider" NOT NULL,
    "encryptedKey" TEXT NOT NULL,
    "label" VARCHAR(100),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Integration" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organizationId" UUID NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "accountId" VARCHAR(255),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organizationId" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "clientUrl" VARCHAR(500) NOT NULL,
    "industry" VARCHAR(100),
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'created',
    "healthScore" INTEGER,
    "createdById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "locationCode" INTEGER NOT NULL,
    "locationName" VARCHAR(255) NOT NULL,
    "locationType" VARCHAR(50) NOT NULL,
    "countryCode" VARCHAR(5),
    "countryName" VARCHAR(100),
    "parentLocationCode" INTEGER,
    "languageCode" VARCHAR(10),
    "languageName" VARCHAR(100),

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectLocation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProjectLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competitor" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "name" VARCHAR(255),
    "isAutoDiscovered" BOOLEAN NOT NULL DEFAULT false,
    "domainAuthority" INTEGER,
    "organicTraffic" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Competitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteAudit" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "healthScore" INTEGER,
    "pagesCrawled" INTEGER NOT NULL DEFAULT 0,
    "lighthousePerformance" DOUBLE PRECISION,
    "lighthouseAccessibility" DOUBLE PRECISION,
    "lighthouseSeo" DOUBLE PRECISION,
    "lighthouseBestPractices" DOUBLE PRECISION,
    "coreWebVitals" JSONB NOT NULL DEFAULT '{}',
    "mobileScore" DOUBLE PRECISION,
    "desktopScore" DOUBLE PRECISION,
    "schemaMarkupFound" JSONB NOT NULL DEFAULT '[]',
    "toxicBacklinksCount" INTEGER,
    "rawData" JSONB NOT NULL DEFAULT '{}',
    "summaryNarrative" TEXT,
    "agentTaskId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteAuditIssue" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "siteAuditId" UUID NOT NULL,
    "severity" "AuditIssueSeverity" NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "description" TEXT NOT NULL,
    "pageUrl" VARCHAR(500),
    "recommendation" TEXT,
    "isFixed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SiteAuditIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeywordOverview" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "keyword" VARCHAR(500) NOT NULL,
    "serpPosition" INTEGER,
    "searchVolume" INTEGER,
    "estimatedTraffic" DOUBLE PRECISION,
    "cpc" DOUBLE PRECISION,
    "difficulty" INTEGER,
    "keywordType" "KeywordType",
    "intent" "KeywordIntent",
    "hasFeaturedSnippet" BOOLEAN NOT NULL DEFAULT false,
    "paaQuestions" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KeywordOverview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitorOverview" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "competitorId" UUID,
    "domainAuthority" INTEGER,
    "totalBacklinks" INTEGER,
    "referringDomains" INTEGER,
    "organicKeywords" INTEGER,
    "estimatedTraffic" INTEGER,
    "trafficCost" DOUBLE PRECISION,
    "linkGapDomains" JSONB NOT NULL DEFAULT '[]',
    "contentGapKeywords" JSONB NOT NULL DEFAULT '[]',
    "shareOfVoice" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompetitorOverview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PpcIntelligence" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "totalEstimatedAdSpend" DOUBLE PRECISION,
    "topAdvertisers" JSONB NOT NULL DEFAULT '[]',
    "keywordAdData" JSONB NOT NULL DEFAULT '[]',
    "bingAdData" JSONB NOT NULL DEFAULT '[]',
    "adCopyExamples" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PpcIntelligence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiVisibilityCheck" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "aiVisibilityScore" INTEGER,
    "mentionsChatgpt" INTEGER NOT NULL DEFAULT 0,
    "mentionsClaude" INTEGER NOT NULL DEFAULT 0,
    "mentionsGemini" INTEGER NOT NULL DEFAULT 0,
    "mentionsPerplexity" INTEGER NOT NULL DEFAULT 0,
    "totalImpressions" INTEGER NOT NULL DEFAULT 0,
    "topMentionedDomains" JSONB NOT NULL DEFAULT '[]',
    "topCitedPages" JSONB NOT NULL DEFAULT '[]',
    "recommendations" TEXT,
    "rawData" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiVisibilityCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GmbAnalysis" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "businessName" VARCHAR(255),
    "rating" DOUBLE PRECISION,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "reviewSentiment" JSONB NOT NULL DEFAULT '{}',
    "categories" JSONB NOT NULL DEFAULT '[]',
    "isInLocalPack" BOOLEAN NOT NULL DEFAULT false,
    "napConsistency" JSONB NOT NULL DEFAULT '{}',
    "competitorGmb" JSONB NOT NULL DEFAULT '[]',
    "localSeoScore" INTEGER,
    "rawData" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GmbAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PitchDeck" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "filePath" TEXT,
    "format" "ReportFormat" NOT NULL DEFAULT 'ppt',
    "status" VARCHAR(50) NOT NULL DEFAULT 'generating',
    "sentAt" TIMESTAMP(3),
    "createdById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PitchDeck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "scopeOfWork" TEXT,
    "recommendedPlan" VARCHAR(100),
    "timeline" TEXT,
    "pricing" JSONB NOT NULL DEFAULT '{}',
    "filePath" TEXT,
    "status" VARCHAR(50) NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Keyword" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "clusterId" UUID,
    "keyword" VARCHAR(500) NOT NULL,
    "searchVolume" INTEGER,
    "difficulty" INTEGER,
    "cpc" DOUBLE PRECISION,
    "competition" DOUBLE PRECISION,
    "keywordType" "KeywordType",
    "intent" "KeywordIntent",
    "funnelStage" VARCHAR(50),
    "priorityScore" DOUBLE PRECISION,
    "currentPosition" INTEGER,
    "monthlyTrend" JSONB NOT NULL DEFAULT '[]',
    "hasFeaturedSnippet" BOOLEAN NOT NULL DEFAULT false,
    "paaQuestions" JSONB NOT NULL DEFAULT '[]',
    "isTarget" BOOLEAN NOT NULL DEFAULT false,
    "isCannibalized" BOOLEAN NOT NULL DEFAULT false,
    "isDecaying" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeywordCluster" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "pillarKeyword" VARCHAR(500),
    "intent" "KeywordIntent",
    "keywordCount" INTEGER NOT NULL DEFAULT 0,
    "totalVolume" INTEGER NOT NULL DEFAULT 0,
    "avgDifficulty" DOUBLE PRECISION,
    "priorityScore" DOUBLE PRECISION,
    "topicalAuthority" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KeywordCluster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitorAnalysis" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "competitorId" UUID,
    "backlinkProfile" JSONB NOT NULL DEFAULT '{}',
    "contentStrategy" JSONB NOT NULL DEFAULT '{}',
    "topPages" JSONB NOT NULL DEFAULT '[]',
    "technicalComparison" JSONB NOT NULL DEFAULT '{}',
    "sponsoredKeywords" JSONB NOT NULL DEFAULT '[]',
    "estimatedAdSpend" DOUBLE PRECISION,
    "linkSources" JSONB NOT NULL DEFAULT '{}',
    "serpFeatureOwnership" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompetitorAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteStructure" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "currentSitemap" JSONB NOT NULL DEFAULT '{}',
    "orphanPages" JSONB NOT NULL DEFAULT '[]',
    "thinContentPages" JSONB NOT NULL DEFAULT '[]',
    "competitorSitemaps" JSONB NOT NULL DEFAULT '{}',
    "gapAnalysis" JSONB NOT NULL DEFAULT '{}',
    "idealSitemap" JSONB NOT NULL DEFAULT '{}',
    "urlStructure" TEXT,
    "internalLinkingPlan" JSONB NOT NULL DEFAULT '{}',
    "schemaStrategy" JSONB NOT NULL DEFAULT '{}',
    "status" "ApprovalStatus" NOT NULL DEFAULT 'pending',
    "approvedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuggestedPage" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "websiteStructureId" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "pageType" VARCHAR(100) NOT NULL,
    "suggestedUrl" VARCHAR(500),
    "title" VARCHAR(255) NOT NULL,
    "purpose" TEXT,
    "targetKeywords" JSONB NOT NULL DEFAULT '[]',
    "competitorReference" JSONB NOT NULL DEFAULT '[]',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(50) NOT NULL DEFAULT 'suggested',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuggestedPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentBrief" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "suggestedPageId" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "primaryKeyword" VARCHAR(500) NOT NULL,
    "secondaryKeywords" JSONB NOT NULL DEFAULT '[]',
    "searchIntent" "KeywordIntent",
    "titleTag" VARCHAR(70),
    "metaDescription" VARCHAR(170),
    "headingStructure" JSONB NOT NULL DEFAULT '[]',
    "contentSections" JSONB NOT NULL DEFAULT '[]',
    "wordCountTarget" INTEGER NOT NULL DEFAULT 1500,
    "internalLinks" JSONB NOT NULL DEFAULT '[]',
    "externalLinks" JSONB NOT NULL DEFAULT '[]',
    "mediaSuggestions" JSONB NOT NULL DEFAULT '[]',
    "ctaPlacements" JSONB NOT NULL DEFAULT '[]',
    "faqSection" JSONB NOT NULL DEFAULT '[]',
    "schemaMarkup" VARCHAR(100),
    "competitorAnalysis" JSONB NOT NULL DEFAULT '{}',
    "seoScoringCriteria" JSONB NOT NULL DEFAULT '{}',
    "status" "ApprovalStatus" NOT NULL DEFAULT 'pending',
    "approvedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentBrief_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkBuildingStrategy" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "targetLinksPerMonth" JSONB NOT NULL DEFAULT '{}',
    "priorityDomains" JSONB NOT NULL DEFAULT '[]',
    "outreachTemplates" JSONB NOT NULL DEFAULT '[]',
    "linkVelocityTarget" INTEGER,
    "directoryLimitPerDay" INTEGER NOT NULL DEFAULT 5,
    "directoryLimitPerWeek" INTEGER NOT NULL DEFAULT 25,
    "profileLimitPerDay" INTEGER NOT NULL DEFAULT 3,
    "profileLimitPerWeek" INTEGER NOT NULL DEFAULT 15,
    "socialBookmarkLimitPerDay" INTEGER NOT NULL DEFAULT 10,
    "socialBookmarkLimitPerWeek" INTEGER NOT NULL DEFAULT 50,
    "imageLimitPerDay" INTEGER NOT NULL DEFAULT 5,
    "imageLimitPerWeek" INTEGER NOT NULL DEFAULT 25,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'pending',
    "approvedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinkBuildingStrategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "contentBriefId" UUID,
    "title" VARCHAR(500) NOT NULL,
    "metaTitle" VARCHAR(70),
    "metaDescription" VARCHAR(170),
    "body" TEXT NOT NULL,
    "bodyHtml" TEXT,
    "targetKeywords" JSONB NOT NULL DEFAULT '[]',
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "contentType" VARCHAR(50) NOT NULL DEFAULT 'blog_post',
    "style" VARCHAR(50),
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "qualityScore" INTEGER,
    "iterationCount" INTEGER NOT NULL DEFAULT 0,
    "llmProvider" VARCHAR(50),
    "llmModel" VARCHAR(100),
    "tokensUsed" INTEGER,
    "schemaMarkup" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentReviewCriteria" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organizationId" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(100) NOT NULL,
    "evaluationPrompt" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "threshold" INTEGER NOT NULL DEFAULT 80,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentReviewCriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentReviewResult" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "contentId" UUID NOT NULL,
    "criteriaId" UUID NOT NULL,
    "iterationNumber" INTEGER NOT NULL DEFAULT 1,
    "score" INTEGER NOT NULL DEFAULT 0,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentReviewResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BacklinkOpportunity" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "domain" VARCHAR(255) NOT NULL,
    "type" "BacklinkType" NOT NULL,
    "domainAuthority" INTEGER,
    "spamScore" INTEGER,
    "relevanceScore" DOUBLE PRECISION,
    "submissionUrl" VARCHAR(500),
    "submissionRequirements" TEXT,
    "status" VARCHAR(50) NOT NULL DEFAULT 'discovered',
    "source" VARCHAR(100),
    "isSafeForAutoSubmit" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BacklinkOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BacklinkSubmission" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "opportunityId" UUID NOT NULL,
    "contentId" UUID,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'queued',
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "screenshotPath" TEXT,
    "liveUrl" VARCHAR(500),
    "isLinkLive" BOOLEAN,
    "lastVerifiedAt" TIMESTAMP(3),
    "linkAttribute" VARCHAR(50),
    "anchorText" VARCHAR(255),
    "scheduledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BacklinkSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutreachCampaign" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "targetUrl" VARCHAR(500) NOT NULL,
    "targetDomain" VARCHAR(255) NOT NULL,
    "contactEmail" VARCHAR(255),
    "contactName" VARCHAR(255),
    "contactFormUrl" VARCHAR(500),
    "socialProfiles" JSONB NOT NULL DEFAULT '[]',
    "outreachType" VARCHAR(50) NOT NULL,
    "emailSubject" VARCHAR(255),
    "emailBody" TEXT,
    "emailVariants" JSONB NOT NULL DEFAULT '[]',
    "followUpSequence" JSONB NOT NULL DEFAULT '[]',
    "status" VARCHAR(50) NOT NULL DEFAULT 'draft',
    "sentAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "repliedAt" TIMESTAMP(3),
    "linkedAt" TIMESTAMP(3),
    "liveUrl" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutreachCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnPageTask" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "taskType" VARCHAR(100) NOT NULL,
    "pageUrl" VARCHAR(500),
    "currentValue" TEXT,
    "recommendedValue" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OnPageTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GmbPost" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "postType" "GmbPostType" NOT NULL DEFAULT 'update',
    "title" VARCHAR(255),
    "body" TEXT NOT NULL,
    "imageUrl" TEXT,
    "ctaType" VARCHAR(50),
    "ctaUrl" VARCHAR(500),
    "status" VARCHAR(50) NOT NULL DEFAULT 'draft',
    "scheduledAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "approvedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GmbPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GmbReviewResponse" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "reviewerName" VARCHAR(255),
    "reviewRating" INTEGER,
    "reviewText" TEXT,
    "draftResponse" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'draft',
    "approvedById" UUID,
    "postedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GmbReviewResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RankTrackingConfig" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "frequency" VARCHAR(50) NOT NULL DEFAULT 'weekly',
    "maxKeywords" INTEGER NOT NULL DEFAULT 100,
    "serpDepth" INTEGER NOT NULL DEFAULT 30,
    "searchEngines" JSONB NOT NULL DEFAULT '["google"]',
    "devices" JSONB NOT NULL DEFAULT '["desktop","mobile"]',
    "trackCompetitors" BOOLEAN NOT NULL DEFAULT true,
    "serpFeatures" JSONB NOT NULL DEFAULT '["featured_snippet","paa","local_pack"]',
    "alertOnTopEntry" BOOLEAN NOT NULL DEFAULT true,
    "alertOnDrop" BOOLEAN NOT NULL DEFAULT true,
    "alertThreshold" INTEGER NOT NULL DEFAULT 5,
    "alertChannels" JSONB NOT NULL DEFAULT '["in_app"]',
    "lastRunAt" TIMESTAMP(3),
    "nextRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RankTrackingConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RankTracking" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "keywordId" UUID,
    "keyword" VARCHAR(500) NOT NULL,
    "locationCode" INTEGER NOT NULL,
    "searchEngine" VARCHAR(50) NOT NULL DEFAULT 'google',
    "device" VARCHAR(50) NOT NULL DEFAULT 'desktop',
    "position" INTEGER,
    "previousPosition" INTEGER,
    "positionChange" INTEGER,
    "url" VARCHAR(500),
    "serpFeatures" JSONB NOT NULL DEFAULT '[]',
    "searchVolume" INTEGER,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RankTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrafficData" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "source" VARCHAR(50) NOT NULL,
    "date" DATE NOT NULL,
    "clicks" INTEGER,
    "impressions" INTEGER,
    "ctr" DOUBLE PRECISION,
    "avgPosition" DOUBLE PRECISION,
    "estimatedTraffic" INTEGER,
    "trafficValue" DOUBLE PRECISION,
    "locationCode" INTEGER,
    "device" VARCHAR(50),
    "rawData" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrafficData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiVisibilityReport" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "aiVisibilityScore" INTEGER,
    "mentionsByPlatform" JSONB NOT NULL DEFAULT '{}',
    "totalImpressions" INTEGER NOT NULL DEFAULT 0,
    "topMentionedDomains" JSONB NOT NULL DEFAULT '[]',
    "competitorComparison" JSONB NOT NULL DEFAULT '{}',
    "recommendations" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiVisibilityReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientReport" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "format" "ReportFormat" NOT NULL DEFAULT 'pdf',
    "filePath" TEXT,
    "sections" JSONB NOT NULL DEFAULT '[]',
    "periodStart" DATE NOT NULL,
    "periodEnd" DATE NOT NULL,
    "executiveSummary" TEXT,
    "status" VARCHAR(50) NOT NULL DEFAULT 'generating',
    "sentAt" TIMESTAMP(3),
    "sentTo" JSONB NOT NULL DEFAULT '[]',
    "createdById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareOfVoice" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "domain" VARCHAR(255) NOT NULL,
    "isClient" BOOLEAN NOT NULL DEFAULT false,
    "keywordsInTop10" INTEGER NOT NULL DEFAULT 0,
    "keywordsInTop3" INTEGER NOT NULL DEFAULT 0,
    "totalTrackedKeywords" INTEGER NOT NULL DEFAULT 0,
    "sovPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "serpFeaturesOwned" JSONB NOT NULL DEFAULT '{}',
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShareOfVoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentTask" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID,
    "organizationId" UUID NOT NULL,
    "agentName" VARCHAR(100) NOT NULL,
    "action" VARCHAR(255) NOT NULL,
    "status" "AgentStatus" NOT NULL DEFAULT 'queued',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "input" JSONB NOT NULL DEFAULT '{}',
    "output" JSONB NOT NULL DEFAULT '{}',
    "errorMessage" TEXT,
    "tokensUsed" INTEGER,
    "apiCost" DOUBLE PRECISION,
    "durationMs" INTEGER,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "agentTaskId" UUID NOT NULL,
    "level" VARCHAR(20) NOT NULL DEFAULT 'info',
    "message" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalQueue" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "itemType" VARCHAR(100) NOT NULL,
    "itemId" UUID NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "description" TEXT,
    "assignedRole" "UserRole" NOT NULL,
    "assignedUserId" UUID,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'pending',
    "feedback" TEXT,
    "reviewedById" UUID,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApprovalQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL DEFAULT 'in_app',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectSetting" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projectId" UUID NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "value" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgSetting" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "organizationId" UUID NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "value" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrgSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingPlan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "stripePriceId" VARCHAR(255),
    "monthlyPrice" INTEGER NOT NULL DEFAULT 0,
    "yearlyPrice" INTEGER,
    "features" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_customDomain_key" ON "Organization"("customDomain");

-- CreateIndex
CREATE INDEX "idx_org_slug" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "idx_org_stripe" ON "Organization"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "idx_user_email" ON "User"("email");

-- CreateIndex
CREATE INDEX "idx_user_org" ON "User"("organizationId");

-- CreateIndex
CREATE INDEX "idx_user_org_role" ON "User"("organizationId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "idx_session_token" ON "Session"("token");

-- CreateIndex
CREATE INDEX "idx_session_user" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "idx_session_expires" ON "Session"("expiresAt");

-- CreateIndex
CREATE INDEX "idx_apikey_org_provider" ON "ApiKey"("organizationId", "provider");

-- CreateIndex
CREATE INDEX "idx_integration_org_type" ON "Integration"("organizationId", "type");

-- CreateIndex
CREATE INDEX "idx_project_org" ON "Project"("organizationId");

-- CreateIndex
CREATE INDEX "idx_project_org_status" ON "Project"("organizationId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Location_locationCode_key" ON "Location"("locationCode");

-- CreateIndex
CREATE INDEX "idx_location_code" ON "Location"("locationCode");

-- CreateIndex
CREATE INDEX "idx_location_country" ON "Location"("countryCode");

-- CreateIndex
CREATE INDEX "idx_projloc_project" ON "ProjectLocation"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectLocation_projectId_locationId_key" ON "ProjectLocation"("projectId", "locationId");

-- CreateIndex
CREATE INDEX "idx_competitor_project" ON "Competitor"("projectId");

-- CreateIndex
CREATE INDEX "idx_audit_project" ON "SiteAudit"("projectId");

-- CreateIndex
CREATE INDEX "idx_audit_org" ON "SiteAudit"("organizationId");

-- CreateIndex
CREATE INDEX "idx_auditissue_audit" ON "SiteAuditIssue"("siteAuditId");

-- CreateIndex
CREATE INDEX "idx_auditissue_severity" ON "SiteAuditIssue"("siteAuditId", "severity");

-- CreateIndex
CREATE INDEX "idx_kwoverview_project" ON "KeywordOverview"("projectId");

-- CreateIndex
CREATE INDEX "idx_kwoverview_org" ON "KeywordOverview"("organizationId");

-- CreateIndex
CREATE INDEX "idx_compoverview_project" ON "CompetitorOverview"("projectId");

-- CreateIndex
CREATE INDEX "idx_ppc_project" ON "PpcIntelligence"("projectId");

-- CreateIndex
CREATE INDEX "idx_aivisibility_project" ON "AiVisibilityCheck"("projectId");

-- CreateIndex
CREATE INDEX "idx_gmb_project" ON "GmbAnalysis"("projectId");

-- CreateIndex
CREATE INDEX "idx_pitch_project" ON "PitchDeck"("projectId");

-- CreateIndex
CREATE INDEX "idx_proposal_project" ON "Proposal"("projectId");

-- CreateIndex
CREATE INDEX "idx_keyword_project" ON "Keyword"("projectId");

-- CreateIndex
CREATE INDEX "idx_keyword_org" ON "Keyword"("organizationId");

-- CreateIndex
CREATE INDEX "idx_keyword_cluster" ON "Keyword"("clusterId");

-- CreateIndex
CREATE INDEX "idx_keyword_project_target" ON "Keyword"("projectId", "isTarget");

-- CreateIndex
CREATE INDEX "idx_kwcluster_project" ON "KeywordCluster"("projectId");

-- CreateIndex
CREATE INDEX "idx_companalysis_project" ON "CompetitorAnalysis"("projectId");

-- CreateIndex
CREATE INDEX "idx_webstructure_project" ON "WebsiteStructure"("projectId");

-- CreateIndex
CREATE INDEX "idx_sugpage_structure" ON "SuggestedPage"("websiteStructureId");

-- CreateIndex
CREATE INDEX "idx_sugpage_project" ON "SuggestedPage"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentBrief_suggestedPageId_key" ON "ContentBrief"("suggestedPageId");

-- CreateIndex
CREATE INDEX "idx_brief_project" ON "ContentBrief"("projectId");

-- CreateIndex
CREATE INDEX "idx_linkstrategy_project" ON "LinkBuildingStrategy"("projectId");

-- CreateIndex
CREATE INDEX "idx_content_project" ON "Content"("projectId");

-- CreateIndex
CREATE INDEX "idx_content_org" ON "Content"("organizationId");

-- CreateIndex
CREATE INDEX "idx_content_status" ON "Content"("projectId", "status");

-- CreateIndex
CREATE INDEX "idx_content_brief" ON "Content"("contentBriefId");

-- CreateIndex
CREATE INDEX "idx_reviewcriteria_org" ON "ContentReviewCriteria"("organizationId");

-- CreateIndex
CREATE INDEX "idx_reviewcriteria_org_active" ON "ContentReviewCriteria"("organizationId", "isActive");

-- CreateIndex
CREATE INDEX "idx_reviewresult_content" ON "ContentReviewResult"("contentId");

-- CreateIndex
CREATE INDEX "idx_reviewresult_content_iteration" ON "ContentReviewResult"("contentId", "iterationNumber");

-- CreateIndex
CREATE INDEX "idx_opportunity_project" ON "BacklinkOpportunity"("projectId");

-- CreateIndex
CREATE INDEX "idx_opportunity_org" ON "BacklinkOpportunity"("organizationId");

-- CreateIndex
CREATE INDEX "idx_opportunity_status" ON "BacklinkOpportunity"("projectId", "status");

-- CreateIndex
CREATE INDEX "idx_opportunity_domain" ON "BacklinkOpportunity"("domain");

-- CreateIndex
CREATE INDEX "idx_submission_project" ON "BacklinkSubmission"("projectId");

-- CreateIndex
CREATE INDEX "idx_submission_org" ON "BacklinkSubmission"("organizationId");

-- CreateIndex
CREATE INDEX "idx_submission_status" ON "BacklinkSubmission"("projectId", "status");

-- CreateIndex
CREATE INDEX "idx_submission_opportunity" ON "BacklinkSubmission"("opportunityId");

-- CreateIndex
CREATE INDEX "idx_submission_scheduled" ON "BacklinkSubmission"("scheduledAt");

-- CreateIndex
CREATE INDEX "idx_outreach_project" ON "OutreachCampaign"("projectId");

-- CreateIndex
CREATE INDEX "idx_outreach_status" ON "OutreachCampaign"("projectId", "status");

-- CreateIndex
CREATE INDEX "idx_onpage_project" ON "OnPageTask"("projectId");

-- CreateIndex
CREATE INDEX "idx_onpage_status" ON "OnPageTask"("projectId", "status");

-- CreateIndex
CREATE INDEX "idx_gmbpost_project" ON "GmbPost"("projectId");

-- CreateIndex
CREATE INDEX "idx_gmbpost_status" ON "GmbPost"("projectId", "status");

-- CreateIndex
CREATE INDEX "idx_gmbpost_scheduled" ON "GmbPost"("scheduledAt");

-- CreateIndex
CREATE INDEX "idx_gmbresponse_project" ON "GmbReviewResponse"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "RankTrackingConfig_projectId_key" ON "RankTrackingConfig"("projectId");

-- CreateIndex
CREATE INDEX "idx_rankconfig_nextrun" ON "RankTrackingConfig"("nextRunAt");

-- CreateIndex
CREATE INDEX "idx_rank_project_date" ON "RankTracking"("projectId", "checkedAt");

-- CreateIndex
CREATE INDEX "idx_rank_keyword_date" ON "RankTracking"("keywordId", "checkedAt");

-- CreateIndex
CREATE INDEX "idx_rank_org" ON "RankTracking"("organizationId");

-- CreateIndex
CREATE INDEX "idx_traffic_project_date" ON "TrafficData"("projectId", "date");

-- CreateIndex
CREATE INDEX "idx_traffic_project_source_date" ON "TrafficData"("projectId", "source", "date");

-- CreateIndex
CREATE INDEX "idx_aireport_project_date" ON "AiVisibilityReport"("projectId", "checkedAt");

-- CreateIndex
CREATE INDEX "idx_clientreport_project" ON "ClientReport"("projectId");

-- CreateIndex
CREATE INDEX "idx_clientreport_period" ON "ClientReport"("projectId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "idx_sov_project_date" ON "ShareOfVoice"("projectId", "checkedAt");

-- CreateIndex
CREATE INDEX "idx_sov_project_domain" ON "ShareOfVoice"("projectId", "domain");

-- CreateIndex
CREATE INDEX "idx_agenttask_project" ON "AgentTask"("projectId");

-- CreateIndex
CREATE INDEX "idx_agenttask_org" ON "AgentTask"("organizationId");

-- CreateIndex
CREATE INDEX "idx_agenttask_status" ON "AgentTask"("status");

-- CreateIndex
CREATE INDEX "idx_agenttask_agent_status" ON "AgentTask"("agentName", "status");

-- CreateIndex
CREATE INDEX "idx_agentlog_task" ON "AgentLog"("agentTaskId");

-- CreateIndex
CREATE INDEX "idx_agentlog_task_level" ON "AgentLog"("agentTaskId", "level");

-- CreateIndex
CREATE INDEX "idx_approval_org_status" ON "ApprovalQueue"("organizationId", "status");

-- CreateIndex
CREATE INDEX "idx_approval_project" ON "ApprovalQueue"("projectId");

-- CreateIndex
CREATE INDEX "idx_approval_assigned" ON "ApprovalQueue"("assignedRole", "status");

-- CreateIndex
CREATE INDEX "idx_notification_user_read" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "idx_notification_user_date" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectSetting_projectId_key_key" ON "ProjectSetting"("projectId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "OrgSetting_organizationId_key_key" ON "OrgSetting"("organizationId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "PricingPlan_slug_key" ON "PricingPlan"("slug");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_planId_fkey" FOREIGN KEY ("planId") REFERENCES "PricingPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectLocation" ADD CONSTRAINT "ProjectLocation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectLocation" ADD CONSTRAINT "ProjectLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competitor" ADD CONSTRAINT "Competitor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteAudit" ADD CONSTRAINT "SiteAudit_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteAudit" ADD CONSTRAINT "SiteAudit_agentTaskId_fkey" FOREIGN KEY ("agentTaskId") REFERENCES "AgentTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteAuditIssue" ADD CONSTRAINT "SiteAuditIssue_siteAuditId_fkey" FOREIGN KEY ("siteAuditId") REFERENCES "SiteAudit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeywordOverview" ADD CONSTRAINT "KeywordOverview_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorOverview" ADD CONSTRAINT "CompetitorOverview_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorOverview" ADD CONSTRAINT "CompetitorOverview_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "Competitor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PpcIntelligence" ADD CONSTRAINT "PpcIntelligence_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiVisibilityCheck" ADD CONSTRAINT "AiVisibilityCheck_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GmbAnalysis" ADD CONSTRAINT "GmbAnalysis_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PitchDeck" ADD CONSTRAINT "PitchDeck_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PitchDeck" ADD CONSTRAINT "PitchDeck_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keyword" ADD CONSTRAINT "Keyword_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keyword" ADD CONSTRAINT "Keyword_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "KeywordCluster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeywordCluster" ADD CONSTRAINT "KeywordCluster_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorAnalysis" ADD CONSTRAINT "CompetitorAnalysis_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorAnalysis" ADD CONSTRAINT "CompetitorAnalysis_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "Competitor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsiteStructure" ADD CONSTRAINT "WebsiteStructure_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsiteStructure" ADD CONSTRAINT "WebsiteStructure_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuggestedPage" ADD CONSTRAINT "SuggestedPage_websiteStructureId_fkey" FOREIGN KEY ("websiteStructureId") REFERENCES "WebsiteStructure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuggestedPage" ADD CONSTRAINT "SuggestedPage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentBrief" ADD CONSTRAINT "ContentBrief_suggestedPageId_fkey" FOREIGN KEY ("suggestedPageId") REFERENCES "SuggestedPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentBrief" ADD CONSTRAINT "ContentBrief_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentBrief" ADD CONSTRAINT "ContentBrief_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkBuildingStrategy" ADD CONSTRAINT "LinkBuildingStrategy_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkBuildingStrategy" ADD CONSTRAINT "LinkBuildingStrategy_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_contentBriefId_fkey" FOREIGN KEY ("contentBriefId") REFERENCES "ContentBrief"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentReviewCriteria" ADD CONSTRAINT "ContentReviewCriteria_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentReviewResult" ADD CONSTRAINT "ContentReviewResult_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentReviewResult" ADD CONSTRAINT "ContentReviewResult_criteriaId_fkey" FOREIGN KEY ("criteriaId") REFERENCES "ContentReviewCriteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BacklinkOpportunity" ADD CONSTRAINT "BacklinkOpportunity_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BacklinkSubmission" ADD CONSTRAINT "BacklinkSubmission_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BacklinkSubmission" ADD CONSTRAINT "BacklinkSubmission_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "BacklinkOpportunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BacklinkSubmission" ADD CONSTRAINT "BacklinkSubmission_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutreachCampaign" ADD CONSTRAINT "OutreachCampaign_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnPageTask" ADD CONSTRAINT "OnPageTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GmbPost" ADD CONSTRAINT "GmbPost_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GmbPost" ADD CONSTRAINT "GmbPost_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GmbReviewResponse" ADD CONSTRAINT "GmbReviewResponse_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankTrackingConfig" ADD CONSTRAINT "RankTrackingConfig_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankTracking" ADD CONSTRAINT "RankTracking_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankTracking" ADD CONSTRAINT "RankTracking_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "Keyword"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrafficData" ADD CONSTRAINT "TrafficData_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiVisibilityReport" ADD CONSTRAINT "AiVisibilityReport_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientReport" ADD CONSTRAINT "ClientReport_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientReport" ADD CONSTRAINT "ClientReport_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareOfVoice" ADD CONSTRAINT "ShareOfVoice_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentTask" ADD CONSTRAINT "AgentTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentLog" ADD CONSTRAINT "AgentLog_agentTaskId_fkey" FOREIGN KEY ("agentTaskId") REFERENCES "AgentTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalQueue" ADD CONSTRAINT "ApprovalQueue_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalQueue" ADD CONSTRAINT "ApprovalQueue_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalQueue" ADD CONSTRAINT "ApprovalQueue_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSetting" ADD CONSTRAINT "ProjectSetting_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgSetting" ADD CONSTRAINT "OrgSetting_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
