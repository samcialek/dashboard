#!/usr/bin/env node
/**
 * Question Expansion Diagnostic
 *
 * Tests each candidate new question (Q65-Q75) individually:
 * 1. Activates Q1-Q64 + one new Q at a time
 * 2. Runs full 124-archetype simulation
 * 3. Reports accuracy delta, which archetypes change, and why
 *
 * Then tests all combinations to find the optimal subset.
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
import { resetConfig, getConfig, type EngineConfig } from "./runtimeConfig.js";

// ---------------------------------------------------------------------------
// Question bank builder — includes ALL questions (Q1-Q75)
// ---------------------------------------------------------------------------
const REP_BY_ID = new Map(REPRESENTATIVE_QUESTIONS.map((q) => [q.id, q]));
const ALL_QUESTIONS: QuestionDef[] = FULL_QUESTIONS.map((fq) => {
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

// Candidate new questions (Q65-Q75) — loaded from representative.ts
// Since they're currently commented out, we define them inline from the representative data
const CANDIDATE_QS = REPRESENTATIVE_QUESTIONS.filter(q => q.id >= 65 && q.id <= 75);
const FULL_CANDIDATES = FULL_QUESTIONS.filter(q => q.id >= 65 && q.id <= 75);

// Merge: for candidates, use representative evidence on top of full structure
function buildCandidateQ(qid: number): QuestionDef | null {
  const rep = CANDIDATE_QS.find(q => q.id === qid);
  const full = FULL_CANDIDATES.find(q => q.id === qid);
  if (!rep && !full) return null;
  const base = full ?? rep;
  if (!base) return null;
  return { ...base,
    ...(rep?.optionEvidence !== undefined ? { optionEvidence: rep.optionEvidence } : {}),
    ...(rep?.sliderMap !== undefined ? { sliderMap: rep.sliderMap } : {}),
    ...(rep?.allocationMap !== undefined ? { allocationMap: rep.allocationMap } : {}),
    ...(rep?.rankingMap !== undefined ? { rankingMap: rep.rankingMap } : {}),
    ...(rep?.pairMaps !== undefined ? { pairMaps: rep.pairMaps } : {}),
    ...(rep?.bestWorstMap !== undefined ? { bestWorstMap: rep.bestWorstMap } : {}),
  };
}

// Base question bank (Q1-Q64 only)
const BASE_BANK = ALL_QUESTIONS.filter(q => q.id <= 64);
const BASE_BY_ID = new Map(BASE_BANK.map(q => [q.id, q]));

// ---------------------------------------------------------------------------
// Answer generation (deterministic argmax)
// ---------------------------------------------------------------------------
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

type Ans = { t: string; v: any };

function genAnswer(arch: Archetype, q: QuestionDef): Ans {
  switch (q.uiType) {
    case "single_choice": { if (!q.optionEvidence) return { t: "sc", v: "default" }; const k = Object.keys(q.optionEvidence); const s = k.map(x => scoreOpt(arch, q.optionEvidence![x])); let bi = 0; for (let i = 1; i < s.length; i++) if (s[i]! > s[bi]!) bi = i; return { t: "sc", v: k[bi]! }; }
    case "slider": { if (!q.sliderMap) return { t: "sl", v: 50 }; const b = Object.keys(q.sliderMap); const s = b.map(x => scoreOpt(arch, q.sliderMap![x])); let bi = 0; for (let i = 1; i < s.length; i++) if (s[i]! > s[bi]!) bi = i; const p = b[bi]!.split("-").map(Number); return { t: "sl", v: Math.round(((p[0] ?? 0) + (p[1] ?? 100)) / 2) }; }
    case "allocation": { if (!q.allocationMap) return { t: "al", v: {} }; const k = Object.keys(q.allocationMap); const s = k.map(x => scoreAlloc(arch, q.allocationMap![x])); const mx = Math.max(...s); const w = s.map(x => Math.exp((x - mx) / 1)); const tw = w.reduce((a, b) => a + b, 0); const raw = w.map(x => Math.max(1, Math.round((100 * x) / tw))); const rt = raw.reduce((a, b) => a + b, 0); const al: Record<string, number> = {}; k.forEach((x, i) => { al[x] = Math.round((100 * raw[i]!) / rt); }); return { t: "al", v: al }; }
    case "ranking": { if (!q.rankingMap) return { t: "rk", v: [] }; const k = Object.keys(q.rankingMap); const s = k.map(x => scoreAlloc(arch, q.rankingMap![x])); const ix = k.map((x, i) => ({ k: x, s: s[i]! })); ix.sort((a, b) => b.s - a.s); return { t: "rk", v: ix.map(x => x.k) }; }
    case "multi": { if (!q.optionEvidence) return { t: "mu", v: ["default"] }; const k = Object.keys(q.optionEvidence); const s = k.map(x => scoreOpt(arch, q.optionEvidence![x])); const ix = k.map((x, i) => ({ k: x, s: s[i]! })); ix.sort((a, b) => b.s - a.s); return { t: "mu", v: ix.slice(0, 2).map(x => x.k) }; }
    case "best_worst": { const rm = q.rankingMap ?? q.bestWorstMap; if (!rm) return { t: "bw", v: [] }; const k = Object.keys(rm); const s = k.map(x => scoreAlloc(arch, rm[x])); const ix = k.map((x, i) => ({ k: x, s: s[i]! })); ix.sort((a, b) => b.s - a.s); return { t: "bw", v: [ix[0]!.k, ix[ix.length - 1]!.k] }; }
    case "pairwise": { if (!q.pairMaps) return { t: "pw", v: {} }; const r: Record<string, string> = {}; for (const [pid, opts] of Object.entries(q.pairMaps)) { const ok = Object.keys(opts); const s = ok.map(x => scoreAlloc(arch, opts[x])); r[pid] = ok[s.indexOf(Math.max(...s))]!; } return { t: "pw", v: r }; }
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
// Simulation with configurable question bank
// ---------------------------------------------------------------------------
interface SimResult {
  accuracy: number;
  wrongCount: number;
  avgQ: number;
  medianQ: number;
  wrong: { id: string; name: string; leader: string; leaderName: string; q: number }[];
  correct: Set<string>;
}

function runSim(questionBank: QuestionDef[]): SimResult {
  resetConfig();
  resetSimilarityCache();
  const cfg = getConfig();
  const bankById = new Map(questionBank.map(q => [q.id, q]));
  const FIXED = [1,2,3,4,8,11,15,18,20,21,23,31,38,39,40,47];

  const wrong: SimResult["wrong"] = [];
  const correctSet = new Set<string>();
  const qs: number[] = [];

  for (const trueArch of ARCHETYPES) {
    const answers = new Map<number, Ans>();
    for (const q of questionBank) answers.set(q.id, genAnswer(trueArch, q));

    const state = createInitialState();
    for (const qid of FIXED) {
      const q = bankById.get(qid); if (!q) continue;
      applyAns(state, q, answers.get(q.id)!);
    }
    recomputeArchetypePosterior(state, ARCHETYPES);
    updateNodeStatuses(state, viableArchetypes(state, ARCHETYPES));

    let questionsAsked = FIXED.length;
    const maxQ = questionBank.length;

    while (Object.keys(state.answers).length < maxQ) {
      if (questionsAsked >= cfg.STOP_MIN_QUESTIONS && shouldStop(state, ARCHETYPES)) break;
      const batch = selectNextBatch(state, questionBank, ARCHETYPES);
      if (batch.length === 0) break;
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

    const sorted = ARCHETYPES.map(a => ({ id: a.id, name: a.name, p: state.archetypePosterior[a.id] ?? 0 })).sort((a, b) => b.p - a.p);
    const totalQ = Object.keys(state.answers).length;
    qs.push(totalQ);

    if (sorted[0]!.id === trueArch.id) {
      correctSet.add(trueArch.id);
    } else {
      wrong.push({ id: trueArch.id, name: trueArch.name, leader: sorted[0]!.id, leaderName: sorted[0]!.name, q: totalQ });
    }
  }

  const sortedQs = [...qs].sort((a, b) => a - b);
  return {
    accuracy: (ARCHETYPES.length - wrong.length) / ARCHETYPES.length,
    wrongCount: wrong.length,
    avgQ: qs.reduce((a, b) => a + b, 0) / qs.length,
    medianQ: sortedQs[Math.floor(sortedQs.length / 2)]!,
    wrong,
    correct: correctSet,
  };
}

// ---------------------------------------------------------------------------
// Main diagnostic
// ---------------------------------------------------------------------------

console.log("=".repeat(80));
console.log("QUESTION EXPANSION DIAGNOSTIC");
console.log(`Available candidates: ${CANDIDATE_QS.map(q => `Q${q.id}`).join(", ") || "NONE (Q65-Q75 are commented out)"}`);
console.log(`Full candidates found: ${FULL_CANDIDATES.map(q => `Q${q.id}`).join(", ") || "NONE"}`);
console.log("=".repeat(80));

// Step 1: Baseline (Q1-Q64)
console.log("\n### BASELINE (Q1-Q64)");
const baseline = runSim(BASE_BANK);
console.log(`  Accuracy: ${(baseline.accuracy * 100).toFixed(1)}% (${baseline.wrongCount} wrong)`);
console.log(`  Avg Q: ${baseline.avgQ.toFixed(1)}, Median Q: ${baseline.medianQ}`);
if (baseline.wrong.length > 0) {
  for (const w of baseline.wrong) {
    console.log(`    WRONG: ${w.id} ${w.name} → ${w.leader} ${w.leaderName} (Q=${w.q})`);
  }
}

// Step 2: Test each candidate individually
console.log("\n### INDIVIDUAL QUESTION TESTS (Q1-Q64 + one new Q)");

const candidateIds = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75];
const qResults: Map<number, { result: SimResult; helped: string[]; hurt: string[]; q: QuestionDef | null }> = new Map();

for (const qid of candidateIds) {
  const candidateQ = buildCandidateQ(qid);
  if (!candidateQ) {
    console.log(`\n  Q${qid}: NOT FOUND (commented out in both files)`);
    qResults.set(qid, { result: baseline, helped: [], hurt: [], q: null });
    continue;
  }

  // Check if the question has evidence maps
  const hasEvidence = !!(candidateQ.optionEvidence || candidateQ.sliderMap || candidateQ.allocationMap || candidateQ.rankingMap || candidateQ.pairMaps || candidateQ.bestWorstMap);

  const bank = [...BASE_BANK, candidateQ];
  const result = runSim(bank);

  // Find which archetypes changed
  const helped: string[] = [];
  const hurt: string[] = [];

  for (const w of baseline.wrong) {
    if (result.correct.has(w.id)) helped.push(`${w.id} ${w.name}`);
  }
  for (const w of result.wrong) {
    if (baseline.correct.has(w.id)) hurt.push(`${w.id} ${w.name}`);
  }

  qResults.set(qid, { result, helped, hurt, q: candidateQ });

  const delta = result.wrongCount - baseline.wrongCount;
  const symbol = delta < 0 ? "✓ IMPROVED" : delta > 0 ? "✗ WORSE" : "= SAME";

  console.log(`\n  Q${qid} (${candidateQ.promptShort}, ${candidateQ.uiType}, evidence=${hasEvidence}): ${symbol}`);
  console.log(`    Accuracy: ${(result.accuracy * 100).toFixed(1)}% (${result.wrongCount} wrong, delta=${delta > 0 ? "+" : ""}${delta})`);
  console.log(`    Avg Q: ${result.avgQ.toFixed(1)} (delta=${(result.avgQ - baseline.avgQ).toFixed(1)}), Median Q: ${result.medianQ}`);

  if (helped.length > 0) console.log(`    FIXED: ${helped.join(", ")}`);
  if (hurt.length > 0) console.log(`    BROKE: ${hurt.join(", ")}`);

  if (result.wrong.length > 0) {
    for (const w of result.wrong) {
      const wasWrong = baseline.wrong.some(bw => bw.id === w.id);
      console.log(`    ${wasWrong ? "  " : "NEW"} WRONG: ${w.id} ${w.name} → ${w.leader} ${w.leaderName} (Q=${w.q})`);
    }
  }
}

// Step 3: Find safe questions (those that don't hurt any archetype)
console.log("\n### SAFE QUESTIONS (help or neutral, never hurt)");
const safeQs: number[] = [];
const helpfulQs: number[] = [];

for (const [qid, data] of qResults) {
  if (!data.q) continue;
  if (data.hurt.length === 0) {
    safeQs.push(qid);
    if (data.helped.length > 0) helpfulQs.push(qid);
    console.log(`  Q${qid}: SAFE${data.helped.length > 0 ? ` (fixes: ${data.helped.join(", ")})` : " (neutral)"}`);
  }
}

// Step 4: Test all safe questions together
if (safeQs.length > 0) {
  console.log(`\n### COMBINED SAFE QUESTIONS: Q${safeQs.join("+Q")}`);
  const safeBank = [...BASE_BANK];
  for (const qid of safeQs) {
    const q = buildCandidateQ(qid);
    if (q) safeBank.push(q);
  }
  const combinedResult = runSim(safeBank);
  console.log(`  Accuracy: ${(combinedResult.accuracy * 100).toFixed(1)}% (${combinedResult.wrongCount} wrong)`);
  console.log(`  Avg Q: ${combinedResult.avgQ.toFixed(1)}, Median Q: ${combinedResult.medianQ}`);

  const combinedHelped: string[] = [];
  const combinedHurt: string[] = [];
  for (const w of baseline.wrong) {
    if (combinedResult.correct.has(w.id)) combinedHelped.push(`${w.id} ${w.name}`);
  }
  for (const w of combinedResult.wrong) {
    if (baseline.correct.has(w.id)) combinedHurt.push(`${w.id} ${w.name}`);
  }

  if (combinedHelped.length > 0) console.log(`  FIXED: ${combinedHelped.join(", ")}`);
  if (combinedHurt.length > 0) console.log(`  BROKE: ${combinedHurt.join(", ")}`);
  if (combinedResult.wrong.length > 0) {
    for (const w of combinedResult.wrong) {
      console.log(`    WRONG: ${w.id} ${w.name} → ${w.leader} ${w.leaderName} (Q=${w.q})`);
    }
  }
}

// Step 5: Test ALL candidates together for reference
console.log(`\n### ALL CANDIDATES (Q65-Q75) — reference`);
const allBank = [...BASE_BANK];
for (const qid of candidateIds) {
  const q = buildCandidateQ(qid);
  if (q) allBank.push(q);
}
const allResult = runSim(allBank);
console.log(`  Accuracy: ${(allResult.accuracy * 100).toFixed(1)}% (${allResult.wrongCount} wrong)`);
console.log(`  Avg Q: ${allResult.avgQ.toFixed(1)}, Median Q: ${allResult.medianQ}`);
if (allResult.wrong.length > 0) {
  for (const w of allResult.wrong) {
    const wasWrong = baseline.wrong.some(bw => bw.id === w.id);
    console.log(`    ${wasWrong ? "  " : "NEW"} WRONG: ${w.id} ${w.name} → ${w.leader} ${w.leaderName} (Q=${w.q})`);
  }
}

console.log(`\n${"=".repeat(80)}`);
console.log("SUMMARY");
console.log(`  Baseline (Q1-Q64): ${(baseline.accuracy * 100).toFixed(1)}% accuracy, ${baseline.avgQ.toFixed(1)} avg Q`);
if (safeQs.length > 0) {
  console.log(`  Safe additions: Q${safeQs.join(", Q")}`);
  console.log(`  Helpful additions: Q${helpfulQs.length > 0 ? helpfulQs.join(", Q") : "none"}`);
}
console.log(`  All Q65-Q75: ${(allResult.accuracy * 100).toFixed(1)}% accuracy, ${allResult.avgQ.toFixed(1)} avg Q`);
console.log("=".repeat(80));
