# Input Category

> Atom focus: Form fields, selectors, toggles, pickers, search bars, filter chips, tag inputs.

> ⚠️ **Decision tree nodes are navigation aids only — not patterns.** Unless a pattern ID appears in the Patterns table below, it does not exist in this directory and CANNOT be recommended. Do not recommend tree node names as patterns.

---

## When This Category Applies

Use input patterns when:
- Collecting data from the user
- Allowing filtering, searching, or selection
- Toggling settings or preferences
- Tagging, categorizing, or multi-selecting items

---

## Patterns in This Category

| Pattern ID | Name | Tags | Confidence |
|------------|------|------|------------|
| *(empty — add via intake)* | | | |

---

## Decision Tree

**Start here: What type of input is this?**

```
Input type?
├── Text entry → Text input patterns
│   ├── Single line → Text field
│   ├── Multi-line → Textarea
│   ├── With prefix/suffix → Adorned text field
│   └── Code/monospace → Code input
│
├── Selection from options → Selector patterns
│   ├── 2–3 options, mutually exclusive → Radio group
│   ├── On/off toggle → Toggle switch
│   ├── Many options → Select dropdown
│   ├── Multi-select from many → Combobox / multi-select
│   └── Visual selection → Segmented control
│
├── Search/filter → Search patterns
│   ├── Simple search → Search bar
│   ├── With filters → Search + filter bar
│   └── Filter chips → Chip filter bar
│
├── Date/time → Picker patterns
│   ├── Single date → Date picker
│   ├── Date range → Date range picker
│   └── Time → Time picker
│
└── Tag/label entry → Tag input
    ├── Free-form tags → Tag input (free)
    └── From predefined list → Tag input (constrained)
```

**Secondary: How is validation surfaced?**
- Inline (real-time) → Validation appears as user types
- On submit → Validation appears after form submission
- On blur → Validation appears when field loses focus

**Tertiary: How many fields appear together?**
- 1–3 fields → Inline form or minimal form
- 4–8 fields → Structured form with sections
- 9+ fields → Multi-step form or tabbed form

---

## Cross-References

- Form layout and grouping → `sections.md` and `layout.md`
- Input feedback (errors, success) → `feedback.md`
- Filter patterns adjacent to list views → `lists.md`
