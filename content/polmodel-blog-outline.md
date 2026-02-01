# PRISM: A Political Disposition Model
## Blog Post Outline — Draft Structure

*Working titles:*
- "What Is the Cause of Our Politics?" 
- "I Know This About Myself, and Assume as Much for Other People"
- "The XOR Problem in Politics"

> *"After creating this framework that could be applied broadly, I applied it broadly."*

---

## I. HOOK — The Quiz That Knows You by Your Chopsticks

**Core idea:** There are many creative ways to infer political beliefs. Some use PCA-like shortcuts — a quiz that shows flags of Palestine, Ukraine, and Taiwan and infers your ideology. Another asks if you can use chopsticks. These proxy signals *work* surprisingly well for coarse classification, and the best way to see why is through a **confusion matrix**.

**Confusion matrix example:** Create a 2×2 with axes:
- "I am sympathetic to the more ruthless means by which **my own** country exercises power."
- "I am sympathetic to the more ruthless means by which **other** countries exercise power."

This immediately reveals archetypes (hawk nationalist, pacifist, realist, etc.) more honestly than any self-reported ideology quiz.

**The problem:** These shortcuts commit a **proxy error**. They don't measure the *causes* of your political foundation — they measure *correlated outputs*. And correlation is not mechanism.

*(Source tasks: #7, #48, #41, #12)*

---

## II. WHAT'S WRONG WITH POLITICAL QUIZZES — A Taxonomy of Errors

### A. The Proxy Error
Most surveys claiming to reveal your political alignment are committing a proxy error. They use rolled-up constructs that are easy to measure but have no direct causal relationship with the thing you're modeling. The preference for using causal forces rather than convenient proxies is the foundation of PRISM.

*(Source: #12, #41)*

### B. Confusing Outcomes and Mechanisms
Some quizzes confuse *what you want* (outcomes) with *how you think we should get there* (mechanisms). These are fundamentally different psychological processes.

*(Source: #9)*

### C. Confusing Saliency for Extremism
Models often don't distinguish between someone who cares deeply about an issue (saliency) and someone who holds an extreme position on it. They also measure only *relative* preferences, not absolute ones. One person saying "all politicians are the same" and another saying "clearly that's not true" can *both* be right — if each is thinking about their own salient issues.

*(Source: #10, #33)*

### D. Assuming Ideology = 100% of Voting Behavior
Quizzes go in with the massive assumption that ideology fully determines voting. But identity, coalition loyalty, risk tolerance, time horizon, and temporal circumstances all contribute independently.

*(Source: #15)*

### E. Categorical vs. Continuous Confusion
Things which are categorical are often treated as continuous (and vice versa). A categorical political variable might actually be 2+ continuous variables that happen to have a small, knowable number of intersections. The left-right spectrum forces a continuous line through categorical clusters.

*(Source: #27, #24)*

### F. The Simplicity–Completeness Trade-off
There's been a trade-off between simplicity and completeness, and simpler models have dominated — not because they're more explainable, but because coding a more complete model was prohibitive. With LLMs generating good code, that constraint is gone. *"The last time I wrote a line of HTML was in Mrs. Williams' Programming class. My Claude Code acceptance rate is 100%."*

*(Source: #37, #14)*

---

## III. THE PRISM FRAMEWORK — Introducing the Layers

### The Metaphor
White light (your raw temperament) enters a prism (your life experiences) and refracts into a political spectrum. The question becomes: **how do we un-refract that light to understand the base-case, neutral-state political disposition?**

### TLDR (5 bullets)
1. Your political disposition has endogenous roots (personality, temperament)
2. Life experiences refract those roots into expressed positions
3. The resulting disposition maps to one of 71 archetypes
4. Current events create temporal dynamics that shift expressed positions
5. Measuring proxies instead of causes produces systematically wrong models

*(Source: #28)*

### How PRISM Differs from Haidt
Haidt's moral foundations framework is purely about moral intuitions. PRISM = Haidt's moral psychology **+** epistemic psychology **+** identity fusion dynamics **+** quantified measurement. 

- Haidt asks: *"What moral intuitions do you have?"*
- PRISM asks: *"What moral intuitions do you have, how do you reason about evidence, how fused is your identity with your coalition, and which of your beliefs actually follow from your psychology vs. being borrowed from your tribe?"*

*(Source: #18)*

---

## IV. L1 — ENDOGENOUS: The Raw Material

**What it is:** Your personality, temperament, cognitive style — the hardware you were born with. Risk tolerance, time horizon, openness, need for order, comfort with ambiguity.

**Key insight:** L1 defines a *range* of possible political dispositions, not a single one. Your L2 experiences select from within that range.

**Rule 1:** Measure the force or construct closest to the outcome. For L1, this means measuring temperament directly, not inferring it from policy preferences.

**Pathway example:** Risk tolerance and time horizon together create distinct political reasoning patterns. Someone's willingness to post political content on social media is itself a signal about their L1.

**Bayesian framing:** Bayesian thinking isn't about constructing a single world ground-up from data. It's about imagining all possible worlds that *could have* produced the data we see. Instead of moving from evidence to certainty, we move from uncertainty to probabilistically-structured belief. PRISM applies this: given someone's expressed politics, what are the possible L1 configurations that could produce them?

*(Source: #39, #26, #34, #2)*

---

## V. L2 — EXOGENOUS: The Prism / Refraction Layer

**What it is:** Formative experiences — where you grew up, your socioeconomic circumstances, education, cultural exposure, generational events, gender, how long you've lived and *what* you've lived through.

**The refraction:** L2 takes the range of possibilities from L1 and selects your actual political disposition (L3). Two people with identical L1 who grow up in vastly different circumstances will express different politics — but their *range* is the same.

**Nationalism as a lens:** Nationalism makes L2 effects visible. If you're a MAGA nationalist of the JD Vance variety — would you be the same kind of nationalist if born into the majority religion/ethnicity of a different country? Or is the attachment to the US *itself* a product of L2?

**Revealed preferences:** One way to get at revealed preferences (vs. stated ones) is to have *someone else* answer the questions about you. Self-report introduces systematic bias. A decision tree for when and how preferences need to be revealed would be a valuable tool.

**Immigration and L2:** Immigrants represent a fascinating L2 case — they carry one country's L2 imprint while living under another's political system. The question of allegiance and interest alignment becomes testable.

*(Source: #16, #6, #17, #44, #31)*

---

## VI. L3 — POLITICAL DISPOSITION: The 71 Archetypes

**What it is:** The output of L1 refracted through L2. Your political disposition — not a point on a left-right line, but a position in a multi-dimensional space that maps to one of 71 distinct archetypes.

**Calculating dispositions:** Show how to calculate:
- Idealism vs. realism
- Supply-side (abundance) vs. demand-side orientation
- "Maximizing to a construct" (e.g., "Is this America First?") vs. maximizing to outcomes

**The XOR problem:** Some political positions are non-linearly separable — you can't draw a straight line between camps. Two people who agree on 80% of policy can land in opposite coalitions because of one non-linear interaction.

**Diagram:** Three boxes — (1) Where we are, (2) How to get there, (3) Where we're going — with Identity as a separate, outside box that influences all three but belongs to none.

**When ideology matters:** Ideology *should* only dominate when measurement is hard (e.g., tension between short-term and long-term effects of free trade or welfare). When ideology colors straightforward, uncontroversially measurable things, that's a diagnostic signal about identity fusion overriding independent reasoning.

**Blind spots:** There are issues where no salient cleavage occurs and crystallized views haven't formed — e.g., process-oriented questions about presidential power. These gaps are themselves informative.

*(Source: #35, #30, #21, #20, #32, #38, #36, #25)*

### The Explore–Exploit Problem
Politics exhibits massive concept drift. Three forces act on each other — a genuine three-body problem — making political prediction difficult. Each person's political lifetime involves an explore/exploit dynamic: how much do you seek new information vs. double down on existing frameworks?

*(Source: #13)*

---

## VII. L4 — TEMPORAL DYNAMICS: The Same Person, Different Era

**What it is:** Current events, shifting coalitions, the information environment. L4 doesn't change your L1 — it activates different parts of the range that L2 originally selected from.

**Key question:** The conservative libertarian moment of 2010 vs. MAGA 2016 — does this represent a morph in fundamentals, or just exogenous circumstances bringing out a different side of *static* fundamentals? How much of politics is real push vs. real pull vs. reflexive?

**Two people, same L3, different L1:** People who arrive at the same L3 disposition via different L1s can *revert to different L3s* under L4 pressure. Same expressed politics today; different politics tomorrow under stress.

**Position hijacking:** Simulating how political entrepreneurs hijack positions — e.g., Nick Fuentes on JD Vance or Israel. The model can track how coalition dynamics shift when key actors reframe issues.

*(Source: #1, #39, #29)*

---

## VIII. APPLICATIONS — What This Model Can Actually Do

### A. Coalition Prediction (Not Horse-Race Prediction)
> "There are a million political prediction blogs. The forecast I think my model is better able to do is predicting which political coalitions might coalesce in different circumstances."

The model simulates not who wins, but *who aligns with whom* under different conditions.

*(Source: #11)*

### B. Generative Population Simulation
Pre-compute all combinations of political behaviors for each of the 71 archetypes. Instead of running all exogenous functions on each person's unique endogenous function at runtime, maintain a master lookup so only a simple search is needed. This enables population-scale simulation.

*(Source: #35)*

### C. The Politracker — Argue Better
A future module: put your political map against someone else's (your uncle who votes the other way) and find areas of agreement. Optimize your talking points for persuasion based on actual overlap, not assumed opposition.

*(Source: #8)*

### D. Expansion Packs
Answer questions and cover your blind spots. "Expansion packs for politics" — modular additions that let you go deeper on specific policy areas.

*(Source: #40)*

---

## IX. FUTURE WORK — Beyond Politics

### A. Historical Extension
Apply PRISM to the Founding Fathers. What were their L1s? How did their L2 (colonial America, Enlightenment ideas, plantation economics) produce their L3 dispositions?

*(Source: #23)*

### B. Personality & Culture Prediction
A future addition could predict your Myers-Briggs type, what TV shows you'd like, etc. — getting to a minimum number of questions by maximizing marginal explanatory value through **orthogonality**. Each question should be maximally informative given what's already been asked.

*(Source: #43)*

### C. First-Principles Resolution
A personal commitment: understand everything from first principles, or hold no view at all. The New Year's resolution that motivated this entire project.

*(Source: #25)*

---

## X. CLOSING

> *"Hand-grown, artisanally crafted sentences."*

This model doesn't tell you what to believe. It tells you *why* you believe what you believe — and whether those beliefs are authentically yours or borrowed from your coalition. The goal isn't prediction for its own sake. It's **self-knowledge at scale**.

---

## APPENDIX: Visual Assets Needed

1. **Confusion matrix:** Ruthlessness toward own country × other countries (2×2)
2. **PRISM layer diagram:** L1 → L2 (prism) → L3 → L4 (temporal overlay)
3. **Where/How/Where diagram:** Three boxes + Identity as separate external box
4. **Archetype map:** Visual of the 71 archetypes in disposition space
5. **Decision tree:** When/how to reveal preferences
6. **Coalition simulation:** Before/after under different L4 scenarios

---

*44 tasks from Todoist project "polmodel" (id: 2365607899) organized into this structure on Jan 31, 2026.*
