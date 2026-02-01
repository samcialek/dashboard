# Follow-up to Jev Wray — LinkedIn Message
**Status:** DRAFT — review and send via LinkedIn DM
**Date:** Jan 31, 2026 (updated Feb 1)
**Context:** Call happened Jan 30, 4:00-4:30 PM via Google Meet. This is a follow-up, NOT a cold intro.

---

Hey Jev — great connecting Friday. Really appreciated the time and the detail on what the team is building at Aaru.

The more I think about it, the more I see the fit. The agent architecture problems you described map directly to what I've been working through with PRISM — especially around structured psychological profiles vs. demographic-conditioned prompting, and the temporal dynamics piece. I'd been solving those same problems from the political modeling side without realizing someone was building the platform I'd want to deploy it on.

Two things I'd love to explore with John directly:

**Serif + population-agent modeling.** I've been running a health/wearables platform called Serif for the past couple years — personalized health interventions driven by biosignal data. The core statistical problem turned out to be the same one PRISM solves: how do you build models across a heterogeneous population without either collapsing everyone into one average or overfitting to individual noise? The answer (from McElreath's *Statistical Rethinking*, which shaped a lot of how I think about this) is partial pooling — hierarchical models where individual agents share information through their cluster membership. Combine that with PCA to reduce the dimensionality of your agent parameter space, and you get something that scales without losing the texture. I think the Serif learnings around health-behavioral clustering map directly onto how Aaru could model non-political agent behaviors — consumption, health decisions, lifestyle patterns. That's a real expansion of what the synthetic population can predict.

**Hedge fund clients.** This is probably more of a BD conversation, but I have real connections into the hedge fund world and I think Aaru's synthetic population data is exactly the kind of alternative signal they'd pay for. Sentiment modeling, consumer behavior prediction, political risk — funds are starving for this stuff and most of what's available is garbage. I could be a bridge there. Worth discussing what that looks like if I'm on the team.

Happy to send over my resume and any supporting materials whenever it makes sense. I'm in the NYC area, so very open to sitting down with John in person — I think the architecture clicks fast once you see the layer structure and how partial pooling actually works at scale.

Looking forward to next steps.

Sam
