'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import type { Agent, CoachingType } from '@/lib/types/qa-dashboard';

interface CoachingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Agent | null;
}

const coachingTopics = {
  'Call Review': ['Call Quality', 'Customer Interaction', 'Resolution Skills'],
  'Knowledge Gap': ['Product Knowledge', 'System Navigation', 'Policy Updates'],
  'Soft Skills': ['Empathy Training', 'Active Listening', 'Conflict Resolution'],
  Compliance: ['Security Protocols', 'Verification Procedures', 'Documentation Requirements'],
};

const coaches = [
  'Sarah Mitchell (Coach)',
  'Michael Chen (Coach)',
  'Jennifer Williams (Coach)',
  'David Brown (Coach)',
];

export function CoachingModal({ open, onOpenChange, agent }: CoachingModalProps) {
  const [coachingType, setCoachingType] = useState<CoachingType>('Call Review');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date>();
  const [assignedCoach, setAssignedCoach] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [scheduleFollowup, setScheduleFollowup] = useState(false);

  if (!agent) return null;

  const handleSubmit = () => {
    console.log({
      agent: agent.name,
      type: coachingType,
      topics: selectedTopics,
      dueDate,
      coach: assignedCoach,
      notes,
      followup: scheduleFollowup,
    });
    onOpenChange(false);
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Coaching</DialogTitle>
          <DialogDescription>
            Create a coaching assignment for {agent.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Coaching Type */}
          <div className="space-y-2">
            <Label>Coaching Type</Label>
            <Select
              value={coachingType}
              onValueChange={(value) => {
                setCoachingType(value as CoachingType);
                setSelectedTopics([]);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Call Review">Call Review</SelectItem>
                <SelectItem value="Knowledge Gap">Knowledge Gap</SelectItem>
                <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                <SelectItem value="Compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Topics */}
          <div className="space-y-2">
            <Label>Topics (select multiple)</Label>
            <div className="border rounded-lg p-4 space-y-2">
              {coachingTopics[coachingType].map((topic) => (
                <div key={topic} className="flex items-center space-x-2">
                  <Checkbox
                    id={topic}
                    checked={selectedTopics.includes(topic)}
                    onCheckedChange={() => toggleTopic(topic)}
                  />
                  <label
                    htmlFor={topic}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {topic}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : 'Select a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Assigned Coach */}
          <div className="space-y-2">
            <Label>Assign To Coach</Label>
            <Select value={assignedCoach} onValueChange={setAssignedCoach}>
              <SelectTrigger>
                <SelectValue placeholder="Select a coach" />
              </SelectTrigger>
              <SelectContent>
                {coaches.map((coach) => (
                  <SelectItem key={coach} value={coach}>
                    {coach}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Additional Notes</Label>
            <Textarea
              placeholder="Add any additional context or instructions for the coaching session..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          {/* Schedule Follow-up */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="followup"
              checked={scheduleFollowup}
              onCheckedChange={(checked) => setScheduleFollowup(checked as boolean)}
            />
            <label
              htmlFor="followup"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Schedule follow-up review in 2 weeks
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedTopics.length === 0 || !dueDate || !assignedCoach}
          >
            Assign Coaching
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
