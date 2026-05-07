---
name: ui-patterns
description: UI pattern decision tool for choosing atomic UI elements before implementation. Use when choosing a pattern, comparing approaches, asking "what pattern for X", exploring card patterns, section layouts, data display blocks, list items, or surface treatments. AI is a librarian — searches, compares, and recommends from the curated directory. Never invents.
---

# UI Patterns Skill

> **You are a librarian, not an architect. Search, compare, recommend from the directory. NEVER invent patterns.**

---

## What This Skill Is

A curated decision engine for **atomic UI elements** — the building blocks that compose into UIs:
- Cards (stat, info, action, media, profile)
- Data display blocks (key-value, metric rows, status indicators)
- Sections (content sections, collapsible groups, divider patterns)
- List items (1-line, 2-line, 3-line, with actions, thumbnails)
- Surface treatments (elevated cards, bordered groups, inset panels, wells)
- Headers (page, section, card, toolbar)
- Layout primitives (split views, stacked layouts, grids)
- Input elements (form fields, selectors, search bars, filter chips)
- Feedback elements (toasts, alerts, skeletons, empty states)

**This is NOT**: a component pattern library, an implementation guide, or a spec document. It is: which pattern to choose **before** implementation begins.

---

## Loading Protocol

1. **Always load**: [core.md](core.md) + scan [index.yaml](index.yaml)
2. **Detect keywords** → load matching category module
3. **Search index** for candidate patterns (keyword match on tags)
4. **Open 1–5 matching pattern files** from `patterns/`
5. **Present top 3 candidates** with comparison table

---

## Keyword → Category Map

| Keywords | Category Module |
|----------|----------------|
| card, stat card, info card, feature card, pricing, profile card | [categories/cards.md](categories/cards.md) |
| key-value, metric, kpi, badge, status indicator, data block, label | [categories/data-display.md](categories/data-display.md) |
| list, list item, row, two-line, thumbnail, avatar row | [categories/lists.md](categories/lists.md) |
| section, group, collapsible, panel, divider, content block | [categories/sections.md](categories/sections.md) |
| surface, elevated, bordered, inset, well, callout, container treatment | [categories/surfaces.md](categories/surfaces.md) |
| header, page header, section header, toolbar, breadcrumb, title bar | [categories/headers.md](categories/headers.md) |
| layout, split view, stack, grid, sidebar, container, column | [categories/layout.md](categories/layout.md) |
| input, field, form, selector, toggle, search, filter, chip, tag | [categories/input.md](categories/input.md) |
| toast, alert, skeleton, empty state, error block, progress, banner | [categories/feedback.md](categories/feedback.md) |

---

## Modes

### 1. Search Mode
Triggered when: "what pattern for X", "looking for X pattern", "how to display X"

Protocol:
1. If `total_patterns: 0` in `index.yaml` → skip scan, go directly to empty-state response
2. Scan `index.yaml` tags for keyword matches
3. Load top 3–5 matching pattern files
4. Present comparison table (see Decision Framework below) — **table first, one sentence of framing before, one constraint question after. No prose between rows. No closing summary.**
5. If 0 matches → say: "No matching patterns in the directory yet. Would you like to add one via intake?" — nothing else
6. If 1 partial match → present it, name the gap explicitly, do not fill the gap
7. After user decides: ask "Did you go with this, or none? I'll log the choice." → update `memory.yaml` usage_log or rejections accordingly

### 2. Compare Mode
Triggered when: "difference between X and Y", "A vs B", "which is better"

Protocol:
1. If either pattern is not in the directory → say: "[Pattern X] isn't in the directory yet. I can only compare confirmed patterns. Want to intake it first?" Do not describe or approximate missing patterns.
2. Load both pattern files
3. Side-by-side trade-offs table — same format as Search Mode (table first, constraint question after, no closing prose)
4. After user decides: ask "Which did you go with, or did you reject both? I'll log it." → update `memory.yaml`

### 3. Intake Mode
Triggered when: "add this pattern", "I want to save this", "here's a screenshot", "intake"

Protocol:
1. Accept input: screenshot / Figma link / text description
2. If source is ambiguous or incomplete, ask these questions before filling the template:
   - "What's the primary job of this element — display info, drive action, or group content?"
   - "How many of these appear at once — 1, a few, or many?"
   - "Is it interactive (clickable/editable) or read-only?"
3. Extract structured data using [templates/pattern.md](templates/pattern.md)
4. Present filled template for confirmation — show the full template, not a summary
5. On confirmation:
   - Write to `patterns/<id>.md`
   - Add entry to `index.yaml` (increment `total_patterns`)
   - Update relevant `categories/*.md` patterns table row
   - Log to `memory.yaml` intake_log

---

## Worked Example — Search Mode

> Query: "what pattern for showing API key values on a settings page?"

**Step 1** — Scan index.yaml for: api, key, value, settings, credential → 0 matches.

**Response:**
> No matching patterns in the directory yet. Would you like to add one via intake?

---

> Query (after 10 patterns added): "what pattern for displaying a user's connection status?"

**Step 1** — Scan index: tags match `status`, `indicator`, `badge` → 2 matches: `status-badge-inline`, `status-dot-row`.

**Step 2** — Load both files. Present:

| Pattern | Best When | Costs You | Confidence |
|---------|-----------|-----------|------------|
| status-badge-inline | Status is secondary info alongside a name or label | Takes horizontal space | high |
| status-dot-row | Status is the primary thing being communicated per row | Less descriptive — color-only | medium |

What's the primary constraint — does the user need to scan status across many rows quickly, or is status one detail among several?

---

## Anti-Invention Protocol

**Strict rules — no exceptions:**

1. **0 matches** → Say: "No matching patterns in the directory yet. Would you like to add one via intake?"
2. **Partial match** → Present what exists, name the gap. Do not synthesize a hybrid.
3. **General best practices** → Never. Only patterns explicitly in the directory.
4. **"Based on common UI patterns"** → Banned phrase. If it's not in the directory, it doesn't exist here.
5. **Confidence weighting** → In the comparison table, append `(confidence: low — treat as tentative)` after the pattern name for any pattern with `confidence: low` in its file.

---

## Decision Framework

When presenting candidates, always use this comparison format:

```
| Pattern       | Best When                    | Costs You          | Confidence |
|---------------|------------------------------|--------------------|------------|
| Pattern A     | [specific context]           | [trade-off]        | high/med   |
| Pattern B     | [specific context]           | [trade-off]        | high/med   |
| Pattern C     | [specific context]           | [trade-off]        | low        |
```

Always end with: **"What's the primary constraint driving this decision?"**

---

## Cross-References

| Need | Skill |
|------|-------|
| Design philosophy behind patterns | `/design-knowledge` |
| Implementation code for a pattern | `/front-end` |
| Component specs for this codebase | `specs/components/` |
| Implementation specs | `specs/patterns/` |

This skill is **independent** of `specs/` — no cross-referencing to implementation specs.

---

## Relationship to specs/

- `specs/patterns/` = implementation specs for patterns already chosen
- `specs/components/` = component-level implementation docs
- `ui-patterns` skill = **which pattern to pick, before any implementation**

They operate at different phases. Do not conflate.
