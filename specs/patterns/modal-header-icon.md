# Modal Header with Icon Pattern

**Rule: When a dialog represents an entity with an icon/avatar, name, and description — always use this header pattern. Do NOT use `<DialogHeader>` with `<DialogTitle>` / `<DialogDescription>` as visible elements.**

---

## When to Use

Use this pattern when a modal/dialog header contains:
- An icon or avatar (app icon, expert avatar, user photo, etc.)
- A primary name/title
- A supporting description line
- Optional action buttons (connect, disconnect, etc.)
- A close button

---

## Canonical Implementation

Source: `src/app/twin-settings/apps/variations/app-detail-dialog.tsx`
Also used: `src/app/experts/page.tsx` (Suggested Expert preview dialog)

```tsx
<DialogContent className="sm:max-w-md gap-0 p-0 flex flex-col max-h-[80vh]" showCloseButton={false}>
  {/* Accessibility: sr-only title/description for screen readers */}
  <DialogTitle className="sr-only">{entity.name}</DialogTitle>
  <DialogDescription className="sr-only">{entity.description}</DialogDescription>

  {/* Header */}
  <div className="flex items-start gap-3.5 px-6 pt-5 pb-4">
    {/* Icon / Avatar — size-10 (40px) */}
    <div className="flex size-10 shrink-0 items-center justify-center ...">
      {/* image, initials, or icon */}
    </div>

    {/* Name + description */}
    <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5">
      <h2 className="text-base font-semibold leading-tight text-balance text-foreground">
        {entity.name}
      </h2>
      <p className="text-xs leading-normal text-pretty text-muted-foreground">
        {entity.description}
      </p>
    </div>

    {/* Actions (optional) + Close */}
    <div className="flex shrink-0 items-center gap-1.5">
      {/* e.g. <Button size="sm">Connect</Button> */}
      <DialogClose asChild>
        <Button variant="ghost" size="icon-sm">
          <XIcon size={16} />
          <span className="sr-only">Close</span>
        </Button>
      </DialogClose>
    </div>
  </div>

  {/* Body content — scrollable, flex-1 to fill remaining height */}
  <div className="flex flex-col gap-4 px-6 pb-2 overflow-y-auto flex-1">
    {/* ... */}
  </div>

  {/* Footer */}
  <DialogFooter className="px-6 pb-5 pt-2">
    {/* ... */}
  </DialogFooter>
</DialogContent>
```

---

## Token Reference

| Element | Class |
|---------|-------|
| Header container | `flex items-start gap-3.5 px-6 pt-5 pb-4` |
| Icon/avatar | `size-10 shrink-0` |
| Name column | `flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5` |
| Name text | `text-base font-semibold leading-tight text-balance text-foreground` |
| Description text | `text-xs leading-normal text-pretty text-muted-foreground` |
| Actions column | `flex shrink-0 items-center gap-1.5` |
| Close button | `variant="ghost" size="icon-sm"` |
| Body padding | `px-6` (matches header for visual alignment) |
| Footer padding | `px-6 pb-5 pt-2` |

---

## Key Rules

- `showCloseButton={false}` on `DialogContent` — the custom close button inside the header replaces the default
- `DialogTitle` and `DialogDescription` stay as `sr-only` for accessibility — the visible heading is a plain `<h2>`
- `gap-0 p-0` on `DialogContent` — header controls its own padding
- Icon is always `size-10` (40px)
- `pt-0.5` on the name column — optically aligns text baseline with icon top
- **`max-h-[80vh] flex flex-col` on `DialogContent`** — caps modal at 80% of viewport height
- **`overflow-y-auto flex-1` on the body div** — body scrolls, header and footer stay pinned

---

## Anti-Patterns

| Don't | Why |
|-------|-----|
| Use `<DialogHeader>` with visible `<DialogTitle>` | Creates inconsistent padding and loses the icon-aligned layout |
| Make icon `size-8` or `size-12` | `size-10` is the standard for this pattern |
| Put description in `<DialogDescription>` as visible text | Results in incorrect color and spacing |
| Forget `sr-only` title | Breaks screen reader accessibility |
