# Beneath the Surface of Belief

*Six layers, five refractions, and why most attempts to model politics start too late in the chain*

March 2026 · Companion to: The Cause of Our Politics

---

Everything before explicit politics belongs to the problem of an agent encountering a world.

Before you have opinions about taxes or immigration or whether the president is doing a good job, you are a biological organism dropped into an environment you did not design. You have a nervous system that reacts to threats at a speed you didn't choose. You have a dopamine system that seeks or avoids novelty in ratios you didn't set. You have a capacity for empathy that was largely determined before you could speak.

You are, in the language of reinforcement learning, an agent. Instantiated by your own hardware, you will learn in the world and develop a *policy* -- a mapping from situations to actions. Over time, the lessons compound. What worked, what didn't, what felt right, what felt wrong. The policy crystallizes. And eventually, that policy starts generating outputs that the world recognizes as politics.

This essay is about the layers of that process -- six transformations that turn neural substrate into political behavior, and about why most attempts to model politics start too late in the chain.


---

## Unrolling the Loop

Here's the problem with modeling a political agent: the process is cyclical. Your behavior changes your environment, your environment reshapes your affordances, your affordances shift which dispositions are salient, and those dispositions generate new behavior. It's a feedback loop. And you can't do causal inference on a loop -- you need directed acyclic structure to ask "what causes what."

The trick is to unroll the cycle by conditioning on time.

At each layer of the process, an endogenous state (something internal to the agent) encounters an exogenous medium (something in the environment). The medium refracts the state into a new form. And that new form becomes the endogenous input to the next layer.

I find it useful to think about this in terms borrowed from machine learning. At every refraction, there are really only two questions: *is this a different algorithm, or different data?* When the same genome develops under different conditions, that's different data run on the same algorithm. When the same upbringing meets a fundamentally different neural architecture, that's the same data run on a different algorithm. At every layer, the endogenous state is the algorithm and the exogenous medium is the data. The output is the learned weights -- and those weights become the next layer's algorithm.

Each layer operates on a different timescale. The genome is evolutionary. Neurology is developmental (years). Personality crystallizes over a decade. Disposition shifts across political eras. Alignment updates with election cycles. Behavior is instantaneous. By stratifying on temporal scale, the feedback loop becomes a directed chain -- each layer's "environment" is the one that was active during its crystallization window.

This is what makes the process tractable. You don't model the full recurrence. You take snapshots at each timescale, treat each snapshot as a sufficient statistic of everything below it, and work with the directed graph.


---

## The Layers

### L0: Genome

The deepest layer is one you will never observe directly. L0 is the raw genetic instructions that specify the broad architecture of a nervous system, dopamine receptor density, amygdala baseline reactivity, oxytocin sensitivity, prefrontal processing speed. Genes don't execute in a vacuum. They execute in a body, in a womb, in a developmental environment. The genome is white light; developmental biology is the first prism.

You cannot politically survey L0. But it constrains everything that follows, because it sets the hardware on which all subsequent software will run.


### L1: Neurology

L1 is what the genome and its developmental conditions produced: the actual nervous system. These are the agent's hyperparameters, the settings that define what type of learner this agent is:

Threat sensitivity. Novelty seeking. Reward response. Impulse control. Social sensitivity. Abstraction tolerance. Baseline affect. Attentional style.

A person high in novelty seeking will always weight new information more heavily. A person high in threat sensitivity will always discount unfamiliar options more steeply. These settings don't change meaningfully over a lifetime. They define what the system is capable of learning, not what it has learned.

The refraction: The same high threat sensitivity infant raised in a safe suburb becomes moderately cautious (prudent risk management, mild conservatism, preference for the familiar). That same infant raised in a war zone becomes hypervigilant (fortress mentality, zero-sum worldview, threat behind every stranger). Same algorithm, different training data, different weights.


### L2: Crystallized Personality

L2 is where native endowment becomes socially legible personality. Family structure, attachment style, class position, religious formation, trauma or safety, schooling, peer hierarchy, these are the training data. L1 was the architecture. The result is the learned weights. And by early adulthood, you cannot re-run your childhood. L2 is baked.

But L2 is still pre-political. The same personality profile can diverge dramatically depending on what cultural circumstances it encounters.

The refraction: Take a high-order, high-discipline, high-affiliative temperament. Formed inside a cosmopolitan meritocratic environment, it produces an earnest institutionalist, someone who loves their country through its systems, its procedures, its aspirational documents. Formed inside a locally rooted, status-threatened community, it produces an earnest patriot of a very different kind, someone who loves their country through its people, its traditions, its continuity. Formed inside a community that has experienced discrimination, it produces a fierce in-group advocate, loyalty and discipline directed toward protecting and advancing their own.

Three very different political trajectories. One underlying temperament. Three different cultural prisms.


### L3: Political Disposition

L3 is where things finally become recognizably political. Order versus change, hierarchy versus leveling, institutional trust versus suspicion, boundary strength, zero-sum sensitivity, moral traditionalism, proceduralism, civic obligation, tolerance for conflict. These are deeper than issue positions and prior to party labels.

PRISM measures L3 across fourteen dimensions organized into four clusters.

Every dimension has two components: position (where you stand) and salience (how much you care). Position without salience is an opinion. Position with salience is a motive.

The refraction: L3 is durable but not permanent. The libertarian moment of 2010 and the populist moment of 2016 didn't involve mass conversions. What changed was the political-economic environment, which activated different dimensions of dispositions that had been there all along. The parochialism that was dormant became salient. The institutional trust that had been fraying finally snapped. Same people, same deep structure, different political expression, because the environment changed which parts of the structure mattered.


### L4: Political Alignment

L4 is where disposition gets compressed into recognizable symbolic categories, issue bundles, and coalition identities. This is where you start calling yourself a liberal, a conservative, a libertarian, a progressive, or where you refuse to call yourself anything (which is itself a position).

This is also where affordances do their work. James Gibson coined the term in ecological psychology: an affordance is the interface between an agent and its environment. Not the full environment, not the full agent, just the action possibilities available to this agent in this context.

The affordance structure includes candidate characteristics, party platforms, coalition composition, the issue agenda, mobilization infrastructure, ballot access, and the social cost of political action. Each person's disposition determines which affordances they can perceive. A person with high engagement and low tribalism perceives the affordance of ticket-splitting and third parties. A person with high engagement and high tribalism doesn't see those options, not because they're unintelligent but because their disposition makes them functionally invisible.

The refraction: This layer explains why the same person votes differently in different elections without having changed. In RL terms: L3 is the policy function, L4 is the state space. Same policy, different states, different actions.


### L5: Political Behavior

Only at the end do we get what everyone actually measures: votes, issue positions, party affiliation, candidate support, movement participation, abstention, posting, persuading, protesting, organizing, defecting, disengaging.

This is where most models start and stop. It is the action output of the agent.

The problem with modeling only L5 is overdetermination. The same observable behavior, voting for a particular candidate, can be generated by completely different configurations at L0 through L4. Two voters with identical survey scores may have arrived there via entirely different causal paths, and their future behavior will diverge as soon as the context shifts. One is a true believer. The other is a contextual voter whose affordance structure happens to point the same direction this cycle. Same output, different generators, different futures.


---

## Liberal and Conservative as Principal Components

Liberal and conservative are better understood as principal components than as true dimensions.

They are summary bundles of correlated views, identities, and intuitions, not singular underlying axes that fully explain a person. Like PCA in statistics, they compress a high-dimensional disposition space into convenient labels that capture the most variance in a given era.

What liberal captures in 1972 (Great Society, labor unions, anti-war) is not what it captures in 2024 (identity politics, credentialism, technocratic governance). Same label, different loading vector. The components rotate when the coalitional sorting changes.

This is why the labels feel increasingly strained. When the coalition structure is stable, the first principal component (the liberal-conservative axis) explains a lot of variance and the labels feel natural. When coalitions are realigning, as they are now, the loading vector is rotating, and people who haven't changed at all suddenly find themselves without a label that fits. They didn't move. The axis did.

The 14-dimensional PRISM space doesn't compress to a line. It preserves the cross-pressures that the PCA projection destroys: the person who is economically redistributionist and culturally traditional, the person who is procedurally conservative and morally universalist, the person who is deeply engaged but refuses partisan identity. These combinations are common in the population and invisible on a left-right spectrum.


---

## The Value Function

There's an old adage that politics is downstream from culture, and culture is downstream from personality. That's the causal chain. PRISM doesn't try to measure personality. It doesn't try to measure culture. It measures the political disposition that personality and culture have deposited, the end product of all those upstream causes, frozen at the moment of measurement.

In reinforcement learning terms, this has a precise name. It's the value function.

The value function is the agent's learned mapping from states to values. It compresses everything the agent has learned from experience, every interaction, every outcome, every lesson, into a single function that says: given this situation, here's how valuable each option is to me.

The value function has a beautiful property. It is a sufficient statistic of the agent's history for predicting future behavior. You don't need to know why someone values economic freedom. Maybe it's personality (dispositional openness to risk). Maybe it's formative (grew up in a family business). Maybe it's economic conditions (experienced real scarcity and saw markets solve it). Doesn't matter. The value function captures what all those upstream causes deposited. Condition on the current value function, and history is irrelevant for prediction.

This is exactly the Markov property. The value function IS a Markov state for political behavior.

PRISM measures the value function of a political agent.

The 14 PRISM nodes are basis functions of the political value function. Each one captures a dimension of variation in how people evaluate political situations. Together, with their positions and saliences, they form a finite-dimensional approximation of the full political value function. Not a perfect representation (no finite basis is) but sufficient in the statistical sense: conditional on knowing someone's 14-node profile, knowing their full biography adds no predictive power for political behavior.

This is what makes PRISM tractable. You don't need to simulate the full life history of 330 million people. You need to measure their current value functions, and those value functions, combined with the current state of the political environment, are sufficient to predict behavior.


---

## Markovian and Non-Markovian

Not everything in the political system is Markovian, and the distinction matters.

L3 is Markovian with respect to L5. Given someone's political disposition, their specific biography doesn't improve your prediction of their political behavior. Two people who arrived at the same L3 profile via completely different life paths will respond to the same L4 conditions in the same way. Demographics are noisy proxies for the disposition that actually generates behavior. Disposition is the sufficient statistic.

But L3 is not Markovian with respect to L3 updating. When someone's disposition changes, during a political realignment, a crisis of faith, a migration to a new context, the way it changes depends on the layers below. Two people with the same L3 but different L1s and L2s will realign differently under the same pressure.

You have to make something Markovian. It doesn't come for free. The PRISM architecture earns the Markov property by choosing the right level of abstraction and defining it precisely enough that it captures the decision-relevant state. Choose too coarse a representation (left-right on a line), and the Markov property fails because you've thrown away information that predicts behavior. Choose too fine a representation (full biography), and the Markov property holds trivially but you've gained nothing in tractability.

For behavioral prediction in steady state, L3 is sufficient. Measure the disposition, observe the environment, predict the behavior. For modeling realignment, the rare but consequential moments when dispositions actually change, you need the deeper layers. You need to know not just where someone is, but how they got there, because the path determines the fault lines.


---

You are a stranger in a room. You have hardware you didn't choose. That hardware was calibrated by an upbringing you didn't choose. That calibration crystallized into a personality you only partially chose. That personality, encountering the cultural and economic conditions of your era, produced a set of political dispositions you experience as beliefs. Those dispositions, compressed into ideological language and filtered through the affordances of the political moment, produce the behavior the world sees and calls your politics.

Six layers. Five refractions. One agent, learning in an environment it didn't design.

The political spectrum is a projection of this process onto a line. PRISM is an attempt to map the process itself.
