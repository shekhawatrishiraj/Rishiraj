'use client';

import { Calendar, Users, AlertCircle, BookOpen, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import type { DashboardFilters, DashboardView, DashboardData } from '@/lib/types/qa-dashboard';

interface LeftPanelProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  data: DashboardData;
}

export function LeftPanel({ activeView, onViewChange, filters, data }: LeftPanelProps) {
  const navigationItems = [
    { id: 'overview' as DashboardView, label: 'Overview', icon: Users },
    { id: 'leaderboard' as DashboardView, label: 'Agent Leaderboard', icon: Users },
    { id: 'compliance' as DashboardView, label: 'Compliance Audit', icon: AlertCircle },
    { id: 'coaching' as DashboardView, label: 'Coaching Queue', icon: BookOpen, badge: 5 },
    { id: 'recordings' as DashboardView, label: 'Recordings Library', icon: Video },
  ];

  const underperformingAgents = data.agents.filter((a) => a.underperformer).length;
  const pendingReviews = data.agents.reduce((sum, agent) => sum + agent.flagged, 0);
  const dueCoaching = data.agents.filter((a) => a.coachingStatus === 'Overdue').length;

  return (
    <aside className="w-[280px] bg-white border-r border-border flex flex-col overflow-y-auto">
      {/* Header Section */}
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-semibold text-foreground mb-4">QA Dashboard</h1>

        {/* Team Selector */}
        <div className="space-y-2 mb-4">
          <label className="text-xs uppercase text-muted-foreground font-medium">Team</label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              <SelectItem value="support-west">Support West</SelectItem>
              <SelectItem value="support-east">Support East</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Picker */}
        <div className="space-y-2">
          <label className="text-xs uppercase text-muted-foreground font-medium">Date Range</label>
          <Select defaultValue="7days">
            <SelectTrigger>
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 p-4 space-y-6">
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="text-xs uppercase text-muted-foreground font-medium mb-2">
            Dashboard Views
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${
                    isActive ? 'border-l-4 border-primary rounded-l-none bg-accent' : ''
                  }`}
                  onClick={() => onViewChange(item.id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                  {item.badge && (
                    <Badge variant="destructive" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible defaultOpen>
          <CollapsibleTrigger className="text-xs uppercase text-muted-foreground font-medium mb-2">
            Quick Filters
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-between text-sm">
              <span>Issues flagged</span>
              <Badge variant="destructive">{data.flaggedIssues.length}</Badge>
            </Button>
            <Button variant="ghost" className="w-full justify-between text-sm">
              <span>Under-performing agents</span>
              <Badge variant="destructive">{underperformingAgents}</Badge>
            </Button>
            <Button variant="ghost" className="w-full justify-between text-sm">
              <span>Pending reviews</span>
              <Badge variant="secondary">{pendingReviews}</Badge>
            </Button>
            <Button variant="ghost" className="w-full justify-between text-sm">
              <span>Due coaching</span>
              <Badge variant="destructive">{dueCoaching}</Badge>
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </aside>
  );
}
