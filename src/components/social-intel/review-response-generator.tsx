"use client";

import * as React from "react";
import {
  Sparkles,
  Copy,
  RefreshCw,
  Send,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Star,
  Clock,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Review, GeneratedResponse, ReviewAnalysis, Tone } from "@/agents/review-response-agent";

interface ReviewResponseGeneratorProps {
  review: Review;
  analysis?: ReviewAnalysis;
  onGenerateResponse?: (tone: Tone) => void;
  onSendResponse?: (response: string) => void;
  generatedResponse?: GeneratedResponse;
  isGenerating?: boolean;
}

export function ReviewResponseGenerator({
  review,
  analysis,
  onGenerateResponse,
  onSendResponse,
  generatedResponse,
  isGenerating = false,
}: ReviewResponseGeneratorProps) {
  const [selectedTone, setSelectedTone] = React.useState<Tone>('professional');
  const [editedResponse, setEditedResponse] = React.useState('');
  const [showAlternatives, setShowAlternatives] = React.useState(false);

  React.useEffect(() => {
    if (generatedResponse) {
      setEditedResponse(generatedResponse.content);
    }
  }, [generatedResponse]);

  const tones: { value: Tone; label: string; description: string }[] = [
    { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
    { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
    { value: 'empathetic', label: 'Empathetic', description: 'Understanding and caring' },
    { value: 'apologetic', label: 'Apologetic', description: 'Sincere and remorseful' },
    { value: 'grateful', label: 'Grateful', description: 'Thankful and appreciative' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(editedResponse);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500/10 text-green-500';
      case 'negative':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-yellow-500/10 text-yellow-500';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-500/10 text-red-500';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500';
      default:
        return 'bg-green-500/10 text-green-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Review Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                {review.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{review.author}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="capitalize">{review.platform}</span>
                  <span>•</span>
                  <span>{review.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-4 w-4",
                      star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"
                    )}
                  />
                ))}
              </div>
              {analysis && (
                <>
                  <Badge className={getSentimentColor(analysis.sentiment)}>
                    {analysis.sentiment}
                  </Badge>
                  <Badge className={getUrgencyColor(analysis.urgency)}>
                    {analysis.urgency} urgency
                  </Badge>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{review.content}</p>
          
          {analysis && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Customer Intent</p>
                  <Badge>{analysis.customerIntent.type}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Topics</p>
                  <div className="flex flex-wrap gap-1">
                    {analysis.topics.slice(0, 3).map((topic, i) => (
                      <Badge key={i} variant="neutral" className="text-xs">
                        {topic.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Priority Score</p>
                  <span className="text-lg font-bold">{analysis.suggestedPriority}/10</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tone Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Response Tone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tones.map((tone) => (
              <Button
                key={tone.value}
                variant={selectedTone === tone.value ? 'accent' : 'secondary'}
                size="sm"
                onClick={() => setSelectedTone(tone.value)}
              >
                {tone.label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {tones.find(t => t.value === selectedTone)?.description}
          </p>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Button
        className="w-full"
        onClick={() => onGenerateResponse?.(selectedTone)}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Generating Response...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate AI Response
          </>
        )}
      </Button>

      {/* Generated Response */}
      {generatedResponse && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Generated Response
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="neutral">{generatedResponse.wordCount} words</Badge>
                <Badge variant="neutral">{generatedResponse.readingTime} read</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <textarea
              value={editedResponse}
              onChange={(e) => setEditedResponse(e.target.value)}
              className="w-full min-h-[200px] p-3 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-accent"
            />

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onGenerateResponse?.(selectedTone)}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Regenerate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAlternatives(!showAlternatives)}
                >
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Alternatives
                </Button>
              </div>
              <Button onClick={() => onSendResponse?.(editedResponse)}>
                <Send className="h-4 w-4 mr-2" />
                Send Response
              </Button>
            </div>

            {/* Suggestions */}
            {generatedResponse.suggestions.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Suggestions
                </p>
                <ul className="space-y-1">
                  {generatedResponse.suggestions.map((suggestion, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 mt-1 text-green-500 shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Alternatives */}
            {showAlternatives && generatedResponse.alternatives.length > 0 && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium">Alternative Responses</p>
                {generatedResponse.alternatives.map((alt, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border cursor-pointer hover:bg-muted/30"
                    onClick={() => setEditedResponse(alt)}
                  >
                    <p className="text-sm line-clamp-3">{alt}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ReviewResponseGenerator;
