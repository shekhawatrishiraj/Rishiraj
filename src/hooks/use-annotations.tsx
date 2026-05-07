"use client";

import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  ANNOTATION_CATEGORY_KEYS,
  type AnnotationCategory,
  type AnnotationEntry,
} from "@/lib/annotations";
import { getAnnotationsForRoute } from "@/lib/annotation-registry";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ResolvedPin {
  entry: AnnotationEntry;
  index: number;
  rect: DOMRect | null;
  element: Element | null;
}

type AnnotationsContextValue = ReturnType<typeof useAnnotationsInternal>;

const AnnotationsContext = createContext<AnnotationsContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider — instantiate the hook once, share via context
// ---------------------------------------------------------------------------

export function AnnotationsProvider({ children }: { children: React.ReactNode }) {
  const value = useAnnotationsInternal();
  return (
    <AnnotationsContext.Provider value={value}>
      {children}
    </AnnotationsContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Consumer hook
// ---------------------------------------------------------------------------

export function useAnnotations(): AnnotationsContextValue {
  const ctx = useContext(AnnotationsContext);
  if (!ctx) {
    throw new Error("useAnnotations must be used within <AnnotationsProvider>");
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Internal hook (single instance via provider)
// ---------------------------------------------------------------------------

function useAnnotationsInternal() {
  const pathname = usePathname();

  const [annotationsOn, setAnnotationsOn] = useQueryState(
    "annotations",
    parseAsBoolean.withDefault(false)
  );

  const [filterRaw, setFilterRaw] = useQueryState(
    "ann-filter",
    parseAsString.withDefault("")
  );

  const activeFilter: AnnotationCategory | null = useMemo(() => {
    if (!filterRaw) return null;
    return ANNOTATION_CATEGORY_KEYS.includes(filterRaw as AnnotationCategory)
      ? (filterRaw as AnnotationCategory)
      : null;
  }, [filterRaw]);

  const setFilter = useCallback(
    (cat: AnnotationCategory | null) => {
      setFilterRaw(cat ?? null);
    },
    [setFilterRaw]
  );

  // Get annotations for current route
  const pageAnnotations = useMemo(
    () => getAnnotationsForRoute(pathname),
    [pathname]
  );

  const entries = useMemo(() => {
    if (!pageAnnotations) return [];
    if (!activeFilter) return pageAnnotations.annotations;
    return pageAnnotations.annotations.filter(
      (a) => a.category === activeFilter
    );
  }, [pageAnnotations, activeFilter]);

  const allEntries = useMemo(
    () => pageAnnotations?.annotations ?? [],
    [pageAnnotations]
  );

  // Category counts (over all entries, not filtered)
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<AnnotationCategory, number>> = {};
    for (const entry of allEntries) {
      counts[entry.category] = (counts[entry.category] ?? 0) + 1;
    }
    return counts;
  }, [allEntries]);

  const totalCount = allEntries.length;

  // ---------------------------------------------------------------------------
  // DOM resolution — only active when annotationsOn
  // ---------------------------------------------------------------------------

  const [pins, setPins] = useState<ResolvedPin[]>([]);
  const rafId = useRef<number>(0);

  const recalculate = useCallback(() => {
    if (!annotationsOn || entries.length === 0) {
      setPins([]);
      return;
    }

    const resolved: ResolvedPin[] = entries.map((entry, index) => {
      const el = document.querySelector(entry.selector);
      const rect = el ? el.getBoundingClientRect() : null;
      return { entry, index, rect, element: el };
    });

    setPins(resolved);
  }, [annotationsOn, entries]);

  // Debounced recalculate via rAF
  const scheduleRecalc = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(recalculate);
  }, [recalculate]);

  useEffect(() => {
    if (!annotationsOn) {
      setPins([]);
      return;
    }

    // Initial calculation (delayed to catch Suspense mounts)
    const timer = setTimeout(recalculate, 100);

    // Scroll + resize on window
    window.addEventListener("scroll", scheduleRecalc, { passive: true });
    window.addEventListener("resize", scheduleRecalc, { passive: true });

    // Scroll on sidebar-inset (inner scrollable container)
    const inset = document.querySelector('[data-slot="sidebar-inset"]');
    if (inset) {
      inset.addEventListener("scroll", scheduleRecalc, { passive: true });
    }

    // ResizeObserver on html element (catches sidebar collapse)
    const resizeObserver = new ResizeObserver(scheduleRecalc);
    resizeObserver.observe(document.documentElement);

    // MutationObserver on body (catches Suspense/tab mount)
    const mutationObserver = new MutationObserver(scheduleRecalc);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("scroll", scheduleRecalc);
      window.removeEventListener("resize", scheduleRecalc);
      if (inset) {
        inset.removeEventListener("scroll", scheduleRecalc);
      }
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [annotationsOn, scheduleRecalc, recalculate]);

  return {
    annotationsOn,
    setAnnotationsOn,
    activeFilter,
    setFilter,
    pins,
    totalCount,
    categoryCounts,
    recalculate,
  } as const;
}
