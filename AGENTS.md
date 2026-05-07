# AGENTS.md — Project Bootstrap

→ [CLAUDE.md](CLAUDE.md) · Identity: [SOUL.md](SOUL.md) · Product: [PRODUCT.md](PRODUCT.md) · Design: `/design-knowledge` skill

**Product**: (Update in PRODUCT.md)
**Config**: `CLAUDE.md` for behavioral instructions · `SOUL.md` for designer identity · `PRODUCT.md` for product context

---

## Prototype Layout

```
src/components/ui/            — shadcn/ui components (57 installed)
src/components/ai-elements/   — AI chat interface components
src/lib/                      — Utilities, personas, annotations
src/hooks/                    — Custom React hooks
modes/                        — Design thinking mode files
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16, React 19, App Router |
| Styling | Tailwind CSS v4, CSS custom properties (oklch) |
| Components | shadcn/ui + Radix UI primitives |
| Icons | Phosphor Icons (@phosphor-icons/react) |
| Forms | react-hook-form + zod |
| Animation | motion (Framer Motion) |
| State | nuqs (URL state), next-themes (dark mode) |
| AI | Vercel AI SDK, streamdown |
| Charts | recharts, @xyflow/react |
| Testing | Playwright (E2E) |

## Conventions

- **Icons**: Phosphor Icons with `*Icon` suffix (`GearIcon`, `SparkleIcon`) and `size` prop
- **Styling**: Design tokens via CSS custom properties in `globals.css`, referenced through Tailwind utilities
- **Components**: shadcn/ui pattern — Radix primitives + CVA variants + tailwind-merge
- **Validation**: Zod schemas for runtime types
- **State**: URL params via nuqs for shareable prototype states

## Dev Server

- **URL**: `http://localhost:3000/` — always use this for browser checks, screenshots, and testing
- **Do NOT start a new dev server** — assume it's already running. Check if it's up before using it.
- If it's not running, tell the user to start it manually.

## Persona Switcher

A draggable floating toolbar for switching between prototype states. Five axes: presets, flags, scenarios (scoped), volume, and annotations.

### Architecture

| File | Purpose |
|------|---------|
| `src/lib/personas.ts` | Presets, flags, scenarios, volumes, scoped scenario parsing |
| `src/lib/annotations.ts` | Annotation types & category config |
| `src/lib/annotation-registry.ts` | Route → annotations lookup |
| `src/lib/sequences.ts` | Sequence player step definitions |
| `src/hooks/use-persona.ts` | `usePersona()` — persona/scenario/volume/sequence state |
| `src/hooks/use-annotations.tsx` | `useAnnotations()` — annotation state + `AnnotationsProvider` context |
| `src/components/persona-switcher.tsx` | Floating toolbar UI (all controls) |
| `src/components/annotation-overlay.tsx` | Annotation pin overlay (portal to body) |
| `src/app/*/page.annotations.ts` | Per-page annotation definitions |

All state is URL-param driven via [nuqs](https://nuqs.dev) — shareable, survives refresh.

### URL params

| Param | Example | Description |
|-------|---------|-------------|
| `persona` | `?persona=new-user` | Preset (new-user / returning) |
| `flags` | `&flags=int:0,dat:1` | Individual flag overrides (short keys) |
| `scenario` | `&scenario=error` | Global scenario |
| `scenario` | `&scenario=error:int,loading:dat` | Scoped scenarios (per-domain) |
| `volume` | `&volume=sparse` | Data density |
| `annotations` | `&annotations=true` | Show design annotation pins |
| `ann-filter` | `&ann-filter=todo` | Filter annotations by category |

### Presets & flags

| Preset | `hasCompletedOnboarding` | `hasData` | `hasIntegrations` | `hasContent` |
|--------|:---:|:---:|:---:|:---:|
| `new-user` | false | false | false | false |
| `returning` (default) | true | true | true | true |

Flags can be toggled individually. When flags diverge from a preset, the toolbar shows "Custom". Short keys for URL: `onb`, `dat`, `int`, `cnt`.

### Scenarios (scoped)

Scenarios can target specific domains or apply globally.

| Scenario | Description |
|----------|-------------|
| `none` (default) | Happy path |
| `error` | API failures, broken states |
| `loading` | Skeleton / spinner states |

Scopes: `*` (global), `onb` (onboarding), `dat` (data), `int` (integrations), `cnt` (content).

Use `getScenario(scope)` to resolve which scenario applies for a given domain (checks specific → falls back to `*` → falls back to `none`).

### Volume

| Key | Description |
|-----|-------------|
| `empty` | Zero items |
| `sparse` | 1-3 items |
| `typical` (default) | Normal usage |
| `heavy` | 100+ items |

### Sequences

Auto-advance through states for stakeholder demos. Built-in: Onboarding Flow, Error Recovery, Data Growth. Defined in `src/lib/sequences.ts`.

### Annotations

Design annotation pins overlay on UI elements via `[data-testid]` selectors. Four categories: Rationale (blue), Edge Case (amber), Motion Spec (violet), Todo (rose).

Each page defines annotations in `page.annotations.ts`. The `AnnotationsProvider` context (in root layout) shares state between the toolbar and overlay — single instance of observers.

### When building any page or component

```tsx
const { flags, getScenario, volume } = usePersona();

// 1. Check scoped scenario first
if (getScenario("dat") === "error") return <DataError />;
if (getScenario("dat") === "loading") return <DataSkeleton />;

// 2. Then persona flags
if (!flags.hasData) return <NoDataState />;

// 3. Then volume
return <DataView />;
```

### Rules for AI agents

1. **Read `src/lib/personas.ts`** before building any page — understand what flags, scenarios, and volumes exist
2. **Always implement both persona states** — every page/component must handle both presets
3. **Always implement scenario states** — every page must handle error and loading (use `getScenario(scope)` for scoped checks)
4. **Use flags, not the persona key** — branch on `flags.hasData`, not `persona === "new-user"`
5. **Check scenario first, then flags, then volume** — scenario overrides persona-specific rendering
6. **New flags/scenarios/volumes** — add to `personas.ts` only; the toolbar and hook pick them up automatically
7. **New annotations** — add a `page.annotations.ts` file alongside the page, register in `annotation-registry.ts`
8. **Empty states for new users** — follow the empty state rules in `/front-end` and `/design-knowledge` skills
9. **Use `data-testid` on key elements** — annotations and testing both depend on these selectors

## Commands

```
npm run dev                  — Start dev server
npm run build                — Production build
npm run lint                 — ESLint check
npm run start                — Start production server
```

## UI Do / Don't

### Navigation & Performance
| Do | Don't |
|----|-------|
| `<Link href>` from `next/link` for all internal links | `<a href>` — causes full page reload, kills perf |
| `usePathname()` where needed | Prop-drill pathname through layout → child |
| shadcn primitives (DropdownMenu, Dialog, Select) | Custom useState+useRef for menus/modals — reinvents a11y |

### Tokens & Theming
| Do | Don't |
|----|-------|
| Semantic tokens: `bg-background`, `text-foreground`, `border-border` | `bg-white`, `text-black`, `#hex`, `bg-gray-*` |
| Status colors via CSS vars: `bg-success`, `bg-warning`, `text-destructive` | Raw Tailwind palette: `bg-emerald-600`, `bg-amber-500`, `text-red-500` |
| `@phosphor-icons/react` with `*Icon` suffix (`GearIcon`, `SparkleIcon`) | `lucide-react`, heroicons, or deprecated non-suffixed (`Gear`, `Sparkle`) |

### Typography & Copy
| Do | Don't |
|----|-------|
| `text-balance` on headings, `text-pretty` on body | Bare text without wrapping utilities |
| `tabular-nums` on numbers, dates, counts | Proportional figures in data-heavy UI |
| Active voice, second person, verb+object labels ("Save Changes", "Add Question") | Vague copy ("Submit", "Enter a name", "Error", "OK") |
| Sample data from `Rules/sample-data.md` | `john@example.com` or made-up names |

### Accessibility & States
| Do | Don't |
|----|-------|
| `aria-label` on every icon-only button | Icon button without accessible name |
| `htmlFor` + `id` on every label/input pair | Disconnected `<label>` without `htmlFor` |
| `focus-visible:ring-2 focus-visible:ring-ring` on custom interactive elements | Missing focus indicator on raw `<button>` or `<div onClick>` |
| `hover:shadow-md transition-shadow` on clickable cards | Flat cards with no hover feedback |
| Empty state with single CTA for every list | List that renders nothing when data is `[]` |

### Layout & Interactions
| Do | Don't |
|----|-------|
| `h-dvh` for full-height layouts | `h-screen` — breaks on mobile with address bar |
| `<textarea rows={1}>` for AI chat input (supports Shift+Enter) | `<input>` for chat — single line only |
| `style={{}}` only for truly dynamic values (animation transforms) | Inline styles for static appearance |

## Context Files

| File | When to load |
|------|-------------|
| CLAUDE.md | Always — behavioral instructions + coding guidelines |
| SOUL.md | Design conversations — designer identity |
| PRODUCT.md | Product decisions — features, positioning, users |
| .claude/skills/front-end/ | UI code review — 53 automated checks |
| .claude/skills/design-knowledge/ | Design implementation — patterns, rules |

## Front-End Task Workflow

For every front-end task:

0. **Memory** — Check `.claude/skills/front-end/memory.yaml` for established patterns (skeleton colors, component conventions, etc.) before implementing. Follow documented decisions. After completing the task, log any new patterns, decisions, or learnings back into `memory.yaml`.
1. **Sample Data** — Use `.claude/skills/front-end/Rules/sample-data.md` for all placeholder/mock data. Never use `john@example.com` or made-up names.
2. **Edge Case Discovery** — Run `.claude/skills/design-knowledge/edge-case-discovery.md` to identify edge cases before considering implementation complete.
3. **QA Checklist** — After implementation, run through `.claude/skills/front-end/Rules/qa-checklist.md` using the `/agent-browser` skill to visually verify tokens, states, accessibility, interactions, and visual QA in the running app before considering the task complete.

---

## Figma-to-Code Workflow

- When given a Figma spec (YAML from Specs plugin), follow the implementation instructions in the spec header exactly.
- Use `get_screenshot` from the Figma MCP server to capture the design. Save to `.figma/` and reference it — don't re-fetch.
- Read the YAML `chunks` for anatomy (structure), layout (flex/grid), and repeats (deduplicated instances).
- Use `resolved_tokens` to map design token names to actual values (hex, font names).
- Match `instance_of` names to your icon library (Phosphor) — check `package.json`.
- For React/Next.js: Build as functional components with Tailwind or CSS modules. Use semantic HTML.
- After building, screenshot your output and compare with the `.figma/*.png` reference. Fix differences.
- Keep implementations minimal — only build what the spec describes.
