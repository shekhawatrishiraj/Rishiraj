# Design Prototype

High-fidelity prototyping environment. Next.js 16, React 19, Tailwind CSS 4, shadcn/ui.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's Included

- **57 shadcn/ui components** — pre-installed, ready to use
- **48 AI chat components** — conversation, code blocks, tools, etc.
- **Persona switcher** — toggle user states, scenarios, volume for prototype review
- **Annotation overlay** — pin design notes to UI elements
- **Design tokens** — oklch-based semantic color system with dark mode
- **Phosphor Icons** — full icon library
- **Playwright** — E2E testing setup

## Persona Switcher

Floating toolbar for switching prototype states. URL-driven via nuqs.

- `?persona=new-user` — first-time user state
- `?scenario=error` — error states
- `?scenario=loading` — skeleton states
- `?volume=heavy` — stress test with 100+ items
- `?annotations=true` — show design annotation pins

## Claude Code

This project includes a full `.claude/` setup with:
- 10 slash commands for design thinking (explore, diverge, decide, handoff, blade, 5d, prd, persona, reply, rewrite)
- 6 skill libraries (front-end review, design knowledge, browser automation, React/Remotion best practices, AI elements)
- 4 design thinking modes (exploration, divergence, decision, handoff)
