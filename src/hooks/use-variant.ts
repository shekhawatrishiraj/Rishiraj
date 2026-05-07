"use client";

import { useQueryState, parseAsString } from "nuqs";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useEffect } from "react";
import {
  getVariantsForRoute,
  resolveVariant,
  type RouteVariants,
} from "@/lib/variants";

/**
 * URL-driven variant switching for stakeholder reviews.
 *
 * URL param: ?variant=compact
 * Clears param when selecting default (clean URLs).
 * Auto-clears when navigating to a route with no variants.
 */
export function useVariant() {
  const pathname = usePathname();
  const [variantRaw, setVariantRaw] = useQueryState(
    "variant",
    parseAsString.withDefault(""),
  );

  const routeVariants: RouteVariants | null = useMemo(
    () => getVariantsForRoute(pathname),
    [pathname],
  );

  const hasVariants = routeVariants !== null;

  const variant = useMemo(
    () => resolveVariant(variantRaw || null, routeVariants),
    [variantRaw, routeVariants],
  );

  const isDefaultVariant =
    !routeVariants || variant === routeVariants.defaultVariant;

  const setVariant = useCallback(
    (key: string) => {
      if (!routeVariants) return;
      // Clear param when selecting default for clean URLs
      if (key === routeVariants.defaultVariant) {
        setVariantRaw(null);
      } else {
        setVariantRaw(key);
      }
    },
    [routeVariants, setVariantRaw],
  );

  const resetVariant = useCallback(() => {
    setVariantRaw(null);
  }, [setVariantRaw]);

  // Auto-cleanup: clear ?variant when navigating to a route with no variants
  useEffect(() => {
    if (!hasVariants && variantRaw) {
      setVariantRaw(null);
    }
  }, [hasVariants, variantRaw, setVariantRaw]);

  return {
    variant,
    setVariant,
    resetVariant,
    routeVariants,
    hasVariants,
    isDefaultVariant,
  } as const;
}
