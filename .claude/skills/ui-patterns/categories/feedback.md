# Feedback Category

> Atom focus: Toasts, alerts, progress bars, skeletons, empty states, error blocks, status banners.

> ⚠️ **Decision tree nodes are navigation aids only — not patterns.** Unless a pattern ID appears in the Patterns table below, it does not exist in this directory and CANNOT be recommended. Do not recommend tree node names as patterns.

---

## When This Category Applies

Use feedback patterns when:
- Communicating a system state (loading, error, success, empty)
- Providing response to a user action
- Showing progress through an operation
- Handling the absence of content gracefully

---

## Patterns in This Category

| Pattern ID | Name | Tags | Confidence |
|------------|------|------|------------|
| *(empty — add via intake)* | | | |

---

## Decision Tree

**Start here: What triggered this feedback?**

```
Trigger?
├── User action completed → Action feedback
│   ├── Quick confirmation → Toast (auto-dismiss)
│   ├── Needs acknowledgment → Alert/dialog
│   ├── With undo → Toast with undo action
│   └── Success state change → Inline success
│
├── System state (loading) → Loading feedback
│   ├── Short wait (<1s) → No feedback (too fast)
│   ├── Medium wait (1–5s) → Skeleton or spinner
│   ├── Long wait (5s+) → Progress bar with % or steps
│   └── Background task → Background progress indicator
│
├── Error occurred → Error feedback
│   ├── Field-level → Inline field error
│   ├── Form-level → Form error summary
│   ├── Page-level → Error block / error state
│   └── Network/system → Error banner
│
├── No content yet → Empty state
│   ├── Never had content → Onboarding empty state
│   ├── Filters removed content → Filtered empty state
│   ├── Search returned nothing → Zero results state
│   └── Content deleted → Post-delete empty state
│
└── Persistent status → Banner / status bar
    ├── Warning (non-blocking) → Warning banner
    ├── Info (contextual) → Info banner
    └── System-wide alert → System banner
```

**Secondary: Where is feedback positioned?**
- Inline (within the content) → Inline feedback pattern
- Overlay (on top of content) → Toast or notification
- Page-level (replaces content) → Full-page empty/error state
- Above content (persistent) → Banner pattern

**Tertiary: Does feedback require a user action to dismiss?**
- Auto-dismiss → Toast (3–5s)
- User-dismissed → Alert with close
- Blocking (requires decision) → Modal/dialog (→ not this skill)

---

## Cross-References

- Empty state within a specific content area → `sections.md`
- Skeleton matching card shapes → `cards.md`
- Skeleton matching list shapes → `lists.md`
- Error copy/messaging → `/design-knowledge` → `copy.md`
