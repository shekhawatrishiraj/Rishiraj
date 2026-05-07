'use client';

import { useState } from 'react';
import { mockDashboardData } from '@/lib/mock-data/qa-dashboard-data';
import { LeftPanel } from './left-panel';
import { CenterPanel } from './center-panel';
import { RightPanel } from './right-panel';
import { useLiveUpdates } from '@/hooks/use-live-updates';
import type { DashboardFilters, DashboardView } from '@/lib/types/qa-dashboard';

export function QADashboard() {
  const [data] = useState(mockDashboardData);
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [filters, setFilters] = useState<DashboardFilters>({
    team: 'All Teams',
    dateRange: data.dateRange,
  });

  const { issues, newIssueCount, clearNewCount } = useLiveUpdates(data.flaggedIssues, true);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background overflow-hidden">
      {/* LEFT PANEL - 280px Navigation & Filters (Hidden on mobile, drawer on tablet) */}
      <div className="hidden lg:block">
        <LeftPanel
          activeView={activeView}
          onViewChange={setActiveView}
          filters={filters}
          onFiltersChange={setFilters}
          data={data}
        />
      </div>

      {/* CENTER PANEL - Main Content */}
      <CenterPanel data={data} filters={filters} />

      {/* RIGHT PANEL - 320px Context & Actions (Hidden on mobile/tablet) */}
      <div className="hidden xl:block">
        <RightPanel
          flaggedIssues={issues}
          newIssueCount={newIssueCount}
          onClearNewCount={clearNewCount}
        />
      </div>
    </div>
  );
}
