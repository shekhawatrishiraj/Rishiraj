/**
 * Persona definitions for stakeholder prototype review.
 *
 * Each persona represents a user state that pages can render conditionally.
 * Pages consume the active persona via `usePersona()` and branch on flags.
 *
 * To add a new persona: add an entry here — the toolbar and hook pick it up automatically.
 */

// ---------------------------------------------------------------------------
// Flag definitions — metadata for each flag, used by the settings panel UI
// ---------------------------------------------------------------------------

export const FLAG_DEFINITIONS = {
  hasCompletedOnboarding: { label: "Onboarding",    shortKey: "onb", description: "Completed onboarding flow" },
  hasData:                { label: "Data",           shortKey: "dat", description: "Has existing data" },
  hasIntegrations:        { label: "Integrations",   shortKey: "int", description: "Has connected integrations" },
  hasContent:             { label: "Content",        shortKey: "cnt", description: "Has user-generated content" },
  isAdmin:                { label: "Admin",          shortKey: "adm", description: "Organization admin role" },
} as const;

export type FlagKey = keyof typeof FLAG_DEFINITIONS;
export const FLAG_KEYS = Object.keys(FLAG_DEFINITIONS) as FlagKey[];

// Reverse lookup: shortKey → flagKey
const SHORT_KEY_TO_FLAG = Object.fromEntries(
  FLAG_KEYS.map((k) => [FLAG_DEFINITIONS[k].shortKey, k])
) as Record<string, FlagKey>;

// ---------------------------------------------------------------------------
// Personas (presets)
// ---------------------------------------------------------------------------

export const PERSONAS = {
  "new-user": {
    label: "First-time User",
    shortLabel: "New",
    description: "Day 1 — no onboarding completed, empty states, no data",
    flags: {
      hasCompletedOnboarding: false,
      hasData: false,
      hasIntegrations: false,
      hasContent: false,
      isAdmin: false,
    },
  },
  returning: {
    label: "Regular User",
    shortLabel: "Regular",
    description: "Fully onboarded, 90-day history, active integrations",
    flags: {
      hasCompletedOnboarding: true,
      hasData: true,
      hasIntegrations: true,
      hasContent: true,
      isAdmin: true,
    },
  },
} as const;

export type PersonaKey = keyof typeof PERSONAS;
export type PersonaFlags = (typeof PERSONAS)[PersonaKey]["flags"];

export const DEFAULT_PERSONA: PersonaKey = "returning";
export const PERSONA_KEYS = Object.keys(PERSONAS) as PersonaKey[];

// Preset aliases — same data, friendlier naming for Phase 1+
export const PRESETS = PERSONAS;
export type PresetKey = PersonaKey;
export const PRESET_KEYS = PERSONA_KEYS;
export const DEFAULT_PRESET = DEFAULT_PERSONA;

// ---------------------------------------------------------------------------
// Scenarios
// ---------------------------------------------------------------------------

export const SCENARIOS = {
  none: { label: "Normal", description: "Default happy path" },
  error: { label: "Error", description: "API failures, broken states" },
  loading: { label: "Loading", description: "Skeleton / spinner states" },
} as const;

export type ScenarioKey = keyof typeof SCENARIOS;

export const DEFAULT_SCENARIO: ScenarioKey = "none";
export const SCENARIO_KEYS = Object.keys(SCENARIOS) as ScenarioKey[];

// ---------------------------------------------------------------------------
// Scoped scenarios — target scenarios to specific domains
// ---------------------------------------------------------------------------

export type ScopeDomain = "onb" | "dat" | "int" | "cnt" | "adm" | "*";
export const SCOPE_DOMAINS: ScopeDomain[] = ["*", "onb", "dat", "int", "cnt", "adm"];
export const SCOPE_LABELS: Record<ScopeDomain, string> = {
  "*": "Global",
  onb: "Onboarding",
  dat: "Data",
  int: "Integrations",
  cnt: "Content",
  adm: "Admin",
};

export type ScopedScenarioMap = Partial<Record<ScopeDomain, ScenarioKey>>;

/**
 * Parse a scoped scenario string from the URL.
 * - No colon = global (backward compat): "error" → { "*": "error" }
 * - With colon = scoped: "error:int,loading:dat" → { int: "error", dat: "loading" }
 */
export function parseScopedScenario(raw: string | null): ScopedScenarioMap {
  if (!raw) return {};
  const parts = raw.split(",").filter(Boolean);
  const map: ScopedScenarioMap = {};
  for (const part of parts) {
    const colonIdx = part.indexOf(":");
    if (colonIdx === -1) {
      // Global shorthand: "error" → { "*": "error" }
      if (SCENARIO_KEYS.includes(part as ScenarioKey)) {
        map["*"] = part as ScenarioKey;
      }
    } else {
      const scenario = part.slice(0, colonIdx) as ScenarioKey;
      const scope = part.slice(colonIdx + 1) as ScopeDomain;
      if (SCENARIO_KEYS.includes(scenario) && SCOPE_DOMAINS.includes(scope)) {
        map[scope] = scenario;
      }
    }
  }
  return map;
}

/**
 * Serialize a scoped scenario map to a compact URL string.
 * Uses "error" when only global, "error:int,loading:dat" when scoped.
 * Returns null when empty.
 */
export function serializeScopedScenario(map: ScopedScenarioMap): string | null {
  const entries = Object.entries(map).filter(
    ([, v]) => v && v !== "none"
  ) as [ScopeDomain, ScenarioKey][];
  if (entries.length === 0) return null;
  // Compact form: single global entry → just the scenario key
  if (entries.length === 1 && entries[0][0] === "*") {
    return entries[0][1];
  }
  return entries.map(([scope, scenario]) => `${scenario}:${scope}`).join(",");
}

/**
 * Resolve which scenario applies for a given scope.
 * Checks specific scope → falls back to "*" → falls back to "none".
 */
export function resolveScenario(map: ScopedScenarioMap, scope: ScopeDomain): ScenarioKey {
  return map[scope] ?? map["*"] ?? "none";
}

// ---------------------------------------------------------------------------
// Volume axis — data density dimension
// ---------------------------------------------------------------------------

export const VOLUMES = {
  empty:   { label: "Empty",   description: "Zero items" },
  sparse:  { label: "Sparse",  description: "1–3 items" },
  typical: { label: "Typical", description: "Normal usage" },
  heavy:   { label: "Heavy",   description: "100+ items" },
} as const;

export type VolumeKey = keyof typeof VOLUMES;
export const VOLUME_KEYS = Object.keys(VOLUMES) as VolumeKey[];
export const DEFAULT_VOLUME: VolumeKey = "typical";

// ---------------------------------------------------------------------------
// Flag serialization — compact URL encoding
// ---------------------------------------------------------------------------

/**
 * Parse a compact flag string into partial flag overrides.
 * Format: "onb:0,int:1" → { hasCompletedOnboarding: false, hasIntegrations: true }
 * Ignores unrecognized keys gracefully.
 */
export function parseFlagString(raw: string | null): Partial<Record<FlagKey, boolean>> {
  if (!raw) return {};
  const result: Partial<Record<FlagKey, boolean>> = {};
  for (const part of raw.split(",")) {
    const [shortKey, val] = part.split(":");
    const flagKey = SHORT_KEY_TO_FLAG[shortKey];
    if (flagKey && (val === "0" || val === "1")) {
      result[flagKey] = val === "1";
    }
  }
  return result;
}

/**
 * Serialize flag overrides to a compact URL string.
 * { hasCompletedOnboarding: false } → "onb:0"
 * Returns null when empty (so the param can be removed from the URL).
 */
export function serializeFlagOverrides(overrides: Partial<Record<FlagKey, boolean>>): string | null {
  const parts: string[] = [];
  for (const key of FLAG_KEYS) {
    if (key in overrides) {
      parts.push(`${FLAG_DEFINITIONS[key].shortKey}:${overrides[key] ? "1" : "0"}`);
    }
  }
  return parts.length > 0 ? parts.join(",") : null;
}
