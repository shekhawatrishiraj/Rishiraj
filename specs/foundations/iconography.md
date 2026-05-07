# Iconography

## Overview

The project is migrating from Lucide React to Phosphor Icons as the primary icon library. New code should use Phosphor exclusively. Lucide usage exists in legacy components and should be migrated when those components are modified.

## Libraries

| Library | Package | Status | Use |
|---------|---------|--------|-----|
| Phosphor Icons | `@phosphor-icons/react` | **Primary** | All new icon usage |
| Lucide React | `lucide-react` | **Legacy** | Existing components only; migrate on touch |

## Scale / Tokens

### Size Scale

#### By Typography Context

| Context | Phosphor `size` | Tailwind Class | Pixel Size |
|---------|-----------------|---------------|------------|
| Caption | `size={16}` | `size-4` | 16px |
| Title | `size={20}` | `size-5` | 20px |
| Heading | `size={24}` | `size-6` | 24px |

#### By UI Context

| Context | Phosphor `size` | Example |
|---------|-----------------|---------|
| Inline metadata | `size={12}` | Timestamps, badges |
| Buttons / inputs | `size={16}` | Button icons, form fields |
| Standalone | `size={20}` | List item icons, nav items |
| Large UI | `size={24}` | Empty states, feature cards |
| Hero | `size={32}` to `size={48}` | Onboarding, marketing |

### Weight / Style

| Weight | Use |
|--------|-----|
| `regular` | Default weight for all icons |
| `bold` | Emphasis, thicker stroke |
| `fill` | Active/selected states, status indicators |
| `light` | Decorative, low-emphasis contexts |
| `thin` | Minimal, subtle decorative use |
| `duotone` | Two-tone decorative icons |

### Color

Icons inherit `currentColor` by default. Control via Tailwind text color utilities:

| Context | Class |
|---------|-------|
| Primary text | `text-foreground` |
| Secondary text | `text-muted-foreground` |
| Interactive | `text-primary` |
| Destructive | `text-destructive` |
| Success | `text-success` |

## Usage Guidelines

### Phosphor Import Pattern

```tsx
import { Bell, User, House } from "@phosphor-icons/react";

<Bell size={16} weight="regular" />
<Bell size={16} weight="fill" />  // active state
```

### Icon + Text Alignment

- Icons and text in the same row should use `flex items-center gap-*`
- Standard gap between icon and text: `gap-1.5` (6px) for small UI, `gap-2` (8px) for standard
- Icons should vertically center with the text line they accompany

### Naming Convention

Icons use PascalCase. Multi-word names concatenate without separator:
- `arrow-left` -> `ArrowLeft`
- `user-circle` -> `UserCircle`

### Lucide to Phosphor Migration

When modifying a component that uses Lucide, migrate its icons:

| Lucide | Phosphor |
|--------|----------|
| `Home` | `House` |
| `Settings` | `Gear` |
| `Trash2` | `TrashSimple` |
| `ChevronDown` | `CaretDown` |
| `ChevronRight` | `CaretRight` |
| `MoreHorizontal` | `DotsThreeVertical` (see rule below) |
| `MoreVertical` | `DotsThreeVertical` |
| `Search` | `MagnifyingGlass` |
| `Edit` | `PencilSimple` |
| `Mail` | `Envelope` |
| `AlertCircle` | `WarningCircle` |
| `EyeOff` | `EyeSlash` |
| `Loader2` | `CircleNotch` (with `className="animate-spin"`) |

API differences:
- Lucide `strokeWidth={2}` -> Phosphor `weight="regular"` (or `"bold"`)
- Lucide `fill="currentColor"` -> Phosphor `weight="fill"`

## Accessibility

- Icon-only buttons MUST have `aria-label`
- Icon-only buttons MUST have a tooltip (300ms delay)
- Decorative icons inside labeled buttons need no extra aria attributes

## Do / Don't

- **Do** use Phosphor Icons for all new components
- **Do** use `weight="fill"` to indicate active/selected state
- **Do** set explicit `size` prop matching the context scale
- **Do** migrate Lucide icons when modifying existing components
- **Don't** import from `lucide-react` in new code
- **Don't** use custom `strokeWidth` -- use Phosphor `weight` variants instead
- **Don't** use icon-only buttons without `aria-label` and tooltip
- **Don't** mix Lucide and Phosphor icons in the same component
- **Don't** use `DotsThreeIcon` (horizontal ⋯) — always use `DotsThreeVerticalIcon` (vertical ⋮). Enforced by ESLint rule `design-system/no-dots-three-horizontal`

## File Type Icons

File type icons are SVG images located in `public/files-icons/`. Use `<Image>` from `next/image` at 24×24px.

| Extension | Icon Path |
|-----------|-----------|
| `.pdf` | `Property 1=016-pdf.svg` |
| `.doc` | `Property 1=005-doc.svg` |
| `.docx` | `Property 1=030-word.svg` |
| `.csv` | `Property 1=006-excel.svg` |
| `.xls` / `.xlsx` | `Property 1=031-xls.svg` |
| `.ppt` | `Property 1=019-ppt.svg` |
| `.pptx` | `Property 1=018-powerpoint.svg` |
| `.json` | `Property 1=009-javascript.svg` |
| `.js` | `Property 1=011-js file.svg` |
| `.txt` | `Property 1=026-txt.svg` |
| `.svg` | `Property 1=023-svg.svg` |
| `.zip` | `Property 1=032-zip.svg` |
| `.mp3` | `Property 1=013-mp3.svg` |
| `.mp4` | `Property 1=014-video.svg` |
| `.png` / `.jpg` | `Property 1=010-image.svg` |
| `.css` | `Property 1=003-css.svg` |
| `.sql` | `Property 1=022-sql.svg` |
| `.php` | `Property 1=017-php.svg` |
| `.psd` | `Property 1=020-psd.svg` |
| fallback | `Property 1=024-text.svg` |

### Usage

```tsx
import Image from "next/image";

<Image
  src="/files-icons/Property 1=016-pdf.svg"
  alt=""
  width={24}
  height={24}
/>
```

### Guidelines

- Use 24×24px for file list rows
- Use 32×32px for larger card contexts
- Do NOT use Phosphor file icons (`FilePdf`, `FileDoc`, etc.) — use these SVGs instead
- Map file extensions dynamically via a helper (see `hld-connect-apps.tsx` `getFileIconPath`)

## Related

- [typography.md](typography.md) - Icon sizes align with type scale
- [color.md](color.md) - Icon colors via text color tokens
- [spacing.md](spacing.md) - Icon-to-text gap patterns
