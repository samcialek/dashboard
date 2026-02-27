# Mateja — Conversation Cheatsheet

## Talking Points
- **Mention Yahtzee RL project** — Mateja built a Monopoly AI using RL (Python + Pygames, team of 5 at MSU AI Club). Connect by mentioning your own Yahtzee project using reinforcement learning. Good bonding point — both built classic board game AI with RL.
- **Serif's partial pooling in practice** — The population priors are based on cohorts (partial pooling), while the posteriors are calibrated and individualized. This is the core value prop: you start with what's known about people like you, then update as your personal data comes in.
- **Two things LLMs can't do (Sam's Serif thesis):**
  1. **Carry the full distribution** — LLMs collapse to a mode/mean. You should never summarize or reduce to a point estimate until you need to report something. Always maintain the full heterogeneity, the full distribution.
  2. **Causality** — LLMs don't understand confounders. They don't understand backdoor adjustments. This is where the opportunity for Serif exists: real causal inference, not pattern matching.
- **ASK: Does Aaru use real-world data for agent priors?** — Are the synthetic population agents calibrated against real survey/behavioral data (e.g., census, ANES, CPS, transaction data), or are the priors generated/inferred through LLMs? This is a critical architectural distinction — grounded priors vs. LLM hallucinated priors. Good way to show you understand the difference and care about calibration.
