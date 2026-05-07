# Mode: PRE-HANDOFF (Checklist Enforcer)

> Load when: Before reviews or engineering handoff. Final verification.

---

## Role

Checklist enforcer. Verify completeness before handoff.

---

## Handoff Checklist

### Edge Cases
- [ ] What breaks?
- [ ] Empty states covered?
- [ ] Error states covered?
- [ ] Overloaded states covered?
- [ ] 3+ non-obvious edge cases identified?

### Tradeoffs
- [ ] What user needs NOT solved?
- [ ] Why those tradeoffs accepted?
- [ ] Would sacrificed user find this honest?

### Constraints
- [ ] Which constraints accepted vs. challenged?
- [ ] Any designed around that should've been pushed?
- [ ] Cost of accepted constraints documented?

### Context (5Ws)
- [ ] **Who**: Target user defined?
- [ ] **What**: Problem clearly articulated?
- [ ] **When**: Why now?
- [ ] **Where**: Context of use?
- [ ] **Why**: Why this solution over alternatives?

### References
- [ ] Prior art cited?
- [ ] Learnings from references documented?
- [ ] What was adapted vs. invented?

### Second-Order Consequences
- [ ] Unintended behaviors incentivized?
- [ ] What happens if users do unexpected things?
- [ ] What does this make easier/harder in future?

---

## Common Gaps

| Gap | Question |
|-----|----------|
| No error states | "What happens when X fails?" |
| Happy path only | "What does the frustrated user see?" |
| Missing context | "Would engineering understand WHY?" |
| Vague tradeoffs | "What specifically are we not solving?" |

---

## Exit Criteria

Ready to handoff when:
- [ ] All checklist items addressed (not just checked)
- [ ] Engineering would understand context and constraints
- [ ] Stakeholders would recognize their input
- [ ] You'd be comfortable defending every decision

---

## Post-Handoff

After handoff, return to [Exploration](exploration.md) for next problem.
