# Aaru Presentation — Full Spoken Script (v2-final)

**Audience:** Patrick Young, Matt Hower, John Kessler, Yun-Duk Kim, ~5 people.
**Duration:** ~25-30 minutes + Q&A
**Tone:** Conceptually serious, conversational, not a lecture.
**Recurring motif:** "What kind of system do you need if reality changes faster than your reporting cycle?"

---

## PART 1: Why I'm Giving This (~2.5 min)

*[SLIDE: Getting on the Same Page]*

So I want to start by being direct about what this is.

We come from somewhat different backgrounds, and I've been working independently for a while now. Over the last couple of years I've developed a way of thinking about causal modeling, agent behavior, and population simulation that I'm pretty confident in — but some of my vocabulary may be idiosyncratic. We may be pointing at the same ideas with somewhat different language.

Part of the point of this presentation is to fix that. I want to translate my language into shared language.

This has three goals.

First, **vocabulary sync**: get on the same page about what I mean by things like causal structure, counterfactual reasoning, and hierarchical representation.

Second, **research sync**: make my assumptions and priorities legible — not just what I built, but how I think about these problems.

Third, **what I bring**: give you a compressed picture of the work and intuitions I've been building across a few domains, and why I think they connect directly to what Aaru is doing.

So with that framing in place, let me tell you what I think the actual modeling problem is.

---

## PART 2: Why Prediction Isn't Enough (~2.5 min)

*[SLIDE: Prediction is necessary, but not sufficient]*

Let me start with a claim that sits underneath everything else I'm going to say.

Prediction is necessary, but it is not sufficient.

Across standard predictive approaches, gains flatten fairly quickly. At some point, another marginal improvement in prediction accuracy stops being the thing that really matters.

The more important question is: *what kind of capabilities does the model support?*

Can it tell you what happens if you intervene? Can it tell you what happens when conditions change? Can it simulate outcomes across different subgroups, contexts, and time horizons?

This matters from a product perspective, not just a research perspective. John and I talked about this directly. A lot of analysis in this space still looks like: build a model, run it, write a report, revisit it 90 days later. Maybe quarterly, maybe annually.

But what if something changes today? Oil prices spike. An exchange rate moves. A policy gets announced. Attention shifts.

What you want, ideally, is a system that can absorb that change and show you the downstream implications immediately — not after the next reporting cycle, and not after a static retrain six weeks later.

That requires a different kind of model. Not just a better predictor — a different capability class.

And that's what the rest of this presentation is about.

---

## PART 3: The Dependency Chain (~2 min)

*[SLIDE: The Dependency Chain]*

So if prediction alone isn't enough, what do we actually need?

I think the answer has three main layers.

First: **hierarchical causal structure**. You need a representation with explicit mechanisms at multiple levels of abstraction, not just a surface pattern-matcher. Without that, you can't distinguish an association from a cause.

Second: **counterfactual reasoning**. Once you have the right structure, you can ask the questions that matter for decisions: if we do X, what happens to Y? What would have happened otherwise? How does that differ across people, contexts, and subgroups?

Third: **online updating**. The world changes. Relationships drift. A useful system has to revise itself as evidence arrives, rather than waiting for a quarterly retrain.

And sitting in the middle of all of this is one key operational question: *where do you intervene?* In a complex system, what is the minimal set of variables you actually need to observe or control? That's where Markov blankets become useful — they define the local informational boundary around a variable.

Most of this talk is about the causal core: structure, counterfactuals, and where intervention actually lives. I'll come back to updating at the end, because that's what makes the system live.

---

## PART 4: Causal Vocabulary (~5 min)

*[SLIDE: Pearl's Ladder of Causation]*

Before I get into examples, I want to spend a few minutes on vocabulary. Not as a lecture — but so that when I use terms like "backdoor path" or "Markov blanket" later, we're pointing at the same things.

The framework comes from Judea Pearl. He organizes causal reasoning into three levels.

**Rung 1: Seeing.** Association. "People on GLP-1 tend to drink less." This is P(Y|X). Observe the data, find the pattern. Most machine learning lives here.

**Rung 2: Doing.** Intervention. "If I *give* someone GLP-1, will they drink less?" This is P(Y | do(X)). A fundamentally different question — it asks about the effect of an action, not just an observation.

**Rung 3: Imagining.** Counterfactual. "Would this specific person have drunk less *even without* GLP-1?" Reasoning about alternate worlds. This is where many of the most important product and strategy questions live.

Most systems operate on Rung 1. Real decision support requires Rung 2. Strategy — and good simulation — requires Rung 3.

*[SLIDE: How to Isolate Causal Effect — d-Separation]*

The thing that makes this principled is the causal graph — a DAG where the edges are meant to represent mechanisms, not just associations. The key concept is **d-separation**: given a graph, when are two variables independent conditional on some third set?

Three canonical patterns. One clean intuition each.

**The chain:** X causes M, M causes Y. Condition on M and you block information flow from X to Y. You've cut the mechanism.

**The fork:** Z causes both X and Y. They look correlated, but only through their common cause. Condition on Z and the spurious association disappears. This is deconfounding.

**The collider:** X causes C, Y causes C. X and Y are actually independent — but condition on C and you *create* a spurious link. This is why "just control for everything" can make your estimates worse.

These three patterns are the grammar. Every complex graph decomposes into combinations of them.

*[SLIDE: Backdoor Adjustment]*

First practical tool: **backdoor adjustment**.

You want the causal effect of X on Y. But there are backdoor paths — non-causal paths through common causes contaminating your estimate. The solution: find a set of variables that blocks all backdoor paths while keeping the causal path open.

In other words: block the spurious paths, preserve the mechanism.

This is the foundation of observational causal inference. It lets you estimate intervention effects without running an experiment — *if* you have the right causal model.

This isn't just statistical technique. It's the foundation for knowing whether an intervention will actually work.

*[SLIDE: Front-Door Adjustment]*

The subtler case: the confounder between X and Y is *unobserved*. You can't condition on what you can't measure.

What Pearl showed is that you can sometimes still identify the causal effect — if you can observe the *mechanism*. X causes M, M causes Y, and there's no unblocked backdoor from X to M. The mediator gives you a path to identification even when the confounder is hidden.

When the direct road is confounded, the mechanism can still give you a way through.

This is not "controlling for more variables." It's identifying causality *through structure* — using the graph itself as the identification strategy. In real-world settings, you almost always have unmeasured confounders. The question is whether the structure gives you a way through. Sometimes it does.

---

## PART 5: GLP-1 — Establishing Causal Rigor (~4 min)

*[SLIDE: The Naive Model]*

Let me make all of this concrete.

GLP-1 drugs — Ozempic, Wegovy — took off in 2023-2024. The consensus forecast from standard modeling was simple: GLP-1 reduces appetite, people drink less, alcohol revenue drops 12%.

One arrow. One direction. Linear and uniform.

*[SLIDE: The Real DAG]*

But if you unpack the mechanisms, the structure looks more like this: multiple interacting pathways rather than a single direct effect. GLP-1 doesn't just suppress appetite. It triggers weight loss, which changes body image, which changes confidence, which changes socialization patterns. Several of those pathways can actually *increase* drinking in certain subgroups.

The naive model missed this because it treated GLP-1 → alcohol as a single direct link. It ignored the mediators, the confounders, and the heterogeneous pathways through different mechanisms.

*[SLIDE: do(GLP-1) on a Population]*

Scale it up. Same drug, three people.

A 25-year-old urban professional woman: weight loss leads to confidence, leads to more socialization. Alcohol spending goes *up*.

A 55-year-old suburban man: direct craving suppression. Solo drinking drops. Alcohol spending goes *down* substantially.

A 35-year-old rural mother: weight loss through a pathway with no alcohol connection. Zero change in drinking. Snack spending drops significantly.

Same intervention. Three completely different causal pathways. Three completely different outcomes.

The consensus forecast was −12%, uniform. A causal simulation suggests the average effect could be much smaller — and more importantly, that the average conceals radically different subgroup pathways. The average treatment effect is useful, but no one in the room is an average person.

*[SLIDE: Heterogeneous Treatment Effects]*

And it's not just heterogeneous across people — it's heterogeneous across time.

A mechanism-aware model makes it possible to represent how an apparent short-run effect could reverse once slower second-order pathways begin to dominate. The first-order effect — appetite suppression — peaks early and fades. The second-order effect — confidence to socialization to social drinking — takes longer to develop. A causal simulation can represent that rebound because it models the second-order pathway explicitly.

I want to be clear about what's implemented versus what's being illustrated here. The causal architecture is real — I'll show you the actual system in a few minutes. The temporal extension in this example is a mechanism-grounded simulation of the kind of dynamics that architecture is designed to support, not a fully trained longitudinal model.

This is what causal structure buys you: not a better aggregate prediction, but the ability to see that the aggregate is concealing completely different dynamics in different subgroups, across different time horizons.

---

## PART 6: Counterfactual Reasoning — A Different Domain (~3 min)

*[SLIDE: Counterfactual — Rural Evangelical Male]*

Now I want to show what a counterfactual actually looks like — and I'm switching domains deliberately, because the point is that this machinery is not domain-specific.

Take a person: Rural Evangelical White Male, age 50. Ask a counterfactual: what happens if we intervene on his education? Specifically: do(education = graduate degree).

A correlational model would tend to say: people with graduate degrees are, on average, more liberal, so this should move him left across the board.

And in part it does. His party ID moves left. His ideology moves left.

But his Trump approval increases.

That's the point. Education is not operating through a single average pathway. It operates through multiple mechanisms in a specific social context. In the modeled example, some of those mechanisms — like increased economic security and social confidence — reinforce identity commitments rather than weakening them.

This is what counterfactual reasoning gives you: not just the average effect of education, but an account of what happens to *this person*, through *these pathways*, in *this context*.

A correlational model can only tell you the average association. A causal model traces the individual mechanisms.

And this is exactly the capability you need for agent-based simulation. Every agent is a person with a specific context. The effect of any intervention depends on which pathways it activates for *that agent*.

---

## PART 7: Markov Blankets — Where to Intervene (~2.5 min)

*[SLIDE: Markov Blankets]*

So you have a causal graph. You can reason about interventions and counterfactuals. But there's a practical question: in a complex system with many variables, *where do you actually intervene?* What matters and what's noise?

This is where Markov blankets become important.

A Markov blanket is the minimal local boundary around a variable — the variables you need to know in order to screen it off from the rest of the system. In graph terms, that usually means its parents, its children, and the variables that jointly determine those children.

If you know the Markov blanket of your outcome variable, you know exactly what matters and what's noise. Conditional on the blanket, everything outside it becomes locally irrelevant.

Three practical consequences.

First: **efficient measurement**. If you're designing a survey or deciding what data to collect about an agent, the blanket tells you the minimum sufficient set. Don't measure everything — just the boundary.

Second: **agent state representation**. When you're building a simulated agent, the blanket defines what the agent actually needs to carry in its internal state. Everything else can be marginalized out.

Third: **local updating**. When something changes in the world, you don't need to re-estimate the entire model. You only need to update variables whose blankets include the thing that changed.

And this circles back to the product question: what kind of system do you need if reality changes faster than your reporting cycle? One answer: a system that knows its own informational boundaries and can update locally rather than globally.

---

## PART 8: Do-Calculus — Briefly (~1 min)

*[SLIDE: Climbing the Ladder]*

One more piece of formal machinery — briefly, because it ties the tools together.

Backdoor adjustment and front-door adjustment are both specific cases of a more general framework Pearl developed: the **do-calculus**. Three rules for when you can convert an interventional query — P(Y | do(X)) — into something estimable from observational data.

The intuition: "How do you turn *do* into *see*?" When can you climb from Rung 1 to Rung 2 using only the graph and observed data?

The answer is: when the graph gives you enough structure to identify the effect by blocking the right paths. Backdoor and front-door are the two most common recipes. The do-calculus is the complete set of rules.

I won't go deeper here. The point is: this is not ad hoc. There's a complete, principled theory for when causal effects are identifiable. The graph is what makes identification possible.

---

## PART 9: An Aaru Use Case (~3 min)

*[SLIDE: Causal Structure in the Agent]*

Let me bring all of this back to something concrete for Aaru.

You have synthetic agents simulating a population. A lot of current population simulation effectively treats agents as demographic profiles passed into a language model. The model generates a response from associational regularities in its training data.

That's Rung 1. It works for many things. But it has a specific limitation: it can't reliably answer intervention questions. If you change the messaging strategy for a segment, the model gives you *something* — but it's drawing on average associations, not tracing causal mechanisms through that agent's specific context.

What I'm proposing is that each agent should carry causal structure. Not just a label or a demographic bucket — an actual graph of mechanisms. When you simulate a messaging change, the effect should propagate through the agent's causal graph, not just shift a scalar.

That gives you:

**Heterogeneous effects**: different agents respond differently to the same intervention, because their causal pathways are different.

**Mechanistic transparency**: you can explain *why* the effect differs — which pathways activated, which didn't.

**Temporal dynamics**: first-order and second-order effects propagate at different speeds through the graph.

**Intervention targeting**: the Markov blanket of the outcome variable tells you exactly what you need to control or observe for each agent subgroup.

And this connects to the product question again: what kind of system do you need if the world changes between reporting cycles? A system where agents carry enough structure that when an exogenous condition shifts, the downstream implications propagate automatically. Not after a retrain. Not after a new report. Through the structure itself.

---

## PART 10: The Causal VAE — What I Actually Built (~3 min)

*[SLIDE: Causal VAE Architecture]*

Let me show you what this looks like as an actual implementation.

Over the last two years, I built a system called a Causal VAE — a variational autoencoder with explicit causal structure in the latent space.

The architecture: demographics go in — about 20 observable variables like age, education, income, geography, religion. The encoder maps them into a split latent space. One part captures demographic variation. The other captures psychographic variation — the latent dispositions that drive political and behavioral outcomes.

The split is one-directional: demographics influence psychographics, but not the reverse. Your age and education shape your political psychology. Your political psychology doesn't retroactively change your age.

In the psychographic latent space, there's an explicit causal graph — a DAG with predefined edges based on theoretical relationships. Authoritarianism influences policy dispositions. Openness influences cultural attitudes. Institutional trust influences engagement.

Each edge has a learned structural equation — a small neural network that estimates the strength and nature of each causal relationship. When you change a parent variable, the structural equations propagate that change through the graph to all downstream dimensions.

The decoder then maps the modified latent space to political and behavioral predictions: party ID, ideology, vote choice, policy positions, feeling thermometers.

This is where intervention becomes operational in the model. To compute a counterfactual, you alter a latent variable and propagate through the structural equations. The decoder gives you the new predicted behavioral profile.

I trained this on about 74,000 harmonized records from three major political surveys — CES, ANES, and the Voter Study Group. I built it for political behavior, but the architectural idea is domain-general — the same encoder-DAG-decoder structure works whether you're modeling political dispositions or health behaviors or consumer choices.

I want to be honest about scope. The architecture is real. The counterfactual mechanism — alter, propagate, decode — works. The DAG structure is informed by domain knowledge rather than discovered purely from data, which I actually think is the more mature approach — we tried learning the graph from data, and the data alone wasn't sufficient to recover sparse structure. Bringing in domain knowledge and using the model to estimate relationship *strengths* rather than relationship *existence* turned out to be better. What's not yet built is the online updating layer — the system learns its structure during training and holds it fixed at inference. Making it adaptive in real time is the engineering frontier.

---

## PART 11: Online Updating — The Frontier (~2 min)

*[SLIDE: Online Bayesian Updating]*

Which brings me to the last layer: online updating.

Everything I've shown so far can, in principle, be computed offline. Build the model, learn the structure, estimate effects. But the world doesn't hold still.

When something changes — a policy shift, a market shock, a cultural moment — some of the causal relationships in the model may no longer hold. Edge weights may have shifted. New pathways may have opened.

The architecture I've described is designed so that this kind of updating is structurally possible. The adjacency matrix and structural equations are modular — you can re-estimate a local neighborhood without rebuilding the entire model. The Markov blankets tell you which variables need to update when something changes.

The formal framework for detecting when structure has changed is Bayesian online change-point detection — maintaining a posterior over how long since the last structural break, and triggering re-estimation when the evidence warrants it.

I haven't built this as a production system yet. But the architecture supports it — the DAG plus structural equations are designed so that when edge weights change, all downstream predictions shift automatically. The engineering work to make this live is incremental, not architectural.

And this is the vision I want to work toward: a system where agents carry causal structure, interventions propagate through mechanisms, and the whole thing updates as reality changes. Not after the next quarterly reporting cycle. Continuously.

---

## PART 12: What I Bring (~2 min)

*[SLIDE: What I Bring]*

So let me close by being explicit about what I bring to this.

Two years of independent research on causal structure, latent representation, and agent-based modeling. Not as separate projects — as instances of the same underlying architecture applied across domains.

In political behavior: PRISM — a 14-dimensional political disposition model with 115 named archetypes, Bayesian adaptive question selection, and counterfactual simulation. PRISM grew out of the same core modeling interests: latent structure, posterior inference, and agent-level heterogeneity.

In health and consumer behavior: the GLP-1 counterfactual work I showed you — same architecture, different domain variables.

And a modeling taste built on partial pooling, hierarchical Bayes, structural causal models, and the conviction that the right answer to most modeling questions is not "more data" or "bigger model" — it's "better structure."

---

## PART 13: Where This Goes (~1.5 min)

*[SLIDE: Forward Collaboration]*

Where does this go?

What I'd like to build toward here is a system where agents carry causal structure, interventions can be evaluated before deployment, and changes in the world propagate through the model rather than waiting for the next reporting cycle.

That's the direction I think is most interesting — and it's what I'd like to build with you.

*[SLIDE: Close]*

The goal is not prediction. It's live counterfactual navigation of a changing world.

---

*Prepared by Sam Cialek — April 2026*

---

## APPENDIX: Implementation Grounding

| Section | Status | Notes |
|---|---|---|
| Part 5: GLP-1 DAG and HTEs | Domain translation | Same architecture, health-domain variables |
| Part 5: Time-bound effects | Conceptual | Cross-sectional model; temporal claims from domain reasoning |
| Part 5: HTE numbers | Illustrative | Not from a specific model run |
| Part 6: Political counterfactual | Real mechanism | `apply_structural_equations()` supports this |
| Part 10: Causal VAE architecture | Real | 6+ iterations, 74K harmonized records |
| Part 10: Split latent space | Real | `z_demo` + `z_psycho`, one-directional bridge |
| Part 10: Predefined DAG | Real | `FIXED_DAG_EDGES_PSYCHO` in iter6a |
| Part 10: Structural equation MLPs | Real | Per-dimension networks, learned edge strengths |
| Part 10: Counterfactual mechanism | Real | Alter input → propagate → decode |
| Part 11: BOCPD / online updating | Conceptual | Not implemented. Architecture supports it. |
| Part 11: Markov blanket local updating | Conceptual | Theoretically sound, not yet built |
| Part 12: PRISM 115 archetypes | Real | Deployed, live at matricesofconfusion.com |
| Part 12: VQ-VAE / archetype codebook | Real | `experiments/vq_sweep/` branch exists |
