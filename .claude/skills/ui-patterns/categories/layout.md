# Layout Category

> Atom focus: Split views, stacked layouts, sidebar arrangements, grid primitives, content containers.

> ⚠️ **Decision tree nodes are navigation aids only — not patterns.** Unless a pattern ID appears in the Patterns table below, it does not exist in this directory and CANNOT be recommended. Do not recommend tree node names as patterns.

---

## When This Category Applies

Use layout patterns when:
- Deciding how to arrange major content regions on a page
- Choosing between single-column, multi-column, or split arrangements
- Creating containers that constrain or expand content
- Handling responsive behavior between layout regions

---

## Patterns in This Category

| Pattern ID | Name | Tags | Confidence |
|------------|------|------|------------|
| *(empty — add via intake)* | | | |

---

## Decision Tree

**Start here: How many primary content regions does this view have?**

```
Content regions?
├── 1 region → Single column layout
│   ├── Centered, narrow → Content-width centered
│   ├── Full width → Full-bleed single column
│   └── With sticky sidebar → Single column + sticky TOC
│
├── 2 regions → Split / two-column layout
│   ├── List + detail → Master-detail split
│   ├── Navigation + content → Sidebar + main
│   ├── Equal weight → 50/50 split
│   └── Primary + secondary → 2/3 + 1/3 split
│
├── 3+ regions → Multi-panel layout
│   ├── Nav + list + detail → Three-panel (email/files pattern)
│   └── Complex dashboard → Grid layout
│
└── Card grid → Grid layout
    ├── Fixed columns → CSS grid, fixed columns
    ├── Auto-fill columns → Auto-fit grid
    └── Masonry → Masonry grid (use sparingly)
```

**Secondary: Does the layout adapt to content or viewport?**
- Fixed layout → Column widths are set
- Fluid layout → Columns scale with viewport
- Breakpoint layout → Different arrangement at each breakpoint

**Tertiary: What's the primary action relationship between regions?**
- Independent regions → Full separation
- Selection in one updates another → Linked regions (master-detail)
- Region sizes adjustable → Resizable split

---

## Cross-References

- What goes inside layout regions → all other categories
- Page-level headers → `headers.md`
- Surface treatment for layout containers → `surfaces.md`
