/**
 * Transition sequence definitions for the persona switcher's sequence player.
 * Each sequence is a series of steps that auto-advance through different states.
 */

import type { PersonaKey, ScenarioKey, VolumeKey, FlagKey, ScopedScenarioMap } from "./personas";

export type SequenceStep = {
  label: string;
  duration: number;
  persona?: PersonaKey;
  flagOverrides?: Partial<Record<FlagKey, boolean>>;
  scenario?: ScenarioKey | ScopedScenarioMap;
  volume?: VolumeKey;
};

export type Sequence = {
  name: string;
  description: string;
  steps: SequenceStep[];
};

export const SEQUENCES: Sequence[] = [
  {
    name: "Onboarding Flow",
    description: "New user → completes onboarding → returning user",
    steps: [
      { label: "Day 1", duration: 3000, persona: "new-user" },
      { label: "Onboarded", duration: 3000, persona: "new-user", flagOverrides: { hasCompletedOnboarding: true } },
      { label: "Integrated", duration: 3000, persona: "new-user", flagOverrides: { hasCompletedOnboarding: true, hasIntegrations: true } },
      { label: "Active User", duration: 3000, persona: "returning" },
    ],
  },
  {
    name: "Error Recovery",
    description: "Normal → error → loading → recovered",
    steps: [
      { label: "Normal", duration: 2000, scenario: "none" },
      { label: "Error", duration: 3000, scenario: "error" },
      { label: "Retrying", duration: 2000, scenario: "loading" },
      { label: "Recovered", duration: 2000, scenario: "none" },
    ],
  },
  {
    name: "Data Growth",
    description: "Empty → sparse → typical → heavy",
    steps: [
      { label: "Empty", duration: 2000, volume: "empty" },
      { label: "Sparse", duration: 2000, volume: "sparse" },
      { label: "Typical", duration: 2000, volume: "typical" },
      { label: "Heavy", duration: 2000, volume: "heavy" },
    ],
  },
];
