"use client";

import { useQueryState, parseAsStringEnum, parseAsString } from "nuqs";
import {
  PERSONAS,
  PERSONA_KEYS,
  DEFAULT_PERSONA,
  SCENARIOS,
  SCENARIO_KEYS,
  VOLUMES,
  VOLUME_KEYS,
  DEFAULT_VOLUME,
  FLAG_KEYS,
  FLAG_DEFINITIONS,
  SCOPE_DOMAINS,
  parseFlagString,
  serializeFlagOverrides,
  parseScopedScenario,
  serializeScopedScenario,
  resolveScenario,
  type PersonaKey,
  type PersonaFlags,
  type ScenarioKey,
  type VolumeKey,
  type FlagKey,
  type ScopeDomain,
  type ScopedScenarioMap,
} from "@/lib/personas";
import { SEQUENCES } from "@/lib/sequences";
import { useCallback, useMemo, useState, useRef, useEffect } from "react";

/**
 * Read and set the active persona + scenario + volume from the URL.
 *
 * URL params:
 *   ?persona=new-user        — preset (unchanged)
 *   &flags=int:0,dat:1       — individual flag overrides
 *   &scenario=error           — global scenario (backward compat)
 *   &scenario=error:int,loading:dat — scoped scenarios
 *   &volume=sparse            — data volume axis
 *
 * Flag resolution: start from preset flags → apply overrides from ?flags=
 */
export function usePersona() {
  const [persona, setPersonaRaw] = useQueryState(
    "persona",
    parseAsStringEnum(PERSONA_KEYS).withDefault(DEFAULT_PERSONA)
  );

  const [flagsRaw, setFlagsRaw] = useQueryState(
    "flags",
    parseAsString.withDefault("")
  );

  const [scenarioRaw, setScenarioRaw] = useQueryState(
    "scenario",
    parseAsString.withDefault("")
  );

  const [volume, setVolumeRaw] = useQueryState(
    "volume",
    parseAsStringEnum(VOLUME_KEYS).withDefault(DEFAULT_VOLUME)
  );

  const personaKey = (PERSONA_KEYS.includes(persona as PersonaKey)
    ? persona
    : DEFAULT_PERSONA) as PersonaKey;

  const volumeKey = (VOLUME_KEYS.includes(volume as VolumeKey)
    ? volume
    : DEFAULT_VOLUME) as VolumeKey;

  // Parse flag overrides from URL
  const flagOverrides = useMemo(
    () => parseFlagString(flagsRaw || null),
    [flagsRaw]
  );

  // Resolve final flags: preset base + overrides
  const config = PERSONAS[personaKey];
  const flags: PersonaFlags = useMemo(() => {
    const base = { ...config.flags } as Record<string, boolean>;
    for (const [key, val] of Object.entries(flagOverrides)) {
      if (key in base) base[key] = val;
    }
    return base as unknown as PersonaFlags;
  }, [config.flags, flagOverrides]);

  // ── Scoped scenarios ──────────────────────────────────────────
  const scenarioMap = useMemo(
    () => parseScopedScenario(scenarioRaw || null),
    [scenarioRaw]
  );

  const getScenario = useCallback(
    (scope: ScopeDomain): ScenarioKey => resolveScenario(scenarioMap, scope),
    [scenarioMap]
  );

  // Backward compat: global scenario
  const scenario = getScenario("*");
  const scenarioConfig = SCENARIOS[scenario];

  const setScenarioScope = useCallback(
    (scope: ScopeDomain, key: ScenarioKey) => {
      const newMap = { ...scenarioMap };
      if (key === "none") {
        delete newMap[scope];
      } else {
        newMap[scope] = key;
      }
      setScenarioRaw(serializeScopedScenario(newMap));
    },
    [scenarioMap, setScenarioRaw]
  );

  const setScenario = useCallback(
    (key: ScenarioKey) => setScenarioScope("*", key),
    [setScenarioScope]
  );

  const clearScenarios = useCallback(
    () => setScenarioRaw(null),
    [setScenarioRaw]
  );

  const volumeConfig = VOLUMES[volumeKey];

  // Detect if current flags match any preset exactly
  const activePreset = useMemo((): PersonaKey | null => {
    for (const key of PERSONA_KEYS) {
      const presetFlags = PERSONAS[key].flags;
      const match = FLAG_KEYS.every(
        (fk) => flags[fk] === presetFlags[fk]
      );
      if (match) return key;
    }
    return null;
  }, [flags]);

  const isCustom = activePreset === null;

  // Set persona preset and clear flag overrides
  const setPersona = useCallback(
    (key: PersonaKey) => {
      setPersonaRaw(key);
      setFlagsRaw(null);
    },
    [setPersonaRaw, setFlagsRaw]
  );

  // Set individual flag override
  const setFlag = useCallback(
    (key: FlagKey, value: boolean) => {
      const baseValue = PERSONAS[personaKey].flags[key];
      const newOverrides = { ...flagOverrides };

      if (value === baseValue) {
        delete newOverrides[key];
      } else {
        newOverrides[key] = value;
      }

      const serialized = serializeFlagOverrides(newOverrides);
      setFlagsRaw(serialized);
    },
    [personaKey, flagOverrides, setFlagsRaw]
  );

  const setVolume = useCallback(
    (key: VolumeKey) => setVolumeRaw(key),
    [setVolumeRaw]
  );

  // ── Sequence player ───────────────────────────────────────────
  const [sequenceState, setSequenceState] = useState<{
    active: boolean;
    sequenceIndex: number;
    stepIndex: number;
  } | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const applyStep = useCallback(
    (step: (typeof SEQUENCES)[number]["steps"][number]) => {
      if (step.persona) {
        setPersonaRaw(step.persona);
        // Apply flag overrides or clear them
        if (step.flagOverrides) {
          setFlagsRaw(serializeFlagOverrides(step.flagOverrides));
        } else {
          setFlagsRaw(null);
        }
      } else if (step.flagOverrides) {
        setFlagsRaw(serializeFlagOverrides(step.flagOverrides));
      }
      if (step.scenario !== undefined) {
        if (typeof step.scenario === "string") {
          setScenarioRaw(step.scenario === "none" ? null : step.scenario);
        } else {
          setScenarioRaw(serializeScopedScenario(step.scenario));
        }
      }
      if (step.volume) {
        setVolumeRaw(step.volume);
      }
    },
    [setPersonaRaw, setFlagsRaw, setScenarioRaw, setVolumeRaw]
  );

  const advanceSequence = useCallback(
    (seqIdx: number, stepIdx: number) => {
      const seq = SEQUENCES[seqIdx];
      if (!seq || stepIdx >= seq.steps.length) {
        // Sequence ended
        setSequenceState(null);
        return;
      }
      const step = seq.steps[stepIdx];
      applyStep(step);
      setSequenceState({ active: true, sequenceIndex: seqIdx, stepIndex: stepIdx });

      timerRef.current = setTimeout(() => {
        advanceSequence(seqIdx, stepIdx + 1);
      }, step.duration);
    },
    [applyStep]
  );

  const playSequence = useCallback(
    (index: number) => {
      clearTimer();
      advanceSequence(index, 0);
    },
    [clearTimer, advanceSequence]
  );

  const stopSequence = useCallback(() => {
    clearTimer();
    setSequenceState(null);
  }, [clearTimer]);

  const stepForward = useCallback(() => {
    if (!sequenceState) return;
    clearTimer();
    const nextIdx = sequenceState.stepIndex + 1;
    const seq = SEQUENCES[sequenceState.sequenceIndex];
    if (nextIdx >= seq.steps.length) {
      setSequenceState(null);
      return;
    }
    const step = seq.steps[nextIdx];
    applyStep(step);
    setSequenceState({ ...sequenceState, stepIndex: nextIdx });
  }, [sequenceState, clearTimer, applyStep]);

  const stepBack = useCallback(() => {
    if (!sequenceState) return;
    clearTimer();
    const prevIdx = sequenceState.stepIndex - 1;
    if (prevIdx < 0) return;
    const step = SEQUENCES[sequenceState.sequenceIndex].steps[prevIdx];
    applyStep(step);
    setSequenceState({ ...sequenceState, stepIndex: prevIdx });
  }, [sequenceState, clearTimer, applyStep]);

  // Clean up timer on unmount
  useEffect(() => clearTimer, [clearTimer]);

  return {
    // Existing — unchanged
    persona: personaKey,
    setPersona,
    flags,
    config,
    scenario,
    setScenario,
    scenarioConfig,

    // Volume
    volume: volumeKey,
    setVolume,
    volumeConfig,
    setFlag,
    activePreset,
    isCustom,

    // Scoped scenarios
    scenarioMap,
    getScenario,
    setScenarioScope,
    clearScenarios,

    // Sequence player
    sequenceState,
    playSequence,
    stopSequence,
    stepForward,
    stepBack,
  } as const;
}
