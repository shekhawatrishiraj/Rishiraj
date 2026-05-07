# Lists Category

> Atom focus: List items (1-line, 2-line, 3-line), with actions, with thumbnails, with avatars, grouped lists, action lists.

> ⚠️ **Decision tree nodes are navigation aids only — not patterns.** Unless a pattern ID appears in the Patterns table below, it does not exist in this directory and CANNOT be recommended. Do not recommend tree node names as patterns.

---

## When This Category Applies

Use list patterns when:
- Content is a collection of similar items
- Items share the same structure
- Density matters (more items than cards can handle)
- Items are scannable vertically

---

## Patterns in This Category

| Pattern ID | Name | Tags | Confidence |
|------------|------|------|------------|
| *(empty — add via intake)* | | | |

---

## Decision Tree

**Start here: How many lines of text per item?**

```
Lines per item?
├── 1 line → Single-line list item
│   ├── With leading icon → Icon list item
│   ├── With leading avatar → Avatar list item
│   ├── With trailing action → Action list item
│   └── Plain text only → Simple list item
│
├── 2 lines → Two-line list item
│   ├── Primary text + secondary (supporting) → Standard two-line
│   ├── Primary text + metadata (date, count) → Metadata list item
│   └── With thumbnail → Thumbnail list item
│
├── 3 lines → Three-line list item
│   ├── With preview text → Preview list item
│   └── Rich content → Rich list item
│
└── Variable height → Custom row (use with caution — breaks scan rhythm)
```

**Secondary: What triggers on the item?**
- Click to navigate → Make full row clickable
- Inline action (delete, edit) → Trailing action or hover reveal
- Multiple actions → Action menu (overflow menu or row actions)
- Selection → Checkbox list item

**Tertiary: Are items grouped?**
- Flat list → Standard list
- Grouped with headers → Grouped list
- Collapsible groups → Expandable grouped list
- Nested hierarchy → Tree list (consider if needed — high complexity)

---

## Cross-References

- Items that need card treatment → `cards.md`
- Item status/badge display → `data-display.md`
- Group headers and section labels → `headers.md`
- List containers and grouping surfaces → `sections.md`
