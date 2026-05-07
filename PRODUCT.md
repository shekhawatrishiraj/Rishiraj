# Product Context

## Product Name
Contact Centre Quality Assurance Dashboard

## What It Does
A comprehensive analytics dashboard for QA managers to review agent performance, identify compliance gaps, assign coaching tasks, and track team quality trends in real-time. Enables data-driven coaching decisions and compliance monitoring across contact centre teams.

## Users
| User Type | Description |
|-----------|-------------|
| QA Manager | Primary user who reviews agent performance, flags issues, and assigns coaching. Needs quick insights into team health and drill-down capability for specific agents and calls. |
| Team Lead | Secondary user who reviews assigned coaching tasks and monitors their team's performance trends. |
| Agent | Views their own performance metrics and coaching assignments. |

## Key Features
| Feature | Status | Description |
|---------|--------|-------------|
| Team Performance Overview | building | 4 KPI cards showing team score, call volume, compliance rate, and average handle time with trends |
| Agent Performance Table | building | Sortable table with quality scores, compliance rates, flagged calls, and coaching status for all agents |
| Flagged Issues Panel | building | Real-time feed of compliance issues and quality concerns requiring review |
| Call Review Modal | building | Detailed call playback with transcript timeline and annotation capability |
| Coaching Assignment | building | Modal workflow for assigning coaching tasks with due dates and topics |
| Advanced Filters | building | Team selector, date range picker, and multi-select filters for compliance status and agent tier |
| Live Updates | planned | Real-time push notifications for new flagged issues and coaching completions |
| Agent Leaderboard | planned | Gamified view of top performers with badges and achievements |

## Core Tensions
- **Depth vs. Speed**: Detailed drill-down analysis vs. quick at-a-glance insights for busy QA managers
- **Accountability vs. Support**: Monitoring/flagging issues vs. creating a supportive coaching environment
- **Real-time vs. Performance**: Live updates and refresh rates vs. page load performance with large datasets

## Review Questions
- "What if this scales to 100x agents and 10,000+ daily calls?"
- "Are we optimizing for QA managers who want quick overview or those who need deep investigation tools?"
- "What's the first thing a QA manager sees when they log in each morning?"
- "How do we balance transparency (showing all metrics) with agent morale?"
