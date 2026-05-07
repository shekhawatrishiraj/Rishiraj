# Surfaces Category

> Atom focus: Elevated cards, bordered groups, inset panels, wells, callout boxes, surface treatments.

> ⚠️ **Decision tree nodes are navigation aids only — not patterns.** Unless a pattern ID appears in the Patterns table below, it does not exist in this directory and CANNOT be recommended. Do not recommend tree node names as patterns.

---

## When This Category Applies

Use surface patterns when:
- Visual separation between content regions is needed without semantic meaning
- Content needs to feel "contained" or "lifted"
- Drawing attention to a specific content area
- Creating visual hierarchy through depth/background

---

## Patterns in This Category

| Pattern ID | Name | Tags | Confidence |
|------------|------|------|------------|
| *(empty — add via intake)* | | | |

---

## Decision Tree

**Start here: What is the surface communicating?**

```
Surface purpose?
├── Elevation/prominence → Elevated surface
│   ├── Above the page → Card with shadow
│   ├── Same level but distinct → Bordered container
│   └── Subtle grouping → Background-tinted group
│
├── Inset/recessed → Inset surface
│   ├── Form area within a page → Well / inset panel
│   ├── Code or monospace content → Code surface
│   └── Secondary content area → Muted surface
│
├── Attention/callout → Callout surface
│   ├── Informational → Info callout
│   ├── Warning → Warning callout
│   ├── Success → Success callout
│   └── Neutral → Note callout
│
└── Grouping without visual weight → Transparent grouping
    ├── Spacing only → Gap-based grouping
    └── With header → Labeled group (→ sections category)
```

**Secondary: What's the contrast level needed?**
- High contrast (must stand out) → Shadow + border
- Medium contrast (should be distinct) → Border only or background only
- Low contrast (subtle grouping) → Background tint only

**Tertiary: Is the surface interactive?**
- Interactive (clickable) → Needs hover state, focus ring
- Read-only container → No interaction affordance

---

## Cross-References

- What goes inside the surface → `cards.md`, `lists.md`, `sections.md`
- Section-level containers → `sections.md`
- Feedback-specific surfaces (alerts, banners) → `feedback.md`
