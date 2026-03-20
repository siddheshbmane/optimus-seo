// SEO-specific LLM API Route Handler
// Specialized endpoints for SEO analysis and content generation

import { NextRequest, NextResponse } from 'next/server';
import { llmClient } from '@/lib/llm/client';
import { requireAuth } from '@/lib/api/auth';

type SEOAction = 
  | 'analyze'
  | 'generateContent'
  | 'analyzeContent'
  | 'generateMeta'
  | 'suggestKeywords'
  | 'competitorAnalysis'
  | 'technicalAudit';

interface RequestBody {
  action: SEOAction;
  params: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body: RequestBody = await request.json();
    const { action, params } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    // Check if LLM is available
    if (!llmClient.isAvailable()) {
      return NextResponse.json(
        { error: 'No LLM provider configured' },
        { status: 503 }
      );
    }

    let result: string;

    switch (action) {
      case 'analyze':
        result = await llmClient.seoAnalysis(
          params.prompt as string,
          params.context as string | undefined
        );
        break;

      case 'generateContent': {
        // Coerce keywords: accept string, string[], or undefined
        let keywords: string[] = [];
        if (Array.isArray(params.keywords)) {
          keywords = params.keywords as string[];
        } else if (typeof params.keywords === 'string') {
          keywords = [params.keywords as string];
        } else if (typeof params.keyword === 'string') {
          keywords = [params.keyword as string];
        }

        result = await llmClient.generateContent(
          (params.topic as string) || 'General SEO',
          keywords,
          (params.contentType as 'blog' | 'product' | 'landing' | 'meta') || 'blog'
        );
        break;
      }

      case 'analyzeContent':
        result = await llmClient.analyzeContent(
          params.content as string,
          params.targetKeyword as string
        );
        break;

      case 'generateMeta':
        result = await generateMetaTags(
          params.title as string,
          params.content as string,
          params.targetKeyword as string
        );
        break;

      case 'suggestKeywords': {
        let existingKw: string[] | undefined;
        if (Array.isArray(params.existingKeywords)) {
          existingKw = params.existingKeywords as string[];
        } else if (typeof params.existingKeywords === 'string') {
          existingKw = [params.existingKeywords as string];
        }

        result = await suggestKeywords(
          params.topic as string,
          existingKw
        );
        break;
      }

      case 'competitorAnalysis':
        result = await analyzeCompetitor(
          params.competitorUrl as string,
          params.competitorContent as string,
          params.targetKeyword as string
        );
        break;

      case 'technicalAudit':
        result = await technicalAuditSuggestions(
          params.issues as string[],
          params.url as string
        );
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('SEO LLM API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions for specific SEO tasks

async function generateMetaTags(
  title: string,
  content: string,
  targetKeyword: string
): Promise<string> {
  const systemPrompt = `You are an SEO meta tag specialist. Generate optimized meta tags 
that improve click-through rates while maintaining keyword relevance.

Target keyword: ${targetKeyword}

Guidelines:
- Title tag: 50-60 characters, keyword near the beginning
- Meta description: 150-160 characters, compelling call-to-action
- Include power words that drive clicks
- Maintain natural language flow`;

  return llmClient.generateText(
    `Generate meta tags for this page:\n\nTitle: ${title}\n\nContent preview: ${content.slice(0, 500)}`,
    systemPrompt
  );
}

async function suggestKeywords(
  topic: string,
  existingKeywords?: string[]
): Promise<string> {
  const systemPrompt = `You are a keyword research specialist. Suggest relevant keywords 
based on search intent and semantic relationships.

${Array.isArray(existingKeywords) && existingKeywords.length > 0 ? `Existing keywords: ${existingKeywords.join(', ')}` : ''}

For each keyword suggestion, provide:
1. The keyword
2. Estimated search intent (informational, navigational, transactional, commercial)
3. Difficulty estimate (low, medium, high)
4. Content type recommendation`;

  return llmClient.generateText(
    `Suggest keywords for the topic: ${topic}`,
    systemPrompt
  );
}

async function analyzeCompetitor(
  competitorUrl: string,
  competitorContent: string,
  targetKeyword: string
): Promise<string> {
  const systemPrompt = `You are a competitive SEO analyst. Analyze competitor content 
and identify opportunities to outrank them.

Target keyword: ${targetKeyword}
Competitor URL: ${competitorUrl}

Analyze:
1. Content gaps we can fill
2. Topics they cover well
3. Structural advantages/disadvantages
4. Keyword usage patterns
5. Recommendations to outrank`;

  return llmClient.generateText(
    `Analyze this competitor content:\n\n${competitorContent.slice(0, 2000)}`,
    systemPrompt
  );
}

async function technicalAuditSuggestions(
  issues: string[],
  url: string
): Promise<string> {
  const systemPrompt = `You are a technical SEO expert. Provide actionable fixes 
for technical SEO issues with priority rankings.

URL: ${url}

For each issue:
1. Explain the impact on SEO
2. Provide step-by-step fix instructions
3. Estimate implementation difficulty
4. Suggest verification method`;

  return llmClient.generateText(
    `Provide fixes for these technical SEO issues:\n\n${issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}`,
    systemPrompt
  );
}
