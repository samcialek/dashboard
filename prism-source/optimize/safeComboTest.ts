#!/usr/bin/env node
/**
 * Test all combinations of safe questions (Q69, Q71, Q72)
 * to find the best subset that doesn't hurt accuracy.
 */
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { FULL_QUESTIONS } from "../config/questions.full.js";
import { createInitialState } from "../state/initialState.js";
import type { Archetype, QuestionDef, NodeId } from "../types.js";
import {
  applyAllocationAnswer, applyPairwiseAnswer, applyRankingAnswer,
  applySingleChoiceAnswer, applySliderAnswer,
} from "../engine/update.js";
import { recomputeArchetypePosterior, viableArchetypes, pruneArchetypes } from "../engine/archetypeDistance.js";
import { updateNodeStatuses } from "../engine/nodeStatus.js";
import { selectNextBatch } from "../engine/nextQuestion.js";
import { shouldStop, resetSimilarityCache } from "../engine/stopRule.js";
import { resetConfig, getConfig } from "./runtimeConfig.js";

const REP_BY_ID = new Map(REPRESENTATIVE_QUESTIONS.map(q => [q.id, q]));
const ALL_Q: QuestionDef[] = FULL_QUESTIONS.map(fq => {
  const rq = REP_BY_ID.get(fq.id);
  if (!rq) return fq;
  return { ...fq,
    ...(rq.optionEvidence ? { optionEvidence: rq.optionEvidence } : {}),
    ...(rq.sliderMap ? { sliderMap: rq.sliderMap } : {}),
    ...(rq.allocationMap ? { allocationMap: rq.allocationMap } : {}),
    ...(rq.rankingMap ? { rankingMap: rq.rankingMap } : {}),
    ...(rq.pairMaps ? { pairMaps: rq.pairMaps } : {}),
    ...(rq.bestWorstMap ? { bestWorstMap: rq.bestWorstMap } : {}),
  };
});

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
    case "pairwise": { if (!q.pairMaps) return { t: "pw", v: {} }; const r: Record<string, string> = {}; for (const [pid, opts] of Object.entries(q.pairMaps)) { const ok = Object.keys(opts); const s = ok.map(x => scoreAlloc(arch, opts[x])); r[pid] = ok[s.indexOf(Math.max(...s))]!; } return { t: "pw", v: r }; }
    case "best_worst": { const rm = q.rankingMap ?? q.bestWorstMap; if (!rm) return { t: "bw", v: [] }; const k = Object.keys(rm); const s = k.map(x => scoreAlloc(arch, rm[x])); const ix = k.map((x, i) => ({ k: x, s: s[i]! })); ix.sort((a, b) => b.s - a.s); return { t: "bw", v: [ix[0]!.k, ix[ix.length - 1]!.k] }; }
    default: return { t: "sc", v: "default" };
  }
}

function applyAns(state: any, q: QuestionDef, a: Ans): void {
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

function runSim(bank: QuestionDef[]) {
  resetConfig(); resetSimilarityCache();
  const cfg = getConfig();
  const bankById = new Map(bank.map(q => [q.id, q]));
  const FIXED = [1,2,3,4,8,11,15,18,20,21,23,31,38,39,40,47];
  const wrong: { id: string; name: string; leader: string; leaderName: string }[] = [];
  const qs: number[] = [];

  for (const trueArch of ARCHETYPES) {
    const answers = new Map<number, Ans>();
    for (const q of bank) answers.set(q.id, genAnswer(trueArch, q));
    const state = createInitialState();
    for (const qid of FIXED) { const q = bankById.get(qid); if (!q) continue; applyAns(state, q, answers.get(q.id)!); }
    recomputeArchetypePosterior(state, ARCHETYPES);
    updateNodeStatuses(state, viableArchetypes(state, ARCHETYPES));
    let asked = FIXED.length;
    while (Object.keys(state.answers).length < bank.length) {
      if (asked >= cfg.STOP_MIN_QUESTIONS && shouldStop(state, ARCHETYPES)) break;
      const batch = selectNextBatch(state, bank, ARCHETYPES);
      if (batch.length === 0) break;
      for (const q of batch) {
        const ans = answers.get(q.id);
        if (!ans) applySingleChoiceAnswer(state, q, "default");
        else applyAns(state, q, ans);
        asked++;
        recomputeArchetypePosterior(state, ARCHETYPES);
      }
      pruneArchetypes(state, ARCHETYPES);
      updateNodeStatuses(state, viableArchetypes(state, ARCHETYPES));
    }
    const sorted = ARCHETYPES.map(a => ({ id: a.id, name: a.name, p: state.archetypePosterior[a.id] ?? 0 })).sort((a, b) => b.p - a.p);
    qs.push(Object.keys(state.answers).length);
    if (sorted[0]!.id !== trueArch.id) wrong.push({ id: trueArch.id, name: trueArch.name, leader: sorted[0]!.id, leaderName: sorted[0]!.name });
  }

  const sortedQs = [...qs].sort((a, b) => a - b);
  return { acc: (ARCHETYPES.length - wrong.length) / ARCHETYPES.length, wrong: wrong.length, avgQ: qs.reduce((a, b) => a + b, 0) / qs.length, medQ: sortedQs[Math.floor(sortedQs.length / 2)]!, wrongs: wrong };
}

// Test WITH_Q64 only (run first to avoid state leaks)
const withQ64 = ALL_Q.filter(q => q.id <= 64);
console.log("Bank size:", withQ64.length, "IDs:", withQ64.map(q=>q.id).join(","));
const r = runSim(withQ64);
console.log(`WITH_Q64        ${(r.acc * 100).toFixed(1)}% (${r.wrong} wrong), avgQ=${r.avgQ.toFixed(1)}, medQ=${r.medQ}`);
for (const w of r.wrongs) console.log(`  WRONG: ${w.id} ${w.name} → ${w.leader} ${w.leaderName}`);
