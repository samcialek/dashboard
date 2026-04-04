# CLAUDE.md — PRISM Project Ground Truth

**READ THIS FIRST. Do not rediscover what is documented here.**
**Then read `RULES.md` for hard invariants, and `TASK.md` for current work.**
**At end of session, update `HANDOFF.md` with what you did and what's next.**

## What This Project Is

PRISM (Political Reasoning and Identity Simulation Model) is a Bayesian archetype-matching quiz.
Users answer questions → responses map to 14 L3 nodes → node profiles match against 124 archetypes → result is a political disposition archetype.

## The 14 Nodes (Canonical — from `nodes.ts`)

| # | ID | Type | Cluster | Full Name | Low ↔ High |
|---|------|-------------|---------|-----------|------------|
| 1 | MAT | continuous | ENDS | Material | Redistribution ↔ Free Market |
| 2 | CD | continuous | ENDS | Cultural Defense | Progressive ↔ Traditional |
| 3 | CU | continuous | ENDS | Cultural Uniformity | Pluralist ↔ Assimilationist |
| 4 | MOR | continuous | ENDS | Moral Circle | Universal ↔ Particularist |
| 5 | PRO | continuous | MEANS | Proceduralism | Rules-bound ↔ Outcome-focused |
| 6 | EPS | categorical | MEANS | Epistemics | (empiricist, institutionalist, traditionalist, intuitionist, autonomous, nihilist) |
| 7 | AES | categorical | MEANS | Aesthetics | (statesman, technocrat, pastoral, authentic, fighter, visionary) |
| 8 | COM | continuous | MEANS | Compromise | Principled ↔ Pragmatic |
| 9 | ZS | continuous | REALITY | Zero-Sum | Positive-sum ↔ Zero-sum |
| 10 | ONT_H | continuous | REALITY | Ontology-Human | Pessimistic ↔ Optimistic |
| 11 | ONT_S | continuous | REALITY | Ontology-System | Declining ↔ Thriving |
| 12 | PF | continuous | SELF | Partisan Fusion | Independent ↔ Partisan |
| 13 | TRB | continuous | SELF | Tribalism | Universalist ↔ Tribal |
| 14 | ENG | continuous | SELF | Engagement | Apolitical ↔ Engaged |

**Clusters:** ENDS (what you want), MEANS (how you pursue it), REALITY (how you see the world), SELF (political identity)

12 continuous nodes (scored 1–5, with salience 1–3) + 2 categorical nodes (EPS, AES).

### L1 Primitives (4) — feed into L3 via influence mappings
- CAL (Reality Calibration), EC (Epistemic Curiosity), DEF (Deference), ERR (Error Preference)
- Defined in the scorer, NOT in archetypes. These are derived from calibration questions.

### Note on `H` (Hierarchy)
The scorer (`prism_scorer_v156.js`) references a 15th node `H` (Hierarchy). This is a **legacy artifact** — `nodes.ts` and `archetypes.ts` do not use it. **Do not add H to the node list.**

## There Are Exactly 124 Archetypes

**Do NOT rediscover this number.** Do NOT recount. Do NOT add or remove archetypes without explicit instruction.

8 were collapsed from the original 132:
- 018 Social Avenger → 017 Uncompromising Redistributionist
- 038 Abundance Planner → 037 Fabian Modernizer
- 044 Parish Steward → 045 Rooted Social Reformer
- 066 Entrepreneurial Reformer → 065 Opportunity Liberal
- 068 Inventive Libertarian → 069 Bleeding-Heart Libertarian
- 113 Expressive Libertine → 112 Contrarian Intellectual
- 114 Political Nihilist → 111 Diogenes Independent
- 123 Contented Householder → 122 Civic Minimalist

## Canonical Files (Source of Truth)

| File | Purpose | Authority |
|------|---------|-----------|
| `prism-quiz-engine/src/config/archetypes.ts` | 124 archetype definitions (id, name, tier, prior, node profiles) | **PRIMARY** |
| `prism-quiz-engine/src/config/nodes.ts` | 14 node definitions | **PRIMARY** |
| `prism-quiz-engine/src/config/questions.full.ts` | Full question bank | **PRIMARY** |
| `prism-quiz-engine/src/config/questions.representative.ts` | Representative question subset | PRIMARY |
| `prism_scorer_v156.js` | Scoring engine (L1→L3 mappings, cross-loading) | Reference |
| `prism_archetypes_calibrated.js` | 111 archetypes (older v157 calibrated export) | **OUTDATED** — do not use as source |
| `gh-dashboard/prism-quiz.html` | The live quiz HTML | Output artifact |

**When in doubt, `archetypes.ts` and `nodes.ts` are the single source of truth.**

## Do / Don't

### DO:
- Read this file at the start of every session
- Check `TASK.md` for current work in progress
- Run verification checks from `VERIFICATION.md` after changes
- Update `HANDOFF.md` at end of session

### DON'T:
- Rediscover archetype count (it's 124)
- Rediscover node count (it's 14)
- Use `prism_archetypes_calibrated.js` as source of truth (it's 111, outdated)
- Add node `H` (it's legacy)
- Revert to archived/backup files (`*.bak`, `*_backup.*`, `*_FORKED.*`)
- Create new archetype files without explicit instruction
