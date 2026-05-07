# Data Display Category

> Atom focus: Key-value pairs, metric rows, status indicators, badges, labels, stat blocks, progress indicators.

> ⚠️ **Decision tree nodes are navigation aids only — not patterns.** Unless a pattern ID appears in the Patterns table below, it does not exist in this directory and CANNOT be recommended. Do not recommend tree node names as patterns.

---

## When This Category Applies

Use data display patterns when:
- Showing structured facts about an entity (not standalone cards)
- Presenting read-only information in a scannable format
- Labeling states, statuses, or categories
- Displaying numbers that aren't the primary content focus

---

## Patterns in This Category

| Pattern ID | Name | Tags | Confidence |
|------------|------|------|------------|
| *(empty — add via intake)* | | | |

---

## Decision Tree

**Start here: What's the relationship between label and value?**

```
Label ↔ Value relationship?
├── One label, one value → Key-Value patterns
│   ├── Horizontal (label left, value right) → Inline key-value
│   ├── Vertical (label above, value below) → Stacked key-value
│   └── Many pairs in a grid → Key-value grid
│
├── A number with context → Metric patterns
│   ├── Just the number + label → Stat block
│   ├── With trend/delta → Metric with trend
│   └── With progress bar → Metric with progress
│
├── A state or category → Status/Badge patterns
│   ├── Status (active/inactive/pending) → Status indicator
│   ├── Category label → Badge
│   └── Count → Count badge
│
└── Progress toward something → Progress patterns
    ├── Linear progress → Progress bar
    ├── Step-based → Step indicator
    └── Completion % → Completion badge
```

**Secondary: Where does this appear?**
- Inside a card → Inline, no extra visual treatment
- As standalone section content → May need label styling
- In a dense table/list → Compact variant

**Tertiary: Is it read-only or interactive?**
- Read-only → Data display pattern
- Interactive (editable) → Input category instead

---

## Cross-References

- Data that needs card treatment → `cards.md`
- Status indicators in list rows → `lists.md`
- Data display groups with section treatment → `sections.md`
