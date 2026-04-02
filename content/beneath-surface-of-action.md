# Beneath the Surface of Belief

*March 2026. Companion to: The Cause of Our Politics.*

Before you have opinions about taxes or immigration or whether the president is doing a good job, you're a biological organism dropped into an environment. Your nervous system reacts to threats at a speed you didn't choose. Your dopamine system seeks or avoids novelty in ratios you didn't set. Your capacity for empathy was largely determined before you could speak.

None of this sits at the surface of your politics, but all of it shapes what your politics will become. Everything upstream of explicit politics is really just the problem of an agent encountering a world and learning within that world.

## A Stranger in a Room

There's a field called reinforcement learning that studies how agents learn from interactions, and could be the gold standard for thinking about politics. The setup is that an RL gets dropped into an environment, takes actions, gets feedback, and over time develops a policy — when I'm in this kind of situation, here's what I do — and a value function, a learned sense of how good or bad each situation is.

So the policy is what the agent does. The value function is why. Another way to think about this is to distinguish between the algorithm and the data. The algorithm is your built-in learning architecture that's downstream of some innate hardware — your genetics and neurology. The data is the stream of experience the world feeds into that architecture. Politics begins to form where those two meet: neither in the organism alone nor the environment alone, but in the learned policy and value function that emerge from their interaction.

## Unspooling the Feedback Loop

The problem with actually trying to model this is that the process is recursive. Your behavior changes your environment, your environment reshapes the options available to you, those options shift which dispositions become salient, and those dispositions generate new behavior — your media diet shapes your politics which shapes your media diet, and so on indefinitely. Causality running in both directions means you're no longer looking at a chain of causes but a system folding back into itself, which is analytically difficult because causal inference depends on acyclic structure. Feedback loops don't just complicate the model; they undermine the kind of inference the model requires.

And even bracketing the feedback problem, the full state of a political agent is staggering in scope — genome, neurology, upbringing, cultural context, economic conditions, the entire history of their interactions with the political system. There's no realistic path to collecting signal on all of it, and collapsing it into something tractable necessarily means throwing things away.

The standard response to this kind of intractability is to find some way of simplifying without losing what matters. One approach that shows up across disciplines is the Markov property: if you can represent an agent's current state in a way that captures everything relevant to predicting what happens next, you can discard the history and work only with the present. The past doesn't disappear so much as compress — it becomes legible through its effects on the current state. Whether that compression preserves what actually matters is a different question.

In real political development, it often doesn't. A person's future political movement isn't determined just by their visible political profile right now. It depends on deeper strata: neurology, formative experience, socialization, accumulated feedback, latent sensitivities. Two people who look politically identical today can diverge sharply tomorrow, because the hidden structure that produced those outward similarities is completely different. The history hasn't really disappeared. It's still living inside the state. We just don't observe it.

So instead of trying to model the full recursive process in real time, I flattened it. Take the feedback loop and cut it at natural joints — developmental periods where the agent's state crystallizes before the next medium acts on it. Each cut gives you a snapshot. String the snapshots together and the intractable loop becomes a directed chain: Genome, Neurology, Crystallized Personality, Political Disposition, Political Alignment, Political Behavior.

Each link in the chain is a refraction. An internal state meets an external medium, and something new comes out. And if you hold the layers below the one you're trying to simulate constant, you get the Markov property back — not as a free assumption, but as something you earn by choosing where to cut.

I find it helpful to think about each layer in terms of what's endogenous, internal to the agent, and what's exogenous, in the environment. At every refraction, an endogenous state encounters an exogenous medium, and the medium reshapes the state into something new. That new form becomes the endogenous input to the next layer.

And at each refraction, there are really only two questions: is this a different algorithm, or different data? When the same genome develops under different conditions, that's different data run on the same algorithm. When the same upbringing meets a fundamentally different neural architecture, that's the same data run on a different algorithm. The endogenous state is the algorithm. The exogenous medium is the data. The output is the learned weights — and those weights become the next layer's algorithm.

Here's what this looks like concretely. Start with neurology — the hardware the agent was born with. Threat sensitivity, novelty-seeking, empathy bandwidth. This is the endogenous state before the environment has meaningfully shaped it.

Now that state encounters its first exogenous medium: childhood socialization. Family structure, religious upbringing, neighbourhood, class. The neurological predispositions don't disappear — they get refracted through this medium. A high-threat-sensitivity child raised in a stable, trusting community develops differently from the same child raised in an unstable one. Same algorithm, different training data, different learned weights. The output becomes the input to the next layer.

Each subsequent layer does the same thing at a different developmental timescale, producing a more politically legible version of the agent, until you reach the disposition profile: the thing we actually measure.

## The Layers

<div class="layers-widget">

  <div class="widget-meta">
    <span class="widget-hint">Click any layer to expand</span>
    <div class="legend">
      <span class="legend-item"><span class="legend-dot dot-bio"></span>Biological</span>
      <span class="legend-item"><span class="legend-dot dot-pol"></span>Political</span>
    </div>
  </div>

  <div id="chain"></div>

</div>

<style>
.layers-widget {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #1a1a18;
  max-width: 680px;
  margin: 0 auto;
  padding: 1.5rem 0;
}
.widget-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.widget-hint { font-size: 13px; color: #888780; }
.legend { display: flex; gap: 14px; font-size: 11px; color: #5f5e5a; }
.legend-item { display: flex; align-items: center; gap: 5px; }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.dot-bio { background: #eaf3de; border: 0.5px solid rgba(59,109,17,0.3); }
.dot-pol { background: #e6f1fb; border: 0.5px solid rgba(24,95,165,0.3); }
.layer-card {
  border: 0.5px solid rgba(0,0,0,0.1);
  border-radius: 12px;
  background: #ffffff;
  overflow: hidden;
  cursor: pointer;
  transition: border-color .15s;
}
.layer-card:hover { border-color: rgba(0,0,0,0.18); }
.layer-card.open { border-color: rgba(0,0,0,0.28); }
.card-header { display: flex; align-items: center; gap: 12px; padding: 12px 16px; user-select: none; }
.layer-badge { font-size: 11px; font-weight: 500; padding: 3px 8px; border-radius: 20px; flex-shrink: 0; letter-spacing: .03em; }
.bio .layer-badge { background: #eaf3de; color: #3b6d11; }
.pol .layer-badge { background: #e6f1fb; color: #185fa5; }
.card-title { font-size: 14px; font-weight: 500; color: #1a1a18; flex: 1; }
.card-tagline { font-size: 12px; color: #888780; margin-top: 1px; }
.chevron { font-size: 11px; color: #888780; transition: transform .2s; flex-shrink: 0; }
.layer-card.open .chevron { transform: rotate(180deg); }
.card-body { display: none; padding: 0 16px 16px; }
.layer-card.open .card-body { display: block; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
.col-block { background: #f5f4f0; border-radius: 8px; padding: 10px 12px; }
.col-label { font-size: 10px; color: #888780; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 4px; font-weight: 500; }
.col-value { font-size: 13px; color: #1a1a18; line-height: 1.5; }
.attr-list { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; }
.attr-pill { font-size: 11px; background: #eeece7; color: #5f5e5a; padding: 2px 8px; border-radius: 20px; }
.refraction-block { border-left: 2px solid rgba(0,0,0,0.18); padding: 8px 12px; margin-top: 8px; }
.refraction-label { font-size: 10px; color: #888780; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 5px; font-weight: 500; }
.refraction-text { font-size: 13px; color: #5f5e5a; line-height: 1.65; }
.note-block { margin-top: 8px; background: #e6f1fb; border-radius: 8px; padding: 9px 12px; font-size: 12px; color: #185fa5; line-height: 1.55; }
.connector { display: flex; flex-direction: column; align-items: center; height: 30px; justify-content: center; gap: 0; }
.connector-line { width: 1px; flex: 1; background: rgba(0,0,0,0.1); }
.connector-text { font-size: 10px; color: #888780; letter-spacing: .05em; padding: 2px 0; }
@media (max-width: 480px) { .two-col { grid-template-columns: 1fr; } }
</style>

<script>
(function() {
const layers = [
  {
    code: "L0",
    name: "Genome",
    tagline: "The hardware spec",
    cls: "bio",
    endo: "Raw genetic instructions",
    exo: "Developmental environment — womb, body, pre-natal conditions",
    attrs: ["dopamine receptor density","amygdala reactivity","oxytocin sensitivity","prefrontal processing speed"],
    refraction: "Genes don't execute in a vacuum. The same genome expressing in different developmental conditions produces different neurological architectures. The genome is white light; developmental biology is the first prism.",
    note: null
  },
  {
    code: "L1",
    name: "Neurology",
    tagline: "The agent's hyperparameters",
    cls: "bio",
    endo: "Nervous system as built — what the genome and its conditions actually produced",
    exo: "Childhood socialization — family structure, neighborhood, class, religious upbringing",
    attrs: ["threat sensitivity","novelty seeking","reward response","impulse control","social sensitivity","abstraction tolerance","baseline affect"],
    refraction: "Same high-threat-sensitivity infant: raised in a safe suburb → moderately cautious, preference for the familiar. Raised in a war zone → hypervigilant, zero-sum worldview, threat behind every stranger. Same algorithm, different training data, different weights.",
    note: null
  },
  {
    code: "L2",
    name: "Crystallized personality",
    tagline: "Endowment becomes legible",
    cls: "bio",
    endo: "Socially legible personality — learned weights from neurological architecture meeting early experience",
    exo: "Cultural context — cosmopolitan vs. traditional vs. marginalized community",
    attrs: ["attachment style","class position","religious formation","trauma or safety","peer hierarchy"],
    refraction: "One high-order, high-discipline, high-affiliative temperament: formed in cosmopolitan meritocracy → earnest institutionalist. Formed in a locally rooted, status-threatened community → earnest patriot of a different kind. Formed in a community that experienced discrimination → fierce in-group advocate. Three trajectories. One temperament. Three cultural prisms.",
    note: null
  },
  {
    code: "L3",
    name: "Political disposition",
    tagline: "The value function",
    cls: "pol",
    endo: "Value function of the political agent — everything learned from experience compressed into a mapping",
    exo: "Political-economic environment — which dispositions the moment activates or suppresses",
    attrs: ["redistribution vs. free markets","cultural openness vs. tradition","zero-sum sensitivity","moral circle breadth","proceduralism","compromise tolerance","partisan identity"],
    refraction: "The libertarian moment of 2010 and populist moment of 2016 didn't involve mass conversions. The political-economic environment changed which dimensions of pre-existing dispositions became salient. Dormant parochialism activated. Fraying institutional trust finally snapped. Same people, same deep structure, different political expression.",
    note: "The Markov property earns its keep here. L3 is Markovian with respect to political behavior — given someone's disposition profile, their specific biography doesn't improve prediction. Disposition is the sufficient statistic. PRISM measures L3 across 14 dimensions in four clusters: Ends, Means, Reality, Self."
  },
  {
    code: "L4",
    name: "Political alignment",
    tagline: "Disposition meets affordance",
    cls: "pol",
    endo: "Disposition compressed into symbolic categories — issue bundles and coalition identities",
    exo: "Affordance structure — candidates, party platforms, coalition composition, issue agenda, ballot access, social cost of action",
    attrs: ["liberal / conservative labels","coalition identity","ticket-splitting","third-party visibility","partisan sorting"],
    refraction: "L3 is the policy function. L4 is the state space. Same policy, different states, different actions — which is why the same person votes differently across elections without having changed. Affordances determine which options are even visible. High engagement + high tribalism makes third parties functionally invisible, not because the person is unintelligent, but because their disposition filters the state space.",
    note: null
  },
  {
    code: "L5",
    name: "Political behavior",
    tagline: "What the world measures",
    cls: "pol",
    endo: "Action output of the agent",
    exo: "The political moment — events, mobilization, campaigns, crises",
    attrs: ["voting","party affiliation","issue positions","movement participation","protest","organizing","abstention","posting","persuading"],
    refraction: "Overdetermination: the same observable behavior — voting for a particular candidate — can be generated by completely different L0–L4 configurations. Two voters with identical survey scores may have arrived there via entirely different causal paths. One is a true believer. The other is a contextual voter whose affordance structure happens to point the same direction this cycle. Same output, different generators, different futures.",
    note: null
  }
];
const chain = document.getElementById('chain');
if (!chain) return;
layers.forEach((l, i) => {
  const card = document.createElement('div');
  card.className = 'layer-card ' + l.cls;
  card.innerHTML = `
    <div class="card-header">
      <span class="layer-badge">${l.code}</span>
      <div style="flex:1">
        <div class="card-title">${l.name}</div>
        <div class="card-tagline">${l.tagline}</div>
      </div>
      <span class="chevron">▼</span>
    </div>
    <div class="card-body">
      <div class="two-col">
        <div class="col-block">
          <div class="col-label">Endogenous</div>
          <div class="col-value">${l.endo}</div>
        </div>
        <div class="col-block">
          <div class="col-label">Exogenous medium</div>
          <div class="col-value">${l.exo}</div>
        </div>
      </div>
      <div class="col-block">
        <div class="col-label">Key attributes</div>
        <div class="attr-list">${l.attrs.map(a => `<span class="attr-pill">${a}</span>`).join('')}</div>
      </div>
      <div class="refraction-block">
        <div class="refraction-label">The refraction</div>
        <div class="refraction-text">${l.refraction}</div>
      </div>
      ${l.note ? `<div class="note-block">${l.note}</div>` : ''}
    </div>
  `;
  card.querySelector('.card-header').addEventListener('click', () => card.classList.toggle('open'));
  chain.appendChild(card);
  if (i < layers.length - 1) {
    const conn = document.createElement('div');
    conn.className = 'connector';
    conn.innerHTML = `<div class="connector-line"></div><span class="connector-text">refraction ↓</span><div class="connector-line"></div>`;
    chain.appendChild(conn);
  }
});
})();
</script>

## Liberal and Conservative as Principal Components

When was the last time someone told you they were liberal or conservative and you felt like you actually understood their politics?

These terms are better understood as principal components than as real dimensions. They're summary bundles of correlated views, identities, and intuitions — not singular underlying axes that explain who someone is. Like PCA in statistics, they compress a high-dimensional disposition space into convenient labels that capture the most variance in a given era.

What liberal captures in 1972 — Great Society, labour unions, anti-war — is not what it captures in 2024 — identity politics, credentialism, technocratic governance. Same label, different loading vector. The components rotate when the coalitional sorting changes.

This is why the labels feel increasingly strained. When the coalition structure is stable, the first principal component — the liberal-conservative axis — explains a lot of variance and the labels feel natural. When coalitions are realigning, as they are now, the loading vector is rotating, and people who haven't changed at all suddenly find themselves without a label that fits. They didn't move. The axis did.

The fourteen-dimensional PRISM space doesn't compress to a line. It preserves the cross-pressures that the PCA projection destroys: the person who is economically redistributionist and culturally traditional, the person who is procedurally conservative and morally universalist, the person who is deeply engaged but refuses partisan identity. These combinations are common in the population and invisible on a left-right spectrum.

You are a stranger in a room. You have hardware you didn't choose. That hardware was calibrated by an upbringing you didn't choose. That calibration crystallized into a personality you only partially chose. That personality, encountering the cultural and economic conditions of your era, produced a set of political dispositions you experience as beliefs. Those dispositions, compressed into ideological language and filtered through the affordances of the political moment, produce the behaviour the world sees and calls your politics.

Six layers. Five refractions. One agent, learning in an environment it didn't design.

The political spectrum is a projection of this process onto a line. PRISM is an attempt to map the process itself.
