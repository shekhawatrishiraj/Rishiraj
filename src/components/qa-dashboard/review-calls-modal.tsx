'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Play, FileText, AlertCircle } from 'lucide-react';
import type { Agent, Call } from '@/lib/types/qa-dashboard';

interface ReviewCallsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Agent | null;
  calls: Call[];
}

export function ReviewCallsModal({ open, onOpenChange, agent, calls }: ReviewCallsModalProps) {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  if (!agent) return null;

  const agentCalls = calls.filter((call) => call.agentId === agent.id);

  const getOutcomeVariant = (outcome: string) => {
    switch (outcome) {
      case 'Resolved':
        return 'default';
      case 'Escalated':
        return 'secondary';
      case 'Callback':
        return 'outline';
      case 'Incomplete':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-warning';
    return 'text-destructive';
  };

  if (selectedCall) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Call Detail: #{selectedCall.id}</DialogTitle>
            <DialogDescription>
              {agent.name} · {selectedCall.date} · {selectedCall.duration}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Call Metrics */}
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Quality Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(selectedCall.qualityScore)}`}>
                  {selectedCall.qualityScore}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-2xl font-bold">{selectedCall.duration}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Outcome</p>
                <Badge variant={getOutcomeVariant(selectedCall.outcome)}>
                  {selectedCall.outcome}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Team</p>
                <p className="text-sm font-medium">{selectedCall.team}</p>
              </div>
            </div>

            {/* Audio Player Placeholder */}
            <div className="border rounded-lg p-6 bg-muted space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button size="icon" variant="outline">
                    <Play className="h-4 w-4" />
                  </Button>
                  <div>
                    <p className="text-sm font-medium">Call Recording</p>
                    <p className="text-xs text-muted-foreground">Duration: {selectedCall.duration}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Download
                </Button>
              </div>
              {/* Waveform placeholder */}
              <div className="h-16 bg-white rounded flex items-center justify-center text-muted-foreground">
                [Waveform visualization would go here]
              </div>
            </div>

            {/* Transcript */}
            {selectedCall.transcriptAvailable ? (
              <div className="space-y-3">
                <h3 className="font-semibold">Transcript</h3>
                <div className="border rounded-lg p-4 space-y-4 max-h-64 overflow-y-auto">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Agent (00:00:05)</p>
                    <p className="text-sm">
                      Thank you for calling customer support. My name is {agent.name}. How can I
                      help you today?
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Customer (00:00:12)</p>
                    <p className="text-sm">
                      Hi, I'm having trouble with my recent order. It hasn't arrived yet and it's
                      been over a week.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Agent (00:00:20)</p>
                    <p className="text-sm">
                      I apologize for the delay. Let me look into that for you right away. Can I
                      have your order number please?
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-6 text-center text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Transcript not available for this call</p>
              </div>
            )}

            {/* Flags and Notes */}
            {selectedCall.flagged && (
              <div className="border-l-4 border-l-destructive bg-destructive/10 p-4 rounded-r space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <h4 className="font-semibold text-destructive-foreground">Flagged Issue</h4>
                </div>
                <p className="text-sm text-foreground">
                  This call was flagged for compliance review. Issue details would appear here.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedCall(null)}>
                Back to Call List
              </Button>
              <Button variant="outline">Flag Issue</Button>
              <Button variant="outline">Add Note</Button>
              <Button>Assign Coaching</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Review Calls: {agent.name}</DialogTitle>
          <DialogDescription>
            {agentCalls.length} calls in selected period · Quality Score: {agent.score}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Call ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Quality Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agentCalls.map((call) => (
                <TableRow
                  key={call.id}
                  className={call.flagged ? 'bg-destructive/10' : ''}
                  onClick={() => setSelectedCall(call)}
                >
                  <TableCell className="font-mono">#{call.id}</TableCell>
                  <TableCell>{call.date}</TableCell>
                  <TableCell>{call.duration}</TableCell>
                  <TableCell>{call.team}</TableCell>
                  <TableCell>
                    <Badge variant={getOutcomeVariant(call.outcome)}>{call.outcome}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-semibold ${getScoreColor(call.qualityScore)}`}>
                      {call.qualityScore}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost">
                      <Play className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {agentCalls.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No calls found for this agent in the selected period</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
