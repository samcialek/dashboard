# Aaru Presentation — Implementation-Grounded Script Fork (Laptop)

## Purpose
This document maps every major claim in the spoken script to specific implementation details from the causal-VAE project. It distinguishes what is real, what is partially implemented, and what is extrapolated for the presentation.

---

## 1. What the Causal-VAE Actually Is

**One sentence:** A variational autoencoder that learns latent psychographic dimensions from observable demographics, with an explicit causal DAG in latent space that enables structured counterfactual reasoning about political and behavioral outcomes.

**Architecture (from `src/causal_vae.py` and `experiments/iter6a/causal_vae_v6a.py`):**

```
Demographics (~20 vars)  →  [Encoder (512→256)]  →  Split Latent Space
                                                         │
                                                    z_demo (6 dims)
                                                         │
                                              [one-directional bridge]
                                                         ↓
                                                   z_psycho (26 dims)
                                                         │
                                                   [Causal DAG]
                                                   (NOTEARS / fixed)
                                                         │
                                              [Structural Equation MLPs]
                                                         │
                                                    z_causal (32 dims)
                                                         │
                                              [Decoder (256→512)]
                                                         ↓
                                          Political/Behavioral Targets (~15 vars)
```

**Data:** ~74K harmonized records from:
- CES 2020 (~61K) — party ID, ideology, policy positions, validated vote
- ANES 2020 (~8.3K) — authoritarianism, trust, media, feeling thermometers
- Voter Study Group (~5K) — panel data with longitudinal tracking

**Encoder input (20 observable demographics):** age, sex, race/ethnicity, education, income, employment, marital status, children, homeownership, state/region (learned 8-dim embedding in v6a), urbanicity, religious affiliation, church attendance, union membership, veteran status, born in US, internet access, household size, health insurance, disability.

**Decoder targets (15 political/behavioral vars):** party ID (7-point), ideology (7-point), presidential vote, voting likelihood, feeling thermometers (D and R), immigration stance, government spending, abortion, gun policy, climate, racial resentment, government trust.

---

## 2. Where the Causal Structure Lives in the Code

### The Split Latent Space
**File:** `src/causal_vae.py`, lines ~55-60

The latent space is explicitly split: `z_demo` (demographic latent, 4-6 dims) and `z_psycho` (psychographic latent, 8-26 dims). The bridge is **one-directional**: demographics influence psychographics, but not the reverse.

```python
# From CausalVAE.__init__():
self.demo_to_psycho = nn.Sequential(
    nn.Linear(n_demo_latent, 32),
    nn.ReLU(),
    nn.Linear(32, n_psycho_latent),
)
```

**Why this matters for the presentation:** This is the structural claim that demographic variables causally influence psychographic dispositions (not the reverse). A person's age, education, and geography shape their political psychology — but their political psychology doesn't retroactively change their demographics. The architecture enforces this.

### The DAG

**Early iterations (v1-v5):** Learned adjacency matrix using NOTEARS acyclicity constraint + hard sigmoid parameterization. The DAG was discovered from data.

```python
# From src/causal_vae.py:
self.W = nn.Parameter(torch.randn(n_psycho_latent, n_psycho_latent) * 0.01)

def get_adjacency(self):
    A = hard_sigmoid(self.W, temperature=0.5)
    A = A * (1 - torch.eye(self.n_psycho_latent, device=A.device))
    return A

def dag_penalty(self):
    """NOTEARS acyclicity constraint"""
    A = self.get_adjacency()
    M = A * A
    exp_M = torch.matrix_exp(M)
    h = torch.trace(exp_M) - d
    return h
```

**Honest assessment:** The learned DAG from early iterations showed near-uniform edge weights (~0.11 everywhere), meaning it didn't learn meaningful sparse structure from the data. This is a known challenge with NOTEARS on real datasets.

**Later iterations (v6a):** Switched to a **predefined DAG** based on theoretical knowledge:

```python
# From iter6a/causal_vae_v6a.py:
FIXED_DAG_EDGES_PSYCHO = [
    # authoritarianism -> economic/cultural policy
    (_remap(4), _remap(7)), (_remap(4), _remap(8)), (_remap(4), _remap(11)),
    # openness -> policy dispositions
    (_remap(5), _remap(6)), (_remap(5), _remap(7)), (_remap(5), _remap(13)),
    # risk tolerance -> engagement
    (_remap(9), _remap(10)), (_remap(9), _remap(11)),
    # trust -> economic policy, engagement
    (_remap(6), _remap(10)),
    (_remap(8), _remap(11)), (_remap(8), _remap(13)),
    ...
]
```

**Why this matters for the presentation:** The move from learned → predefined DAG is actually a strong story: "We tried to discover structure purely from data. The data alone wasn't enough to recover sparse structure. So we brought in domain knowledge — theoretical causal relationships between psychological foundations and policy dispositions — and used the model to estimate the *strength* of those relationships rather than their *existence*." This is a mature approach, not a failure.

### The Structural Equations

**File:** `src/causal_vae.py`, `apply_structural_equations()`

Each latent dimension has a small MLP that takes its causal parents as input and produces a structural effect that's *added* to the raw latent value:

```python
def apply_structural_equations(self, z_psycho):
    A = self.get_adjacency()
    z_causal = torch.zeros_like(z_psycho)
    for i in range(self.n_psycho_latent):
        parent_weights = A[:, i]
        parent_input = z_psycho * parent_weights.unsqueeze(0)
        structural_effect = self.structural_nets[i](parent_input).squeeze(-1)
        z_causal[:, i] = z_psycho[:, i] + structural_effect
    return z_causal
```

**Why this matters for the presentation:** This is where counterfactual reasoning lives. To compute a counterfactual: you change a parent latent dimension (e.g., "what if this person had graduate education?"), then re-run `apply_structural_equations()` to see how the change propagates through the DAG to all downstream dimensions. The decoder then maps the modified latent to new political/behavioral predictions. That's the `do()` operator — implemented as graph propagation through learned structural equations.

---

## 3. What Kinds of Counterfactuals It Actually Supports

### Implemented and demonstrated:
- **Demographic interventions:** Change a demographic input (education, income, urbanicity), re-encode, propagate through DAG, decode to new behavioral predictions. This is what the "Rural Evangelical Male, do(education=graduate)" slide shows.
- **Latent-space interventions:** Directly modify a psychographic latent dimension (e.g., increase authoritarianism by 1 std) and propagate downstream. This is cleaner because it operates in the causal space directly.
- **Population-level heterogeneity:** Run the same intervention across many encoded individuals and observe the distribution of effects. This is what the "do(GLP-1) on a population" slide shows.

### Partially implemented (on desktop, not on laptop):
- **GLP-1 counterfactual simulation:** The `experiments/glp1_causal/` branch on desktop extends the model to health/consumer behavior domains. Laptop doesn't have this code.
- **Environment simulation:** Desktop has `deliverable/ENVIRONMENT-SIMULATION.md` describing how exogenous shocks propagate through the agent population.

### Extrapolated for the presentation (not yet implemented):
- **Online Bayesian change detection (BOCPD):** The BOCPD slide in the presentation is conceptual. The causal-VAE does not currently have an online updating mechanism. The adjacency matrix is learned/fixed during training and doesn't adapt at inference time.
- **Anticipatory simulation with posterior sampling:** The "1000 draws from posterior" simulation flow is conceptually supported by the VAE's probabilistic latent space (you can sample z ~ N(mu, sigma)), but the full pipeline shown in the slide hasn't been built as a product-ready system.
- **Time-bound effects:** The temporal dynamics shown in the HTE table and time-bound effects slide are derived from domain reasoning about GLP-1 pharmacology, not from a trained temporal model. The causal-VAE is cross-sectional, not longitudinal.

---

## 4. How the GLP-1 / Simulation Branch Maps to Code

The GLP-1 example in the presentation is a **domain translation** of the political causal-VAE concept. The architecture is the same:
- Encoder: demographics → latent
- DAG: psychographic mechanisms (replaced with health/behavioral mechanisms for GLP-1)
- Structural equations: propagate intervention effects
- Decoder: behavioral outcomes

The *political* causal-VAE is fully implemented. The *health/GLP-1* version is a conceptual extension that uses the same architecture but with health-domain variables. Desktop has experimental code; laptop does not.

**For the presentation, the honest framing is:**
- "I built this architecture for political behavior modeling"
- "The GLP-1 example demonstrates the same architecture applied to a different domain"
- "The point is that the modeling approach is domain-general — the same structure works whether you're modeling political dispositions or health behaviors"

---

## 5. What Is Real vs. What Is Extrapolated

| Presentation Claim | Status | Evidence |
|---|---|---|
| Causal VAE architecture with split latent space + DAG | **REAL** | `src/causal_vae.py`, 6+ iterations |
| Demographics → psychographic bridge (one-directional) | **REAL** | `demo_to_psycho` network in code |
| NOTEARS acyclicity constraint | **REAL** | `dag_penalty()` in code |
| Predefined DAG from domain knowledge | **REAL** | `FIXED_DAG_EDGES_PSYCHO` in iter6a |
| Structural equation MLPs per latent dimension | **REAL** | `apply_structural_equations()` |
| 74K harmonized dataset (CES + ANES + VSG) | **REAL** | `data/harmonized_v2.csv` |
| Counterfactual via latent intervention + propagation | **REAL** | Architecture directly supports this |
| VQ-VAE / archetype codebook branch | **REAL** | `experiments/vq_sweep/`, `train_vq.py` |
| CRP clustering for archetype discovery | **REAL** | `experiments/crp_clustering/` |
| R² ≈ 0.20 predictive ceiling across models | **REAL** | `evaluate.py` baseline comparison |
| GLP-1 counterfactual simulation | **PARTIAL** | Desktop has code; laptop doesn't |
| Population heterogeneous effects | **PARTIAL** | Architecture supports; full demo on desktop |
| Environment simulation | **PARTIAL** | Desktop deliverable doc exists |
| Online Bayesian change detection (BOCPD) | **CONCEPTUAL** | Not implemented in codebase |
| Anticipatory simulation pipeline | **CONCEPTUAL** | VAE posterior sampling possible; full pipeline not built |
| Time-bound effects / temporal dynamics | **CONCEPTUAL** | Cross-sectional model; temporal claims from domain reasoning |
| Agent architecture with feedback loop | **CONCEPTUAL** | Describes desired system, not current implementation |
| State embedding (learned geographic representation) | **REAL** | `nn.Embedding(NUM_STATES, 8)` in v6a |

---

## 6. How to Translate This Into Spoken Language

### When the script says "causal structure":
Point to: the split latent space, the one-directional bridge, the predefined DAG, and the structural equation MLPs. These are not metaphors — they're architecture decisions that enforce causal assumptions in the computational graph.

### When the script says "counterfactual reasoning":
Point to: `apply_structural_equations()`. Change a parent, propagate through the structural nets, decode. That's the `do()` operator implemented as forward passes through the graph.

### When the script says "online updating":
**Be careful.** This is the aspirational piece. The current system learns structure during training and fixes it at inference. The honest version: "The architecture is designed so that the adjacency matrix and structural equation weights *could* be updated online as new evidence arrives — and that's the direction I want to go." Don't claim it's already live.

### When the script says "hierarchical representation":
Point to: the split latent (demo/psycho layers), the DAG structure within psycho dimensions, the bridge between layers. Also: the VQ-VAE/archetype branch (discrete codebook = cluster centers in latent space = archetypes). This connects directly to PRISM's 115 archetypes.

### The "reports every 90 days" contrast:
This is the strongest product motivation. Frame it as: "The architecture I've built is cross-sectional — it doesn't update in real time yet. But the structure is there. The DAG + structural equations are designed so that if you change an input or update an edge weight, the downstream implications propagate immediately. The engineering work to make this live is incremental, not architectural."

### The GLP-1 example:
Frame as domain translation: "I built this for political behavior. The GLP-1 example shows the same architecture working on a health domain. The modeling approach is general — the graph structure changes, but the computational machinery is the same."

---

## 7. Recommended Script Edits Based on Implementation Reality

### Part 2 (Prediction ceiling):
Current: "Across standard predictors — XGBoost, LightGBM, random forests, neural nets — gains flatten quickly."
**Add grounding:** "In the political behavior dataset I've been working with — 74,000 harmonized records across three major surveys — the best standard models hit R² around 0.20. Fourteen architectures, same ceiling."

### Part 5 (Counterfactual reasoning):
Current: The Rural Evangelical Male example.
**Add grounding:** "This runs on an actual trained model. The encoder maps his demographics to a 32-dimensional latent space. The causal graph has predefined edges — authoritarianism influences policy dispositions, openness influences cultural attitudes, institutional trust influences engagement. When I change his education, the encoder shifts his latent position, and the structural equation networks propagate that change through every downstream dimension. The decoder then tells me his new predicted party ID, ideology, Trump approval, and policy stances."

### Part 6 (Online updating):
Current: Claims BOCPD detects changes and rewires DAG.
**Soften:** "The architecture is designed so that if edge weights change — if authoritarianism no longer predicts policy positions the same way — the structural equations update and all downstream predictions shift. The live change-detection piece is the engineering frontier I want to build toward."

### Part 8 (What I bring — PRISM):
**Connect to causal-VAE:** "PRISM's 115 archetypes map directly to the VQ-VAE codebook branch of this project — discrete cluster centers in the same latent space. The quiz's Bayesian adaptive question selection is doing inference in this space: each answer updates the posterior over where you sit in the 14-dimensional latent manifold."
