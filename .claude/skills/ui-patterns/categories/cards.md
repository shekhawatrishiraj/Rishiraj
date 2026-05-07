# Cards Category

> Atom focus: Stat cards, info cards, action cards, media cards, profile cards, pricing cards, feature cards.

> ⚠️ **Decision tree nodes are navigation aids only — not patterns.** Unless a pattern ID appears in the Patterns table below, it does not exist in this directory and CANNOT be recommended. Do not recommend tree node names as patterns.

---

## When This Category Applies

Use card patterns when content is:
- Discrete, bounded units (not a continuous list)
- Scannable in isolation (each card makes sense without context)
- Potentially clickable or interactive as a whole unit
- Visually distinguished from surrounding content

---

## Patterns in This Category

| Pattern ID | Name | Tags | Confidence |
|------------|------|------|------------|
| *(empty — add via intake)* | | | |

---

## Decision Tree

**Start here: What's the primary purpose of the card?**

```
Card purpose?
├── Show a metric/number → Stat Card variants
│   ├── With trend/delta → Stat card with trend
│   ├── Simple number only → Minimal stat card
│   └── Comparison (before/after) → Comparison stat card
│
├── Describe a thing (entity, feature, product) → Info Card variants
│   ├── With image/media → Media card
│   ├── Text only → Info card
│   └── With person/avatar → Profile card
│
├── Drive an action → Action Card variants
│   ├── Single primary action → Action card
│   ├── Multiple actions → Multi-action card
│   └── Pricing/tier → Pricing card
│
└── Navigate somewhere → Navigable card (treat as list item in card form)
```

**Secondary question: How many cards appear together?**
- 1–3 cards: Large format OK
- 4–8 cards: Medium format, grid layout
- 9+ cards: Consider list items instead of cards

**Tertiary: What's the information density?**
- High density (many fields) → Structured info card with sections
- Low density (1–2 fields) → Minimal card or stat card
- Media-heavy → Media card with minimal text

---

## Cross-References

- Dense data that doesn't need card treatment → `data-display.md`
- Cards in a list-like layout → `lists.md`
- Card containers and grouping → `sections.md`
- Card elevation and surface treatment → `surfaces.md`
