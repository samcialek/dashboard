#!/usr/bin/env node
/**
 * 10,000 random quiz simulations.
 *
 * Uses the real engine logic (question selection, stop rule, pruning)
 * but answers each question randomly.  Collects final node-signature
 * distributions across all runs.
 *
 * Output: JSON to stdout with per-node histograms.
 */
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { FULL_QUESTIONS } from "../config/questions.full.js";
import { FIXED_16 } from "../engine/config.js";
import { createInitialState } from "../state/initialState.js";
import type { QuestionDef, RespondentState } from "../types.js";
import {
  applyAllocationAnswer, applyPairwiseAnswer, applyRankingAnswer,
  applySingleChoiceAnswer, applySliderAnswer,
} from "../engine/update.js";
import {
  recomputeArchetypePosterior, viableArchetypes, pruneArchetypes,
} from "../engine/archetypeDistance.js";
import { updateNodeStatuses } from "../engine/nodeStatus.js";
import { selectNextBatch } from "../engine/nextQuestion.js";
import { shouldStop, resetSimilarityCache } from "../engine/stopRule.js";
import { resetConfig, getConfig } from "./runtimeConfig.js";
import { expectedPosFrom5, expectedSalience, expectedCatArgmax } from "../engine/math.js";

// ---- Build question bank (same merge logic as browser.ts) ----
const REP_BY_ID = new Map(REPRESENTATIVE_QUESTIONS.map(q => [q.id, q]));
const QUESTION_BANK: QuestionDef[] = FULL_QUESTIONS.map(fq => {
  const rq = REP_BY_ID.get(fq.id);
  if (!rq) return fq;
  return { ...fq,
    ...(rq.optionEvidence !== undefined ? { optionEvidence: rq.optionEvidence } : {}),
    ...(rq.sliderMap !== undefined ? { sliderMap: rq.sliderMap } : {}),
    ...(rq.allocationMap !== undefined ? { allocationMap: rq.allocationMap } : {}),
    ...(rq.rankingMap !== undefined ? { rankingMap: rq.rankingMap } : {}),
    ...(rq.pairMaps !== undefined ? { pairMaps: rq.pairMaps } : {}),
    ...(rq.bestWorstMap !== undefined ? { bestWorstMap: rq.bestWorstMap } : {}),
  };
});
const BANK_BY_ID = new Map(QUESTION_BANK.map(q => [q.id, q]));

// ---- Random answer generators ----

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function randomAnswer(q: QuestionDef): { type: string; value: any } {
  switch (q.uiType) {
    case "single_choice": {
      const keys = Object.keys(q.optionEvidence || {});
      if (keys.length === 0) return { type: "single_choice", value: "default" };
      return { type: "single_choice", value: keys[Math.floor(Math.random() * keys.length)]! };
    }
    case "slider": {
      // Random integer 0-100
      return { type: "slider", value: Math.floor(Math.random() * 101) };
    }
    case "allocation": {
      const keys = Object.keys(q.allocationMap || {});
      // Generate random weights, normalize to 100
      const raw = keys.map(() => Math.random());
      const total = raw.reduce((a, b) => a + b, 0);
      const alloc: Record<string, number> = {};
      let assigned = 0;
      keys.forEach((k, i) => {
        if (i === keys.length - 1) {
          alloc[k] = 100 - assigned;
        } else {
          const v = Math.round((100 * raw[i]!) / total);
          alloc[k] = v;
          assigned += v;
        }
      });
      return { type: "allocation", value: alloc };
    }
    case "ranking": {
      const keys = Object.keys(q.rankingMap || {});
      return { type: "ranking", value: shuffle(keys) };
    }
    case "pairwise": {
      const pairs = q.pairMaps || {};
      const result: Record<string, string> = {};
      for (const [pid, opts] of Object.entries(pairs)) {
        const optKeys = Object.keys(opts);
        result[pid] = optKeys[Math.floor(Math.random() * optKeys.length)]!;
      }
      return { type: "pairwise", value: result };
    }
    case "best_worst": {
      const rm = q.rankingMap ?? q.bestWorstMap ?? {};
      const keys = shuffle(Object.keys(rm));
      return { type: "best_worst", value: [keys[0]!, keys[keys.length - 1]!] };
    }
    case "multi": {
      const keys = Object.keys(q.optionEvidence || {});
      const picked = shuffle(keys).slice(0, 2); // pick 2
      return { type: "multi", value: picked };
    }
    default:
      return { type: "single_choice", value: "default" };
  }
}

function applyAns(state: RespondentState, q: QuestionDef, ans: { type: string; value: any }): void {
  switch (ans.type) {
    case "single_choice": applySingleChoiceAnswer(state, q, ans.value); break;
    case "slider": applySliderAnswer(state, q, ans.value); break;
    case "allocation": applyAllocationAnswer(state, q, ans.value); break;
    case "ranking": applyRankingAnswer(state, q, ans.value); break;
    case "pairwise": applyPairwiseAnswer(state, q, ans.value); break;
    case "best_worst": applyRankingAnswer(state, q, ans.value); break;
    case "multi":
      for (const v of ans.value) applySingleChoiceAnswer(state, q, v);
      state.answers[q.id] = ans.value;
      break;
  }
}

// ---- Snapshot extractor ----

interface NodeSnapshot {
  position: number;   // expected value 1-5 for continuous
  salience: number;   // expected value 0-3
}

interface CatSnapshot {
  topCategory: number;   // argmax index 0-5
  distribution: number[];  // full 6-prob vector
  salience: number;
}

interface SimResult {
  questionsAsked: number;
  stoppedBy: string;
  winnerArchId: string;
  winnerPosterior: number;
  continuous: Record<string, NodeSnapshot>;
  categorical: Record<string, CatSnapshot>;
  trbAnchor: number[];  // 7-element distribution
}

function extractResult(state: RespondentState, questionsAsked: number, stoppedBy: string): SimResult {
  const continuous: Record<string, NodeSnapshot> = {};
  for (const [id, n] of Object.entries(state.continuous)) {
    continuous[id] = {
      position: expectedPosFrom5(n.posDist),
      salience: expectedSalience(n.salDist),
    };
  }

  const categorical: Record<string, CatSnapshot> = {};
  for (const [id, n] of Object.entries(state.categorical)) {
    categorical[id] = {
      topCategory: expectedCatArgmax(n.catDist),
      distribution: [...n.catDist],
      salience: expectedSalience(n.salDist),
    };
  }

  const sorted = Object.entries(state.archetypePosterior)
    .sort((a, b) => b[1] - a[1]);

  return {
    questionsAsked,
    stoppedBy,
    winnerArchId: sorted[0]?.[0] ?? "???",
    winnerPosterior: sorted[0]?.[1] ?? 0,
    continuous,
    categorical,
    trbAnchor: [...state.trbAnchor.dist],
  };
}

// ---- Main simulation loop ----

const N_SIMS = parseInt(process.argv[2] || "10000", 10);

console.error(`Running ${N_SIMS} random simulations...`);

resetConfig();
const cfg = getConfig();
const allResults: SimResult[] = [];

for (let sim = 0; sim < N_SIMS; sim++) {
  resetSimilarityCache();
  const state = createInitialState();

  // Phase 1: Fixed-16
  for (const qid of FIXED_16) {
    const q = BANK_BY_ID.get(qid);
    if (!q) continue;
    const ans = randomAnswer(q);
    applyAns(state, q, ans);
  }
  recomputeArchetypePosterior(state, ARCHETYPES);
  pruneArchetypes(state, ARCHETYPES);
  updateNodeStatuses(state, viableArchetypes(state, ARCHETYPES));

  // Phase 2: Batch-adaptive
  let questionsAsked = FIXED_16.length;
  let stoppedBy = "exhausted";
  const maxQ = QUESTION_BANK.length;

  while (Object.keys(state.answers).length < maxQ) {
    if (questionsAsked >= cfg.STOP_MIN_QUESTIONS && shouldStop(state, ARCHETYPES)) {
      stoppedBy = "shouldStop";
      break;
    }
    const batch = selectNextBatch(state, QUESTION_BANK, ARCHETYPES);
    if (batch.length === 0) { stoppedBy = "noMoreQ"; break; }
    for (const q of batch) {
      const ans = randomAnswer(q);
      applyAns(state, q, ans);
      questionsAsked++;
      recomputeArchetypePosterior(state, ARCHETYPES);
    }
    pruneArchetypes(state, ARCHETYPES);
    updateNodeStatuses(state, viableArchetypes(state, ARCHETYPES));
  }

  allResults.push(extractResult(state, questionsAsked, stoppedBy));

  if ((sim + 1) % 1000 === 0) {
    console.error(`  ${sim + 1}/${N_SIMS} complete`);
  }
}

// ---- Aggregate statistics ----

// Helpers
function percentile(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.floor(p * (sorted.length - 1));
  return sorted[idx]!;
}

function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function std(arr: number[]): number {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((s, x) => s + (x - m) ** 2, 0) / arr.length);
}

// Build output
const continuousNodeIds = Object.keys(allResults[0]!.continuous);
const categoricalNodeIds = Object.keys(allResults[0]!.categorical);

const NODE_NAMES: Record<string, string> = {
  MAT: "Economic Values", CD: "Cultural Direction", CU: "Cultural Universalism",
  MOR: "Moral Circle", PRO: "Proceduralism", COM: "Compromise",
  ZS: "Zero-Sum Thinking", ONT_H: "Ontological Hope", ONT_S: "Ontological Security",
  PF: "Party Feeling", TRB: "Tribalism", ENG: "Engagement",
  EPS: "Epistemics", AES: "Aesthetic Style",
};

const CAT_LABELS: Record<string, string[]> = {
  EPS: ["empiricist", "institutionalist", "traditionalist", "intuitionist", "autonomous", "nihilist"],
  AES: ["statesman", "technocrat", "pastoral", "authentic", "fighter", "visionary"],
};

interface ContinuousAgg {
  name: string;
  position: { mean: number; std: number; min: number; max: number; p5: number; p25: number; p50: number; p75: number; p95: number };
  salience: { mean: number; std: number; min: number; max: number; p5: number; p25: number; p50: number; p75: number; p95: number };
  // Histogram bins for position (1-5 in 0.1 increments)
  positionHist: { binCenter: number; count: number }[];
  salienceHist: { binCenter: number; count: number }[];
}

interface CategoricalAgg {
  name: string;
  categoryDistribution: { label: string; meanProb: number; winRate: number }[];
  salience: { mean: number; std: number; min: number; max: number; p5: number; p25: number; p50: number; p75: number; p95: number };
}

function makeHist(values: number[], binMin: number, binMax: number, binWidth: number): { binCenter: number; count: number }[] {
  const bins: { binCenter: number; count: number }[] = [];
  for (let b = binMin; b <= binMax - binWidth / 2; b += binWidth) {
    bins.push({ binCenter: Math.round((b + binWidth / 2) * 100) / 100, count: 0 });
  }
  for (const v of values) {
    const idx = Math.min(bins.length - 1, Math.max(0, Math.floor((v - binMin) / binWidth)));
    bins[idx]!.count++;
  }
  return bins;
}

function statBlock(values: number[]) {
  return {
    mean: Math.round(mean(values) * 1000) / 1000,
    std: Math.round(std(values) * 1000) / 1000,
    min: Math.round(Math.min(...values) * 1000) / 1000,
    max: Math.round(Math.max(...values) * 1000) / 1000,
    p5: Math.round(percentile(values, 0.05) * 1000) / 1000,
    p25: Math.round(percentile(values, 0.25) * 1000) / 1000,
    p50: Math.round(percentile(values, 0.50) * 1000) / 1000,
    p75: Math.round(percentile(values, 0.75) * 1000) / 1000,
    p95: Math.round(percentile(values, 0.95) * 1000) / 1000,
  };
}

// Continuous nodes
const continuousAgg: Record<string, ContinuousAgg> = {};
for (const nid of continuousNodeIds) {
  const positions = allResults.map(r => r.continuous[nid]!.position);
  const saliences = allResults.map(r => r.continuous[nid]!.salience);
  continuousAgg[nid] = {
    name: NODE_NAMES[nid] ?? nid,
    position: statBlock(positions),
    salience: statBlock(saliences),
    positionHist: makeHist(positions, 1.0, 5.0, 0.1),
    salienceHist: makeHist(saliences, 0.0, 3.0, 0.1),
  };
}

// Categorical nodes
const categoricalAgg: Record<string, CategoricalAgg> = {};
for (const nid of categoricalNodeIds) {
  const saliences = allResults.map(r => r.categorical[nid]!.salience);
  const labels = CAT_LABELS[nid] ?? Array.from({ length: 6 }, (_, i) => `cat${i}`);
  const catDist: { label: string; meanProb: number; winRate: number }[] = [];
  for (let c = 0; c < 6; c++) {
    const probs = allResults.map(r => r.categorical[nid]!.distribution[c]!);
    const wins = allResults.filter(r => r.categorical[nid]!.topCategory === c).length;
    catDist.push({
      label: labels[c] ?? `cat${c}`,
      meanProb: Math.round(mean(probs) * 1000) / 1000,
      winRate: Math.round((wins / N_SIMS) * 1000) / 1000,
    });
  }
  categoricalAgg[nid] = {
    name: NODE_NAMES[nid] ?? nid,
    categoryDistribution: catDist,
    salience: statBlock(saliences),
  };
}

// TRB anchor
const anchorLabels = ["national", "ideological", "religious", "class", "ethnic_racial", "global", "mixed_none"];
const trbAnchorAgg = anchorLabels.map((label, i) => {
  const probs = allResults.map(r => r.trbAnchor[i]!);
  const wins = allResults.filter(r => {
    const d = r.trbAnchor;
    return d.indexOf(Math.max(...d)) === i;
  }).length;
  return {
    label,
    meanProb: Math.round(mean(probs) * 1000) / 1000,
    winRate: Math.round((wins / N_SIMS) * 1000) / 1000,
  };
});

// Quiz length stats
const qLens = allResults.map(r => r.questionsAsked);
const stopTypes: Record<string, number> = {};
for (const r of allResults) {
  stopTypes[r.stoppedBy] = (stopTypes[r.stoppedBy] ?? 0) + 1;
}

// Archetype winner distribution
const archWins: Record<string, number> = {};
for (const r of allResults) {
  archWins[r.winnerArchId] = (archWins[r.winnerArchId] ?? 0) + 1;
}
const topWinners = Object.entries(archWins)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 30)
  .map(([id, count]) => {
    const arch = ARCHETYPES.find(a => a.id === id);
    return { id, name: arch?.name ?? id, count, pct: Math.round((count / N_SIMS) * 1000) / 10 };
  });

const output = {
  meta: {
    simulations: N_SIMS,
    questionBankSize: QUESTION_BANK.length,
    archetypeCount: ARCHETYPES.length,
  },
  quizLength: {
    ...statBlock(qLens),
    stopTypes,
    histogram: makeHist(qLens, 16, 65, 1),
  },
  archetypeWinners: {
    uniqueWinners: Object.keys(archWins).length,
    top30: topWinners,
  },
  continuousNodes: continuousAgg,
  categoricalNodes: categoricalAgg,
  trbAnchor: trbAnchorAgg,
};

console.log(JSON.stringify(output, null, 2));
console.error(`\nDone. ${Object.keys(archWins).length} unique archetype winners out of ${ARCHETYPES.length}.`);
console.error(`Quiz length: mean=${mean(qLens).toFixed(1)}, median=${percentile(qLens, 0.5)}, p5=${percentile(qLens, 0.05)}, p95=${percentile(qLens, 0.95)}`);
console.error(`Stop types: ${JSON.stringify(stopTypes)}`);
