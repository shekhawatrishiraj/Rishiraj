'use client';

import { KPICard } from './kpi-card';
import { AgentTable } from './agent-table';
import type { DashboardData, DashboardFilters } from '@/lib/types/qa-dashboard';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface CenterPanelProps {
  data: DashboardData;
  filters: DashboardFilters;
}

export function CenterPanel({ data }: CenterPanelProps) {
  const { kpis } = data;

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Team Score Card */}
          <KPICard
            title="Team Quality Score"
            value={kpis.teamScore.value}
            trend={kpis.teamScore.trend}
            subtitle={`Target: ${kpis.teamScore.target}`}
            variant={kpis.teamScore.value >= kpis.teamScore.target ? 'success' : 'warning'}
          >
            <div className="h-12 flex items-end gap-0.5">
              {kpis.teamScore.sparkline?.map((value, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary rounded-t"
                  style={{ height: `${(value / 100) * 100}%` }}
                />
              ))}
            </div>
          </KPICard>

          {/* Call Volume Card */}
          <KPICard title="Calls Reviewed This Period" value={kpis.callsReviewed.value}>
            <div className="flex gap-2 text-sm">
              <Badge variant="destructive">{kpis.callsReviewed.flagged} flagged</Badge>
              <Badge variant="default" className="bg-success">
                {kpis.callsReviewed.compliant} compliant
              </Badge>
            </div>
          </KPICard>

          {/* Compliance Rate Card */}
          <KPICard
            title="Compliance Score"
            value={`${kpis.complianceRate.value}%`}
            variant={kpis.complianceRate.value >= 80 ? 'success' : 'danger'}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>AHT</span>
                <span className="font-medium">{kpis.complianceRate.byCategory.AHT}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Greeting</span>
                <span className="font-medium">{kpis.complianceRate.byCategory.Greeting}%</span>
              </div>
              <div className="flex items-center justify-between text-xs text-warning-foreground">
                <span>Protocol ⚠️</span>
                <span className="font-medium">{kpis.complianceRate.byCategory.Protocol}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Closing</span>
                <span className="font-medium">{kpis.complianceRate.byCategory.Closing}%</span>
              </div>
            </div>
          </KPICard>

          {/* Avg Handle Time Card */}
          <KPICard
            title="Average Handle Time"
            value={kpis.avgHandleTime.value}
            subtitle={`Target: ${kpis.avgHandleTime.target}`}
            variant="success"
          >
            <div className="flex items-center gap-2 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" />
              <span className="font-medium">Compliant</span>
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Top 3 Agents:</p>
              {kpis.avgHandleTime.topAgents.map((agent, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span>{agent.name}</span>
                  <span className="font-medium">{agent.aht}</span>
                </div>
              ))}
            </div>
          </KPICard>
        </div>

        {/* Agent Performance Table */}
        <AgentTable agents={data.agents} calls={data.calls} />
      </div>
    </main>
  );
}
