"use client";

import { usePersona } from "@/hooks/use-persona";
import { useVariant } from "@/hooks/use-variant";
import { useAnnotations } from "@/hooks/use-annotations";
import {
  PERSONAS,
  PERSONA_KEYS,
  SCENARIOS,
  SCENARIO_KEYS,
  FLAG_DEFINITIONS,
  FLAG_KEYS,
  VOLUMES,
  VOLUME_KEYS,
  SCOPE_DOMAINS,
  SCOPE_LABELS,
  type PersonaKey,
  type ScenarioKey,
  type VolumeKey,
  type ScopeDomain,
} from "@/lib/personas";
import {
  ANNOTATION_CATEGORIES,
  ANNOTATION_CATEGORY_KEYS,
} from "@/lib/annotations";
import { SEQUENCES } from "@/lib/sequences";
import {
  ArrowCounterClockwiseIcon,
  DotsSixVerticalIcon,
  GearSixIcon,
  PlayIcon,
  PauseIcon,
  CaretLeftIcon,
  CaretRightIcon,
  StopIcon,
} from "@phosphor-icons/react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, useCallback } from "react";

export function PersonaSwitcher() {
  const {
    persona,
    setPersona,
    flags,
    scenario,
    setScenario,
    volume,
    setVolume,
    setFlag,
    activePreset,
    isCustom,
    scenarioMap,
    setScenarioScope,
    clearScenarios,
    sequenceState,
    playSequence,
    stopSequence,
    stepForward,
    stepBack,
  } = usePersona();

  const {
    variant,
    setVariant,
    resetVariant,
    routeVariants,
    hasVariants,
    isDefaultVariant,
  } = useVariant();

  const {
    annotationsOn,
    setAnnotationsOn,
    activeFilter,
    setFilter,
    totalCount,
    categoryCounts,
  } = useAnnotations();

  const isNewUser = persona === "new-user";
  const hasVolume = volume !== "typical";

  // Compute active scenario count for toolbar indicator
  const activeScenarios = Object.entries(scenarioMap).filter(
    ([, v]) => v && v !== "none"
  );
  const hasScenario = activeScenarios.length > 0;
  const scenarioIndicator =
    activeScenarios.length === 0
      ? null
      : activeScenarios.length === 1
        ? SCENARIOS[activeScenarios[0][1] as ScenarioKey].label
        : "Mixed";

  const [panelOpen, setPanelOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Drag position (right-anchored: x = distance from right edge, y = distance from top)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const dragging = useRef(false);
  const hasDragged = useRef(false);
  const resizing = useRef(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, elX: 0, elY: 0 });

  // Initialize to bottom-left on mount
  useEffect(() => {
    requestAnimationFrame(() => {
      const w = ref.current?.offsetWidth ?? 160;
      setPos({ x: window.innerWidth - 16 - w, y: window.innerHeight - 44 });
    });
  }, []);

  // Re-clamp position when toolbar width changes (pills added/removed)
  useEffect(() => {
    const el = ref.current;
    if (!el || !pos) return;
    const observer = new ResizeObserver(() => {
      if (dragging.current) return;
      const w = el.offsetWidth;
      const maxRight = window.innerWidth - w - 8;
      if (pos.x > maxRight) {
        setPos((prev) => prev ? { ...prev, x: maxRight } : prev);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [pos]);

  // Re-position on window resize / zoom — maintain relative position
  const prevViewport = useRef({ w: 0, h: 0 });
  useEffect(() => {
    prevViewport.current = { w: window.innerWidth, h: window.innerHeight };
  }, []);

  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;
    function handleResize() {
      if (dragging.current) return;
      const el = ref.current;
      if (!el) return;
      resizing.current = true;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resizing.current = false; }, 300);

      const elW = el.offsetWidth;
      const elH = el.offsetHeight;
      const oldVw = prevViewport.current.w;
      const oldVh = prevViewport.current.h;
      const newVw = window.innerWidth;
      const newVh = window.innerHeight;
      prevViewport.current = { w: newVw, h: newVh };

      setPos((prev) => {
        if (!prev) return prev;
        // Convert right-anchored x to left position, scale, convert back
        const oldLeft = oldVw - prev.x - elW;
        const newLeft = (oldLeft / oldVw) * newVw;
        const newY = (prev.y / oldVh) * newVh;
        return {
          x: Math.max(8, Math.min(newVw - newLeft - elW, newVw - elW - 8)),
          y: Math.max(8, Math.min(newY, newVh - elH - 8)),
        };
      });
    }
    window.addEventListener("resize", handleResize);
    return () => { window.removeEventListener("resize", handleResize); clearTimeout(resizeTimer); };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!(e.target as HTMLElement).closest("[data-drag-handle]")) return;
    e.preventDefault();
    dragging.current = true;
    hasDragged.current = true;
    const rect = ref.current!.getBoundingClientRect();
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      elX: window.innerWidth - rect.right,
      elY: rect.top,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragStart.current.mouseX;
    const dy = e.clientY - dragStart.current.mouseY;
    const w = ref.current?.offsetWidth ?? 160;
    const maxRight = window.innerWidth - w - 8;
    setPos({
      x: Math.max(8, Math.min(dragStart.current.elX - dx, maxRight)),
      y: Math.max(8, Math.min(dragStart.current.elY + dy, window.innerHeight - 40)),
    });
  }, []);

  const handlePointerUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;

    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pad = 16;

    const third = vw / 3;
    const snapRight =
      cx < third
        ? vw - pad - rect.width
        : cx < third * 2
          ? Math.round((vw - rect.width) / 2)
          : pad;

    const snapY = cy < vh / 2 ? pad : vh - pad - rect.height;
    setPos({ x: snapRight, y: snapY });
  }, []);

  // Close panel on outside click / escape
  useEffect(() => {
    if (!panelOpen) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPanelOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [panelOpen]);

  // Volume pill color
  const volumeColor =
    volume === "empty"
      ? "text-red-400"
      : volume === "sparse"
        ? "text-yellow-400"
        : volume === "heavy"
          ? "text-blue-400"
          : "";

  // Sequence player state
  const [selectedSequence, setSelectedSequence] = useState(0);
  const isPlaying = sequenceState?.active ?? false;
  const currentSeq = sequenceState ? SEQUENCES[sequenceState.sequenceIndex] : null;
  const currentStep = currentSeq && sequenceState ? currentSeq.steps[sequenceState.stepIndex] : null;

  const isDirty = isNewUser || isCustom || hasVolume || hasScenario || isPlaying || annotationsOn || (hasVariants && !isDefaultVariant);

  const handleReset = useCallback(() => {
    setPersona("returning" as PersonaKey);
    clearScenarios();
    setVolume("typical" as VolumeKey);
    stopSequence();
    setAnnotationsOn(false);
    resetVariant();
  }, [setPersona, clearScenarios, setVolume, stopSequence, setAnnotationsOn, resetVariant]);

  return (
    <div
      ref={ref}
      className="fixed z-50 select-none"
      style={{
        top: pos?.y ?? -100,
        right: pos?.x ?? 16,
        opacity: pos ? 1 : 0,
        // eslint-disable-next-line react-hooks/refs
        transition: hasDragged.current && !dragging.current && !resizing.current ? "top 200ms ease-out, right 200ms ease-out" : "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Compact toolbar */}
      <div className="flex h-7 items-center rounded-full bg-neutral-800/80 shadow-sm backdrop-blur-sm">
        {/* Drag handle */}
        <div
          data-drag-handle
          className="flex cursor-grab items-center pl-1.5 pr-0.5 text-white/40 hover:text-white/60 active:cursor-grabbing"
        >
          <DotsSixVerticalIcon size={12} weight="bold" />
        </div>

        {/* Persona toggle */}
        <div className="flex items-center gap-1.5 pr-1">
          <span className="text-2xs font-medium text-white/70">
            {isCustom ? "Custom" : "New"}
          </span>
          <Switch
            size="sm"
            checked={isNewUser}
            onCheckedChange={(checked) =>
              setPersona(checked ? "new-user" : "returning")
            }
            className={cn(
              "data-[state=checked]:!bg-primary data-[state=unchecked]:!bg-white/30",
              isCustom && "opacity-50"
            )}
          />
        </div>

        {/* Volume pill — only visible when not typical */}
        {hasVolume && (
          <span className={cn("text-2xs font-medium px-1", volumeColor)}>
            {VOLUMES[volume].label}
          </span>
        )}

        {/* Scenario pill — shows scoped indicator */}
        {hasScenario && (
          <span className="text-2xs font-medium text-orange-400 px-1">
            {scenarioIndicator}
          </span>
        )}

        {/* Variant pill */}
        {hasVariants && !isDefaultVariant && routeVariants && (
          <span className="text-2xs font-medium text-violet-400 px-1">
            {routeVariants.variants[variant]?.label ?? variant}
          </span>
        )}

        {/* Sequence indicator */}
        {isPlaying && currentStep && (
          <span className="text-2xs font-medium text-emerald-400 px-1">
            {currentStep.label}
          </span>
        )}

        {/* Annotation pill */}
        {annotationsOn && (
          <span className="text-2xs font-medium text-cyan-400 px-1">Ann</span>
        )}

        {/* Gear button — opens settings panel */}
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          aria-label="Persona settings"
          className="flex items-center px-1.5 text-white/40 hover:text-white/70 transition-colors"
        >
          <GearSixIcon size={13} weight="bold" />
        </button>
      </div>

      {/* Settings panel */}
      {panelOpen && (
        <div
          ref={panelRef}
          className={cn(
            "absolute w-72 rounded-lg bg-neutral-800 p-3 shadow-xl overflow-y-auto",
            (pos?.x ?? 0) > window.innerWidth / 2
              ? "left-0"
              : "right-0",
          )}
          // eslint-disable-next-line react-hooks/refs
          style={(() => {
            const toolbarY = pos?.y ?? 0;
            const toolbarH = ref.current?.offsetHeight ?? 28;
            const pad = 8; // min distance from viewport edge
            const gap = 6; // gap between toolbar and panel
            const opensUp = toolbarY > window.innerHeight / 2;

            if (opensUp) {
              const maxH = toolbarY - gap - pad;
              return { bottom: toolbarH + gap, maxHeight: Math.max(maxH, 200) };
            } else {
              const maxH = window.innerHeight - toolbarY - toolbarH - gap - pad;
              return { top: toolbarH + gap, maxHeight: Math.max(maxH, 200) };
            }
          })()}
        >
          {/* Reset */}
          {isDirty && (
            <button
              onClick={handleReset}
              className="flex w-full items-center justify-center gap-1.5 rounded-md bg-white/5 py-1.5 text-xs-plus font-medium text-white/50 hover:bg-white/10 hover:text-white/70 transition-colors mb-3"
            >
              <ArrowCounterClockwiseIcon size={12} weight="bold" />
              Reset to defaults
            </button>
          )}

          {/* Presets */}
          <SectionLabel>Presets</SectionLabel>
          <div className="flex gap-1.5 mb-3">
            {PERSONA_KEYS.map((key) => (
              <Pill
                key={key}
                active={activePreset === key}
                onClick={() => setPersona(key as PersonaKey)}
              >
                {PERSONAS[key].shortLabel}
              </Pill>
            ))}
            {isCustom && (
              <Pill active className="cursor-default">Custom</Pill>
            )}
          </div>

          {/* Flags */}
          <SectionLabel>Flags</SectionLabel>
          <div className="space-y-1.5 mb-3">
            {FLAG_KEYS.map((key) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-white/80">{FLAG_DEFINITIONS[key].label}</span>
                  <span className="text-2xs text-white/30 ml-1.5">{FLAG_DEFINITIONS[key].description}</span>
                </div>
                <Switch
                  size="sm"
                  checked={flags[key]}
                  onCheckedChange={(checked) => setFlag(key, checked)}
                  className="data-[state=checked]:!bg-primary data-[state=unchecked]:!bg-white/20"
                />
              </div>
            ))}
          </div>

          {/* Data Volume */}
          <SectionLabel>Data Volume</SectionLabel>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {VOLUME_KEYS.map((key) => (
              <Pill
                key={key}
                active={volume === key}
                onClick={() => setVolume(key as VolumeKey)}
              >
                {VOLUMES[key].label}
              </Pill>
            ))}
          </div>

          {/* Scoped Scenario Grid */}
          <div className="flex items-center justify-between mb-1.5">
            <SectionLabel className="mb-0">Scenario</SectionLabel>
            {hasScenario && (
              <button
                onClick={clearScenarios}
                className="text-2xs text-white/30 hover:text-white/50 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="mb-3">
            {/* Header row */}
            <div className="grid grid-cols-[80px_1fr_1fr_1fr] gap-0.5 mb-0.5">
              <div />
              {SCENARIO_KEYS.map((key) => (
                <div key={key} className="text-center text-[9px] font-medium text-white/30 uppercase tracking-wider">
                  {SCENARIOS[key].label}
                </div>
              ))}
            </div>
            {/* Scope rows */}
            {SCOPE_DOMAINS.map((scope) => (
              <div key={scope} className="grid grid-cols-[80px_1fr_1fr_1fr] gap-0.5">
                <div className="text-2xs text-white/50 flex items-center">
                  {SCOPE_LABELS[scope]}
                </div>
                {SCENARIO_KEYS.map((sKey) => {
                  const current = scenarioMap[scope] ?? "none";
                  const isActive = current === sKey;
                  return (
                    <button
                      key={sKey}
                      onClick={() => setScenarioScope(scope, sKey)}
                      className={cn(
                        "h-6 rounded text-2xs font-medium transition-colors",
                        isActive
                          ? "bg-white/15 text-white"
                          : "text-white/25 hover:bg-white/5 hover:text-white/40"
                      )}
                    >
                      {isActive ? "●" : "○"}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sequence Player */}
          <SectionLabel>Sequences</SectionLabel>
          <div className="space-y-2">
            {/* Sequence selector */}
            <div className="flex items-center gap-1.5">
              <select
                value={isPlaying && sequenceState ? sequenceState.sequenceIndex : selectedSequence}
                onChange={(e) => setSelectedSequence(Number(e.target.value))}
                disabled={isPlaying}
                className="flex-1 h-6 rounded bg-white/5 border-0 text-xs-plus text-white/80 px-1.5 focus:outline-none focus:ring-1 focus:ring-white/20 disabled:opacity-50"
              >
                {SEQUENCES.map((seq, i) => (
                  <option key={i} value={i} className="bg-neutral-800">
                    {seq.name}
                  </option>
                ))}
              </select>

              {/* Controls */}
              <div className="flex items-center gap-0.5">
                <button
                  onClick={stepBack}
                  disabled={!isPlaying || (sequenceState?.stepIndex ?? 0) === 0}
                  aria-label="Previous step"
                  className="flex size-6 items-center justify-center rounded text-white/50 hover:bg-white/10 hover:text-white/80 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <CaretLeftIcon size={12} weight="bold" />
                </button>

                {isPlaying ? (
                  <button
                    onClick={stopSequence}
                    aria-label="Stop sequence"
                    className="flex size-6 items-center justify-center rounded bg-white/10 text-white/80 hover:bg-white/15 transition-colors"
                  >
                    <StopIcon size={12} weight="bold" />
                  </button>
                ) : (
                  <button
                    onClick={() => playSequence(selectedSequence)}
                    aria-label="Play sequence"
                    className="flex size-6 items-center justify-center rounded bg-white/10 text-white/80 hover:bg-white/15 transition-colors"
                  >
                    <PlayIcon size={12} weight="fill" />
                  </button>
                )}

                <button
                  onClick={stepForward}
                  disabled={!isPlaying || (sequenceState?.stepIndex ?? 0) >= (currentSeq?.steps.length ?? 1) - 1}
                  aria-label="Next step"
                  className="flex size-6 items-center justify-center rounded text-white/50 hover:bg-white/10 hover:text-white/80 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <CaretRightIcon size={12} weight="bold" />
                </button>
              </div>
            </div>

            {/* Progress */}
            {isPlaying && currentSeq && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-2xs">
                  <span className="text-white/60">
                    Step {(sequenceState?.stepIndex ?? 0) + 1}/{currentSeq.steps.length}: &ldquo;{currentStep?.label}&rdquo;
                  </span>
                </div>
                <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500/60 transition-all duration-300"
                    style={{
                      width: `${(((sequenceState?.stepIndex ?? 0) + 1) / currentSeq.steps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Description when not playing */}
            {!isPlaying && (
              <p className="text-2xs text-white/30">
                {SEQUENCES[selectedSequence].description}
              </p>
            )}
          </div>

          {/* Variants */}
          {hasVariants && routeVariants && (
            <>
              <SectionLabel className="mt-3">Variants</SectionLabel>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {Object.entries(routeVariants.variants).map(([key, def]) => (
                  <Pill
                    key={key}
                    active={variant === key}
                    onClick={() => setVariant(key)}
                  >
                    {def.label}
                  </Pill>
                ))}
              </div>
              {routeVariants.variants[variant]?.description && (
                <p className="text-2xs text-white/30 mb-3">
                  {routeVariants.variants[variant].description}
                </p>
              )}
            </>
          )}

          {/* Annotations */}
          <div className="flex items-center justify-between mt-3 mb-1.5">
            <SectionLabel className="mb-0">
              Annotations{totalCount > 0 && ` (${totalCount})`}
            </SectionLabel>
            <Switch
              size="sm"
              checked={annotationsOn}
              onCheckedChange={setAnnotationsOn}
              className="data-[state=checked]:!bg-cyan-500 data-[state=unchecked]:!bg-white/20"
            />
          </div>
          {annotationsOn && totalCount > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <Pill
                active={activeFilter === null}
                onClick={() => setFilter(null)}
              >
                All
              </Pill>
              {ANNOTATION_CATEGORY_KEYS.map((key) => {
                const count = categoryCounts[key];
                if (!count) return null;
                return (
                  <Pill
                    key={key}
                    active={activeFilter === key}
                    onClick={() => setFilter(activeFilter === key ? null : key)}
                  >
                    {ANNOTATION_CATEGORIES[key].shortLabel}
                  </Pill>
                );
              })}
            </div>
          )}
          {annotationsOn && totalCount === 0 && (
            <p className="text-2xs text-white/30">No annotations for this page.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small internal components
// ---------------------------------------------------------------------------

function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("text-2xs font-semibold uppercase tracking-wider text-white/30 mb-1.5", className)}>
      {children}
    </div>
  );
}

function Pill({
  children,
  active,
  onClick,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-white/15 text-white"
          : "text-white/50 hover:bg-white/5 hover:text-white/70",
        className,
      )}
    >
      {children}
    </button>
  );
}
