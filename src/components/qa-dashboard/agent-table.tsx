'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, FileText, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Agent, Call } from '@/lib/types/qa-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReviewCallsModal } from './review-calls-modal';
import { CoachingModal } from './coaching-modal';

interface AgentTableProps {
  agents: Agent[];
  calls?: Call[];
}

type SortField = 'name' | 'score' | 'callsReviewed' | 'flagged' | 'compliance' | 'aht' | 'csat';
type SortDirection = 'asc' | 'desc';

export function AgentTable({ agents, calls = [] }: AgentTableProps) {
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [coachingModalOpen, setCoachingModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedAgents = [...agents].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'aht') {
      aValue = parseInt(a.aht.split('m')[0]) * 60 + parseInt(a.aht.split('m')[1]);
      bValue = parseInt(b.aht.split('m')[0]) * 60 + parseInt(b.aht.split('m')[1]);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-foreground bg-success';
    if (score >= 80) return 'text-warning-foreground bg-warning-muted';
    return 'text-destructive-foreground bg-destructive';
  };

  const getCoachingStatusVariant = (status: string) => {
    switch (status) {
      case 'Overdue':
        return 'destructive';
      case 'In Progress':
        return 'default';
      case 'Scheduled':
        return 'secondary';
      case 'Completed':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Agent Performance Summary</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export CSV
          </Button>
          <Button variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Rank</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('name')}
                    className="h-8 px-2"
                  >
                    Agent Name
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('score')}
                    className="h-8 px-2"
                  >
                    Quality Score
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('callsReviewed')}
                    className="h-8 px-2"
                  >
                    Calls
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('flagged')}
                    className="h-8 px-2"
                  >
                    Flagged
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('compliance')}
                    className="h-8 px-2"
                  >
                    Compliance
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('aht')}
                    className="h-8 px-2"
                  >
                    AHT
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('csat')}
                    className="h-8 px-2"
                  >
                    CSAT
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Coaching Status</TableHead>
                <TableHead>Last Review</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAgents.map((agent, index) => (
                <TableRow
                  key={agent.id}
                  className={`${
                    agent.flagged > 15 ? 'bg-destructive/10' : ''
                  } hover:bg-muted cursor-pointer transition-colors`}
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {agent.underperformer && (
                        <span className="h-2 w-2 rounded-full bg-destructive" />
                      )}
                      <span className="font-medium">{agent.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getScoreColor(agent.score)}>{agent.score}</Badge>
                  </TableCell>
                  <TableCell>{agent.callsReviewed}</TableCell>
                  <TableCell>
                    <Badge variant={agent.flagged > 15 ? 'destructive' : 'secondary'}>
                      {agent.flagged}
                    </Badge>
                  </TableCell>
                  <TableCell>{agent.compliance}%</TableCell>
                  <TableCell className="font-mono text-sm">{agent.aht}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-warning">★</span>
                      <span>{agent.csat}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getCoachingStatusVariant(agent.coachingStatus)}>
                      {agent.coachingStatus}
                      {agent.coachingProgress && ` (${agent.coachingProgress})`}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{agent.lastReview}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedAgent(agent);
                            setReviewModalOpen(true);
                          }}
                        >
                          <Target className="mr-2 h-4 w-4" />
                          Review Calls
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedAgent(agent);
                            setCoachingModalOpen(true);
                          }}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Assign Coaching
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <ReviewCallsModal
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        agent={selectedAgent}
        calls={calls}
      />

      <CoachingModal
        open={coachingModalOpen}
        onOpenChange={setCoachingModalOpen}
        agent={selectedAgent}
      />
    </Card>
  );
}
