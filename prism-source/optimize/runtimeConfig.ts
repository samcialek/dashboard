/**
 * Mutable runtime configuration singleton.
 * The optimizer overrides these values per-run; engine modules
 * read them via getConfig() instead of importing constants.
 */

export interface EngineConfig {
  // Core distance
  TEMPERATURE: number;
  SALIENCE_MISMATCH_LAMBDA: number;
  ARCHETYPE_WEIGHT_BOOST: number;
  CONFIRM_LAMBDA: number;
  CONFIRM_RADIUS: number;

  // Stop rule
  STOP_POSTERIOR_THRESHOLD: number;
  STOP_MARGIN_THRESHOLD: number;
  STOP_MIN_QUESTIONS: number;
  STOP_MIN_CONSECUTIVE_LEADS: number;
  STOP_AGREEMENT_K: number;

  // Stop rule — hardcoded in stopRule.ts, now tunable
  HC_POSTERIOR: number;
  HC_MARGIN: number;
  HC_CONSECUTIVE: number;
  HC_COSINE_BLOCK: number;
  SECONDARY_MIN_Q: number;
  UC_POSTERIOR: number;
  UC_MARGIN: number;
  UC_CONSECUTIVE: number;
  UC_MIN_Q: number;
  LATE_GAME_MIN_Q: number;
  LATE_GAME_POSTERIOR: number;
  LATE_GAME_MARGIN: number;
  LATE_GAME_CONSECUTIVE: number;

  // Pruning
  PRUNE_AFTER_QUESTIONS: number;
  PRUNE_RATIO: number;
  PRUNE_MIN_VIABLE: number;

  // Batch-adaptive
  BATCH_SIZE_MIN: number;
  BATCH_SIZE_MAX: number;
  BATCH_PRUNE_THRESHOLD: number;
  BATCH_PRUNE_MIN_VIABLE: number;

  // Question selection
  EXPLOIT_BLEND_START: number;
  EXPLOIT_BLEND_END: number;
  DEVILS_ADVOCATE_WEIGHT: number;
  NODE_OVERLAP_PENALTY: number;
  BATCH_SEARCH_DEPTH: number;

  // Salience surprise (disabled by default)
  SALIENCE_SURPRISE_LAMBDA: number;
  SALIENCE_SURPRISE_THRESHOLD: number;
  SURPRISE_ONSET: number;
}

const DEFAULTS: EngineConfig = {
  // Core distance
  TEMPERATURE: 1.6,
  SALIENCE_MISMATCH_LAMBDA: 0.98,
  ARCHETYPE_WEIGHT_BOOST: 1,
  CONFIRM_LAMBDA: 0,
  CONFIRM_RADIUS: 0.8,

  // Stop rule (original hand-tuned — proven 124/124 accuracy)
  STOP_POSTERIOR_THRESHOLD: 0.3,
  STOP_MARGIN_THRESHOLD: 0.08,
  STOP_MIN_QUESTIONS: 25,
  STOP_MIN_CONSECUTIVE_LEADS: 5,
  STOP_AGREEMENT_K: 5,

  // Stop rule — fine constants (original hand-tuned)
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

  // Pruning (original hand-tuned)
  PRUNE_AFTER_QUESTIONS: 16,
  PRUNE_RATIO: 0.1,
  PRUNE_MIN_VIABLE: 8,

  // Batch-adaptive (original hand-tuned)
  BATCH_SIZE_MIN: 3,
  BATCH_SIZE_MAX: 4,
  BATCH_PRUNE_THRESHOLD: 0.02,
  BATCH_PRUNE_MIN_VIABLE: 15,

  // Question selection (original hand-tuned)
  EXPLOIT_BLEND_START: 20,
  EXPLOIT_BLEND_END: 32,
  DEVILS_ADVOCATE_WEIGHT: 0,
  NODE_OVERLAP_PENALTY: 0.3,
  BATCH_SEARCH_DEPTH: 10,

  // Salience surprise (disabled)
  SALIENCE_SURPRISE_LAMBDA: 0,
  SALIENCE_SURPRISE_THRESHOLD: 0.6,
  SURPRISE_ONSET: 62,
};

let _active: EngineConfig = { ...DEFAULTS };

export function setConfig(overrides: Partial<EngineConfig>): void {
  _active = { ...DEFAULTS, ...overrides };
}

export function resetConfig(): void {
  _active = { ...DEFAULTS };
}

export function getConfig(): Readonly<EngineConfig> {
  return _active;
}

export function getDefaults(): Readonly<EngineConfig> {
  return DEFAULTS;
}
