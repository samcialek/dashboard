# Serif × Examine: Technical Integration Brief

**From population evidence to personalized inference**

---

## The Problem

Health recommendations today fall into two failure modes:

1. **Generic population advice** -- "take vitamin D" -- that ignores individual variation in genetics, lifestyle, and biomarkers. The average treatment effect is rarely the individual treatment effect.

2. **N-of-1 experimentation** with no grounding in existing evidence. People track 40 variables and A/B test supplements on themselves without priors, which means they're mostly fitting noise.

The missing piece: a systematic way to start with what the research literature already knows (population-level evidence), then update those estimates with individual-level data as it comes in.

---

## The Methodology

Serif uses a Bayesian partial pooling approach -- drawn from McElreath's *Statistical Rethinking* framework -- to generate personalized health recommendations.

The process:

1. **Establish prior distributions** from population-level evidence (effect sizes, dose-response curves, moderator variables, heterogeneity estimates)
2. **Ingest individual data** from wearables, labs, and self-reports (HRV, sleep stages, blood glucose, dietary logs, etc.)
3. **Update via partial pooling** -- individual estimates are "shrunk" toward the population mean in proportion to uncertainty. Less individual data = lean more on the prior. More individual data = let the posterior diverge.
4. **Generate personalized recommendations** with explicit uncertainty bands -- not just "take magnesium" but "P(improvement in deep sleep) = 0.73 given your current data, with expected effect size of 12-18 minutes"

The key constraint: **the quality of the posterior depends entirely on the quality of the prior.**

---

## Where Examine Fits

Examine has spent 15 years building precisely the evidence base that Serif needs as input:

| What Serif Needs | What Examine Has |
|---|---|
| Effect sizes by intervention × outcome | Systematic evidence summaries for 400+ supplements and nutrients |
| Study quality weighting | Rigorous quality assessment methodology (no conflicts of interest, no cherry-picking) |
| Dose-response relationships | Dosage information across clinical populations |
| Moderator variables (age, sex, condition) | Population-specific breakdowns in evidence summaries |
| Heterogeneity estimates | Acknowledgment of mixed evidence and context-dependence |

Examine's editorial independence is actually a feature here, not just a brand attribute. Biased priors produce biased posteriors -- Serif's methodology *requires* an evidence source with no financial conflicts.

---

## Concrete Example: Caffeine Timing → Sleep Quality

**Step 1 — Prior from Examine's evidence base:**
- Population-level evidence suggests caffeine consumed within 6 hours of bedtime reduces total sleep time by ~40 minutes on average
- Effect is moderated by CYP1A2 genotype (fast vs. slow metabolizers), habitual caffeine intake, and age
- Examine's summary captures the heterogeneity: "the effects of caffeine on sleep vary widely between individuals"

**Step 2 — Individual data ingestion:**
- User wears an Oura ring. We observe their HRV, sleep onset latency, deep sleep %, and wake-after-sleep-onset
- User logs caffeine intake via app (timing, amount, source)
- Over 14 days, we accumulate individual caffeine × sleep observations

**Step 3 — Bayesian update:**
- Prior: population mean effect (-40 min total sleep) with wide variance reflecting known heterogeneity
- Likelihood: individual's observed data shows caffeine after 2 PM has minimal impact on total sleep time but *does* reduce deep sleep by ~22 minutes
- Posterior: this person is likely a fast metabolizer whose sleep architecture (not duration) is the sensitive measure. Recommendation shifts from "no caffeine after noon" (generic) to "caffeine fine until 3 PM, but expect 15-25 min deep sleep reduction if consumed after 1 PM" (personalized, with uncertainty)

**Step 4 — Recommendation with uncertainty:**
> "Based on your data and the existing research, afternoon caffeine appears to cost you about 20 minutes of deep sleep (90% credible interval: 10-30 min), without significantly affecting total sleep time. This is consistent with faster caffeine metabolism. Your call on the tradeoff."

This is what personalization looks like when it's grounded in evidence rather than vibes.

---

## What the Partnership Looks Like Practically

**Phase 1 — Structured data access**
- Serif licenses Examine's evidence summaries in a structured format suitable for prior construction
- We work with Examine's research team to define the schema: intervention, outcome, effect size range, quality weight, key moderators
- Starting domain: sleep, stress, and metabolic health (our current clinical focus)

**Phase 2 — Collaborative prior development**
- Joint development of prior distributions for the top 50 intervention × outcome pairs
- Examine contributes the evidence synthesis; Serif contributes the statistical modeling
- Output: a shared library of evidence-informed priors that both organizations can reference

**Phase 3 — Feedback loop**
- As Serif accumulates individual-level data across users, aggregate (de-identified) posterior distributions become a new signal
- Example: if Serif observes that the population prior for melatonin × sleep onset latency consistently overestimates the effect in users over 60, that's a signal for Examine's research team
- The inference layer becomes a real-world evidence complement to clinical trial data

---

## Proof Points (Serif)

- **92% retention** (up from 60%) after switching to Bayesian personalization
- **80 hours → 10 minutes** per patient program generation
- **3.2x engagement** vs. static recommendation approaches
- **Human Edge pilot** -- 350 users, executive wellness in India, active deployment
- **$2.3M SBIR** funded (causal inference methodology)

---

## Why This Makes Sense for Examine

1. **Methodological alignment** -- Examine's mission is evidence-based, not product-based. This is an evidence integration, not a marketing partnership.
2. **New surface area for the evidence** -- Examine's research currently lives on a website. This puts it into an inference engine that generates individualized recommendations -- a fundamentally new application of the same data.
3. **Real-world evidence feedback** -- Aggregate posterior data from Serif's user base gives Examine a signal they currently lack: how population-level evidence holds up (or doesn't) at the individual level.
4. **Revenue without compromise** -- Data licensing is cleaner than ads, sponsorships, or affiliate deals. No editorial conflicts. No supplement companies in the mix.

---

*Prepared by Sam Cialek · Serif · serif.life*
