# RULES.md — Hard Invariants

These rules are **non-negotiable**. If a change would violate any of these, stop and ask.

## Archetype Invariants
1. There are exactly **124 archetypes** (IDs 001–132, with 8 gaps from collapsed archetypes)
2. Each archetype has: id, name, tier (T1–T4), prior (1/124 uniform), and node profiles
3. Priors are uniform: `1/124 = 0.00806...` — do not change without explicit instruction
4. Archetype IDs are stable — never renumber, never reuse a collapsed ID

## Node Invariants
5. There are exactly **14 L3 nodes** (defined in `nodes.ts`)
6. 12 continuous (scored 1–5, salience 1–3) + 2 categorical (EPS, AES)
7. Node `H` (Hierarchy) does NOT exist in the canonical model — ignore it
8. Every archetype must have profiles for all 14 nodes
9. Continuous node positions: integer 1–5 only. Salience: integer 1–3 only.

## File Authority
10. `archetypes.ts` is the single source of truth for archetype definitions
11. `nodes.ts` is the single source of truth for node definitions
12. Never overwrite canonical files with data from backup/archived/outdated files
13. The `*.bak`, `*_backup.*`, `*_FORKED.*` files are historical — read-only reference

## Quiz Invariants
14. Quiz must be able to reach all 124 archetypes (reachability = 100%)
15. No two archetypes should have identical node profiles
16. Tier distribution should remain roughly: T1 (~30), T2 (~35), T3 (~35), T4 (~24)

## Process Rules
17. Read `CLAUDE.md` before starting any work
18. Run `VERIFICATION.md` checks after any archetype or node change
19. Update `HANDOFF.md` at session end
20. Update `TASK.md` when starting or completing work
