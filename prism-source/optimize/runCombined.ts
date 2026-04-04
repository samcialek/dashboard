#!/usr/bin/env node
/**
 * Combined optimization: applies Phase 2 best params, then optimizes Phase 3+4 on top.
 * Finally does joint refinement.
 */
import { cmaes } from "./cmaes.js";
import {
  PHASE3_PARAMS, PHASE4_PARAMS,
  ALL_PARAMS, encode, decode, defaultVector,
  type ParamDef,
} from "./paramSpace.js";
import { evaluateFitness, type FitnessResult } from "./fitness.js";
import { runSimulation } from "./simulate.js";
import { getDefaults, resetConfig, type EngineConfig } from "./runtimeConfig.js";

function formatPct(n: number): string { return (n * 100).toFixed(1) + "%"; }

function printSim(label: string, fr: FitnessResult): void {
  const s = fr.sim;
  console.log(`\n${"=".repeat(60)}`);
  console.log(label);
  console.log(`  Accuracy: ${formatPct(s.accuracy)} (${s.wrongCount} wrong/${s.perArchetype.length}), Avg Q: ${s.avgQuestions.toFixed(1)}, Med Q: ${s.medianQuestions}`);
  console.log(`  Stopped: ${s.shouldStopCount}/${s.perArchetype.length}, Exhausted: ${s.exhaustedCount}, Fitness: ${fr.fitness.toFixed(4)}`);
  if (s.wrongArchetypes.length > 0) {
    for (const w of s.wrongArchetypes) {
      console.log(`    WRONG: ${w.id} ${w.name} → ${w.leader} ${w.leaderName} (Q=${w.stoppedAt})`);
    }
  }
}

// Phase 2 best results (from previous run)
const PHASE2_BEST: Partial<EngineConfig> = {
  STOP_POSTERIOR_THRESHOLD: 0.600000,
  STOP_MARGIN_THRESHOLD: 0.093030,
  STOP_MIN_QUESTIONS: 32,
  STOP_MIN_CONSECUTIVE_LEADS: 3,
  STOP_AGREEMENT_K: 3,
  HC_POSTERIOR: 0.640950,
  HC_MARGIN: 0.303295,
  HC_CONSECUTIVE: 5,
  HC_COSINE_BLOCK: 0.980000,
  UC_POSTERIOR: 0.866520,
  UC_MARGIN: 0.946280,
  UC_CONSECUTIVE: 5,
  UC_MIN_Q: 20,
  LATE_GAME_MIN_Q: 40,
  LATE_GAME_POSTERIOR: 0.200000,
  LATE_GAME_MARGIN: 0.062851,
  LATE_GAME_CONSECUTIVE: 20,
};

// Baseline
resetConfig();
const baselineFr = evaluateFitness({});
printSim("BASELINE", baselineFr);

// Phase 2 alone
const p2Fr = evaluateFitness(PHASE2_BEST);
printSim("PHASE 2 BEST", p2Fr);

// Phase 3: Question selection on top of Phase 2
console.log("\n### Phase 3: Question Selection (on top of Phase 2)");
function runPhase(params: ParamDef[], base: Partial<EngineConfig>, gens: number): Partial<EngineConfig> {
  const x0 = defaultVector(params);
  const result = cmaes(
    (x) => evaluateFitness({ ...base, ...decode(x, params) }).fitness,
    {
      dim: params.length, x0, sigma0: 0.3, maxGenerations: gens,
      onGeneration: (g, b, m, s) => { if (g % 5 === 0) console.log(`  Gen ${g}: best=${b.toFixed(4)}, σ=${s.toFixed(4)}`); },
    }
  );
  return { ...base, ...decode(result.bestX, params) };
}

const p3Overrides = runPhase(PHASE3_PARAMS, PHASE2_BEST, 20);
const p3Fr = evaluateFitness(p3Overrides);
printSim("PHASE 2+3", p3Fr);

// Phase 4: Pruning on top of Phase 2+3
console.log("\n### Phase 4: Pruning (on top of Phase 2+3)");
const p4Overrides = runPhase(PHASE4_PARAMS, p3Overrides, 15);
const p4Fr = evaluateFitness(p4Overrides);
printSim("PHASE 2+3+4", p4Fr);

// Joint refinement of ALL params starting from phased best
console.log("\n### Joint Refinement (all params)");
const jointX0 = encode(p4Overrides, ALL_PARAMS);
const jointResult = cmaes(
  (x) => evaluateFitness(decode(x, ALL_PARAMS)).fitness,
  {
    dim: ALL_PARAMS.length, x0: jointX0, sigma0: 0.15, maxGenerations: 30,
    onGeneration: (g, b, m, s) => { if (g % 5 === 0) console.log(`  Gen ${g}: best=${b.toFixed(4)}, σ=${s.toFixed(4)}`); },
  }
);
const jointOverrides = decode(jointResult.bestX, ALL_PARAMS);
const jointFr = evaluateFitness(jointOverrides);
printSim("JOINT REFINEMENT", jointFr);

// Pick the best
const candidates = [
  { label: "Phase 2", fr: p2Fr, cfg: PHASE2_BEST },
  { label: "Phase 2+3", fr: p3Fr, cfg: p3Overrides },
  { label: "Phase 2+3+4", fr: p4Fr, cfg: p4Overrides },
  { label: "Joint", fr: jointFr, cfg: jointOverrides },
];
candidates.sort((a, b) => a.fr.fitness - b.fr.fitness);
const best = candidates[0]!;

console.log(`\n${"#".repeat(60)}`);
console.log(`BEST: ${best.label} (fitness=${best.fr.fitness.toFixed(4)})`);
printSim("BEST RESULT", best.fr);

// Print optimized config
const defaults = getDefaults();
console.log("\n// Optimized config:");
console.log("const OPTIMIZED: Partial<EngineConfig> = {");
for (const [key, val] of Object.entries(best.cfg)) {
  if (Math.abs(val as number - (defaults as any)[key]) > 1e-6) {
    const v = val as number;
    console.log(`  ${key}: ${Number.isInteger(v) ? v : v.toFixed(6)},`);
  }
}
console.log("};");

console.log(`\n  Baseline:  ${formatPct(baselineFr.sim.accuracy)}, ${baselineFr.sim.avgQuestions.toFixed(1)} avg Q, fitness=${baselineFr.fitness.toFixed(4)}`);
console.log(`  Optimized: ${formatPct(best.fr.sim.accuracy)}, ${best.fr.sim.avgQuestions.toFixed(1)} avg Q, fitness=${best.fr.fitness.toFixed(4)}`);
