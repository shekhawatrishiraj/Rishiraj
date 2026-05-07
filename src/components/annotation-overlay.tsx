"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAnnotations } from "@/hooks/use-annotations";
import { ANNOTATION_CATEGORIES, type AnnotationEntry } from "@/lib/annotations";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Inline markdown renderer — simple regex, no external dep
// ---------------------------------------------------------------------------

function renderInlineMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("- ")) {
      // List item
      elements.push(
        <li key={i} className="ml-3 list-disc text-xs text-white/70">
          {renderInlineText(trimmed.slice(2))}
        </li>
      );
    } else if (trimmed === "") {
      elements.push(<br key={i} />);
    } else {
      elements.push(
        <p key={i} className="text-xs text-white/70">
          {renderInlineText(trimmed)}
        </p>
      );
    }
  }

  return <>{elements}</>;
}

function renderInlineText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Match **bold** and `code`
  const regex = /(\*\*(.+?)\*\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      // Bold
      parts.push(
        <strong key={match.index} className="font-semibold text-white/90">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // Code
      parts.push(
        <code
          key={match.index}
          className="rounded bg-white/10 px-1 py-0.5 text-[11px] font-mono text-white/80"
        >
          {match[3]}
        </code>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

// ---------------------------------------------------------------------------
// Pin component
// ---------------------------------------------------------------------------

function AnnotationPin({
  index,
  rect,
  entry,
}: {
  index: number;
  rect: DOMRect;
  entry: AnnotationEntry;
}) {
  const cat = ANNOTATION_CATEGORIES[entry.category];

  // Clamp pin position to viewport (all four edges)
  const left = Math.min(rect.right - 10, window.innerWidth - 20);
  const top = Math.min(Math.max(rect.top - 10, 4), window.innerHeight - 24);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "pointer-events-auto absolute flex items-center justify-center",
            "size-5 rounded-full text-[9px] font-bold text-white",
            "ring-2 ring-white/20 shadow-lg",
            "hover:scale-110 hover:ring-white/40 transition-transform",
            cat.color
          )}
          style={{
            position: "fixed",
            left,
            top,
          }}
          aria-label={`Annotation ${index + 1}: ${entry.title ?? entry.category}`}
        >
          {index + 1}
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="left"
        sideOffset={8}
        className="w-72 rounded-lg border-0 bg-neutral-900 p-0 shadow-2xl"
      >
        {/* Category header strip */}
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-t-lg px-3 py-1.5",
            cat.color
          )}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/90">
            {cat.label}
          </span>
        </div>
        <div className="space-y-1.5 px-3 py-2.5">
          {entry.title && (
            <h4 className="text-xs font-semibold text-white/90">
              {entry.title}
            </h4>
          )}
          <div className="space-y-1">{renderInlineMarkdown(entry.note)}</div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ---------------------------------------------------------------------------
// Overlay
// ---------------------------------------------------------------------------

export function AnnotationOverlay() {
  const [mounted, setMounted] = useState(false);
  const { pins, annotationsOn } = useAnnotations();

  // SSR guard — portal only after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !annotationsOn || pins.length === 0) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 z-40"
      aria-label="Annotation overlay"
    >
      {pins.map(
        (pin) =>
          pin.rect && (
            <AnnotationPin
              key={pin.entry.selector}
              index={pin.index}
              rect={pin.rect}
              entry={pin.entry}
            />
          )
      )}
    </div>,
    document.body
  );
}
