/**
 * Variant registry for switching between UI variations during stakeholder reviews.
 *
 * To add a variant:
 * 1. Copy a page/component into `variations/` with a descriptive name
 * 2. Add an entry to VARIANT_REGISTRY below
 * 3. Import variant component in the page, add conditional render
 * 4. Switch via persona switcher or ?variant=<key> URL
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VariantDef {
  label: string;
  description?: string;
}

export interface RouteVariants {
  route: string;
  defaultVariant: string;
  variants: Record<string, VariantDef>;
}

// ---------------------------------------------------------------------------
// Registry — add/remove entries as needed
// ---------------------------------------------------------------------------

export const VARIANT_REGISTRY: Record<string, RouteVariants> = {
  // Example:
  // "/dashboard": {
  //   route: "/dashboard",
  //   defaultVariant: "default",
  //   variants: {
  //     default: { label: "Default", description: "Standard dashboard layout" },
  //     compact: { label: "Compact", description: "Condensed dashboard layout" },
  //   },
  // },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Find variant config for a pathname — exact match, then prefix match. */
export function getVariantsForRoute(pathname: string): RouteVariants | null {
  // Exact match first
  if (VARIANT_REGISTRY[pathname]) return VARIANT_REGISTRY[pathname];
  // Prefix match (e.g. /feed/123 matches /feed)
  for (const key of Object.keys(VARIANT_REGISTRY)) {
    if (pathname.startsWith(key + "/")) return VARIANT_REGISTRY[key];
  }
  return null;
}

/** Validate variant key against route config, fall back to default. */
export function resolveVariant(
  raw: string | null,
  routeVariants: RouteVariants | null,
): string {
  if (!routeVariants) return "";
  if (raw && raw in routeVariants.variants) return raw;
  return routeVariants.defaultVariant;
}
