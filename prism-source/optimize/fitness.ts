/**
 * Composite fitness function for CMA-ES optimization.
 *
 * Fitness = accuracy_penalty + efficiency_bonus + confusion_penalty
 *
 * CMA-ES MINIMIZES, so lower = better.
 */
import { runSimulation, type SimulationResult } from "./simulate.js";
import type { EngineConfig } from "./runtimeConfig.js";
import { ARCHETYPES } from "../config/archetypes.js";

// Known confusion pairs (cosine > 0.90) — accuracy on these matters most
const CONFUSION_PAIRS: [string, string][] = [
  ["086", "096"], // Duty Traditionalist / Civic Disciplinarian (0.927)
  ["100", "012"], // Tribal Insurgent / Class-War Leftist (0.917)
  ["043", "049"], // (0.984)
  ["093", "097"], // cluster
  ["093", "091"], // cluster
  ["097", "091"], // cluster
  ["021", "022"], // cosmopolitan cluster
  ["021", "024"],
  ["021", "026"],
  ["021", "030"],
  ["022", "024"],
  ["022", "026"],
  ["022", "030"],
  ["024", "026"],
  ["024", "030"],
  ["026", "030"],
];

export interface FitnessWeights {
  /** Per wrong archetype penalty (default: 10) */
  wrongPenalty: number;
  /** Per question cost (default: 0.05) — favor shorter quizzes */
  questionCost: number;
  /** Bonus per confusion pair correctly classified (default: 2) */
  confusionBonus: number;
  /** Penalty for exhausting all questions (not stopping early) (default: 3) */
  exhaustedPenalty: number;
  /** Target accuracy — penalty scales quadratically below this (default: 0.98) */
  targetAccuracy: number;
}

const DEFAULT_WEIGHTS: FitnessWeights = {
  wrongPenalty: 10,
  questionCost: 0.05,
  confusionBonus: 2,
  exhaustedPenalty: 3,
  targetAccuracy: 0.98,
};

export interface FitnessResult {
  fitness: number;
  sim: SimulationResult;
  breakdown: {
    accuracyPenalty: number;
    efficiencyCost: number;
    confusionPenalty: number;
    exhaustedPenalty: number;
  };
}

/**
 * Evaluate fitness for a given config.
 * Lower = better (CMA-ES minimizes).
 */
export function evaluateFitness(
  configOverrides: Partial<EngineConfig>,
  weights: FitnessWeights = DEFAULT_WEIGHTS,
  archetypeSubset?: string[]
): FitnessResult {
  const sim = runSimulation(configOverrides, archetypeSubset);

  // Accuracy penalty: quadratic below target, linear above (reward accuracy improvements)
  const accGap = weights.targetAccuracy - sim.accuracy;
  const accuracyPenalty = accGap > 0
    ? weights.wrongPenalty * sim.wrongCount + 50 * accGap * accGap
    : -2 * sim.accuracy; // small reward for exceeding target

  // Efficiency cost: favor shorter quizzes
  const efficiencyCost = weights.questionCost * sim.avgQuestions;

  // Confusion pair penalty: check if confusion pair members are correctly classified
  let confusionCorrect = 0;
  const confusionIds = new Set<string>();
  for (const [a, b] of CONFUSION_PAIRS) {
    confusionIds.add(a);
    confusionIds.add(b);
  }
  for (const r of sim.perArchetype) {
    if (confusionIds.has(r.id) && r.correct) confusionCorrect++;
  }
  const confusionPenalty = -weights.confusionBonus * confusionCorrect;

  // Exhausted penalty: discourage running all questions
  const exhaustedPenalty = weights.exhaustedPenalty * sim.exhaustedCount;

  const fitness = accuracyPenalty + efficiencyCost + confusionPenalty + exhaustedPenalty;

  return {
    fitness,
    sim,
    breakdown: { accuracyPenalty, efficiencyCost, confusionPenalty, exhaustedPenalty },
  };
}

/**
 * Quick fitness: run only on confusion pairs + a random sample.
 * ~3x faster than full simulation for initial exploration.
 */
export function evaluateFitnessQuick(
  configOverrides: Partial<EngineConfig>,
  weights: FitnessWeights = DEFAULT_WEIGHTS
): FitnessResult {
  // Run on all confusion pair members + 20 random others
  const confusionIds = new Set<string>();
  for (const [a, b] of CONFUSION_PAIRS) {
    confusionIds.add(a);
    confusionIds.add(b);
  }

  // Add a deterministic sample of non-confusion archetypes
  const others = ARCHETYPES
    .filter(a => !confusionIds.has(a.id))
    .filter((_, i) => i % 5 === 0)  // every 5th = ~20 archetypes
    .map(a => a.id);

  const subset = [...confusionIds, ...others];
  return evaluateFitness(configOverrides, weights, subset);
}
