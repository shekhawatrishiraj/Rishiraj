# Typography

## Overview

The project uses Google Sans as the primary font family, loaded via Google Fonts. The type scale extends Tailwind's defaults with two additional small sizes (`text-2xs` and `text-xs-plus`). All typography follows strict rules for text wrapping, number formatting, and content overflow.

## Scale / Tokens

### Font Family

| Token | Value | Tailwind Class |
|-------|-------|---------------|
| `--font-sans` | `"Google Sans", var(--font-geist-sans)` | `font-sans` |
| `--font-mono` | `var(--font-geist-mono)` | `font-mono` |

### Size Scale

| Tailwind Class | Size | Line Height | Use |
|---------------|------|-------------|-----|
| `text-2xs` | `0.625rem` (10px) | `1.4` | Micro labels, badges, timestamps |
| `text-xs-plus` | `0.6875rem` (11px) | `~1.45` (`calc(1 / 0.6875)`) | Dense metadata, compact UI |
| `text-xs` | `0.75rem` (12px) | `1rem` (Tailwind default) | Captions, descriptions, helper text |
| `text-sm` | `0.875rem` (14px) | `1.25rem` (Tailwind default) | Titles, tabs, body text in dense UI |
| `text-base` | `1rem` (16px) | `1.5rem` (Tailwind default) | Small headings, standard body |
| `text-lg` | `1.125rem` (18px) | `1.75rem` (Tailwind default) | Emphasized body text |
| `text-xl` | `1.25rem` (20px) | `1.75rem` (Tailwind default) | Large headings |
| `text-2xl` | `1.5rem` (24px) | `2rem` (Tailwind default) | Page titles, hero text |

### Font Weights

| Weight | Tailwind Class | Use |
|--------|---------------|-----|
| 400 | `font-normal` | Body text, descriptions |
| 500 | `font-medium` | Labels, titles, emphasis |
| 600 | `font-semibold` | Section headings, strong emphasis |
| 700 | `font-bold` | Page headings, hero text |

### Component Font Size Mapping

| Context | Size | Tailwind |
|---------|------|----------|
| Caption / description | 12px | `text-xs` |
| Title | 14px | `text-sm` |
| Tabs | 14px | `text-sm` |
| Heading (small) | 16px | `text-base` |
| Heading (large) | 20px | `text-xl` |

## Usage Guidelines

### Text Wrapping

| Context | Class | Purpose |
|---------|-------|---------|
| Headings | `text-balance` | Prevents orphans/widows |
| Body / paragraphs | `text-pretty` | Better line breaks |
| Data / numbers | `tabular-nums` | Aligned columns in tables |
| Dense UI | `truncate` or `line-clamp-{n}` | Prevents overflow |
| Labels | Keep concise | Avoid truncation when possible |

### Line Height for Descriptions

When `text-xs` is used for multi-line description or body text (not single-line labels), always add `leading-normal` to set line-height to 1.5 (18px). The Tailwind default for `text-xs` is `1rem` (16px, ratio 1.33), which is too tight for readable body copy.

| Context | Class | Line Height |
|---------|-------|-------------|
| Single-line labels, badges | `text-xs` (default) | `1rem` (1.33 ratio) |
| Multi-line descriptions, helper text | `text-xs leading-normal` | `1.125rem` (1.5 ratio) |

### Content Overflow

| Rule | Detail |
|------|--------|
| Text containers | Handle long content via `truncate`, `line-clamp-*`, or `break-words` |
| Flex children | Need `min-w-0` to allow truncation |
| User content | Anticipate short, average, and very long inputs |

### Character Rules

| Use | Not |
|-----|-----|
| `...` (ellipsis character) | `...` (three dots) |
| `"` `"` (curly quotes) | `"` (straight quotes) |
| `&nbsp;` (non-breaking space) | Regular space in: `10 MB`, `Cmd K`, brand names |

### Loading Text

Loading states end with ellipsis: `"Loading..."`, `"Saving..."`, `"Processing..."`

## Do / Don't

- **Do** use `text-balance` on every heading
- **Do** use `tabular-nums` in any data table or numeric display
- **Do** use `font-medium` for labels and titles, `font-normal` for body
- **Do** use `leading-normal` on multi-line `text-xs` descriptions (1.5 ratio, not default 1.33)
- **Don't** modify `letter-spacing` (no `tracking-*` classes)
- **Don't** use `text-2xs` for anything a user needs to read at length
- **Don't** skip `min-w-0` on flex children that need truncation

## Violations (Auto-Fail)

- `tracking-*` or `letter-spacing:` -- no letter-spacing modification
- `"..."` (three dots) -- use single ellipsis character

## Related

- [color.md](color.md) - Text color tokens
- [spacing.md](spacing.md) - Text container spacing
- [iconography.md](iconography.md) - Icon + text alignment
