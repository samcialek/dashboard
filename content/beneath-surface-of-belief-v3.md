# Beneath the Surface of Belief

*Six layers, five refractions, and why most attempts to model politics start too late in the chain*

March 2026 · Companion to: The Cause of Our Politics

---

Everything before explicit politics belongs to the problem of an agent encountering a world.

Before you have opinions about taxes or immigration or whether the president is doing a good job, you are a biological organism dropped into an environment you did not design. You have a nervous system that reacts to threats at a speed you didn't choose. You have a dopamine system that seeks or avoids novelty in ratios you didn't set. You have a capacity for empathy that was largely determined before you could speak.

You are, in the language of reinforcement learning, an agent.


---

## The Agent

Reinforcement learning is the study of how agents learn from interaction. An RL agent doesn't start with a rulebook. It starts with a capacity to act, a capacity to observe outcomes, and a capacity to update. Over time, through trial and error, the agent develops two things: a *policy* -- a mapping from situations to actions -- and a *value function* -- a learned sense of how good each situation is, based on everything that's happened so far.

The policy is what the agent does. The value function is why.

People are RL agents. You were instantiated by your own hardware, dropped into an environment, and you learned. What worked, what didn't, what felt right, what felt wrong. The lessons compounded. The policy crystallized. And eventually, that policy started generating outputs that the world recognizes as politics.

This essay is about the layers of that process -- six transformations that turn neural substrate into political behavior -- and about why most attempts to model politics start too late in the chain.


---

## Why Layers?

Here's the problem with modeling a political agent: the process is cyclical. Your behavior changes your environment, your environment reshapes your affordances, your affordances shift which dispositions are salient, and those dispositions generate new behavior. It's a feedback loop. And you can't do causal inference on a loop -- you need directed acyclic structure to ask "what causes what."

In RL terms, this is a classic intractability problem. The full state of a political agent includes their genome, their neurology, their upbringing, their cultural context, their current economic conditions, and the full history of their interactions with the political system. That state space is enormous. You can't solve for the optimal policy by brute force any more than you can simulate a human life from first principles.

RL handles this with the Markov property: if you can find a representation of the agent's state that is *sufficient* -- meaning, conditional on the current state, the history doesn't improve your prediction of future behavior -- then you can throw away the history and just work with the current state.

But the full political process isn't Markovian. How someone's disposition changes under pressure depends on the deeper layers -- their neurology, their formative experiences -- not just their current political profile. Two people with identical political dispositions today may realign in opposite directions tomorrow, because the path that built them determines the fault lines.

The trick is to unroll the cycle by conditioning on time.

At each layer, an endogenous state (something internal to the agent) encounters an exogenous medium (something in the environment). The medium refracts the state into a new form. That new form becomes the endogenous input to the next layer. By flattening the process into layers -- each one a snapshot at a different point in the agent's development -- the feedback loop becomes a directed chain.

You make something Markovian. It doesn't come for free. You earn it by choosing the right level of abstraction.

At every refraction, there are really only two questions: *is this a different algorithm, or different data?* When the same genome develops under different conditions, that's different data run on the same algorithm. When the same upbringing meets a fundamentally different neural architecture, that's the same data run on a different algorithm. The endogenous state is the algorithm. The exogenous medium is the data. The output is the learned weights -- and those weights become the next layer's algorithm.


---

## The Layers

### L0: Genome

The deepest layer is one you will never observe directly. L0 is the raw genetic instructions that specify the broad architecture of a nervous system -- dopamine receptor density, amygdala baseline reactivity, oxytocin sensitivity, prefrontal processing speed. Genes don't execute in a vacuum. They execute in a body, in a womb, in a developmental environment. The genome is white light; developmental biology is the first prism.

You cannot politically survey L0. But it constrains everything that follows, because it sets the hardware on which all subsequent software will run.


### L1: Neurology

L1 is what the genome and its developmental conditions produced: the actual nervous system. These are the agent's hyperparameters -- the settings that define what type of learner this agent is:

Threat sensitivity. Novelty seeking. Reward response. Impulse control. Social sensitivity. Abstraction tolerance. Baseline affect. Attentional style.

A person high in novelty seeking will always weight new information more heavily. A person high in threat sensitivity will always discount unfamiliar options more steeply. These settings don't change meaningfully over a lifetime. They define what the system is capable of learning, not what it has learned.

The refraction: The same high-threat-sensitivity infant raised in a safe suburb becomes moderately cautious -- prudent risk management, mild conservatism, preference for the familiar. That same infant raised in a war zone becomes hypervigilant -- fortress mentality, zero-sum worldview, threat behind every stranger. Same algorithm, different training data, different weights.


### L2: Crystallized Personality

L2 is where native endowment becomes socially legible personality. Family structure, attachment style, class position, religious formation, trauma or safety, schooling, peer hierarchy -- these are the training data. L1 was the architecture. The result is the learned weights. And by early adulthood, you cannot re-run your childhood. L2 is baked.

But L2 is still pre-political. The same personality profile can diverge dramatically depending on what cultural circumstances it encounters.

The refraction: Take a high-order, high-discipline, high-affiliative temperament. Formed inside a cosmopolitan meritocratic environment, it produces an earnest institutionalist -- someone who loves their country through its systems, its procedures, its aspirational documents. Formed inside a locally rooted, status-threatened community, it produces an earnest patriot of a very different kind -- someone who loves their country through its people, its traditions, its continuity. Formed inside a community that has experienced discrimination, it produces a fierce in-group advocate -- loyalty and discipline directed toward protecting and advancing their own.

Three very different political trajectories. One underlying temperament. Three different cultural prisms.


### L3: Political Disposition

L3 is where things finally become recognizably political. Order versus change, hierarchy versus leveling, institutional trust versus suspicion, boundary strength, zero-sum sensitivity, moral traditionalism, proceduralism, civic obligation, tolerance for conflict. These are deeper than issue positions and prior to party labels.

PRISM measures L3 across fourteen dimensions organized into four clusters.

Every dimension has two components: position (where you stand) and salience (how much you care). Position without salience is an opinion. Position with salience is a motive.

The refraction: L3 is durable but not permanent. The libertarian moment of 2010 and the populist moment of 2016 didn't involve mass conversions. What changed was the political-economic environment, which activated different dimensions of dispositions that had been there all along. The parochialism that was dormant became salient. The institutional trust that had been fraying finally snapped. Same people, same deep structure, different political expression -- because the environment changed which parts of the structure mattered.

This is where the Markov property earns its keep. L3 is Markovian with respect to political behavior. Given someone's political disposition, their specific biography doesn't improve your prediction of how they'll vote, what they'll support, how they'll respond to a candidate. Two people who arrived at the same L3 profile via completely different life paths will respond to the same political environment in the same way. Demographics are noisy proxies for the disposition that actually generates behavior. Disposition is the sufficient statistic.

In RL terms, L3 is the value function of the political agent. It compresses everything the agent has learned from experience -- every interaction, every outcome, every lesson -- into a mapping that says: given this situation, here's how valuable each option is to me. PRISM's 14 nodes are basis functions of that value function. Together, with their positions and saliences, they form a finite-dimensional approximation sufficient for prediction.


### L4: Political Alignment

L4 is where disposition gets compressed into recognizable symbolic categories -- issue bundles and coalition identities. This is where you start calling yourself a liberal, a conservative, a libertarian, a progressive, or where you refuse to call yourself anything (which is itself a position).

This is also where affordances do their work. James Gibson coined the term in ecological psychology: an affordance is the interface between an agent and its environment. Not the full environment, not the full agent -- just the action possibilities available to this agent in this context.

The affordance structure includes candidate characteristics, party platforms, coalition composition, the issue agenda, mobilization infrastructure, ballot access, and the social cost of political action. Each person's disposition determines which affordances they can perceive. A person with high engagement and low tribalism perceives the affordance of ticket-splitting and third parties. A person with high engagement and high tribalism doesn't see those options -- not because they're unintelligent but because their disposition makes them functionally invisible.

The refraction: This layer explains why the same person votes differently in different elections without having changed. In RL terms: L3 is the policy function, L4 is the state space. Same policy, different states, different actions.


### L5: Political Behavior

Only at the end do we get what everyone actually measures: votes, issue positions, party affiliation, candidate support, movement participation, abstention, posting, persuading, protesting, organizing, defecting, disengaging.

This is where most models start and stop. It is the action output of the agent.

The problem with modeling only L5 is overdetermination. The same observable behavior -- voting for a particular candidate -- can be generated by completely different configurations at L0 through L4. Two voters with identical survey scores may have arrived there via entirely different causal paths, and their future behavior will diverge as soon as the context shifts. One is a true believer. The other is a contextual voter whose affordance structure happens to point the same direction this cycle. Same output, different generators, different futures.


---

## Liberal and Conservative as Principal Components

Liberal and conservative are better understood as principal components than as true dimensions.

They are summary bundles of correlated views, identities, and intuitions -- not singular underlying axes that fully explain a person. Like PCA in statistics, they compress a high-dimensional disposition space into convenient labels that capture the most variance in a given era.

What liberal captures in 1972 (Great Society, labor unions, anti-war) is not what it captures in 2024 (identity politics, credentialism, technocratic governance). Same label, different loading vector. The components rotate when the coalitional sorting changes.

This is why the labels feel increasingly strained. When the coalition structure is stable, the first principal component -- the liberal-conservative axis -- explains a lot of variance and the labels feel natural. When coalitions are realigning, as they are now, the loading vector is rotating, and people who haven't changed at all suddenly find themselves without a label that fits. They didn't move. The axis did.

The 14-dimensional PRISM space doesn't compress to a line. It preserves the cross-pressures that the PCA projection destroys: the person who is economically redistributionist and culturally traditional, the person who is procedurally conservative and morally universalist, the person who is deeply engaged but refuses partisan identity. These combinations are common in the population and invisible on a left-right spectrum.


---

You are a stranger in a room. You have hardware you didn't choose. That hardware was calibrated by an upbringing you didn't choose. That calibration crystallized into a personality you only partially chose. That personality, encountering the cultural and economic conditions of your era, produced a set of political dispositions you experience as beliefs. Those dispositions, compressed into ideological language and filtered through the affordances of the political moment, produce the behavior the world sees and calls your politics.

Six layers. Five refractions. One agent, learning in an environment it didn't design.

The political spectrum is a projection of this process onto a line. PRISM is an attempt to map the process itself.
