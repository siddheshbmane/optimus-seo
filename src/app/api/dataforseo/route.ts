// DataForSEO API Route Handler
// Server-side proxy for DataForSEO API calls to protect credentials

import { NextRequest, NextResponse } from 'next/server';
import { dataForSEOClient } from '@/lib/dataforseo/client';

// Define allowed methods and their handlers
type MethodName = 
  | 'serpGoogleOrganic'
  | 'keywordsSearchVolume'
  | 'keywordsForSite'
  | 'keywordIdeas'
  | 'relatedKeywords'
  | 'competitorsDomain'
  | 'rankedKeywords'
  | 'backlinksSummary'
  | 'backlinksBacklinks'
  | 'backlinksReferringDomains'
  | 'llmMentionsSearch'
  | 'llmMentionsTopPages'
  | 'llmMentionsTopDomains'
  | 'llmMentionsAggregated'
  | 'llmResponsesLive'
  | 'llmResponsesCompare'
  | 'onpageTaskPost'
  | 'onpageSummary'
  | 'onpageLighthouse'
  | 'contentAnalysisSearch'
  | 'contentAnalysisSentiment'
  | 'googleMyBusinessInfo'
  | 'googleReviews';

interface RequestBody {
  method: MethodName;
  params: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { method, params } = body;

    if (!method) {
      return NextResponse.json(
        { error: 'Method is required' },
        { status: 400 }
      );
    }

    // Route to appropriate DataForSEO client method
    let result;
    
    switch (method) {
      // SERP API
      case 'serpGoogleOrganic':
        result = await dataForSEOClient.serpGoogleOrganic(
          params.keywords as string[],
          params.locationCode as number,
          params.languageCode as string
        );
        break;

      // Keywords API
      case 'keywordsSearchVolume':
        result = await dataForSEOClient.keywordsSearchVolume(
          params.keywords as string[],
          params.locationCode as number,
          params.languageCode as string
        );
        break;

      case 'keywordsForSite':
        result = await dataForSEOClient.keywordsForSite(
          params.domain as string,
          params.locationCode as number,
          params.languageCode as string
        );
        break;

      // Labs API
      case 'keywordIdeas':
        result = await dataForSEOClient.keywordIdeas(
          params.keyword as string,
          params.locationCode as number,
          params.languageCode as string,
          params.limit as number
        );
        break;

      case 'relatedKeywords':
        result = await dataForSEOClient.relatedKeywords(
          params.keyword as string,
          params.locationCode as number,
          params.languageCode as string,
          params.limit as number
        );
        break;

      case 'competitorsDomain':
        result = await dataForSEOClient.competitorsDomain(
          params.domain as string,
          params.locationCode as number,
          params.languageCode as string
        );
        break;

      case 'rankedKeywords':
        result = await dataForSEOClient.rankedKeywords(
          params.domain as string,
          params.locationCode as number,
          params.languageCode as string,
          params.limit as number
        );
        break;

      // Backlinks API
      case 'backlinksSummary':
        result = await dataForSEOClient.backlinksSummary(params.domain as string);
        break;

      case 'backlinksBacklinks':
        result = await dataForSEOClient.backlinksBacklinks(
          params.domain as string,
          params.limit as number
        );
        break;

      case 'backlinksReferringDomains':
        result = await dataForSEOClient.backlinksReferringDomains(
          params.domain as string,
          params.limit as number
        );
        break;

      // AI Optimization API (LLM Mentions)
      case 'llmMentionsSearch':
        result = await dataForSEOClient.llmMentionsSearch(
          params.keyword as string,
          params.platforms as string[],
          params.locationCode as number
        );
        break;

      case 'llmMentionsTopPages':
        result = await dataForSEOClient.llmMentionsTopPages(
          params.keyword as string,
          params.locationCode as number
        );
        break;

      case 'llmMentionsTopDomains':
        result = await dataForSEOClient.llmMentionsTopDomains(
          params.keyword as string,
          params.locationCode as number
        );
        break;

      case 'llmMentionsAggregated':
        result = await dataForSEOClient.llmMentionsAggregated(
          params.keyword as string,
          params.locationCode as number
        );
        break;

      case 'llmResponsesLive':
        result = await dataForSEOClient.llmResponsesLive(
          params.query as string,
          params.platforms as string[]
        );
        break;

      case 'llmResponsesCompare':
        result = await dataForSEOClient.llmResponsesCompare(params.query as string);
        break;

      // OnPage API
      case 'onpageTaskPost':
        result = await dataForSEOClient.onpageTaskPost(params.url as string);
        break;

      case 'onpageSummary':
        result = await dataForSEOClient.onpageSummary(params.taskId as string);
        break;

      case 'onpageLighthouse':
        result = await dataForSEOClient.onpageLighthouse(params.url as string);
        break;

      // Content Analysis API
      case 'contentAnalysisSearch':
        result = await dataForSEOClient.contentAnalysisSearch(
          params.keyword as string,
          params.locationCode as number
        );
        break;

      case 'contentAnalysisSentiment':
        result = await dataForSEOClient.contentAnalysisSentiment(params.texts as string[]);
        break;

      // Business Data API
      case 'googleMyBusinessInfo':
        result = await dataForSEOClient.googleMyBusinessInfo(
          params.keyword as string,
          params.locationCode as number
        );
        break;

      case 'googleReviews':
        result = await dataForSEOClient.googleReviews(params.placeId as string);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown method: ${method}` },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('DataForSEO API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
