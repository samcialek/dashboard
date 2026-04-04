# Aaru Presentation v6 — TTS-Native Spoken Scripts
## 23 slides (affordance slide inserted after Markov Blankets)

**North star:** Counterfactual reasoning as the capability class. GLP-1 as running example. Causal structure as the operational layer. Affordance map as the bridge from structure to action. Online updating as the frontier.

All scripts below are written for spoken delivery. Short sentences. Clear cadence. No em dashes, no en dashes, no smart quotes, no semicolons. Preserved technical precision. Trimmed visual-dependent language.

---

### SLIDE 1 — Getting on the Same Page

So I want to start by being direct about what this is. We come from different backgrounds, and I've been working independently for a while. Some of my vocabulary may be idiosyncratic. We may be pointing at the same ideas with different language.

This talk has three goals. First, vocabulary sync. Get on the same page about what I mean by causal structure, intervention, counterfactual reasoning. Second, research sync. Make my assumptions visible. Not just what I built, but how I think about these problems. Third, what I bring. A compressed picture of two years of work, and why I think it connects directly to what Aaru is doing.

---

### SLIDE 2 — Prediction is Necessary, But Not Sufficient

Let me start with a claim that sits underneath everything I am going to say. Prediction is necessary, but not sufficient.

Across standard predictive approaches, gains flatten quickly. At some point, another marginal improvement in accuracy stops being what matters. The more important question is, what kind of capabilities does the model support.

Can it tell you what happens if you intervene. Can it adapt when conditions change. Can it simulate outcomes across different subgroups and time horizons.

John and I talked about this directly. A lot of analysis still looks like, build a model, run it, write a report, revisit it ninety days later. But what if something changes today. A policy shift, a market move, attention shifts. What you want is a system that absorbs that change and shows you downstream implications immediately. Not after the next reporting cycle.

That requires a different capability class. And that is what the rest of this talk is about.

---

### SLIDE 3 — The Dependency Chain

If prediction is not enough, what do we actually need. Three layers.

First, hierarchical causal structure. A representation with explicit mechanisms at multiple levels of abstraction. Without that, you cannot distinguish an association from a cause.

Second, counterfactual reasoning. Once you have the right structure, you can ask the questions that matter for decisions. If we do this, what happens. What would have happened otherwise. How does it differ across people.

Third, online updating. The world changes. Relationships drift. A useful system revises itself as evidence arrives. Not after a quarterly retrain.

And in the middle, where do you intervene. In a complex system, what is the minimal set of variables you need to observe or control. That is where Markov blankets come in. They define the local informational boundary around a variable.

Most of this talk is about the causal core. I will come back to updating at the end, because that is what makes the system live.

---

### SLIDE 4 — Pearl's Ladder of Causation

Before I get into examples, vocabulary. The framework comes from Judea Pearl. He organizes causal reasoning into three levels.

Rung one. Seeing. Association. People on GLP-1 tend to drink less. Observe the data, find the pattern. Most machine learning lives here.

Rung two. Doing. Intervention. If I give someone GLP-1, will they drink less. A fundamentally different question. It asks about the effect of an action, not just an observation.

Rung three. Imagining. Counterfactual. Would this specific person have drunk less even without GLP-1. Reasoning about alternate worlds. This is where the most important product and strategy questions live.

Most systems operate on rung one. Real decision support requires rung two. Strategy, and good simulation, requires rung three.

---

### SLIDE 5 — Squawk Box GLP-1 Clip

Before we go deeper into causal structure, I want to ground this in a concrete example we will come back to throughout. This is a short clip on GLP-1 drugs. The observation is that people on them are drinking less, spending less, eating differently. The interesting thing is not the weight loss effect. It is that a single intervention is rippling across behaviors nobody designed it to touch. That is the kind of system that forces you into causal reasoning. Because prediction alone cannot tell you which of those downstream effects will hold, which will fade, and for whom.

---

### SLIDE 6 — Why Causal Isolation Matters

Before we get into the tools, why are we doing all this path isolation.

Because observed associations mix together many different stories. Some are causal. Some are spurious. Some are collider-induced artifacts. If you want intervention-relevant knowledge, if you want to know what will actually happen when you act, you have to separate the causal pathway from the noise around it.

That is what the next few slides are about. The grammar for isolating causal effects.

---

### SLIDE 7 — d-Separation

The key concept is d-separation. Given a graph, when are two variables independent conditional on some third set. Three canonical patterns.

The chain. X causes M, M causes Y. Condition on M and you block information flow. You have isolated the direct effect.

The fork. Z causes both X and Y. They look correlated, but only through the common cause. Condition on Z and the spurious association disappears. The causal effect becomes identifiable.

The collider. X and Y both cause C. They are actually independent. But condition on C and you create a false dependency. This is why controlling for everything can make estimates worse.

These three patterns are the grammar. Every complex graph decomposes into combinations of them.

---

### SLIDE 8 — Backdoor Adjustment

First practical tool. Backdoor adjustment.

You want the causal effect of X on Y. But there are backdoor paths. Non-causal routes through common causes that contaminate your estimate. The solution. Find variables that block all backdoor paths while keeping the causal path open.

Block the spurious paths. Preserve the mechanism. Now the causal effect is identifiable from observational data. You can estimate what an intervention would do without actually running the experiment.

This is the foundation of observational causal inference. It is how you turn the do-operator into something estimable from data you already have.

---

### SLIDE 9 — Front-Door Adjustment

The subtler case. The confounder is unobserved. You cannot condition on what you cannot measure.

Pearl showed you can sometimes still identify the effect. If you can observe the mechanism. X causes M, M causes Y, and there is no unblocked backdoor from X to M. The mediator gives you identification even when the confounder is hidden.

When the direct road is confounded, the mechanism can still give you a way through.

This is not controlling for more variables. It is identifying causality through structure. Using the graph itself as the identification strategy. And this is where mediators become crucial. The mediator is not just a variable on the path. It is your rescue route when direct deconfounding fails.

---

### SLIDE 10 — The Naive Model

Let me make this concrete with a running example.

GLP-1 drugs. Ozempic, Wegovy. The consensus forecast was simple. GLP-1 reduces appetite, people drink less, alcohol revenue drops twelve percent.

One arrow. One direction. Linear and uniform. This is what you get from a rung one model. An observed association treated as if it were a single causal mechanism.

---

### SLIDE 11 — The Real Causal Structure

But unpack the mechanisms, and the structure looks like this. GLP-1 does not just suppress appetite. It triggers weight loss, which changes body image, which changes confidence, which changes socialization patterns.

Seven causal pathways. And here is the critical point. Three of them can actually increase drinking in certain subgroups. The confidence pathway. Weight loss leads to body image, which leads to confidence, which leads to socialization, which leads to more social drinking. That is a real mechanism. It is not noise. It is a second-order causal pathway that the naive model completely missed.

The naive model missed it because it treated GLP-1 and alcohol as a single direct link. It ignored the mediators, the confounders, and the fact that different mechanisms dominate for different people.

This is why causal structure matters. This is why you need the DAG.

---

### SLIDE 12 — do(GLP-1) on a Population

Scale it up. Same drug, three people.

A twenty-five-year-old urban professional woman. Weight loss leads to confidence, leads to more socialization. Alcohol spending goes up.

A fifty-five-year-old suburban man. Direct craving suppression dominates. Solo drinking drops substantially.

A thirty-five-year-old rural mother. Weight loss through a pathway with no alcohol connection. Zero change in drinking.

Same intervention. Three completely different causal pathways. Three completely different outcomes. The consensus forecast was minus twelve percent, uniform. But no one in the room is an average person.

---

### SLIDE 13 — Heterogeneous Treatment Effects

This is the payoff. Because different parent nodes, different starting demographics, different social contexts, different baseline mechanisms, affect different subgroups differently.

The treatment effect is not just heterogeneous across people. It is heterogeneous because different causal pathways activate for different subgroups. For some, the first-order appetite suppression dominates. For others, second-order confidence and socialization pathways create a rebound effect.

A causal model can represent this, because it traces each pathway separately. An associational model gives you one number. The causal model gives you a distribution of effects indexed by mechanism.

I want to be honest. The specific numbers here are illustrative. They are mechanism-grounded. They follow from the DAG structure. But they are not from a fully trained longitudinal model. The architecture to compute them is real. The point is what causal structure buys you. The ability to see that the aggregate conceals completely different dynamics in different subgroups.

---

### SLIDE 14 — Counterfactual: Rural Evangelical Male

Now I am switching domains deliberately. Because the point is that this machinery is not domain-specific.

Take a person. Rural evangelical white male, age fifty. Ask a counterfactual. What happens if we intervene on his education. Give him a graduate degree.

A correlational model says, people with graduate degrees are on average more liberal, so this should move him left across the board.

And in part, it does. Party ID moves left. Ideology moves left. But Trump approval increases.

Why. Because education is not operating through a single pathway. In the modeled example, increased economic security and social confidence reinforce existing identity commitments rather than weakening them. The causal graph traces this. An associational model cannot.

This is what counterfactual reasoning gives you. Not the average effect. What happens to this person, through these pathways, in this context. XGBoost cannot compute this. A causal model can.

And this is exactly the capability you need for agent-based simulation. Every agent is a person with a specific context. The intervention effect depends on which pathways activate for that agent.

---

### SLIDE 15 — Markov Blankets

So you have a causal graph. You can do interventions and counterfactuals. But there is a practical question. In a complex system with many variables, where do you actually intervene. What matters, and what is noise.

The DAG defines the answer. For any node, its Markov blanket is the minimal local boundary. The parents, the children, and the co-parents of its children. Everything outside the blanket is conditionally independent of that node, given the blanket.

The blanket tells you what is locally relevant. But the next question is, which of those variables actually carries the effect. That is the mediator question. The blanket gives you the boundary. The mediator identifies the mechanism within that boundary.

Together they answer a deeper question. At what level of abstraction should I intervene.

In the GLP-1 example, do you target appetite suppression directly, or do you target the neurochemical reward pathway underneath it. Those are different levels of abstraction. Different mediators. Different blankets. The structure tells you which level is actionable.

---

### SLIDE 16 — From Blanket to Affordance

Now here is the move that turns all of this from description into strategy.

The DAG tells you where leverage is. You have to tell it what is movable. Age is not a lever. Geography is not a lever. Some nodes you can only watch. The topology does not know that. You do.

So for each node in the graph, you ask four things. Reach. How much ripples downstream. Manipulability. Can this actually be moved. Specificity. Is the intervention a scalpel or a hammer. Does it stay on one pathway or spill across the graph. Tractability. Will the change stick, or is the variable overdetermined, with too many sufficient causes holding it in place.

Two warnings. Overdetermination. A node can be causally important and still intervention-resistant, because redundant parents stabilize it. And collapsed feedback. Many DAGs are acyclic only because we flattened feedback loops across time. In those cases, the real lever is not a node at all. It is a property of the loop. Its gain, its damping, its threshold.

Once you annotate nodes with these properties, the DAG stops being just a causal diagram. It becomes an affordance map. And now you can ask the real question. What is the minimum-cost set of manipulable, specific, tractable nodes whose blanket actually covers the outcome I care about.

That is intervention strategy.

---

### SLIDE 17 — Climbing the Ladder, do-Calculus

One more formal piece. Briefly.

Backdoor and front-door adjustment are both specific cases of Pearl's do-calculus. Three rules for when you can convert an interventional query into something estimable from observed data. How do you turn do into see.

The answer. When the graph gives you enough structure to identify the effect by blocking the right paths. Backdoor and front-door are the two most common recipes. The do-calculus is the complete set of rules. A guarantee that if the effect is identifiable, these rules will find the formula.

The graph is what makes identification possible.

---

### SLIDE 18 — Causal Structure in the Agent

Let me bring this back to Aaru.

You have synthetic agents simulating a population. A lot of current simulation treats agents as demographic profiles passed into a language model. The model generates responses from associational regularities in its training data. That is rung one.

What I am proposing is that each agent should carry causal structure. Not just a label. An actual graph of mechanisms. When you simulate a messaging change, the effect ripples through the agent's causal graph, not just shifts a scalar.

That gives you heterogeneous effects. Different agents respond differently because their pathways are different. It gives you mechanistic transparency. You can explain why. And it gives you intervention targeting. Because every agent carries its own affordance map. You know which variables are manipulable for which subgroup, and you know which of them are scalpels versus hammers.

The agents carry enough structure that when an exogenous condition shifts, the downstream implications ripple through automatically. Not after a retrain. Through the structure itself.

---

### SLIDE 19 — Causal VAE Architecture

Let me show you what this looks like as implementation.

I built a causal variational autoencoder. A VAE with explicit causal structure in the latent space. The architecture. About twenty demographic variables go in. The encoder maps them into a split latent space. One part captures demographic variation. The other captures psychographic variation.

The split is one-directional. Demographics influence psychographics, not the reverse. Your age shapes your political psychology. Your political psychology does not change your age.

In the psychographic space, there is an explicit causal graph. A predefined DAG with edges based on domain knowledge. Each edge has a learned structural equation. A small neural network estimating the strength of each causal relationship.

This is where the architecture connects to everything I have been saying. The DAG in the latent space is the same kind of structure we have been talking about. The structural equations are the mechanism. The Markov blankets are defined by the graph. And to compute a counterfactual, you alter a latent variable and ripple through the structural equations. The decoder gives you the new behavioral profile.

One design choice I want to be honest about. We tried learning the graph from data. Pure structure discovery. The data alone was not sufficient to recover sparse structure. What worked better. Bring in domain knowledge for which relationships exist. Use the model to learn how strong they are. Predefined structure, learned strengths. I actually think that is the more mature approach.

Trained on seventy-four thousand records from three major political surveys. Built for political behavior. But the architecture is domain-general. The same encoder, DAG, decoder works for health behaviors, consumer choices, anything with latent causal structure.

---

### SLIDE 20 — Online Updating

Which brings me to the last layer. Everything I have shown so far can be computed offline. Build the model, learn the structure, estimate effects. But the world does not hold still.

When something changes, a policy shift, a market shock, some causal relationships may no longer hold. Edge weights shift. New pathways open.

This is where the architecture pays off. The DAG plus structural equations are modular. You can re-estimate a local neighborhood without rebuilding the entire model. The Markov blankets tell you which variables need updating when something changes.

The picture. You are watching the system. A structural break is detected. Some regime has shifted. Local re-estimation fires. Only the affected neighborhood updates. The change ripples downstream. Causal children inherit the shift automatically.

The formal framework is Bayesian online change-point detection. Maintaining a posterior over how long since the last structural break. I have not built this as a production system. But the architecture supports it. The engineering work to make this live is incremental, not architectural.

The vision. Agents carry causal structure, interventions ripple through mechanisms, and the whole thing updates as reality changes. Continuously, not quarterly.

---

### SLIDE 21 — What I Bring

Two years of independent research on causal structure, latent representation, and agent-based modeling. Not separate projects. Instances of the same architecture across domains.

In political behavior. PRISM. A fourteen-dimensional model with one hundred fifteen archetypes, Bayesian adaptive selection, counterfactual simulation. Same core modeling interests. Latent structure, posterior inference, agent-level heterogeneity.

In health and consumer behavior. The GLP-1 work. Same architecture, different domain variables.

And a modeling taste built on partial pooling, hierarchical Bayes, structural causal models, and the conviction that the right answer to most modeling questions is not more data, or bigger model. It is better structure.

---

### SLIDE 22 — Forward Collaboration

What I would like to build toward here is a system where agents carry causal structure, interventions can be evaluated before deployment, and changes in the world ripple through the model rather than waiting for the next reporting cycle.

That is the direction I think is most interesting. And it is what I would like to build with you.

---

### SLIDE 23 — Close

The goal is not prediction. It is live counterfactual navigation of a changing world.

Happy to take questions.

---
