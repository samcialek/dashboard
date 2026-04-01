# Beneath the Surface of Action

*How light refracts: four layers of political refraction, and why the same person votes differently in different worlds*

March 2026 · Companion to: The Cause of Our Politics

---

In the previous essay I described an attempt to build a generative political model — one that infers the upstream causes of political behavior rather than sorting declared beliefs into familiar buckets. I talked about why most political compasses start too close to the outputs, why self-report is lossy, why identity and ideology create an XOR problem that linear models can't solve, and why the real target is something deeper than the issue positions themselves.

What I didn't do is lay out the actual structure. This essay does that.

The central claim remains simple enough to state even if the implications take a while to unpack: "liberal" and "conservative" are not fundamental forces. They are principal components — compressions of a high-dimensional disposition space into convenient axes that capture the most variance in a given era. They feel real because they explain a lot. But principal components are artifacts of the decomposition, not the underlying reality. They rotate when the data changes. What "liberal" captures in 1972 is not what it captures in 2024. Same label, different loading vector.

If you build a model on the components, it breaks every time the political landscape rearranges. If you build a model on the underlying dimensions, it survives the rearrangement. That's the difference between descriptive and generative.

The framework — PRISM, Political Refraction of Innate Social Mapping — models political behavior as white light passing through a series of optical media. You are born with a particular beam of light: your innate temperament. That beam then passes through three successive prisms, each one an exogenous medium that bends the light in a different way. What emerges on the far side is political behavior — a particular color, at a particular angle, at a particular brightness. But the same beam of light, passed through different media, produces a different output. This is why the same person in a different country, a different era, or facing a different ballot would vote differently. The light didn't change. The medium did.

The architecture has four layers, alternating between what is inside the person (endogenous) and what happens to the person (exogenous). The endogenous layers are the light itself — L1 (innate temperament), L2 (crystallized personality), L3 (political disposition), L4 (political behavior). The exogenous layers are the media the light passes through — [F] (formative experiences), [M] (milieu/zeitgeist), [CA] (choice architecture). Each exogenous layer refracts the endogenous layer above it into the endogenous layer below it. The model is feed-forward: light goes in one direction, from deep and stable to shallow and volatile.

---

## L1 — Innate Temperament: The White Light

At the bottom of the stack are six neurobiological traits that precede ideology entirely. These are the hardware, not the software. They don't determine your politics, but they define the range of politics available to you. Think of them as Bayesian priors in the literal sense: before you encounter any evidence about the world — before you grow up anywhere, absorb any culture, or experience any economy — these priors constrain which political dispositions you'll find intuitive and which will always feel slightly wrong.

**The six L1 dimensions:**

**Threat Reactivity (TR)** — how strongly your nervous system responds to perceived danger, disgust, or violation. High TR doesn't make you conservative; it makes you sensitive to threat cues, and the political system then determines which threats feel salient. The same high-TR person in 1955 fears communism; in 2024, immigration; in a different country, something else entirely. The reactivity is innate. The target is supplied by context.

**Novelty Drive (ND)** — appetite for new experience, unfamiliar people, untested ideas. This is openness-to-experience narrowed to its politically relevant core. High ND makes cosmopolitan environments feel natural and monocultural ones feel stifling. Low ND makes tradition feel like wisdom and disruption feel like recklessness. Neither is wrong. But they produce genuinely different political intuitions about change, immigration, cultural evolution, and institutional reform.

**Empathic Capacity (EMP)** — the radius and intensity of emotional resonance with others' suffering. This is not "empathy good, lack of empathy bad." Extremely high EMP can produce political paralysis (every policy hurts someone). Moderate EMP combined with high cognitive flexibility produces the technocratic reformer who can hold both the aggregate benefit and the individual cost in mind. Low EMP combined with high affiliative drive produces the communitarian who cares intensely — but only about their people.

**Temperamental Reactance (RX)** — the instinctive pushback against perceived constraint or authority. This is not libertarianism; it's the pre-political impulse that libertarianism channels. High RX people chafe at being told what to do regardless of who is doing the telling. In a left-coded environment, RX produces contrarianism against progressive orthodoxy. In a right-coded one, it produces rebellion against traditional authority. Same trait, different political expression, because the constraint it's reacting against is supplied by context.

**Affiliative Drive (AF)** — how strongly you seek belonging, group membership, collective identity. High AF makes party loyalty feel natural, movement politics feel exciting, and political loneliness feel unbearable. Low AF makes independence feel principled and partisanship feel like surrender. This is the dimension that most strongly predicts whether someone will join — a party, a movement, a coalition — regardless of which one.

**Cognitive Flexibility (CF)** — the capacity to hold contradictory frames simultaneously, to update beliefs in response to evidence, to tolerate ambiguity without resolving it prematurely. Low CF combined with high TR produces the political phenotype that wants clear answers, clear enemies, strong leadership, and decisive action — a phenotype that can manifest on any point of the traditional spectrum. High CF allows for more exploratory political behavior, more cross-partisan curiosity, more willingness to hold multiple considerations at once. It also, honestly, can produce a paralyzing tendency to see all sides of everything.

These six are chosen because each is upstream of political content, heritable to a significant degree, stable by late adolescence, and — crucially — they interact in ways that matter for prediction. A person isn't just "high threat reactivity." They're high TR combined with a particular level of empathic capacity, a particular level of cognitive flexibility, a particular affiliative drive. The interactions matter more than the individual dimensions. High TR + high CF produces a very different person than high TR + low CF, even though both are "threat-sensitive." The first can hold the threat in mind while also reasoning about it. The second needs to resolve it immediately.

The Bayesian framing is not a metaphor. Given someone's expressed politics, the question PRISM asks is: what are the possible L1 configurations that could have produced them? It's the inverse problem. We observe the output and try to infer the generator. A person's expressed politics don't map back to a single L1 profile. They map back to a distribution over L1 profiles, weighted by how plausible each configuration is given everything else we know about their formation, their era, and their choices.

---

## [F] — Formative Refraction: The First Prism

This is where PRISM gets its name. L1 is white light — undifferentiated temperament, carrying all possible political dispositions as potential. The formative layer is the first prism: the medium through which that white light passes and separates into distinct colors.

The formative medium includes everything that shapes how your raw temperament crystallizes into durable personality during childhood and early adulthood: family structure, parental ideology, religious upbringing, education path, childhood trauma on the micro side; region and geography, economic era, cultural zeitgeist, media environment, and the prevailing level of institutional trust on the macro side.

The metaphor is precise in a way I find genuinely useful. Two people with identical L1 who grow up in vastly different circumstances will express different politics — but their range is the same. The prism doesn't create new colors. It separates the ones that were already there. A high-threat-reactivity, high-affiliative-drive temperament formed inside a cosmopolitan meritocratic environment does not produce the same crystallized personality as the same temperament formed inside a locally rooted, status-threatened one. But both outputs were possible from the same L1 — one was just selected by the formative context.

This is where the endogenous meets the exogenous for the first time. L1 is endogenous — you were, to a considerable degree, born with it. [F] is exogenous — it happened to you. The transformation is not additive (temperament plus context does not equal personality). It's refractive. [F] doesn't add to L1; it selects from the possibility space that L1 defines. This means two things. First, [F] effects are bounded by L1 — no formative context can produce a personality that L1 doesn't permit. Second, the same [F] applied to different L1s produces different results, which is why siblings who grew up in the same house can end up with strikingly different dispositions.

---

## L2 — Crystallized Personality: The First Spectrum

What comes out the other side of the formative prism are six personality dispositions — more specific than raw temperament, more durable than political opinion. Each one is a function of two to four L1 traits refracted through [F]:

**Traditionalism** — comfort with established norms and inherited practices. A function of threat reactivity (how dangerous does novelty feel?), novelty drive (how appealing is the unfamiliar?), and cognitive flexibility (can you hold "this is new" and "this might be good" simultaneously?) — all filtered through whether your formative context rewarded tradition or punished it.

**Economic Conservatism** — the disposition toward markets, individual economic agency, and skepticism of redistribution. Downstream of reactance (resistance to collective imposition), threat reactivity (economic anxiety sensitivity), and cognitive flexibility (can you model the system or only feel the personal impact?).

**Compassion** — the politically relevant expression of empathic capacity, shaped by whether your formative context expanded or contracted your moral circle. High EMP + cosmopolitan [F] = universalist compassion. High EMP + parochial [F] = intense in-group care.

**Defiance** — the crystallized form of reactance after it's been aimed by formative experience at particular authority structures. High RX + anti-establishment [F] = populist defiance. High RX + counter-cultural [F] = progressive defiance. Same engine, different target.

**Gregariousness** — social energy and comfort with collective action, downstream of affiliative drive shaped by whether formative experiences made groups feel safe or suffocating.

**Risk Comfort** — tolerance for uncertainty in practice, not just in theory. Novelty drive plus cognitive flexibility, tempered by whether your early life rewarded risk-taking or punished it.

These six are durable but not immutable. Under normal conditions, they're stable enough to treat as fixed for modeling purposes. But there are moments — phase transitions — when the formative prism reopens.

War, forced migration, religious conversion, incarceration, catastrophic economic collapse — these are experiences intense enough to re-liquify what had crystallized. When someone says "I used to be liberal but 9/11 changed everything," what they're describing is a phase transition: a macro event ([F] reopening) that allowed their L1 traits to re-refract through new formative material, producing a different L2 configuration. Their threat reactivity didn't change. Their novelty drive didn't change. What changed was the medium those traits passed through — and a different medium produced different colors.

---

## [M] — Milieu: The Second Medium

The six crystallized personality traits now enter the second optical medium: the current milieu. Where [F] was formative and largely historical — the world you grew up in — [M] is contemporaneous and ongoing. It's the atmosphere the light is currently traveling through.

If [F] is a glass prism — solid, fixed, something you passed through once — then [M] is more like the atmosphere itself: a medium that's always there, always bending the light, but whose density and composition change over time. Some eras are clear air. The beams pass through relatively straight — your crystallized personality maps onto political dispositions in a fairly predictable way. Other eras are dense fog. The beams scatter, bend, converge unexpectedly. Dispositions that should produce one kind of politics produce another, because the medium is doing so much work.

[M] operates on two scales simultaneously. The macro milieu — recession or boom, inflation, housing costs, institutional decay or renewal, social mobility rates — is observable and roughly the same for everyone in a given time and place. The micro milieu — personal income shocks, health crises, divorce, migration, career trajectory — is unobservable at the individual level but predictable in aggregate. You can't know who will get divorced this year. But you can know the divorce rate, and you can model what divorce does to the L2→L3 mapping for different personality profiles.

This is the layer that makes realignment possible without requiring people to become fundamentally different creatures. The conservative libertarian moment of 2010 and the MAGA populist moment of 2016 didn't involve mass conversion. What changed was [M]: the financial crisis, the cultural backlash, the sense of elite betrayal. Those milieu shifts activated different L3 dispositions in people whose L1 and L2 hadn't changed at all. The communitarian impulse that was always latent became salient. The economic populism that had been dormant woke up. The institutional trust that had been fraying finally snapped. Same people, same deep structure, completely different political expression — because the atmosphere changed which beams bent which way.

---

## L3 — Political Disposition: The Spectrum in Full Color

L3 is where things first look recognizably political. After two refractions — [F] crystallizing temperament into personality, [M] bending personality into disposition — we arrive at fourteen dimensions of political orientation, organized into four clusters.

**ENDS — what you want.** Four dimensions defining the goals of politics. Material: structuralist (redistribute, regulate) vs. marketist (deregulate, privatize). Cultural Direction: progressive (change is progress) vs. traditional (change is loss). Cultural Uniformity: pluralist (diversity is strength) vs. assimilationist (cohesion requires conformity). Moral Circle: universalist (all humans count equally) vs. communitarian (your people come first).

**MEANS — how you get there.** Four dimensions defining the methods of politics. Procedural: outcome-focused (do whatever works) vs. rules-bound (process matters intrinsically). Compromise: principled (hold the line) vs. pragmatic (half a loaf). Epistemic Style: a categorical dimension with six modes of deciding what to trust — institutional, empirical, experiential, traditional, revelatory, tribal. Leadership Aesthetic: also categorical, six preferred political styles — the statesman, the technocrat, the pastor, the fighter, the prophet, the everyman.

**REALITY — what you believe is true.** Three dimensions about ontology rather than preference. Zero-Sum: do you see the world as positive-sum (we can all gain) or zero-sum (your gain is my loss)? Human Ontology: are people basically good (optimistic) or basically flawed (pessimistic)? System Ontology: is the current order declining or thriving?

**SELF — who you are politically.** Three dimensions about political identity itself. Political Fusion: is your politics a thing you have (independent) or a thing you are (fused with identity)? Tribalism: universalist (issues over teams) vs. group-bound (my side, right or wrong). Engagement: disengaged (politics is noise) vs. highly engaged (politics is life).

I want to be upfront about why fourteen. The answer is empirical rather than theoretical. I kept adding dimensions until additional ones stopped improving the model's ability to distinguish archetypes that behave differently under counterfactual conditions. Two dimensions (the standard left-right plus libertarian-authoritarian) lose enormous amounts of information. Fourteen captures the major axes of variation. More than fourteen starts introducing redundancy.

The cross-pressures are the interesting part. Consider someone who scores high on Material (structuralist), high on Cultural Uniformity (assimilationist), high on Procedural (rules-bound), and low on Political Fusion (independent). In the current American arrangement, this person is genuinely homeless. They want redistribution (codes left), cultural cohesion (codes right), process integrity (codes centrist), and refuse to identify with either team. No party captures this configuration. Their actual political behavior — who they vote for, whether they vote at all — depends on which dimensions the choice architecture makes salient. Which brings us to the final refraction.

---

## [CA] — Choice Architecture: The Last Prism

The fourteen-dimensional political disposition now hits the final optical medium: the choice architecture. This is the structure of the actual political choice confronting the voter — the candidates on offer, the party platforms available, how the media frames the election, what's on the ballot, the mobilization infrastructure, the social cost of participation.

Unlike [F] and [M], the choice architecture is purely macro — it's the same for everyone in a given district. And unlike [F] and [M], it's fully observable. You can see who's on the ballot. You can read the platforms. You can measure the media framing. This is why the L3→L4 mapping (disposition → behavior, through [CA]) is the most predictable step in the entire model, while the L2→L3 mapping (personality → disposition, through [M]) is the least predictable. The final prism is the one we can actually see.

But "most predictable" doesn't mean "trivial." The choice architecture compresses fourteen continuous dimensions into a handful of discrete options. It's a massive information bottleneck. A voter with a rich, cross-pressured disposition profile enters the booth and must choose from two or three options, none of which match their full spectrum. Which dimensions dominate the choice depends on which ones the [CA] makes salient: Is this election about the economy or about culture? About competence or about identity? About fear or about hope? The same fourteen-dimensional profile produces different votes under different framings — not because the person changed, but because the grating let different beams through.

This is the mechanism behind the phenomenon everyone recognizes but few models capture: the same person voting for Obama in 2008 and Trump in 2016. Their L1 didn't change. Their L2 probably didn't change. Their L3 may have shifted slightly under [M] (the financial crisis, the recovery's uneven distribution, the cultural backlash). But the biggest shift was [CA]: different candidates, different framings, different slits in the grating. The 2008 [CA] made "hope/change/competence" dimensions salient. The 2016 [CA] made "anti-establishment/economic anxiety/cultural threat" dimensions salient. Same light, different grating, different output.

---

## L4 — Political Behavior: The Light That Reaches the Wall

Only at the end do we get the things everyone actually measures: turnout, vote choice, and what the model calls the resistance-compliance scale — the full range of non-electoral political behavior, from active resistance through passive compliance to enthusiastic mobilization.

L4 is where most models start and stop. It's what surveys measure, what pundits discuss, what prediction markets price, what elections reveal. The problem with modeling only L4 is the same problem with modeling only the surface of anything: you get a decent snapshot and poor transfer. If you train on 2020 voting behavior, you'll do well on 2020. You'll do poorly on 2028, because the coalitional sorting will have shifted, the salient issues will be different, and some of the proxy variables that were informative in 2020 will have changed sign.

The overdetermination problem is acute. The same observed behavior — voting for a particular candidate — can be generated by completely different upstream configurations. Two voters with identical survey scores may have arrived there via entirely different causal paths, and their future behavior will diverge as soon as the context changes. One is a true believer whose L1-L3 alignment with the candidate is deep and stable. The other is a contextual voter whose [M] and [CA] happen to point in the same direction right now but could easily shift. "Two voters, one survey score" — same output, different generators, different futures. A political model that can't distinguish them is a model that will be surprised by the next realignment.

If you model the generative layers — L1 through [CA] — you have a shot at understanding why someone votes as they do now, why they might have voted differently in another setting, and what changes are likely to move them in the future. The light doesn't change. The media change. Map the media, and you can predict the output.

---

## Concept Drift and the Three-Body Problem

There is one structural feature of politics that deserves separate treatment: concept drift.

The meaning of "liberal," "conservative," "populist," "establishment" — these are labels attached to coalitional configurations that shift over time. Three forces act on each other in a way that genuinely resembles the gravitational three-body problem: (1) elite positioning — what party leaders advocate; (2) mass sentiment — the aggregate distribution of dispositional profiles across the electorate, which shifts with demographics, economics, and [M] events; and (3) media framing — how the available political options are described and which dispositions are mapped to which labels.

Each influences the other two. Elites respond to mass sentiment or lose elections. Mass sentiment is shaped by how elites and media frame the options. Media framing responds to both. The system is chaotic in the technical sense. And this is why "liberal" rotates: the coalitional sorting algorithm changed what the first principal component captures. The loading vector rotated, and the label went with it.

Simple models assume stationarity. PRISM assumes non-stationarity and tries to model the drift mechanism itself. The underlying dimensions (L1 temperament, L3 dispositions) don't drift — they're the invariants. What drifts is the mapping from those dimensions to coalitions, labels, and behavior. If you model only the surface, you're modeling the thing that drifts. If you model the depth, you're modeling the thing that stays.

---

## Where Do You Sit?

The quiz is being built to answer exactly this question. Rather than asking you to self-report your positions ("do you agree that government should regulate X?"), it triangulates revealed preferences through scenarios, tradeoffs, and forced choices. The goal isn't to catch you lying — most people aren't lying; they genuinely believe the story they tell. The goal is to get at the structure underneath the story.

The design principle I keep returning to: "I Know This About Myself, I Assume as Much for Other People." If you can identify a disposition in yourself, you should expect it to operate in others as well, even when their surface politics look nothing like yours. The quiz is designed to surface these deep symmetries — to show you that the uncle who votes the other way might share more of your underlying temperament than either of you suspects, and that the divergence happened at [F] or [M] or [CA], not at L1.

---

## What This Enables

**Coalition simulation.** If you have a generative model, you can ask: which coalitions are stable? Which are held together only by the current [M] and would fracture under different conditions? Where are the fault lines? These questions are answerable with a model of disposition. They are unanswerable with survey snapshots.

**The Politracker.** Put your dispositional map against someone else's and find areas of genuine overlap versus assumed opposition. Most political conversations operate on the assumption that disagreement is total. Usually it isn't. A tool that surfaces those overlaps could make political conversations less terrible. I am not optimistic about this but I think it's worth trying.

**Historical extension.** Apply PRISM to the Founders. What were their L1s? How did colonial America and Enlightenment thought ([F]) refract those temperaments into the dispositions (L3) that produced the Constitution? This is speculative, obviously, but it's the kind of counterfactual reasoning that a generative model permits.

**Expansion packs.** The architecture is modular — you can add domain-specific question sets that go deeper on particular policy areas without rebuilding the core model. Same framework, finer resolution in specific areas.

The political spectrum is a projection. It flattens a high-dimensional reality into a line. The line is useful — PCA's first component usually is — but it's not the territory. PRISM is an attempt to map the territory itself, layer by layer, from the temperament you were born with to the vote you cast last Tuesday. Four layers of light, three refractive media, fourteen dimensions of disposition, and one simple claim: what comes out depends not just on what went in, but on what it passed through.

The same light, through different prisms, produces different colors. That's not a metaphor. That's the model.

---

*March 2026. Companion to "The Cause of Our Politics."*
