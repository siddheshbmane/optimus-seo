"use client";

import * as React from "react";
import {
  Star,
  Clock,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PrioritizedReview } from "@/agents/review-response-agent";

interface ReviewPriorityListProps {
  reviews: PrioritizedReview[];
  onSelectReview?: (review: PrioritizedReview) => void;
  onRespondToReview?: (review: PrioritizedReview) => void;
}

export function ReviewPriorityList({
  reviews,
  onSelectReview,
  onRespondToReview,
}: ReviewPriorityListProps) {
  const getPriorityColor = (score: number) => {
    if (score >= 8) return 'bg-red-500/10 text-red-500 border-red-500/20';
    if (score >= 6) return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    if (score >= 4) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    return 'bg-green-500/10 text-green-500 border-green-500/20';
  };

  const getPriorityLabel = (score: number) => {
    if (score >= 8) return 'Critical';
    if (score >= 6) return 'High';
    if (score >= 4) return 'Medium';
    return 'Low';
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-3 w-3",
              star <= rating ? "text-yellow-500 fill-yellow-500" : "text-muted"
            )}
          />
        ))}
      </div>
    );
  };

  const needsResponseCount = reviews.filter(r => !r.response).length;
  const criticalCount = reviews.filter(r => r.priorityScore >= 8).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Review Priority Queue
          </CardTitle>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <Badge variant="error">
                {criticalCount} critical
              </Badge>
            )}
            <Badge variant="warning">
              {needsResponseCount} need response
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={cn(
                "p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                getPriorityColor(review.priorityScore)
              )}
              onClick={() => onSelectReview?.(review)}
            >
              <div className="flex items-start gap-4">
                {/* Priority Score */}
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
                    review.priorityScore >= 8 ? "bg-red-500 text-white" :
                    review.priorityScore >= 6 ? "bg-orange-500 text-white" :
                    review.priorityScore >= 4 ? "bg-yellow-500 text-white" :
                    "bg-green-500 text-white"
                  )}>
                    {review.priorityScore}
                  </div>
                  <span className="text-xs mt-1">{getPriorityLabel(review.priorityScore)}</span>
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{review.author}</span>
                    {getRatingStars(review.rating)}
                    <Badge variant="neutral" className="capitalize">
                      {review.platform}
                    </Badge>
                    {review.response ? (
                      <Badge variant="success" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Responded
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Needs Response
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm line-clamp-2">{review.content}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {review.date}
                    </span>
                    <span>{review.priorityReason}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {review.estimatedResponseTime}
                  </div>
                  {!review.response && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRespondToReview?.(review);
                      }}
                    >
                      Respond
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Suggested Action */}
              <div className="mt-3 pt-3 border-t border-current/10">
                <p className="text-xs">
                  <span className="font-medium">Suggested Action:</span>{' '}
                  {review.suggestedAction}
                </p>
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <p className="text-muted-foreground">All reviews have been addressed!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ReviewPriorityList;
