# Aaru v6 — Slide Job List

Maps the frozen script (v2-final) to slides. Each slide has: title, purpose, visual type, on-screen text, and what's spoken-only.

---

## ACT I: Why We're Here (3 slides)

### Slide 0: "Getting on the Same Page"
- **Purpose:** Set the frame — why this presentation exists
- **Visual:** Pull-quote / title card. Dark bg, Cormorant Garamond hero text.
- **On-screen:** Title + subtitle ("Vocabulary, worldview, and research direction") + 3 bullet cards (Vocabulary sync / Research sync / What I bring)
- **Spoken only:** "We come from somewhat different backgrounds..." preamble, "translate my language into shared language"
- **Type:** Text-centered, fade-in

### Slide 1: "Prediction is necessary, but not sufficient"
- **Purpose:** Establish the insufficiency of prediction; create need for rest of talk
- **Visual:** Big centered pull-quote. No charts.
- **On-screen:** "Prediction is necessary, but not sufficient." + subtext: "The question is not whether we can predict — but whether a model can support intervention, adaptation, and simulation."
- **Spoken only:** The John Kessler / oil prices / 90-day reporting cycle motivation
- **Type:** Quote slide

### Slide 2: "The Dependency Chain"
- **Purpose:** Thesis slide — the conceptual stack
- **Visual:** Vertical chain diagram, 3 layers + 1 operational question branching from center
- **On-screen:** Three boxes: Hierarchical Causal Structure → Counterfactual Reasoning → Online Updating. Side branch: "Where do you intervene?" (Markov blankets). Caption: "The representation enables the questions. The updating keeps the system alive."
- **Spoken only:** Full explanation of each layer + "most of this talk is about the causal core"
- **Type:** Diagram, bottom-up animated build
- **Colors:** Causal=#1019EC, Counterfactual=#03E87A, Online=#EC1014, Intervention=#5BA8D9

---

## ACT II: Causal Vocabulary (4 slides)

### Slide 3: Pearl's Ladder of Causation
- **Purpose:** Establish the 3 rungs
- **Visual:** 3-rung vertical ladder. Reuse from v5.
- **On-screen:** Rung 1: Seeing / P(Y|X) / Rung 2: Doing / P(Y|do(X)) / Rung 3: Imagining / Counterfactual
- **Spoken only:** GLP-1 examples for each rung; "most ML lives here / decision support / strategy"
- **Type:** Existing v5 slide (slide 5), reused

### Slide 4: "How to Isolate Causal Effect" — d-Separation
- **Purpose:** Establish the 3 canonical graph patterns
- **Visual:** 3 small DAGs side by side: chain, fork, collider. Each with 1-line label.
- **On-screen:** Chain: "conditioning blocks transmission" / Fork: "conditioning removes confounding" / Collider: "conditioning creates bias". Footer: "These three patterns are the grammar."
- **Spoken only:** Full explanation of each; "just control for everything can make estimates worse"
- **Type:** NEW slide — 3-panel diagram
- **Reuse from v5:** Confounds slide (slide 8) has similar structure but different layout

### Slide 5: Backdoor Adjustment
- **Purpose:** First practical causal tool
- **Visual:** Clean DAG: Z→X→Y, Z→Y. Show backdoor path blocked.
- **On-screen:** "Block the spurious paths. Preserve the mechanism." + small DAG
- **Spoken only:** Full backdoor explanation; "the foundation for knowing whether an intervention will actually work"
- **Type:** NEW slide — DAG + pull-quote

### Slide 6: Front-Door Adjustment
- **Purpose:** When confounders are unobserved
- **Visual:** DAG: X→M→Y, hidden U between X and Y. Mediator highlighted.
- **On-screen:** "When the direct road is confounded, the mechanism can still give you a way through." + DAG
- **Spoken only:** Full front-door explanation; "identifying causality through structure"
- **Type:** NEW slide — DAG + pull-quote

---

## ACT III: Worked Example — GLP-1 (4 slides)

### Slide 7: The Naive Model
- **Purpose:** Set up the wrong answer
- **Visual:** Single arrow: GLP-1 → Alcohol Sales, "−12%". Reuse from v5.
- **On-screen:** "One arrow. One direction. −12%."
- **Spoken only:** Context about Ozempic/Wegovy; "linear and uniform"
- **Type:** Existing v5 slide (slide 6), reused

### Slide 8: The Real DAG
- **Purpose:** Show the actual causal structure
- **Visual:** 7-pathway DAG with 10 nodes. Reuse from v5.
- **On-screen:** DAG + caption about multiple interacting pathways
- **Spoken only:** How 3 pathways increase drinking; missed mediators/confounders
- **Type:** Existing v5 slide (slide 7), reused

### Slide 9: do(GLP-1) on a Population
- **Purpose:** Heterogeneous effects across 3 personas
- **Visual:** 3 persona columns with effect bars. Reuse from v5.
- **On-screen:** 3 personas + different outcomes
- **Spoken only:** Full persona descriptions; "no one in the room is an average person"
- **Type:** Existing v5 slide (slide 10), reused

### Slide 10: Heterogeneous Treatment Effects
- **Purpose:** Effects vary across time, not just people
- **Visual:** HTE table (4 segments × 3 time periods). Reuse from v5.
- **On-screen:** Table + callout about time reversal
- **Spoken only:** Honesty disclaimer ("mechanism-grounded illustration, not fully trained longitudinal model"); "the aggregate conceals completely different dynamics"
- **Type:** Existing v5 slide (slide 12), reused

---

## ACT IV: Counterfactual + Operational Tools (4 slides)

### Slide 11: Counterfactual — Rural Evangelical Male
- **Purpose:** Show counterfactual in a different domain; prove cross-domain generality
- **Visual:** Persona card + bar chart of before/after effects. Reuse from v5.
- **On-screen:** Persona + do(education=graduate) + effect bars showing ideology left but Trump approval up
- **Spoken only:** "machinery is not domain-specific"; pathway explanation; "what happens to this person, through these pathways, in this context"
- **Type:** Existing v5 slide (slide 9), reused with reframing

### Slide 12: Markov Blankets
- **Purpose:** Where to intervene — the operational question
- **Visual:** DAG with one node's Markov blanket highlighted (parents + children + co-parents). Clean, elegant.
- **On-screen:** "The minimal local boundary around a variable." + 3 consequences (efficient measurement / agent state / local updating)
- **Spoken only:** Full spoken definitions; "a system that knows its own informational boundaries"
- **Type:** NEW slide — DAG with highlighted boundary + bullet list

### Slide 13: Do-Calculus — Climbing the Ladder
- **Purpose:** Legitimize the formal machinery, briefly
- **Visual:** Arrow from "do(X)" to "see(X)" with graph structure as bridge. Minimal.
- **On-screen:** "How do you turn do into see?" + "The graph is what makes identification possible."
- **Spoken only:** Brief mention of 3 rules; backdoor/frontdoor as common recipes
- **Type:** NEW slide — concept diagram, very clean

### Slide 14: Causal Structure in the Agent — Aaru Use Case
- **Purpose:** Make it theirs — why this matters for Aaru's product
- **Visual:** Contrast diagram: left = "Demographics → LLM → Response (Rung 1)" / right = "Demographics → Encoder → Latent → DAG → Response (Rung 2+)"
- **On-screen:** "Each agent should carry causal structure." + 4 payoff bullets (heterogeneous effects / mechanistic transparency / temporal dynamics / intervention targeting)
- **Spoken only:** LLM limitation; "not just shift a scalar"; reporting cycle callback
- **Type:** NEW slide — comparison diagram + bullets

---

## ACT V: Implementation + What I Bring (3 slides)

### Slide 15: Causal VAE Architecture
- **Purpose:** Show what you actually built
- **Visual:** Architecture diagram: Demographics → Encoder → Split Latent [z_demo | z_psycho] → DAG → Structural Equations → Decoder → Behavioral Predictions. Reuse from v5 with modifications.
- **On-screen:** Architecture flow + "74K harmonized records / CES + ANES + VSG" + "alter → propagate → decode"
- **Spoken only:** Full technical explanation; one-directional bridge; domain knowledge vs learned graph; honesty about scope
- **Type:** Existing v5 slide (slide 18) substantially modified

### Slide 16: Online Updating — The Frontier
- **Purpose:** Frame online updating as next step, not fake-complete
- **Visual:** Timeline with change-point markers + local Markov blanket update zone highlighted. Partial reuse from v5 BOCPD slide.
- **On-screen:** "The engineering work to make this live is incremental, not architectural." + "Continuously, not quarterly."
- **Spoken only:** Full frontier framing; BOCPD concept; "architecture is organized so this is a natural next step"
- **Type:** Existing v5 slide (slide 15) substantially modified

### Slide 17: What I Bring
- **Purpose:** Explicit value statement
- **Visual:** Clean text, staggered reveal. 3 items.
- **On-screen:** "Two years of independent research..." / "Domain fluency across health, political behavior, and population simulation" / "Better structure > more data"
- **Spoken only:** PRISM mention; GLP-1 connection; modeling taste
- **Type:** NEW slide — text reveal

---

## ACT VI: Close (2 slides)

### Slide 18: Forward Collaboration
- **Purpose:** Point toward building together
- **Visual:** Clean text, warm tone
- **On-screen:** "What I'd like to build toward here..." (2-3 lines of the collaboration paragraph)
- **Spoken only:** Full spoken version; "that's the direction I think is most interesting — and it's what I'd like to build with you"
- **Type:** NEW slide — text

### Slide 19: Close
- **Purpose:** Final line
- **Visual:** Big centered text, dramatic
- **On-screen:** "The goal is not prediction. It's live counterfactual navigation of a changing world." + "Prepared by Sam Cialek — April 2026"
- **Spoken only:** Nothing — let the slide land
- **Type:** Quote slide, similar to v5 closing

---

## APPENDIX (press 'A')

### Appendix 1: R² Predictive Ceiling
- **Visual:** R² chart from v5 slide 1 + XGBoost comparison from v5 slide 2
- **Purpose:** Backup detail for "prediction flatlines" claim

### Appendix 2: Capability Comparison Table
- **Visual:** Reuse v5 appendix table
- **Purpose:** Feature comparison backup

### Appendix 3: Sensitivity Decomposition
- **Visual:** Reuse v5 slide 14 (E-values, Cinelli-Hazlett)
- **Purpose:** Robustness backup for GLP-1 claims

---

## Summary

| Category | Count | New | Reused | Modified |
|---|---|---|---|---|
| Main slides | 20 (0-19) | 8 | 8 | 4 |
| Appendix | 3 | 0 | 3 | 0 |
| **Total** | **23** | **8** | **11** | **4** |

**New slides to build:** 0 (title), 4 (d-sep), 5 (backdoor), 6 (frontdoor), 12 (Markov), 13 (do-calc), 14 (Aaru use case), 17 (what I bring), 18 (collaboration)

**Reused from v5 as-is:** 3 (Pearl's Ladder), 7 (Naive), 8 (Real DAG), 9 (do-pop), 10 (HTE), 11 (counterfactual), 19 (close)

**Modified from v5:** 1 (prediction — text only, no chart), 2 (dependency chain — new diagram), 15 (architecture — modified), 16 (BOCPD — reframed as frontier)
