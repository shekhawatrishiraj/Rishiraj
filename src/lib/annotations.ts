/**
 * Annotation types and category configuration for the design overlay system.
 *
 * Annotations are static design notes pinned to UI elements via data-testid selectors.
 * They live alongside the prototype so handoff specs don't require separate docs.
 */

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const ANNOTATION_CATEGORIES = {
  rationale: {
    label: "Rationale",
    shortLabel: "Why",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    ringColor: "ring-blue-500/30",
  },
  "edge-case": {
    label: "Edge Case",
    shortLabel: "Edge",
    color: "bg-amber-500",
    textColor: "text-amber-500",
    ringColor: "ring-amber-500/30",
  },
  "motion-spec": {
    label: "Motion Spec",
    shortLabel: "Motion",
    color: "bg-violet-500",
    textColor: "text-violet-500",
    ringColor: "ring-violet-500/30",
  },
  todo: {
    label: "Todo",
    shortLabel: "Todo",
    color: "bg-rose-500",
    textColor: "text-rose-500",
    ringColor: "ring-rose-500/30",
  },
} as const;

export type AnnotationCategory = keyof typeof ANNOTATION_CATEGORIES;

export const ANNOTATION_CATEGORY_KEYS = Object.keys(
  ANNOTATION_CATEGORIES
) as AnnotationCategory[];

// ---------------------------------------------------------------------------
// Entry & page types
// ---------------------------------------------------------------------------

export interface AnnotationEntry {
  /** CSS selector — typically `[data-testid="..."]` */
  selector: string;
  category: AnnotationCategory;
  title?: string;
  /** Inline markdown: **bold**, `code`, - list items */
  note: string;
}

export interface PageAnnotations {
  route: string;
  annotations: AnnotationEntry[];
}
