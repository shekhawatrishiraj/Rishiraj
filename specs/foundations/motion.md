# Motion

## Overview

Motion is defined across three sources: `src/lib/motion.ts` (JS duration/easing constants), `.claude/skills/front-end/Rules/motion.md` (constraints), and `globals.css` (@keyframes). This spec consolidates all motion specifications.

## Scale / Tokens

### Duration Scale (from `motion.ts`)

| Name | Value | Use |
|------|-------|-----|
| `instant` | `100ms` | Micro-interactions: checkbox, toggle, opacity changes |
| `fast` | `150ms` | State transitions: hover, focus, active states |
| `normal` | `250ms` | Standard transitions: panels opening, content swaps |
| `slow` | `400ms` | Deliberate transitions: page transitions, large reveals |
| `sequence` | `600ms` | Multi-step sequences: staggered list reveals |

### CSS Duration Conventions

| Context | Duration | Easing |
|---------|----------|--------|
| State transitions (hover, focus) | `150ms` | `ease-out` |
| Page transitions | `300ms` | `ease-out` |
| Loading animations | `1000ms` | `linear` |
| Interaction feedback | Max `200ms` | Any |

### Easing Functions (from `motion.ts`)

| Name | Value | Use |
|------|-------|-----|
| `default` | `cubic-bezier(0.4, 0, 0.2, 1)` | General-purpose transitions |
| `enter` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering view (ease-out) |
| `exit` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving view (ease-in) |
| `spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy/playful entrances |

### Stagger Values (from `motion.ts`)

| Name | Value | Use |
|------|-------|-----|
| `item` | `50ms` | Delay between list items in staggered reveal |
| `section` | `100ms` | Delay between sections in staggered reveal |

## Keyframe Animations (from `globals.css`)

| Animation | Keyframe | Purpose | Duration/Timing |
|-----------|----------|---------|-----------------|
| Speech waveform | `speech` | Voice visualization bars with irregular bursts and pauses | Variable, continuous loop |
| Thinking dots | `thinking-dot` | Chat loading indicator, opacity pulse 0.3 -> 1 -> 0.3 | Staggered per dot |
| Tile jiggle | `tile-jiggle` | iOS-style edit mode wobble, +/-0.6deg rotation | Continuous loop |
| Shimmer | `shimmer` | Attention-drawing sweep effect, translateX -100% to 350% | Continuous loop |
| Border rotate | `border-rotate` | Rotating gradient border via `--border-angle` custom property | Continuous loop |
| Fade in | `fade-in` | Entrance: opacity 0 + translateY(4px) to visible | One-shot |
| Pulse subtle | `pulse-subtle` | Attention pulse via box-shadow using primary color, 10 repetitions | `2s ease-in-out`, 10 iterations |

### Utility Classes

| Class | Animation |
|-------|-----------|
| `.animate-pulse-subtle` | `pulse-subtle 2s ease-in-out 10` |
| `.waveform-bar` | Used with `speech` keyframe |
| `.tile-jiggle` | Used with `tile-jiggle` keyframe |

## Constraints

### Animatable Properties

| Allowed | Forbidden |
|---------|-----------|
| `transform` | `width`, `height` |
| `opacity` | `top`, `left`, `right`, `bottom` |
| | `margin`, `padding` |

### Rules

- MUST animate only compositor properties (`transform`, `opacity`)
- MUST honor `prefers-reduced-motion` -- provide reduced variant or disable
- MUST pause looping animations when off-screen
- NEVER use `transition: all` -- list properties explicitly
- NEVER exceed `200ms` for interaction feedback
- NEVER add `@keyframes` without designer approval
- NEVER introduce custom `cubic-bezier` without approval
- SHOULD use `ease-out` on entrance animations
- SHOULD avoid animating large images or full-screen elements
- Set `transform-origin` explicitly for transform animations

### SVG Animation Rules

- Apply transforms on `<g>` wrapper, not individual elements
- Use `transform-box: fill-box` for proper origin
- Use `transform-origin: center` unless specific origin needed

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .waveform-bar { animation: none !important; transform: scaleY(0.6) !important; }
  .tile-jiggle { animation: none !important; }
  .animate-pulse-subtle { animation: none !important; }
}
```

All looping animations must have reduced-motion equivalents. One-shot transitions (fade-in) can optionally be preserved with reduced displacement.

## Do / Don't

- **Do** use `MOTION.duration` and `MOTION.easing` constants from `motion.ts`
- **Do** list transition properties explicitly: `transition-[opacity,transform]`
- **Do** provide reduced-motion fallbacks for all looping animations
- **Don't** use `transition: all` or `transition-all`
- **Don't** animate layout properties (`width`, `height`, `margin`, `padding`)
- **Don't** create new `@keyframes` without designer approval
- **Don't** use custom easing curves outside of the defined set

## Related

- [elevation.md](elevation.md) - Shadow transitions on hover
- [z-index.md](z-index.md) - Animated overlays need correct z-index
