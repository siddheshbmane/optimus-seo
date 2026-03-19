"use client";

import * as React from "react";
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  X,
  ExternalLink,
  Clock,
  Star,
  MessageSquare,
  TrendingDown,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Alert } from "@/agents/review-response-agent";

interface AlertListProps {
  alerts: Alert[];
  onMarkRead?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  onViewSource?: (alert: Alert) => void;
}

export function AlertList({
  alerts,
  onMarkRead,
  onResolve,
  onDismiss,
  onViewSource,
}: AlertListProps) {
  const [filter, setFilter] = React.useState<'all' | 'unread' | 'critical'>('all');

  const filteredAlerts = React.useMemo(() => {
    switch (filter) {
      case 'unread':
        return alerts.filter(a => !a.isRead);
      case 'critical':
        return alerts.filter(a => a.severity === 'critical' || a.severity === 'high');
      default:
        return alerts;
    }
  }, [alerts, filter]);

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;

  const getSeverityConfig = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          color: 'bg-red-500/10 text-red-500 border-red-500/20',
          icon: AlertCircle,
          badge: 'bg-red-500 text-white',
        };
      case 'high':
        return {
          color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
          icon: AlertTriangle,
          badge: 'bg-orange-500 text-white',
        };
      case 'medium':
        return {
          color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
          icon: Info,
          badge: 'bg-yellow-500 text-white',
        };
      default:
        return {
          color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
          icon: Info,
          badge: 'bg-blue-500 text-white',
        };
    }
  };

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'negative_review':
        return Star;
      case 'viral_mention':
        return TrendingDown;
      case 'competitor_mention':
        return Users;
      case 'rating_drop':
        return TrendingDown;
      case 'response_needed':
        return MessageSquare;
      default:
        return Bell;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alerts
            {unreadCount > 0 && (
              <Badge variant="error" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={filter === 'all' ? 'accent' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({alerts.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'accent' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filter === 'critical' ? 'accent' : 'ghost'}
              size="sm"
              onClick={() => setFilter('critical')}
            >
              Critical ({criticalCount})
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <p className="text-muted-foreground">No alerts to show</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => {
              const config = getSeverityConfig(alert.severity);
              const TypeIcon = getTypeIcon(alert.type);
              const SeverityIcon = config.icon;

              return (
                <div
                  key={alert.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    config.color,
                    !alert.isRead && "ring-2 ring-offset-2 ring-offset-background",
                    alert.isResolved && "opacity-60"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-background">
                      <SeverityIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{alert.title}</p>
                        <Badge className={config.badge}>
                          {alert.severity}
                        </Badge>
                        {alert.isResolved && (
                          <Badge variant="success">Resolved</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <TypeIcon className="h-3 w-3" />
                          {alert.type.replace(/_/g, ' ')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.date}
                        </span>
                        <span className="capitalize">{alert.source}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!alert.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onMarkRead?.(alert.id)}
                        >
                          Mark Read
                        </Button>
                      )}
                      {!alert.isResolved && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onResolve?.(alert.id)}
                        >
                          Resolve
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewSource?.(alert)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDismiss?.(alert.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AlertList;
