/**
 * CMA-ES (Covariance Matrix Adaptation Evolution Strategy) optimizer.
 *
 * Lightweight implementation for ~5-50 dimensional parameter spaces.
 * References: Hansen & Ostermeier (2001), "Completely Derandomized
 * Self-Adaptation in Evolution Strategies."
 */

export interface CMAESOptions {
  /** Dimension of search space */
  dim: number;
  /** Initial mean (center of search) */
  x0: number[];
  /** Initial step size (sigma) */
  sigma0: number;
  /** Population size (default: 4 + floor(3 * ln(dim))) */
  popSize?: number;
  /** Maximum generations */
  maxGenerations: number;
  /** Fitness target — stop if reached */
  fitnessTarget?: number;
  /** Callback per generation */
  onGeneration?: (gen: number, bestFitness: number, meanFitness: number, sigma: number) => void;
}

export interface CMAESResult {
  bestX: number[];
  bestFitness: number;
  generations: number;
  evaluations: number;
  converged: boolean;
}

/**
 * Run CMA-ES minimization.
 *
 * @param objectiveFn  Function that takes a candidate vector and returns a scalar fitness (lower = better)
 * @param opts         CMA-ES configuration
 */
export function cmaes(
  objectiveFn: (x: number[]) => number,
  opts: CMAESOptions
): CMAESResult {
  const { dim, sigma0, maxGenerations, fitnessTarget } = opts;
  const lambda = opts.popSize ?? 4 + Math.floor(3 * Math.log(dim));
  const mu = Math.floor(lambda / 2);

  // Weights for recombination (log-linear)
  const rawWeights = Array.from({ length: mu }, (_, i) => Math.log(mu + 0.5) - Math.log(i + 1));
  const wSum = rawWeights.reduce((a, b) => a + b, 0);
  const weights = rawWeights.map(w => w / wSum);
  const muEff = 1 / weights.reduce((a, w) => a + w * w, 0);

  // Adaptation parameters
  const cc = (4 + muEff / dim) / (dim + 4 + 2 * muEff / dim);
  const cs = (muEff + 2) / (dim + muEff + 5);
  const c1 = 2 / ((dim + 1.3) ** 2 + muEff);
  const cmu = Math.min(1 - c1, 2 * (muEff - 2 + 1 / muEff) / ((dim + 2) ** 2 + muEff));
  const damps = 1 + 2 * Math.max(0, Math.sqrt((muEff - 1) / (dim + 1)) - 1) + cs;
  const chiN = Math.sqrt(dim) * (1 - 1 / (4 * dim) + 1 / (21 * dim * dim));

  // State
  let mean = [...opts.x0];
  let sigma = sigma0;
  let pc = new Array(dim).fill(0);    // evolution path for C
  let ps = new Array(dim).fill(0);    // evolution path for sigma
  // Covariance matrix as diagonal (simplified — full CMA-ES uses dense matrix)
  // For speed, we use a separable variant (sep-CMA-ES) which is O(d) per generation
  let diagC = new Array(dim).fill(1);

  let bestX = [...mean];
  let bestFitness = Infinity;
  let evaluations = 0;
  let converged = false;

  for (let gen = 0; gen < maxGenerations; gen++) {
    // Sample population
    const population: { x: number[]; fitness: number }[] = [];

    for (let k = 0; k < lambda; k++) {
      const z = new Array(dim);
      const x = new Array(dim);
      for (let i = 0; i < dim; i++) {
        z[i] = randn();
        x[i] = mean[i]! + sigma * Math.sqrt(diagC[i]!) * z[i];
      }
      const fitness = objectiveFn(x as number[]);
      evaluations++;
      population.push({ x: x as number[], fitness });
    }

    // Sort by fitness (ascending = best first)
    population.sort((a, b) => a.fitness - b.fitness);

    // Track best
    if (population[0]!.fitness < bestFitness) {
      bestFitness = population[0]!.fitness;
      bestX = [...population[0]!.x];
    }

    // Check termination
    if (fitnessTarget !== undefined && bestFitness <= fitnessTarget) {
      converged = true;
      opts.onGeneration?.(gen, bestFitness, population.reduce((s, p) => s + p.fitness, 0) / lambda, sigma);
      break;
    }

    // Weighted recombination
    const oldMean = [...mean];
    for (let i = 0; i < dim; i++) {
      mean[i] = 0;
      for (let k = 0; k < mu; k++) {
        mean[i]! += weights[k]! * population[k]!.x[i]!;
      }
    }

    // Update evolution paths
    for (let i = 0; i < dim; i++) {
      const diff = (mean[i]! - oldMean[i]!) / (sigma * Math.sqrt(diagC[i]!));
      ps[i] = (1 - cs) * ps[i]! + Math.sqrt(cs * (2 - cs) * muEff) * diff;
      pc[i] = (1 - cc) * pc[i]! + Math.sqrt(cc * (2 - cc) * muEff) * (mean[i]! - oldMean[i]!) / sigma;
    }

    // Update diagonal covariance (sep-CMA-ES)
    for (let i = 0; i < dim; i++) {
      let rankMuUpdate = 0;
      for (let k = 0; k < mu; k++) {
        const diff = (population[k]!.x[i]! - oldMean[i]!) / (sigma * Math.sqrt(diagC[i]!));
        rankMuUpdate += weights[k]! * diff * diff;
      }
      diagC[i] = (1 - c1 - cmu) * diagC[i]! + c1 * pc[i]! * pc[i]! + cmu * rankMuUpdate;
      // Prevent degeneration
      diagC[i] = Math.max(1e-20, Math.min(1e10, diagC[i]!));
    }

    // Update sigma (step-size control)
    const psNorm = Math.sqrt(ps.reduce((s, v) => s + v! * v!, 0));
    sigma *= Math.exp((cs / damps) * (psNorm / chiN - 1));
    sigma = Math.max(1e-20, Math.min(10, sigma));

    const meanFitness = population.reduce((s, p) => s + p.fitness, 0) / lambda;
    opts.onGeneration?.(gen, bestFitness, meanFitness, sigma);

    // Convergence check: sigma too small
    if (sigma < 1e-12) {
      converged = true;
      break;
    }
  }

  return { bestX, bestFitness, generations: evaluations / lambda, evaluations, converged };
}

/** Box-Muller normal random */
function randn(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
