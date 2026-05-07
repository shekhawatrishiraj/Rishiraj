---
title: Design Tension Map
purpose: Structural backbone for /debate — map topic to tension pair before Round 1
---

# Design Tension Map

> Find the active tension pair(s) in the debate topic. These are the underlying disagreements — not the surface-level topic. A debate about "should we use RBAC?" is actually about Scale vs Simplicity and Platform vs Feature. Name the underlying tension before the debate starts.

---

## Primary Tension Pairs

| Tension | Evangelist Default | Pragmatist Default | Escalation Trigger |
|---------|-------------------|---------------|-------------------|
| **Consistency vs Context** | Global system rules, even when they create local friction | Local user needs, even when they create system exceptions | "Users don't care about your design system" vs "Exceptions compound into chaos" |
| **Innovation vs Familiarity** | Push the pattern forward; "familiar" is often "stagnant" | Copy what works; novel interaction requires learning cost users don't have budget for | "You're building for 2024, not 2026" vs "Novelty isn't usability" |
| **Scale vs Simplicity** | Design for the user base you're becoming | Design for the user base you have | "That complexity doesn't exist yet" vs "You can't bolt on architecture" |
| **Platform vs Feature** | Every decision is a platform decision; features are expressions of platform | This is a feature problem; don't let architecture block the feature | "You're overbuilding" vs "You're under-thinking" |
| **Craft vs Speed** | Shipping the wrong thing fast teaches you nothing useful | Shipping the right thing slow has an opportunity cost too | "Perfection is procrastination" vs "Speed without direction is expensive" |
| **Delight vs Utility** | Memorable moments create retention and word-of-mouth | Friction reduction creates daily habit | "Nobody remembers efficient" vs "Nobody returns to delightful-but-broken" |
| **Explicit vs Progressive** | Surface complexity explicitly; trust users to navigate | Progressive disclosure; reveal complexity only when needed | "You're hiding the product" vs "You're drowning new users" |
| **Autonomy vs Guardrails** | Give users full control; they'll figure it out | Guardrails reduce errors and support trust-building | "You're being paternalistic" vs "You're optimizing for power users who don't exist yet" |

---

## How to Use This Map

**Step 1**: Read the debate topic. Ask: what is the *underlying* disagreement?

**Step 2**: Find 1–2 tension pairs that best describe it. Most debates have a primary tension and a secondary tension.

**Step 3**: In Round 1, have both personas argue from their default position on the primary tension.

**Step 4**: In Round 2–3, let the secondary tension surface. This is often where the real disagreement lives.

**Step 5**: In Round 4 synthesis, name both tensions explicitly and resolve each one: "On Scale vs Simplicity we're shipping simple now and architecting for scale. On Platform vs Feature we're explicitly making this a feature and deferring the platform question."

---

## Common Topic → Tension Mappings

| Debate Topic | Primary Tension | Secondary Tension |
|--------------|----------------|------------------|
| RBAC vs owner/member permissions | Scale vs Simplicity | Platform vs Feature |
| Progressive disclosure vs show everything | Explicit vs Progressive | Delight vs Utility |
| AI responses: structured vs conversational | Innovation vs Familiarity | Utility vs Delight |
| Onboarding: guided flow vs self-serve | Autonomy vs Guardrails | Explicit vs Progressive |
| Navigation: global sidebar vs contextual nav | Consistency vs Context | Scale vs Simplicity |
| Notifications: real-time vs digest | Autonomy vs Guardrails | Craft vs Speed |
| Sharing model: link-based vs invite-only | Platform vs Feature | Scale vs Simplicity |
| Empty states: instructional vs minimal | Delight vs Utility | Explicit vs Progressive |

---

## Escalation Triggers

These phrases signal that the debate has hit peak tension. Use in Round 3 when the underlying assumption finally surfaces:

**Evangelist escalation phrases:**
- "You're designing for the user you can see, not the user you need."
- "That's user empathy as risk avoidance."
- "Show me the research. Your instinct isn't the same as user evidence."
- "You're post-hoc armoring a decision you haven't interrogated."

**Pragmatist escalation phrases:**
- "That's an elegant solution to a problem our users don't have."
- "I keep hearing about [competitor]. Their user is not our user."
- "We're adding a mental model. Who taught them that model?"
- "The unhappy path on this is really bad. Have you designed it?"

**Moderator escalation note (Round 3 only):**
Surface the assumption neither persona has named. Usually:
- A hidden agreement (both want the same outcome, disagree on path)
- A hidden disagreement (they're solving different problems)
- A missing variable (user data, timeline, org structure) that would resolve the debate
