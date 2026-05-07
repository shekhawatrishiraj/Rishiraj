# Layout: Content Container

## Overview
Centers page content with a maximum width and horizontal padding. This is the primary content-width constraint used across most pages in the app.

## Structure
```tsx
import { ContentContainer } from "@/components/content-container";

<ContentContainer className="flex flex-col gap-6 py-4">
  {children}
</ContentContainer>
```

## Implementation
```tsx
// src/components/content-container.tsx
function ContentContainer({ className, children, ...props }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1200px] px-4", className)} {...props}>
      {children}
    </div>
  );
}
```

## Key Classes
| Class | Purpose |
|-------|---------|
| `mx-auto` | Center horizontally |
| `w-full` | Fill available width |
| `max-w-[1200px]` | Cap at 1200px (75rem) |
| `px-4` | 16px horizontal padding |

## Common Width Values Across Codebase

| Pattern | Width | Where Used |
|---------|-------|------------|
| `ContentContainer` | `max-w-[1200px]` (1200px) | Most pages (feed, meetings, settings) |
| Feed column | `max-w-2xl` (672px / 42rem) | Feed component, feed skeleton |
| New-tab prompt | `max-w-[800px]` | New tab page prompt area |
| New-tab grid | `max-w-[1440px]` | New tab widget grid |
| Dialog | `sm:max-w-lg` (default), `sm:max-w-md`, `sm:max-w-sm` | Various dialogs |
| Message bubble | `max-w-[95%]` | AI message component |

## Responsive Behavior
- Below 1200px: content fills full width with 16px side padding
- At 1200px+: content is centered with auto margins
- No breakpoint-based width changes -- single max-width approach

## Do / Don't

**Do:**
- Wrap page content in `ContentContainer` inside `SidebarInset`
- Pass additional classes via `className` prop (e.g., `py-4`, `gap-6`)
- Use for settings pages, list pages, and form pages

**Don't:**
- Don't use for full-bleed layouts (meeting detail page skips ContentContainer)
- Don't override `max-w-[1200px]` -- use a different container if you need a different width
- Don't add `px-*` in className -- `px-4` is already applied
- Don't nest ContentContainer inside another ContentContainer

## Standard Page Layout Pattern
```tsx
<SidebarProvider>
  <GlobalSidenav />
  <SidebarInset>
    <ContentContainer className="flex flex-col gap-6 py-4">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold leading-7 text-foreground">Title</h1>
        <p className="text-xs leading-5 text-muted-foreground">Description</p>
      </div>
      {/* Page content */}
    </ContentContainer>
  </SidebarInset>
</SidebarProvider>
```

## Examples in Codebase
- `src/app/feed/feed-page.tsx`
- `src/app/meetings/page.tsx`
- `src/app/twin-settings/data-sources/page.tsx` (via layout)
- `src/components/content-container.tsx` (source)
