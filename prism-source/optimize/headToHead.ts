#!/usr/bin/env node
/**
 * Head-to-head comparison: OLD config vs NEW (CMA-ES optimized) config.
 *
 * Simulates 1,240 respondents (10 per archetype) with noisy answer generation
 * to model realistic respondent variation. Tracks per-archetype and aggregate
 * results for both configurations.
 */
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { FULL_QUESTIONS } from "../config/questions.full.js";
import { createInitialState } from "../state/initialState.js";
import type { Archetype, QuestionDef, RespondentState, NodeId } from "../types.js";
import {
  applyAllocationAnswer, applyPairwiseAnswer, applyRankingAnswer,
  applySingleChoiceAnswer, applySliderAnswer,
} from "../engine/update.js";
import { recomputeArchetypePosterior, viableArchetypes, pruneArchetypes } from "../engine/archetypeDistance.js";
import { updateNodeStatuses } from "../engine/nodeStatus.js";
import { selectNextBatch } from "../engine/nextQuestion.js";
import { shouldStop, resetSimilarityCache } from "../engine/stopRule.js";
import { setConfig, getConfig, type EngineConfig } from "./runtimeConfig.js";

// ---------------------------------------------------------------------------
// Question bank (same as simulate.ts)
// ---------------------------------------------------------------------------
const REP_BY_ID = new Map(REPRESENTATIVE_QUESTIONS.map((q) => [q.id, q]));
const QUESTION_BANK: QuestionDef[] = FULL_QUESTIONS.map((fq) => {
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
const BANK_BY_ID = new Map(QUESTION_BANK.map((q) => [q.id, q]));

// ---------------------------------------------------------------------------
// Seeded PRNG (Mulberry32) — reproducible across runs
// ---------------------------------------------------------------------------
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Noisy answer generation
//
// Instead of always picking the argmax (optimal answer for the archetype),
// we use softmax sampling with temperature to model realistic respondent
// behavior. Temperature controls noise:
//   0.0 = deterministic (always pick best)
//   0.5 = moderate noise (occasionally pick 2nd best)
//   1.0 = high noise (frequently suboptimal)
// ---------------------------------------------------------------------------

type Ans = { t: string; v: any };

function scoreOpt(arch: Archetype, ev: any): number {
  let s = 0;
  if (ev?.continuous) for (const [nid, u] of Object.entries(ev.continuous)) {
    const t = arch.nodes[nid as NodeId]; if (!t || t.kind !== "continuous") continue;
    if ((u as any)?.pos) s += Math.log(Math.max(((u as any).pos as number[])[t.pos - 1] ?? 0.1, 0.01));
    if ((u as any)?.sal) s += Math.log(Math.max(((u as any).sal as number[])[t.sal] ?? 0.2, 0.01)) * 0.5;
  }
  if (ev?.categorical) for (const [nid, u] of Object.entries(ev.categorical)) {
    const t = arch.nodes[nid as NodeId]; if (!t || t.kind !== "categorical") continue;
    if ((u as any)?.cat) { let d = 0; for (let i = 0; i < 6; i++) d += (((u as any).cat as number[])[i] ?? 0) * (t.probs[i] ?? 0); s += Math.log(Math.max(d, 0.01)); }
    if ((u as any)?.sal) s += Math.log(Math.max(((u as any).sal as number[])[t.sal] ?? 0.2, 0.01)) * 0.5;
  }
  return s;
}

function scoreAlloc(arch: Archetype, map: any): number {
  let s = 0;
  if (map?.continuous) for (const [nid, sig] of Object.entries(map.continuous)) {
    const t = arch.nodes[nid as NodeId]; if (!t || t.kind !== "continuous") continue;
    s += (sig as number) * (t.pos - 3);
  }
  if (map?.categorical) for (const [nid, cd] of Object.entries(map.categorical)) {
    const t = arch.nodes[nid as NodeId]; if (!t || t.kind !== "categorical") continue;
    let d = 0; for (let i = 0; i < 6; i++) d += ((cd as number[])[i] ?? 0) * (t.probs[i] ?? 0);
    s += Math.log(Math.max(d, 0.01));
  }
  return s;
}

/** Softmax sample: pick an index with probability proportional to exp(score / temp) */
function softmaxSample(scores: number[], temp: number, rand: () => number): number {
  if (temp <= 0.001) {
    // Deterministic — pick argmax
    let best = 0;
    for (let i = 1; i < scores.length; i++) if (scores[i]! > scores[best]!) best = i;
    return best;
  }
  const maxS = Math.max(...scores);
  const exps = scores.map(s => Math.exp((s - maxS) / temp));
  const total = exps.reduce((a, b) => a + b, 0);
  const r = rand() * total;
  let cum = 0;
  for (let i = 0; i < exps.length; i++) {
    cum += exps[i]!;
    if (r <= cum) return i;
  }
  return exps.length - 1;
}

/** Generate a noisy answer for an archetype on a question */
function genNoisyAnswer(arch: Archetype, q: QuestionDef, noiseTemp: number, rand: () => number): Ans {
  switch (q.uiType) {
    case "single_choice": {
      if (!q.optionEvidence) return { t: "sc", v: "default" };
      const k = Object.keys(q.optionEvidence);
      const s = k.map(x => scoreOpt(arch, q.optionEvidence![x]));
      const idx = softmaxSample(s, noiseTemp, rand);
      return { t: "sc", v: k[idx]! };
    }
    case "slider": {
      if (!q.sliderMap) return { t: "sl", v: 50 };
      const b = Object.keys(q.sliderMap);
      const s = b.map(x => scoreOpt(arch, q.sliderMap![x]));
      const idx = softmaxSample(s, noiseTemp, rand);
      const p = b[idx]!.split("-").map(Number);
      // Add slider jitter within the bucket
      const lo = p[0] ?? 0;
      const hi = p[1] ?? 100;
      const jitter = lo + rand() * (hi - lo);
      return { t: "sl", v: Math.round(jitter) };
    }
    case "allocation": {
      if (!q.allocationMap) return { t: "al", v: {} };
      const k = Object.keys(q.allocationMap);
      const s = k.map(x => scoreAlloc(arch, q.allocationMap![x]));
      const mx = Math.max(...s);
      // Add noise to allocation weights
      const w = s.map(x => Math.exp((x - mx) / Math.max(0.3, 1 - noiseTemp * 0.5)) * (0.8 + rand() * 0.4));
      const tw = w.reduce((a, b) => a + b, 0);
      const raw = w.map(x => Math.max(1, Math.round((100 * x) / tw)));
      const rt = raw.reduce((a, b) => a + b, 0);
      const al: Record<string, number> = {};
      k.forEach((x, i) => { al[x] = Math.round((100 * raw[i]!) / rt); });
      return { t: "al", v: al };
    }
    case "ranking": {
      if (!q.rankingMap) return { t: "rk", v: [] };
      const k = Object.keys(q.rankingMap);
      const s = k.map(x => scoreAlloc(arch, q.rankingMap![x]));
      // Add noise and sort
      const ix = k.map((x, i) => ({ k: x, s: s[i]! + (rand() - 0.5) * noiseTemp * 2 }));
      ix.sort((a, b) => b.s - a.s);
      return { t: "rk", v: ix.map(x => x.k) };
    }
    case "multi": {
      if (!q.optionEvidence) return { t: "mu", v: ["default"] };
      const k = Object.keys(q.optionEvidence);
      const s = k.map(x => scoreOpt(arch, q.optionEvidence![x]));
      const ix = k.map((x, i) => ({ k: x, s: s[i]! + (rand() - 0.5) * noiseTemp * 2 }));
      ix.sort((a, b) => b.s - a.s);
      return { t: "mu", v: ix.slice(0, 2).map(x => x.k) };
    }
    case "best_worst": {
      const rm = q.rankingMap ?? q.bestWorstMap;
      if (!rm) return { t: "bw", v: [] };
      const k = Object.keys(rm);
      const s = k.map(x => scoreAlloc(arch, rm[x]));
      const ix = k.map((x, i) => ({ k: x, s: s[i]! + (rand() - 0.5) * noiseTemp * 2 }));
      ix.sort((a, b) => b.s - a.s);
      return { t: "bw", v: [ix[0]!.k, ix[ix.length - 1]!.k] };
    }
    case "pairwise": {
      if (!q.pairMaps) return { t: "pw", v: {} };
      const r: Record<string, string> = {};
      for (const [pid, opts] of Object.entries(q.pairMaps)) {
        const ok = Object.keys(opts);
        const s = ok.map(x => scoreAlloc(arch, opts[x]));
        const idx = softmaxSample(s, noiseTemp, rand);
        r[pid] = ok[idx]!;
      }
      return { t: "pw", v: r };
    }
    default: return { t: "sc", v: "default" };
  }
}

function applyAns(state: RespondentState, q: QuestionDef, a: Ans): void {
  switch (a.t) {
    case "sc": applySingleChoiceAnswer(state, q, a.v); break;
    case "sl": applySliderAnswer(state, q, a.v); break;
    case "al": applyAllocationAnswer(state, q, a.v); break;
    case "rk": applyRankingAnswer(state, q, a.v); break;
    case "pw": applyPairwiseAnswer(state, q, a.v); break;
    case "bw": applyRankingAnswer(state, q, a.v); break;
    case "mu": for (const v of a.v) applySingleChoiceAnswer(state, q, v); state.answers[q.id] = a.v; break;
  }
}

// ---------------------------------------------------------------------------
// Config definitions
// ---------------------------------------------------------------------------

const OLD_CONFIG: Partial<EngineConfig> = {
  // Original hand-tuned defaults
  TEMPERATURE: 1.6,
  SALIENCE_MISMATCH_LAMBDA: 0.98,
  ARCHETYPE_WEIGHT_BOOST: 1,
  CONFIRM_LAMBDA: 0,
  CONFIRM_RADIUS: 0.8,
  STOP_POSTERIOR_THRESHOLD: 0.3,
  STOP_MARGIN_THRESHOLD: 0.08,
  STOP_MIN_QUESTIONS: 25,
  STOP_MIN_CONSECUTIVE_LEADS: 5,
  STOP_AGREEMENT_K: 5,
  HC_POSTERIOR: 0.80,
  HC_MARGIN: 0.60,
  HC_CONSECUTIVE: 8,
  HC_COSINE_BLOCK: 0.94,
  SECONDARY_MIN_Q: 50,
  UC_POSTERIOR: 0.93,
  UC_MARGIN: 0.80,
  UC_CONSECUTIVE: 10,
  UC_MIN_Q: 30,
  LATE_GAME_MIN_Q: 55,
  LATE_GAME_POSTERIOR: 0.45,
  LATE_GAME_MARGIN: 0.20,
  LATE_GAME_CONSECUTIVE: 12,
  PRUNE_AFTER_QUESTIONS: 16,
  PRUNE_RATIO: 0.1,
  PRUNE_MIN_VIABLE: 8,
  BATCH_SIZE_MIN: 3,
  BATCH_SIZE_MAX: 4,
  BATCH_PRUNE_THRESHOLD: 0.02,
  BATCH_PRUNE_MIN_VIABLE: 15,
  EXPLOIT_BLEND_START: 20,
  EXPLOIT_BLEND_END: 32,
  DEVILS_ADVOCATE_WEIGHT: 0,
  NODE_OVERLAP_PENALTY: 0.3,
  BATCH_SEARCH_DEPTH: 10,
  SALIENCE_SURPRISE_LAMBDA: 0,
  SALIENCE_SURPRISE_THRESHOLD: 0.6,
  SURPRISE_ONSET: 62,
};

const NEW_CONFIG: Partial<EngineConfig> = {
  // CMA-ES optimized
  TEMPERATURE: 1.6,
  SALIENCE_MISMATCH_LAMBDA: 0.98,
  ARCHETYPE_WEIGHT_BOOST: 1,
  CONFIRM_LAMBDA: 0,
  CONFIRM_RADIUS: 0.8,
  STOP_POSTERIOR_THRESHOLD: 0.60,
  STOP_MARGIN_THRESHOLD: 0.093,
  STOP_MIN_QUESTIONS: 32,
  STOP_MIN_CONSECUTIVE_LEADS: 3,
  STOP_AGREEMENT_K: 3,
  HC_POSTERIOR: 0.64,
  HC_MARGIN: 0.30,
  HC_CONSECUTIVE: 5,
  HC_COSINE_BLOCK: 0.98,
  SECONDARY_MIN_Q: 50,
  UC_POSTERIOR: 0.87,
  UC_MARGIN: 0.95,
  UC_CONSECUTIVE: 5,
  UC_MIN_Q: 20,
  LATE_GAME_MIN_Q: 40,
  LATE_GAME_POSTERIOR: 0.20,
  LATE_GAME_MARGIN: 0.063,
  LATE_GAME_CONSECUTIVE: 20,
  PRUNE_AFTER_QUESTIONS: 10,
  PRUNE_RATIO: 0.067,
  PRUNE_MIN_VIABLE: 9,
  BATCH_SIZE_MIN: 4,
  BATCH_SIZE_MAX: 2,
  BATCH_PRUNE_THRESHOLD: 0.005,
  BATCH_PRUNE_MIN_VIABLE: 12,
  EXPLOIT_BLEND_START: 21,
  EXPLOIT_BLEND_END: 36,
  DEVILS_ADVOCATE_WEIGHT: 0,
  NODE_OVERLAP_PENALTY: 0,
  BATCH_SEARCH_DEPTH: 5,
  SALIENCE_SURPRISE_LAMBDA: 0,
  SALIENCE_SURPRISE_THRESHOLD: 0.6,
  SURPRISE_ONSET: 62,
};

// ---------------------------------------------------------------------------
// Single-run simulation
// ---------------------------------------------------------------------------

interface RunResult {
  archetypeId: string;
  archetypeName: string;
  trialIndex: number;
  correct: boolean;
  leaderId: string;
  leaderName: string;
  posterior: number;
  margin: number;
  questionsAsked: number;
  stoppedBy: string;
  /** Rank of the true archetype in final posterior (1 = top) */
  trueRank: number;
  /** Posterior of the true archetype */
  truePosterior: number;
}

function runOneTrial(
  trueArch: Archetype,
  trialIndex: number,
  noiseTemp: number,
  seed: number,
): RunResult {
  const rand = mulberry32(seed);
  const cfg = getConfig();

  // Pre-generate all noisy answers
  const answers = new Map<number, Ans>();
  for (const q of QUESTION_BANK) {
    answers.set(q.id, genNoisyAnswer(trueArch, q, noiseTemp, rand));
  }

  const FIXED = [1,2,3,4,8,11,15,18,20,21,23,31,38,39,40,47];

  // Phase 1: Fixed-16
  const state = createInitialState();
  for (const qid of FIXED) {
    const q = BANK_BY_ID.get(qid); if (!q) continue;
    applyAns(state, q, answers.get(q.id)!);
  }
  recomputeArchetypePosterior(state, ARCHETYPES);
  updateNodeStatuses(state, viableArchetypes(state, ARCHETYPES));

  // Phase 2: Batch-adaptive
  let questionsAsked = FIXED.length;
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
      const ans = answers.get(q.id);
      if (!ans) applySingleChoiceAnswer(state, q, "default");
      else applyAns(state, q, ans);
      questionsAsked++;
      recomputeArchetypePosterior(state, ARCHETYPES);
    }
    pruneArchetypes(state, ARCHETYPES);
    updateNodeStatuses(state, viableArchetypes(state, ARCHETYPES));
  }

  // Results
  const sorted = ARCHETYPES
    .map(a => ({ id: a.id, name: a.name, p: state.archetypePosterior[a.id] ?? 0 }))
    .sort((a, b) => b.p - a.p);

  const trueRank = sorted.findIndex(s => s.id === trueArch.id) + 1;
  const truePosterior = state.archetypePosterior[trueArch.id] ?? 0;

  return {
    archetypeId: trueArch.id,
    archetypeName: trueArch.name,
    trialIndex,
    correct: sorted[0]!.id === trueArch.id,
    leaderId: sorted[0]!.id,
    leaderName: sorted[0]!.name,
    posterior: sorted[0]!.p,
    margin: sorted[0]!.p - sorted[1]!.p,
    questionsAsked: Object.keys(state.answers).length,
    stoppedBy,
    trueRank,
    truePosterior,
  };
}

// ---------------------------------------------------------------------------
// Main comparison
// ---------------------------------------------------------------------------

const TRIALS_PER_ARCHETYPE = 10;
const NOISE_TEMPS = [0.0, 0.3, 0.5]; // deterministic, mild, moderate noise

console.log("=".repeat(80));
console.log("HEAD-TO-HEAD: OLD config vs NEW (CMA-ES optimized) config");
console.log(`${ARCHETYPES.length} archetypes × ${TRIALS_PER_ARCHETYPE} trials = ${ARCHETYPES.length * TRIALS_PER_ARCHETYPE} simulations per config per noise level`);
console.log(`Noise levels: ${NOISE_TEMPS.map(t => t === 0 ? "0.0 (deterministic)" : t.toString()).join(", ")}`);
console.log("=".repeat(80));

for (const noiseTemp of NOISE_TEMPS) {
  console.log(`\n${"#".repeat(80)}`);
  console.log(`# NOISE TEMPERATURE: ${noiseTemp}${noiseTemp === 0 ? " (deterministic — identical to optimizer simulation)" : noiseTemp === 0.3 ? " (mild — occasional suboptimal choices)" : " (moderate — frequent suboptimal choices)"}`);
  console.log(`${"#".repeat(80)}`);

  const oldResults: RunResult[] = [];
  const newResults: RunResult[] = [];

  for (const arch of ARCHETYPES) {
    for (let trial = 0; trial < TRIALS_PER_ARCHETYPE; trial++) {
      // Same seed for both configs so they get identical respondent answers
      const seed = parseInt(arch.id) * 1000 + trial * 7 + Math.round(noiseTemp * 100);

      // OLD config
      setConfig(OLD_CONFIG);
      resetSimilarityCache();
      oldResults.push(runOneTrial(arch, trial, noiseTemp, seed));

      // NEW config
      setConfig(NEW_CONFIG);
      resetSimilarityCache();
      newResults.push(runOneTrial(arch, trial, noiseTemp, seed));
    }
  }

  // ---------------------------------------------------------------------------
  // Aggregate stats
  // ---------------------------------------------------------------------------

  function aggregateStats(results: RunResult[]) {
    const correct = results.filter(r => r.correct).length;
    const qs = results.map(r => r.questionsAsked);
    const sortedQs = [...qs].sort((a, b) => a - b);
    const top3 = results.filter(r => r.trueRank <= 3).length;
    const top5 = results.filter(r => r.trueRank <= 5).length;
    return {
      total: results.length,
      correct,
      accuracy: correct / results.length,
      top3Accuracy: top3 / results.length,
      top5Accuracy: top5 / results.length,
      avgQ: qs.reduce((a, b) => a + b, 0) / qs.length,
      medianQ: sortedQs[Math.floor(sortedQs.length / 2)]!,
      p10Q: sortedQs[Math.floor(sortedQs.length * 0.10)]!,
      p90Q: sortedQs[Math.floor(sortedQs.length * 0.90)]!,
      avgPosterior: results.reduce((s, r) => s + r.posterior, 0) / results.length,
      avgMargin: results.reduce((s, r) => s + r.margin, 0) / results.length,
      avgTruePosterior: results.reduce((s, r) => s + r.truePosterior, 0) / results.length,
      avgTrueRank: results.reduce((s, r) => s + r.trueRank, 0) / results.length,
      exhausted: results.filter(r => r.stoppedBy === "exhausted").length,
      shouldStop: results.filter(r => r.stoppedBy === "shouldStop").length,
    };
  }

  const oldStats = aggregateStats(oldResults);
  const newStats = aggregateStats(newResults);

  const fmt = (n: number) => (n * 100).toFixed(2) + "%";
  const fmtN = (n: number) => n.toFixed(1);

  console.log(`\n  ${"METRIC".padEnd(30)} ${"OLD".padStart(12)} ${"NEW".padStart(12)} ${"DELTA".padStart(12)}`);
  console.log(`  ${"-".repeat(66)}`);
  console.log(`  ${"Top-1 Accuracy".padEnd(30)} ${fmt(oldStats.accuracy).padStart(12)} ${fmt(newStats.accuracy).padStart(12)} ${((newStats.accuracy - oldStats.accuracy) * 100).toFixed(2).padStart(11)}pp`);
  console.log(`  ${"Top-3 Accuracy".padEnd(30)} ${fmt(oldStats.top3Accuracy).padStart(12)} ${fmt(newStats.top3Accuracy).padStart(12)} ${((newStats.top3Accuracy - oldStats.top3Accuracy) * 100).toFixed(2).padStart(11)}pp`);
  console.log(`  ${"Top-5 Accuracy".padEnd(30)} ${fmt(oldStats.top5Accuracy).padStart(12)} ${fmt(newStats.top5Accuracy).padStart(12)} ${((newStats.top5Accuracy - oldStats.top5Accuracy) * 100).toFixed(2).padStart(11)}pp`);
  console.log(`  ${"Avg Questions".padEnd(30)} ${fmtN(oldStats.avgQ).padStart(12)} ${fmtN(newStats.avgQ).padStart(12)} ${fmtN(newStats.avgQ - oldStats.avgQ).padStart(12)}`);
  console.log(`  ${"Median Questions".padEnd(30)} ${String(oldStats.medianQ).padStart(12)} ${String(newStats.medianQ).padStart(12)} ${String(newStats.medianQ - oldStats.medianQ).padStart(12)}`);
  console.log(`  ${"P10 Questions".padEnd(30)} ${String(oldStats.p10Q).padStart(12)} ${String(newStats.p10Q).padStart(12)} ${String(newStats.p10Q - oldStats.p10Q).padStart(12)}`);
  console.log(`  ${"P90 Questions".padEnd(30)} ${String(oldStats.p90Q).padStart(12)} ${String(newStats.p90Q).padStart(12)} ${String(newStats.p90Q - oldStats.p90Q).padStart(12)}`);
  console.log(`  ${"Avg Leader Posterior".padEnd(30)} ${fmt(oldStats.avgPosterior).padStart(12)} ${fmt(newStats.avgPosterior).padStart(12)} ${((newStats.avgPosterior - oldStats.avgPosterior) * 100).toFixed(2).padStart(11)}pp`);
  console.log(`  ${"Avg Margin".padEnd(30)} ${fmt(oldStats.avgMargin).padStart(12)} ${fmt(newStats.avgMargin).padStart(12)} ${((newStats.avgMargin - oldStats.avgMargin) * 100).toFixed(2).padStart(11)}pp`);
  console.log(`  ${"Avg True-Arch Posterior".padEnd(30)} ${fmt(oldStats.avgTruePosterior).padStart(12)} ${fmt(newStats.avgTruePosterior).padStart(12)} ${((newStats.avgTruePosterior - oldStats.avgTruePosterior) * 100).toFixed(2).padStart(11)}pp`);
  console.log(`  ${"Avg True-Arch Rank".padEnd(30)} ${fmtN(oldStats.avgTrueRank).padStart(12)} ${fmtN(newStats.avgTrueRank).padStart(12)} ${fmtN(newStats.avgTrueRank - oldStats.avgTrueRank).padStart(12)}`);
  console.log(`  ${"Exhausted (all Q asked)".padEnd(30)} ${String(oldStats.exhausted).padStart(12)} ${String(newStats.exhausted).padStart(12)} ${String(newStats.exhausted - oldStats.exhausted).padStart(12)}`);
  console.log(`  ${"Stopped Early".padEnd(30)} ${String(oldStats.shouldStop).padStart(12)} ${String(newStats.shouldStop).padStart(12)} ${String(newStats.shouldStop - oldStats.shouldStop).padStart(12)}`);

  // ---------------------------------------------------------------------------
  // Per-archetype breakdown: find archetypes where results differ
  // ---------------------------------------------------------------------------

  console.log(`\n  PER-ARCHETYPE COMPARISON (showing disagreements and notable differences):`);
  console.log(`  ${"ARCHETYPE".padEnd(45)} ${"OLD".padStart(7)} ${"NEW".padStart(7)} ${"OLD-Q".padStart(7)} ${"NEW-Q".padStart(7)} ${"NOTES"}`);
  console.log(`  ${"-".repeat(90)}`);

  // Group by archetype
  const archMap = new Map<string, { old: RunResult[]; new_: RunResult[] }>();
  for (const r of oldResults) {
    if (!archMap.has(r.archetypeId)) archMap.set(r.archetypeId, { old: [], new_: [] });
    archMap.get(r.archetypeId)!.old.push(r);
  }
  for (const r of newResults) {
    archMap.get(r.archetypeId)!.new_.push(r);
  }

  let oldBetter = 0, newBetter = 0, tied = 0;
  let oldBetterArchetypes: string[] = [];
  let newBetterArchetypes: string[] = [];

  for (const [archId, data] of [...archMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const oldCorrect = data.old.filter(r => r.correct).length;
    const newCorrect = data.new_.filter(r => r.correct).length;
    const oldAvgQ = data.old.reduce((s, r) => s + r.questionsAsked, 0) / data.old.length;
    const newAvgQ = data.new_.reduce((s, r) => s + r.questionsAsked, 0) / data.new_.length;
    const name = data.old[0]!.archetypeName;

    const notes: string[] = [];
    if (oldCorrect > newCorrect) {
      notes.push(`OLD wins by ${oldCorrect - newCorrect}`);
      oldBetter++;
      oldBetterArchetypes.push(`${archId} ${name}`);
    } else if (newCorrect > oldCorrect) {
      notes.push(`NEW wins by ${newCorrect - oldCorrect}`);
      newBetter++;
      newBetterArchetypes.push(`${archId} ${name}`);
    } else {
      tied++;
    }

    // Show any row where correctness differs OR there's a notable Q difference
    if (oldCorrect !== newCorrect || Math.abs(oldAvgQ - newAvgQ) > 8) {
      console.log(`  ${(archId + " " + name).padEnd(45)} ${(oldCorrect + "/" + TRIALS_PER_ARCHETYPE).padStart(7)} ${(newCorrect + "/" + TRIALS_PER_ARCHETYPE).padStart(7)} ${oldAvgQ.toFixed(0).padStart(7)} ${newAvgQ.toFixed(0).padStart(7)} ${notes.join("; ")}`);
    }
  }

  // Show wrong trials detail for NEW config
  const newWrong = newResults.filter(r => !r.correct);
  if (newWrong.length > 0) {
    console.log(`\n  NEW CONFIG — WRONG CLASSIFICATIONS (${newWrong.length} total):`);
    console.log(`  ${"TRUE ARCHETYPE".padEnd(40)} ${"CLASSIFIED AS".padEnd(35)} ${"Q".padStart(3)} ${"POST".padStart(7)} ${"RANK".padStart(5)} ${"TRIAL".padStart(6)}`);
    for (const w of newWrong.sort((a, b) => a.archetypeId.localeCompare(b.archetypeId) || a.trialIndex - b.trialIndex)) {
      console.log(`  ${(w.archetypeId + " " + w.archetypeName).padEnd(40)} ${(w.leaderId + " " + w.leaderName).padEnd(35)} ${String(w.questionsAsked).padStart(3)} ${(w.posterior * 100).toFixed(1).padStart(6)}% ${String(w.trueRank).padStart(5)} ${String(w.trialIndex).padStart(6)}`);
    }
  }

  // Show wrong trials detail for OLD config
  const oldWrong = oldResults.filter(r => !r.correct);
  if (oldWrong.length > 0) {
    console.log(`\n  OLD CONFIG — WRONG CLASSIFICATIONS (${oldWrong.length} total):`);
    console.log(`  ${"TRUE ARCHETYPE".padEnd(40)} ${"CLASSIFIED AS".padEnd(35)} ${"Q".padStart(3)} ${"POST".padStart(7)} ${"RANK".padStart(5)} ${"TRIAL".padStart(6)}`);
    for (const w of oldWrong.sort((a, b) => a.archetypeId.localeCompare(b.archetypeId) || a.trialIndex - b.trialIndex)) {
      console.log(`  ${(w.archetypeId + " " + w.archetypeName).padEnd(40)} ${(w.leaderId + " " + w.leaderName).padEnd(35)} ${String(w.questionsAsked).padStart(3)} ${(w.posterior * 100).toFixed(1).padStart(6)}% ${String(w.trueRank).padStart(5)} ${String(w.trialIndex).padStart(6)}`);
    }
  }

  console.log(`\n  ARCHETYPE SCOREBOARD:`);
  console.log(`    OLD wins on ${oldBetter} archetypes, NEW wins on ${newBetter}, tied on ${tied}`);
  if (oldBetterArchetypes.length > 0) {
    console.log(`    OLD better: ${oldBetterArchetypes.join(", ")}`);
  }
  if (newBetterArchetypes.length > 0) {
    console.log(`    NEW better: ${newBetterArchetypes.join(", ")}`);
  }
}
