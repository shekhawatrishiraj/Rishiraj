# Spacing

## Overview

This project uses Tailwind v4's default spacing scale. Spacing is applied consistently via `p-*`, `m-*`, `gap-*`, and `space-*` utilities. No custom spacing tokens are defined; the framework defaults cover all needs.

## Scale / Tokens

### Tailwind v4 Default Spacing Scale

| Class Value | rem | px | Common Use |
|-------------|-----|-----|------------|
| `0` | `0` | `0` | Reset spacing |
| `px` | `1px` | `1` | Hairline borders/offsets |
| `0.5` | `0.125rem` | `2` | Micro gaps (icon badges) |
| `1` | `0.25rem` | `4` | Tight internal padding |
| `1.5` | `0.375rem` | `6` | Dense UI gaps |
| `2` | `0.5rem` | `8` | Standard small gap |
| `2.5` | `0.625rem` | `10` | Button padding (vertical) |
| `3` | `0.75rem` | `12` | Card internal padding (compact) |
| `3.5` | `0.875rem` | `14` | Medium spacing |
| `4` | `1rem` | `16` | Standard padding/gap |
| `5` | `1.25rem` | `20` | Section internal spacing |
| `6` | `1.5rem` | `24` | Card padding, section gaps |
| `7` | `1.75rem` | `28` | Medium section spacing |
| `8` | `2rem` | `32` | Large section gaps |
| `9` | `2.25rem` | `36` | Between major sections |
| `10` | `2.5rem` | `40` | Page section spacing |
| `11` | `2.75rem` | `44` | Large gaps |
| `12` | `3rem` | `48` | Major section padding |
| `14` | `3.5rem` | `56` | Layout spacing |
| `16` | `4rem` | `64` | Large layout gaps |
| `20` | `5rem` | `80` | Page-level spacing |
| `24` | `6rem` | `96` | Hero sections |
| `28` | `7rem` | `112` | Large hero spacing |
| `32` | `8rem` | `128` | Maximum spacing |
| `36` | `9rem` | `144` | Extended spacing |
| `40` | `10rem` | `160` | Extended spacing |
| `44` | `11rem` | `176` | Extended spacing |
| `48` | `12rem` | `192` | Extended spacing |
| `52` | `13rem` | `208` | Extended spacing |
| `56` | `14rem` | `224` | Extended spacing |
| `60` | `15rem` | `240` | Extended spacing |
| `64` | `16rem` | `256` | Extended spacing |
| `72` | `18rem` | `288` | Extended spacing |
| `80` | `20rem` | `320` | Extended spacing |
| `96` | `24rem` | `384` | Extended spacing |

## Usage Guidelines

### Common Patterns

| Component Type | Padding | Gap |
|---------------|---------|-----|
| Button | `px-3 py-1.5` or `px-4 py-2` | -- |
| Card | `p-4` or `p-6` | `gap-4` |
| Dialog | `p-6` | `gap-4` |
| List items | `px-4 py-2` or `px-3 py-1.5` | -- |
| Form fields | `px-3 py-2` | `gap-2` between label/input |
| Section | `px-6 py-4` or `px-6 py-8` | `gap-6` or `gap-8` |
| Page container | `px-4` to `px-6` | `gap-8` to `gap-10` |
| Sidebar items | `px-3 py-1.5` | `gap-1` |
| Toolbar | `px-4 py-2` or `px-6` | `gap-2` |

### Spacing Rhythm

- **4px** (`1`) -- Tightest: between icon and label in same element
- **8px** (`2`) -- Tight: between related items in a group
- **12-16px** (`3`-`4`) -- Standard: component internal padding
- **24px** (`6`) -- Comfortable: card padding, between sections
- **32-40px** (`8`-`10`) -- Spacious: between major page sections
- **48px+** (`12`+) -- Reserved for page-level layout breathing room

## Do / Don't

- **Do** use consistent spacing within a component (don't mix `gap-2` and `gap-3` for the same purpose)
- **Do** use `gap-*` on flex/grid containers instead of margins on children
- **Do** use the spacing scale values (not arbitrary values like `p-[13px]`)
- **Don't** use margins for layout spacing when `gap` works
- **Don't** use spacing larger than `gap-10` between related content sections
- **Don't** mix spacing philosophies (e.g., padding on some children, margin on others)

## Related

- [radius.md](radius.md) - Border radius scale
- [typography.md](typography.md) - Text spacing context
