import type { PageAnnotations } from "@/lib/annotations";

/**
 * Registry of per-page design annotations.
 *
 * To add annotations for a page:
 * 1. Create `page.annotations.ts` alongside your page
 * 2. Import and add it to the REGISTRY array below
 *
 * Example:
 *   import { annotations as dashboardAnnotations } from "@/app/dashboard/page.annotations";
 *   const REGISTRY: PageAnnotations[] = [dashboardAnnotations];
 */
const REGISTRY: PageAnnotations[] = [];

export function getAnnotationsForRoute(
  pathname: string
): PageAnnotations | null {
  return (
    REGISTRY.find((entry) => entry.route === pathname) ??
    REGISTRY.find((entry) => pathname.startsWith(entry.route + "/")) ??
    null
  );
}
