# Layout: Sidebar

## Overview
The sidebar layout provides a collapsible navigation panel alongside main content. Built on shadcn/ui's sidebar primitive, it handles desktop/mobile rendering, keyboard shortcuts, and persistent state via cookies.

## Structure
```tsx
<SidebarProvider>
  <Sidebar>
    <SidebarHeader />
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Section</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Item</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter />
  </Sidebar>
  <SidebarInset>
    {/* Main content */}
  </SidebarInset>
</SidebarProvider>
```

## Key Constants
| Constant | Value | Purpose |
|----------|-------|---------|
| `SIDEBAR_WIDTH` | `16rem` (256px) | Desktop expanded width |
| `SIDEBAR_WIDTH_MOBILE` | `18rem` (288px) | Mobile sheet width |
| `SIDEBAR_WIDTH_ICON` | `3rem` (48px) | Collapsed icon-only width |
| `SIDEBAR_KEYBOARD_SHORTCUT` | `"b"` | Cmd/Ctrl+B to toggle |
| `SIDEBAR_COOKIE_NAME` | `"sidebar_state"` | Persists open/closed state |

## Key Classes

### SidebarProvider (Root)
```
group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full
```
Sets CSS custom properties `--sidebar-width` and `--sidebar-width-icon`.

### Sidebar Container
```
fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width)
transition-[left,right,width] duration-200 ease-linear md:flex
```

### SidebarInset (Main Content)
```
bg-background relative flex w-full flex-1 flex-col
```
With inset variant peer styles for margin and rounded corners.

### SidebarMenuButton
Sizes: `default` (h-8), `sm` (h-7), `lg` (h-12)
Variants: `default`, `outline`
```
flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm
hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium
group-data-[collapsible=icon]:size-8!
```

## Sidebar Variants
| Variant | Behavior |
|---------|----------|
| `sidebar` | Fixed panel with border separator |
| `floating` | Fixed panel with padding, rounded corners, border, shadow |
| `inset` | Fixed panel with padding, main content gets rounded corners |

## Collapsible Modes
| Mode | Behavior |
|------|----------|
| `offcanvas` | Sidebar slides completely off-screen (width becomes 0) |
| `icon` | Sidebar collapses to icon-only width (3rem) |
| `none` | Sidebar is always visible, not collapsible |

## Mobile Behavior
On mobile (`useIsMobile`), the sidebar renders inside a `Sheet` component that slides in from the side. The `SidebarTrigger` button toggles the mobile sheet.

## Data Attributes
| Attribute | Used On | Values |
|-----------|---------|--------|
| `data-state` | sidebar root | `expanded`, `collapsed` |
| `data-collapsible` | sidebar root | `offcanvas`, `icon`, `""` |
| `data-variant` | sidebar root | `sidebar`, `floating`, `inset` |
| `data-side` | sidebar root | `left`, `right` |
| `data-active` | menu button | `true`, `false` |
| `data-sidebar` | all sub-components | component name for styling hooks |

## Responsive Behavior
- Mobile (< md): Sidebar hidden, accessible via Sheet overlay
- Desktop (>= md): Sidebar visible, collapsible via keyboard shortcut or rail

## GlobalSidenav Nav Items

The "My Twin" nav item links to `/twin-settings/train` (the main twin dashboard). Active state is `pathname.startsWith("/twin-settings")`. The homepage (`/`) is a separate prompt-only landing — not the My Twin destination.

Main nav items (in order): My Twin, People, Experts, Agents, Meetings, Library (`BooksIcon`, `/files-library`).

## GlobalSidenav Footer Dropdown

The user avatar at the bottom of the sidebar opens a dropdown menu with:
- View Twins
- Audit Logs
- Sign Out

## Do / Don't

**Do:**
- Always wrap `Sidebar` and `SidebarInset` inside `SidebarProvider`
- Use `SidebarMenuButton` with `tooltip` prop for collapsed state labels
- Use `GlobalSidenav` component (the app's sidebar implementation) rather than building from scratch

**Don't:**
- Don't set sidebar width with custom classes -- use the CSS custom properties
- Don't render content outside of `SidebarInset` that should be affected by sidebar state
- Don't use `SidebarMenuButton` outside of `SidebarMenu > SidebarMenuItem`

## Examples in Codebase
- `src/components/ui/sidebar.tsx` - Primitive components
- `src/components/global-sidenav.tsx` - App-level sidebar implementation
- `src/app/feed/feed-page.tsx` - Standard usage pattern
- `src/app/meetings/page.tsx` - Standard usage pattern
