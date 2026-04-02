/**
 * Parameter space definition for CMA-ES optimization.
 * Defines bounds, encoding/decoding between normalized [0,1]^d and EngineConfig.
 */
import type { EngineConfig } from "./runtimeConfig.js";
import { getDefaults } from "./runtimeConfig.js";

export interface ParamDef {
  key: keyof EngineConfig;
  min: number;
  max: number;
  integer?: boolean;  // round to nearest integer after decoding
}

// Phase 1: Core distance parameters (most impact on accuracy)
export const PHASE1_PARAMS: ParamDef[] = [
  { key: "TEMPERATURE",              min: 0.5,  max: 4.0 },
  { key: "SALIENCE_MISMATCH_LAMBDA", min: 0.0,  max: 2.0 },
  { key: "ARCHETYPE_WEIGHT_BOOST",   min: 0.0,  max: 3.0 },
  { key: "CONFIRM_LAMBDA",           min: 0.0,  max: 1.0 },
  { key: "CONFIRM_RADIUS",           min: 0.3,  max: 1.5 },
];

// Phase 2: Stop rule parameters (affect efficiency without hurting accuracy)
export const PHASE2_PARAMS: ParamDef[] = [
  { key: "STOP_POSTERIOR_THRESHOLD",    min: 0.10, max: 0.60 },
  { key: "STOP_MARGIN_THRESHOLD",       min: 0.02, max: 0.20 },
  { key: "STOP_MIN_QUESTIONS",          min: 16,   max: 40, integer: true },
  { key: "STOP_MIN_CONSECUTIVE_LEADS",  min: 3,    max: 10, integer: true },
  { key: "STOP_AGREEMENT_K",            min: 3,    max: 10, integer: true },
  { key: "HC_POSTERIOR",                min: 0.60, max: 0.95 },
  { key: "HC_MARGIN",                   min: 0.30, max: 0.80 },
  { key: "HC_CONSECUTIVE",              min: 4,    max: 15, integer: true },
  { key: "HC_COSINE_BLOCK",             min: 0.88, max: 0.98 },
  { key: "SECONDARY_MIN_Q",             min: 30,   max: 63, integer: true },
  { key: "UC_POSTERIOR",                min: 0.80, max: 0.99 },
  { key: "UC_MARGIN",                   min: 0.50, max: 0.95 },
  { key: "UC_CONSECUTIVE",              min: 5,    max: 15, integer: true },
  { key: "UC_MIN_Q",                    min: 20,   max: 50, integer: true },
  { key: "LATE_GAME_MIN_Q",             min: 40,   max: 63, integer: true },
  { key: "LATE_GAME_POSTERIOR",          min: 0.20, max: 0.70 },
  { key: "LATE_GAME_MARGIN",            min: 0.05, max: 0.40 },
  { key: "LATE_GAME_CONSECUTIVE",        min: 6,    max: 20, integer: true },
];

// Phase 3: Question selection strategy
export const PHASE3_PARAMS: ParamDef[] = [
  { key: "EXPLOIT_BLEND_START",     min: 10,   max: 30, integer: true },
  { key: "EXPLOIT_BLEND_END",       min: 20,   max: 50, integer: true },
  { key: "DEVILS_ADVOCATE_WEIGHT",  min: 0.0,  max: 1.0 },
  { key: "NODE_OVERLAP_PENALTY",    min: 0.0,  max: 1.0 },
  { key: "BATCH_SEARCH_DEPTH",      min: 5,    max: 25, integer: true },
  { key: "BATCH_SIZE_MIN",          min: 1,    max: 5,  integer: true },
  { key: "BATCH_SIZE_MAX",          min: 2,    max: 8,  integer: true },
  { key: "BATCH_PRUNE_THRESHOLD",   min: 0.005, max: 0.10 },
  { key: "BATCH_PRUNE_MIN_VIABLE",  min: 5,    max: 30, integer: true },
];

// Phase 4: Pruning parameters
export const PHASE4_PARAMS: ParamDef[] = [
  { key: "PRUNE_AFTER_QUESTIONS", min: 10, max: 30, integer: true },
  { key: "PRUNE_RATIO",          min: 0.01, max: 0.30 },
  { key: "PRUNE_MIN_VIABLE",     min: 3, max: 20, integer: true },
];

// Phase 5: Salience surprise (currently disabled — explore if it helps)
export const PHASE5_PARAMS: ParamDef[] = [
  { key: "SALIENCE_SURPRISE_LAMBDA",    min: 0.0, max: 2.0 },
  { key: "SALIENCE_SURPRISE_THRESHOLD", min: 0.3, max: 1.0 },
  { key: "SURPRISE_ONSET",              min: 30,  max: 63, integer: true },
];

/** All phases combined for joint refinement */
export const ALL_PARAMS: ParamDef[] = [
  ...PHASE1_PARAMS, ...PHASE2_PARAMS, ...PHASE3_PARAMS, ...PHASE4_PARAMS, ...PHASE5_PARAMS,
];

/**
 * Encode EngineConfig values into normalized [0,1]^d vector.
 */
export function encode(config: Partial<EngineConfig>, params: ParamDef[]): number[] {
  const defaults = getDefaults();
  return params.map(p => {
    const val = config[p.key] ?? defaults[p.key];
    return (val - p.min) / (p.max - p.min);
  });
}

/**
 * Decode normalized [0,1]^d vector into EngineConfig overrides.
 */
export function decode(vec: number[], params: ParamDef[]): Partial<EngineConfig> {
  const overrides: Partial<EngineConfig> = {};
  for (let i = 0; i < params.length; i++) {
    const p = params[i]!;
    let val = p.min + Math.max(0, Math.min(1, vec[i] ?? 0.5)) * (p.max - p.min);
    if (p.integer) val = Math.round(val);
    // Clamp to bounds
    val = Math.max(p.min, Math.min(p.max, val));
    (overrides as any)[p.key] = val;
  }
  return overrides;
}

/**
 * Get the default vector in normalized space for a param set.
 */
export function defaultVector(params: ParamDef[]): number[] {
  return encode({}, params);
}
