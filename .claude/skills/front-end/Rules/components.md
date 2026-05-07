---
title: Component Rules
impact: HIGH
impactDescription: shadcn/ui wrapping and primitives
tags: rules, components, shadcn, primitive, wrapper
---

# Component Rules

> Load when: `component`, `shadcn`, `primitive`, `wrapper`, `ui`

---

## shadcn/ui

- Wrap, don't modify source
- Token overrides in `globals.css`
- Prop extensions via wrapper components

### Pre-Build Audit (MANDATORY)

Before building ANY interactive element, check if a shadcn component exists:

```bash
ls src/components/ui/
```

| Need | Use shadcn | NOT custom |
|------|-----------|------------|
| Dropdown/menu | `DropdownMenu` | Custom `<div>` with click-outside handler |
| Popover | `Popover` | Custom positioned `<div>` |
| Dialog/modal | `Dialog` / `AlertDialog` | Custom overlay |
| Tooltip | `Tooltip` | Custom hover `<div>` |
| Tabs | `Tabs` | Custom tab state |
| Select | `Select` | Custom `<button>` + list |

**If a shadcn primitive doesn't exist yet, install it**: `npx shadcn@latest add <component>`

### Custom `<button>` Trap

NEVER use a raw `<button>` when shadcn `<Button>` works. Raw buttons lose:
- Built-in hover/focus/active/disabled states
- Consistent radius from design system
- Dark mode theming
- Size variants and consistent padding

If you MUST use a raw `<button>` (e.g., split-button pattern), you are responsible for manually implementing ALL 8 states from `Rules/states.md`.

---

## Primitives

| Rule | Rationale |
|------|-----------|
| MUST use project's existing primitives first | Consistency; avoid reinventing |
| MUST audit `src/components/ui/` before building custom | Avoid duplicating existing components |
| NEVER mix primitive systems within the same component | A single component file uses one primitive system |
| NEVER build custom dropdown/popover/dialog | Install shadcn equivalent instead |

---

## Allowed

- CSS variables
- shadcn classes
- Tailwind utilities
- Global/shared CSS only

---

## Forbidden

- Inline styles
- Component CSS files
- Hardcoded values
- `!important`
- Source modifications

---

## GlobalPromptBox Variants

> Use `GlobalPromptBox` (`@/components/global-prompt-box`) for ALL prompt/chat inputs. Never build a custom prompt input.

| Variant | Use Case | Avatar | Footer | Sleeves |
|---------|----------|--------|--------|---------|
| `full` | Homepage, main chat | Yes (size-8) | Upload, Tools, Customize, model selector, voice, submit | No |
| `minimal` | Meeting chat, contextual panels | Yes (size-7) | No — inline submit | Optional via `suggestions` prop |
| `compact` | Chat thread continuation, embedded | No | No — inline submit | No |

### Key Implementation Rules

- **InputGroup `h-auto`**: Always override InputGroup's default `h-9` via `[&_[data-slot=input-group]]:h-auto` — PromptInputBody wraps textarea in a flex div, breaking the `has-[>textarea]:h-auto` selector
- **Single focus ring**: Suppress InputGroup's built-in focus ring with `[&_[data-slot=input-group]]:ring-0!` and use `focus-within:ring-2` on the outer wrapper only
- **Textarea sizing**: Use `min-h-[1lh]` with `field-sizing-content` (base class) — never override `field-sizing` with inline styles or `rows`
- **Sleeves variant**: Outer wrapper gets `rounded-2xl overflow-hidden border` when sleeves are present; PromptInput gets `border-0 rounded-none`
- **Avatar sizes**: `size-8` for full, `size-7` for minimal — must not touch the border edge

---

## Theming (Dark/Light Mode)

> **ALL shadcn components must work in both dark and light mode.**

### Component Colors

| Use shadcn semantic | Not hardcoded |
|---------------------|---------------|
| `bg-background` | `bg-white` / `bg-black` |
| `bg-card` | `bg-white` |
| `bg-muted` | `bg-gray-100` |
| `text-foreground` | `text-black` / `text-white` |
| `text-muted-foreground` | `text-gray-500` |
| `border-border` | `border-gray-200` |

### Custom Components

When building custom components:
1. Use shadcn semantic color classes
2. Define custom colors as CSS variables with dark/light variants
3. Test in both modes before shipping

### Wrapper Pattern

```tsx
// Good: Uses shadcn theming
<Card className="bg-card text-card-foreground">

// Bad: Breaks in dark mode
<Card className="bg-white text-black">
```
