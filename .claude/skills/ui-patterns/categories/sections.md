# Sections Category

> Atom focus: Content sections, collapsible groups, divider patterns, card groups, panel sections.

> ⚠️ **Decision tree nodes are navigation aids only — not patterns.** Unless a pattern ID appears in the Patterns table below, it does not exist in this directory and CANNOT be recommended. Do not recommend tree node names as patterns.

---

## When This Category Applies

Use section patterns when:
- Grouping related content under a common label
- Creating visual separation between content areas
- Organizing a page into scannable regions
- Hiding/showing content progressively

---

## Patterns in This Category

| Pattern ID | Name | Tags | Confidence |
|------------|------|------|------------|
| *(empty — add via intake)* | | | |

---

## Decision Tree

**Start here: Is the section always visible or sometimes hidden?**

```
Visibility?
├── Always visible → Static section patterns
│   ├── With header label → Labeled section
│   ├── With divider only → Divider section
│   ├── No visual separation → Content block
│   └── With card treatment → Card section
│
├── Can be hidden → Collapsible section patterns
│   ├── Hidden by default → Expandable section (collapsed)
│   ├── Open by default → Collapsible section (expanded)
│   └── Tab-based switching → Tab section
│
└── Content loads progressively → Lazy section
```

**Secondary: How many items does the section contain?**
- 1–3 items: Section with card children
- 4–8 items: Section with list or grid children
- 9+ items: Section with pagination or show-more

**Tertiary: Does the section have actions?**
- No actions → Label only header
- Section-level action (add, edit all) → Header with action
- Item-level actions → Handled by child pattern (list, card)

---

## Cross-References

- Section headers specifically → `headers.md`
- Section surface/container treatment → `surfaces.md`
- Items inside sections → `lists.md` or `cards.md`
- Collapsible with accordion behavior → overlap with `layout.md`
