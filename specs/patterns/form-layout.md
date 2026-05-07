# Form Layout

## Overview
Structured form field layout using the Field component system. Provides consistent spacing, label placement, error display, and orientation control for form fields.

## Structure
```tsx
import {
  Field, FieldLabel, FieldDescription, FieldError,
  FieldGroup, FieldSet, FieldLegend, FieldContent,
  FieldTitle, FieldSeparator
} from "@/components/ui/field";

<FieldSet>
  <FieldLegend>Section Title</FieldLegend>
  <FieldGroup>
    <Field>
      <FieldLabel htmlFor="name">Name</FieldLabel>
      <Input id="name" />
      <FieldDescription>Helper text</FieldDescription>
      <FieldError>Error message</FieldError>
    </Field>
  </FieldGroup>
</FieldSet>
```

## Components

### FieldSet
Top-level form section container.
```
flex flex-col gap-6
has-[>[data-slot=checkbox-group]]:gap-3
has-[>[data-slot=radio-group]]:gap-3
```

### FieldLegend
Section heading for a FieldSet.
```
mb-3 font-medium
data-[variant=legend]:text-base
data-[variant=label]:text-sm
```
Variants: `legend` (default, text-base), `label` (text-sm)

### FieldGroup
Groups multiple fields together.
```
@container/field-group flex w-full flex-col gap-7
data-[slot=checkbox-group]:gap-3
[&>[data-slot=field-group]]:gap-4
```

### Field
Individual field wrapper. Supports orientation variants.
```
group/field flex w-full gap-3 data-[invalid=true]:text-destructive
```

| Orientation | Classes |
|-------------|---------|
| `vertical` (default) | `flex-col [&>*]:w-full` |
| `horizontal` | `flex-row items-center` with label `flex-auto` |
| `responsive` | Vertical by default, horizontal at `@md/field-group` |

### FieldLabel
Label element wrapping a `<Label>`.
```
flex w-fit gap-2 leading-snug
group-data-[disabled=true]/field:opacity-50
```
Supports nested fields (checkbox/radio in card style) with border and checked highlight.

### FieldTitle
Non-label heading for a field (decorative).
```
flex w-fit items-center gap-2 text-sm leading-snug font-medium
```

### FieldContent
Wrapper for field input + description + error.
```
flex flex-1 flex-col gap-1.5 leading-snug
```

### FieldDescription
Helper text below input.
```
text-muted-foreground text-sm leading-normal font-normal
```
Supports links: `[&>a:hover]:text-primary [&>a]:underline`

### FieldSeparator
Divider between fields with optional text content.
```
relative -my-2 h-5 text-sm
```
Renders a `Separator` with optional centered text overlay.

### FieldError
Error message with alert role.
```
text-destructive text-sm font-normal
```
Accepts `errors` array prop for multiple errors, deduplicates, renders as list if > 1.

## Key Spacing Values
| Context | Gap |
|---------|-----|
| Between fields in FieldGroup | `gap-7` (28px) |
| Between nested FieldGroups | `gap-4` (16px) |
| Between checkbox/radio fields | `gap-3` (12px) |
| Between FieldSets | `gap-6` (24px) |
| Label to input (vertical) | `gap-3` (12px, from Field) |
| Input to description/error | `gap-1.5` (6px, from FieldContent) |

## Data Attributes
| Attribute | Component | Purpose |
|-----------|-----------|---------|
| `data-slot="field"` | Field | Slot identification |
| `data-orientation` | Field | Current orientation |
| `data-invalid="true"` | Field | Error state styling |
| `data-disabled="true"` | Field | Disabled state |
| `data-slot="field-error"` | FieldError | Error identification |

## Do / Don't

**Do:**
- Use `FieldGroup` to wrap related fields with consistent spacing
- Use `FieldContent` when you need description or error below an input in horizontal layout
- Use `orientation="responsive"` for forms that should stack on mobile
- Set `data-invalid="true"` on Field when validation fails

**Don't:**
- Don't use raw `<label>` + `<input>` -- use the Field system for consistent spacing
- Don't manually add gap between label and input -- Field handles it
- Don't nest FieldSet inside FieldSet (use FieldGroup for nesting)
- Don't use FieldError for non-validation messages -- use FieldDescription

## Examples in Codebase
- `src/components/ui/field.tsx` - Source implementation
- `src/components/data-source-card.tsx` - AuthKeyForm uses label/input pattern
