# MASTER.md — Project Directory Map

**Canonical location:** `C:\Users\samci\Projects\polmodel\`
*(Extracted from `Downloads\polmodel-final\` which contains 3,000+ unrelated files)*

## Key Directories

```
polmodel/
├── prism-quiz-engine/          # TypeScript quiz engine (CANONICAL)
│   └── src/
│       ├── config/
│       │   ├── archetypes.ts       # 124 archetype definitions ★
│       │   ├── nodes.ts            # 14 node definitions ★
│       │   ├── questions.full.ts   # Full question bank
│       │   ├── questions.representative.ts  # Representative subset
│       │   └── categories.ts       # Question categories
│       ├── engine/
│       │   ├── archetypeDistance.ts # Distance/matching logic
│       │   └── nodeStatus.ts       # Node resolution tracking
│       └── types.js                # TypeScript type definitions
│
├── gh-dashboard/               # GitHub Pages output (built artifacts)
│   ├── prism-quiz.html            # The live quiz
│   └── prism-*.html               # Various visualizations
│
├── prism_scorer_v156.js        # Scoring engine (L1→L3, cross-loading)
├── prism_archetypes_calibrated.js  # 111 archetypes (OUTDATED, v157)
├── archetype_behaviors.js      # Behavior mappings
│
├── briefs/                     # Documentation & specs
│   ├── prism-complete-spec.md     # Full model specification
│   └── prism-*.md                 # Various briefs
│
├── docs/quiz/                  # Older quiz deployment
├── data/                       # Data files
├── precomputed/                # Precomputed archetype data
├── output/                     # Analysis outputs
├── archive/                    # Old/archived code (DO NOT USE AS SOURCE)
├── tmp/                        # Temporary/scratch files
│
├── CLAUDE.md                   # ★ Read first every session
├── RULES.md                    # Hard invariants
├── MASTER.md                   # This file (directory map)
├── TASK.md                     # Current work tracking
├── VERIFICATION.md             # Sanity checks
└── HANDOFF.md                  # Session continuity
```

## Quiz Flow

1. **Question presented** → user answers
2. **Response mapped** to one or more of 14 L3 nodes via scorer
3. **L1 primitives** (CAL, EC, DEF, ERR) computed from calibration questions
4. **L1→L3 influence** applied (e.g., well-calibrated → lower EPS)
5. **Cross-load discount** applied (multi-node questions get reduced weight)
6. **Node profile** assembled (12 continuous positions + 2 categorical)
7. **Distance calculated** to all 124 archetypes
8. **Best match** returned with confidence score

## Version History
- v157: 111 archetypes (calibrated export, Feb 2026)
- Quiz engine: 124 archetypes (current canonical, reduced from 132)
- v156: Scorer with L1 primitives and cross-loading
