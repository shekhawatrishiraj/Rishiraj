'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Clock } from 'lucide-react';
import type { FlaggedIssue, IssueSeverity } from '@/lib/types/qa-dashboard';

interface RightPanelProps {
  flaggedIssues: FlaggedIssue[];
  newIssueCount?: number;
  onClearNewCount?: () => void;
}

export function RightPanel({ flaggedIssues, newIssueCount = 0, onClearNewCount }: RightPanelProps) {
  const [severityFilter, setSeverityFilter] = useState<IssueSeverity | 'all'>('all');

  const filteredIssues =
    severityFilter === 'all'
      ? flaggedIssues
      : flaggedIssues.filter((issue) => issue.severity === severityFilter);

  const severityCounts = {
    all: flaggedIssues.length,
    Critical: flaggedIssues.filter((i) => i.severity === 'Critical').length,
    High: flaggedIssues.filter((i) => i.severity === 'High').length,
    Medium: flaggedIssues.filter((i) => i.severity === 'Medium').length,
  };

  const getSeverityVariant = (severity: IssueSeverity) => {
    switch (severity) {
      case 'Critical':
        return 'destructive';
      case 'High':
        return 'default';
      case 'Medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case 'Compliance':
        return 'destructive';
      case 'Protocol Breach':
        return 'destructive';
      case 'AHT':
        return 'default';
      case 'CSAT Issue':
        return 'secondary';
      case 'Knowledge Gap':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <aside className="w-[320px] bg-white border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Flagged Issues</h2>
          <div className="flex gap-2">
            {newIssueCount > 0 && (
              <Badge
                variant="default"
                className="rounded-full animate-pulse bg-info cursor-pointer"
                onClick={onClearNewCount}
              >
                {newIssueCount} new
              </Badge>
            )}
            <Badge variant="destructive" className="rounded-full">
              {flaggedIssues.length}
            </Badge>
          </div>
        </div>

        {/* Severity Filter Tabs */}
        <Tabs defaultValue="all" onValueChange={(value) => setSeverityFilter(value as any)}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all" className="text-xs">
              All
              <Badge variant="outline" className="ml-1">
                {severityCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="Critical" className="text-xs">
              <AlertCircle className="h-3 w-3 text-destructive" />
              <Badge variant="outline" className="ml-1">
                {severityCounts.Critical}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="High" className="text-xs">
              High
              <Badge variant="outline" className="ml-1">
                {severityCounts.High}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="Medium" className="text-xs">
              Med
              <Badge variant="outline" className="ml-1">
                {severityCounts.Medium}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Issue Cards Stack */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredIssues.map((issue) => (
          <Card key={issue.id} className="border-l-4 border-l-destructive">
            <CardContent className="p-4 space-y-3">
              {/* Agent & Time */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm text-foreground">{issue.agentName}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span>{getTimeAgo(issue.timestamp)}</span>
                  </div>
                </div>
                <Badge variant={getSeverityVariant(issue.severity)}>{issue.severity}</Badge>
              </div>

              {/* Call Info */}
              <div className="space-y-1">
                <p className="text-xs font-mono text-muted-foreground">
                  Call: #{issue.callId} ({issue.duration})
                </p>
                <p className="text-xs text-muted-foreground">QUEUE: {issue.queue}</p>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-1">
                {issue.categories.map((category) => (
                  <Badge
                    key={category}
                    variant={getCategoryVariant(category)}
                    className="text-xs"
                  >
                    {category}
                  </Badge>
                ))}
              </div>

              {/* Summary */}
              <p className="text-sm text-foreground line-clamp-2">{issue.summary}</p>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  Review Call
                </Button>
                <Button size="sm" variant="ghost">
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredIssues.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No issues found</p>
          </div>
        )}
      </div>
    </aside>
  );
}
