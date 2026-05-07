# Headers Category

> Atom focus: Page headers, section headers, card headers, toolbar headers, breadcrumb bars.

> ⚠️ **Decision tree nodes are navigation aids only — not patterns.** Unless a pattern ID appears in the Patterns table below, it does not exist in this directory and CANNOT be recommended. Do not recommend tree node names as patterns.

---

## When This Category Applies

Use header patterns when:
- Labeling a content region with a title
- Providing navigation context (breadcrumbs, back navigation)
- Housing page-level or section-level actions
- Creating a sticky/persistent anchor for a scrolling area

---

## Patterns in This Category

| Pattern ID | Name | Tags | Confidence |
|------------|------|------|------------|
| *(empty — add via intake)* | | | |

---

## Decision Tree

**Start here: What level in the hierarchy is this header?**

```
Hierarchy level?
├── Page level → Page header
│   ├── With back navigation → Page header with back
│   ├── With primary action → Page header with CTA
│   ├── With tabs → Page header with tabs
│   └── With breadcrumbs → Page header with breadcrumb
│
├── Section level → Section header
│   ├── With action (add, see all) → Section header with action
│   ├── Label only → Simple section header
│   └── With count → Section header with count
│
├── Card/panel level → Card header
│   ├── Title only → Simple card header
│   ├── With subtitle → Card header with subtitle
│   └── With actions → Card header with actions
│
└── Toolbar → Toolbar bar
    ├── Contextual (appears on selection) → Contextual toolbar
    ├── Persistent → Persistent toolbar
    └── Floating → Floating toolbar
```

**Secondary: Is the header sticky?**
- Sticky on scroll → Needs compact/collapsed variant design
- Not sticky → Standard treatment

**Tertiary: How many actions does the header contain?**
- 0 actions → Label-focused header, maximize whitespace
- 1 primary action → Title + single CTA
- 2–3 actions → Title + action group
- 4+ actions → Overflow into more menu

---

## Cross-References

- Section-level grouping logic → `sections.md`
- Toolbar actions → `input.md` (buttons as interactive elements)
- Breadcrumb navigation → adjacent to `layout.md`
