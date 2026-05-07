'use client';

import { useState, useEffect } from 'react';
import type { FlaggedIssue } from '@/lib/types/qa-dashboard';

const newIssues: FlaggedIssue[] = [
  {
    id: 100,
    agentId: 4,
    agentName: 'James Williams',
    timestamp: new Date().toISOString(),
    callId: 47900,
    duration: '6m 45s',
    queue: 'Sales',
    categories: ['Knowledge Gap'],
    severity: 'Medium',
    summary: 'Agent was unable to answer product pricing question without multiple holds.',
  },
  {
    id: 101,
    agentId: 7,
    agentName: 'Aisha Mohammed',
    timestamp: new Date(Date.now() + 60000).toISOString(),
    callId: 47901,
    duration: '7m 12s',
    queue: 'Technical Support',
    categories: ['Compliance', 'Protocol Breach'],
    severity: 'Critical',
    summary: 'Failed to verify customer identity before discussing account details.',
  },
];

export function useLiveUpdates(initialIssues: FlaggedIssue[], enabled = true) {
  const [issues, setIssues] = useState<FlaggedIssue[]>(initialIssues);
  const [newIssueCount, setNewIssueCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let issueIndex = 0;
    const interval = setInterval(() => {
      if (issueIndex < newIssues.length) {
        const newIssue = {
          ...newIssues[issueIndex],
          timestamp: new Date().toISOString(),
        };

        setIssues((prev) => [newIssue, ...prev]);
        setNewIssueCount((prev) => prev + 1);
        issueIndex++;
      }
    }, 30000); // Add new issue every 30 seconds

    return () => clearInterval(interval);
  }, [enabled]);

  const clearNewCount = () => setNewIssueCount(0);

  return { issues, newIssueCount, clearNewCount };
}
