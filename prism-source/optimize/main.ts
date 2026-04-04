#!/usr/bin/env node
/**
 * CMA-ES optimization entry point.
 *
 * Usage:
 *   npx tsx src/optimize/main.ts [phase]
 *
 * Phases:
 *   1  Core distance parameters (TEMPERATURE, SALIENCE_MISMATCH_LAMBDA, etc.)
 *   2  Stop rule parameters (thresholds, consecutive leads, etc.)
 *   3  Question selection strategy (blend, batch, overlap)
 *   4  Pruning parameters
 *   5  Salience surprise (currently disabled features)
 *   all  Joint optimization of all parameters (starts from best of phases 1-4)
 *   baseline  Run baseline simulation (no optimization)
 */

import { cmaes } from "./cmaes.js";
import {
  PHASE1_PARAMS, PHASE2_PARAMS, PHASE3_PARAMS, PHASE4_PARAMS, PHASE5_PARAMS,
  ALL_PARAMS, encode, decode, defaultVector,
  type ParamDef,
} from "./paramSpace.js";
import { evaluateFitness, evaluateFitnessQuick, type FitnessResult } from "./fitness.js";
import { runSimulation } from "./simulate.js";
import { getDefaults, resetConfig, type EngineConfig } from "./runtimeConfig.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPct(n: number): string {
  return (n * 100).toFixed(1) + "%";
}

function printSimResult(label: string, fr: FitnessResult): void {
  const s = fr.sim;
  console.log(`\n${"=".repeat(60)}`);
  console.log(`${label}`);
  console.log(`${"=".repeat(60)}`);
  console.log(`  Accuracy:        ${formatPct(s.accuracy)} (${s.wrongCount} wrong / ${s.perArchetype.length})`);
  console.log(`  Avg questions:   ${s.avgQuestions.toFixed(1)}`);
  console.log(`  Median questions:${s.medianQuestions}`);
  console.log(`  Avg posterior:   ${formatPct(s.avgPosterior)}`);
  console.log(`  Avg margin:      ${formatPct(s.avgMargin)}`);
  console.log(`  Stopped early:   ${s.shouldStopCount} / ${s.perArchetype.length}`);
  console.log(`  Exhausted:       ${s.exhaustedCount}`);
  console.log(`  Fitness:         ${fr.fitness.toFixed(4)}`);
  console.log(`  Breakdown:       acc=${fr.breakdown.accuracyPenalty.toFixed(2)} eff=${fr.breakdown.efficiencyCost.toFixed(2)} conf=${fr.breakdown.confusionPenalty.toFixed(2)} exh=${fr.breakdown.exhaustedPenalty.toFixed(2)}`);

  if (s.wrongArchetypes.length > 0) {
    console.log(`\n  Wrong archetypes:`);
    for (const w of s.wrongArchetypes) {
      console.log(`    ${w.id} ${w.name} → ${w.leader} ${w.leaderName} (post=${formatPct(w.posterior)}, margin=${formatPct(w.margin)}, Q=${w.stoppedAt})`);
    }
  }
}

function printConfig(overrides: Partial<EngineConfig>, params: ParamDef[]): void {
  const defaults = getDefaults();
  console.log(`\n  Optimized parameters:`);
  for (const p of params) {
    const val = (overrides as any)[p.key] ?? defaults[p.key];
    const def = defaults[p.key];
    const changed = Math.abs(val - def) > 1e-6;
    const marker = changed ? " ← CHANGED" : "";
    console.log(`    ${p.key}: ${p.integer ? val : val.toFixed(4)} (default: ${p.integer ? def : def.toFixed(4)})${marker}`);
  }
}

// ---------------------------------------------------------------------------
// Phase runner
// ---------------------------------------------------------------------------

function runPhase(
  phaseName: string,
  params: ParamDef[],
  baseOverrides: Partial<EngineConfig> = {},
  maxGens: number = 30,
  useQuickFitness: boolean = false,
): { overrides: Partial<EngineConfig>; result: FitnessResult } {
  console.log(`\n${"#".repeat(60)}`);
  console.log(`# Phase: ${phaseName} (${params.length} params, ${maxGens} generations)`);
  console.log(`${"#".repeat(60)}`);

  const x0 = defaultVector(params);

  const objective = (x: number[]): number => {
    const decoded = decode(x, params);
    const merged = { ...baseOverrides, ...decoded };
    const fr = useQuickFitness
      ? evaluateFitnessQuick(merged)
      : evaluateFitness(merged);
    return fr.fitness;
  };

  const result = cmaes(objective, {
    dim: params.length,
    x0,
    sigma0: 0.3,
    maxGenerations: maxGens,
    onGeneration: (gen, best, mean, sigma) => {
      if (gen % 5 === 0 || gen === maxGens - 1) {
        console.log(`  Gen ${gen.toString().padStart(3)}: best=${best.toFixed(4)}, mean=${mean.toFixed(4)}, σ=${sigma.toFixed(4)}`);
      }
    },
  });

  const overrides = { ...baseOverrides, ...decode(result.bestX, params) };
  const fr = evaluateFitness(overrides);

  console.log(`\n  CMA-ES completed: ${result.evaluations} evaluations, ${result.converged ? "converged" : "max generations reached"}`);
  printConfig(overrides, params);
  printSimResult(`Phase ${phaseName} — Full Evaluation`, fr);

  return { overrides, result: fr };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const phase = process.argv[2] ?? "all";

console.log("PRISM Quiz Engine — CMA-ES Optimizer");
console.log(`Phase: ${phase}`);
console.log(`Archetypes: ${runSimulation({}).perArchetype.length}`);

// Baseline
console.log("\nRunning baseline...");
resetConfig();
const baselineFr = evaluateFitness({});
printSimResult("BASELINE (default config)", baselineFr);

if (phase === "baseline") {
  process.exit(0);
}

let bestOverrides: Partial<EngineConfig> = {};

if (phase === "1" || phase === "all") {
  // Phase 1: quick fitness for exploration, then full fitness for refinement
  const p1Quick = runPhase("1-core-distance (quick)", PHASE1_PARAMS, {}, 20, true);
  const p1 = runPhase("1-core-distance (full)", PHASE1_PARAMS, {}, 15, false);
  bestOverrides = p1.result.fitness < p1Quick.result.fitness ? p1.overrides : p1Quick.overrides;
}

if (phase === "2" || phase === "all") {
  const p2 = runPhase("2-stop-rule", PHASE2_PARAMS, bestOverrides, 25, false);
  bestOverrides = p2.overrides;
}

if (phase === "3" || phase === "all") {
  const p3 = runPhase("3-question-selection", PHASE3_PARAMS, bestOverrides, 20, false);
  bestOverrides = p3.overrides;
}

if (phase === "4" || phase === "all") {
  const p4 = runPhase("4-pruning", PHASE4_PARAMS, bestOverrides, 15, false);
  bestOverrides = p4.overrides;
}

if (phase === "5") {
  const p5 = runPhase("5-salience-surprise", PHASE5_PARAMS, bestOverrides, 15, false);
  bestOverrides = p5.overrides;
}

if (phase === "all") {
  // Joint refinement: take best from phased optimization, refine all together
  console.log("\n\nJoint refinement phase — all parameters together...");
  const joint = runPhase("joint-refinement", ALL_PARAMS, {}, 40, false);

  // Pick whichever is better: phased or joint
  const phasedFr = evaluateFitness(bestOverrides);
  if (joint.result.fitness < phasedFr.fitness) {
    bestOverrides = joint.overrides;
    console.log("\n  → Joint refinement improved over phased optimization!");
  } else {
    console.log("\n  → Phased optimization was better — keeping phased result.");
  }
}

// Final report
const finalFr = evaluateFitness(bestOverrides);
printSimResult("FINAL OPTIMIZED RESULT", finalFr);
printConfig(bestOverrides, phase === "all" ? ALL_PARAMS : []);

// Print as code for easy copy-paste into config
console.log("\n\n// Copy-paste into runtimeConfig.ts DEFAULTS:");
console.log("const OPTIMIZED: Partial<EngineConfig> = {");
const defaults = getDefaults();
for (const [key, val] of Object.entries(bestOverrides)) {
  if (Math.abs(val as number - (defaults as any)[key]) > 1e-6) {
    console.log(`  ${key}: ${typeof val === "number" && !Number.isInteger(val) ? (val as number).toFixed(6) : val},`);
  }
}
console.log("};");

// Compare with baseline
console.log(`\n${"=".repeat(60)}`);
console.log("COMPARISON");
console.log(`${"=".repeat(60)}`);
console.log(`  Baseline accuracy:  ${formatPct(baselineFr.sim.accuracy)} (${baselineFr.sim.wrongCount} wrong)`);
console.log(`  Optimized accuracy: ${formatPct(finalFr.sim.accuracy)} (${finalFr.sim.wrongCount} wrong)`);
console.log(`  Baseline avg Q:     ${baselineFr.sim.avgQuestions.toFixed(1)}`);
console.log(`  Optimized avg Q:    ${finalFr.sim.avgQuestions.toFixed(1)}`);
console.log(`  Baseline fitness:   ${baselineFr.fitness.toFixed(4)}`);
console.log(`  Optimized fitness:  ${finalFr.fitness.toFixed(4)}`);
console.log(`  Improvement:        ${((baselineFr.fitness - finalFr.fitness) / Math.abs(baselineFr.fitness) * 100).toFixed(1)}%`);
