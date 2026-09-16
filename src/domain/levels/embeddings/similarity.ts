import type { Vec2 } from './types'

/** Cosine similarity in 2D — deterministic, no randomness */
export function cosineSimilarity(a: Vec2, b: Vec2): number {
  const dot = a.x * b.x + a.y * b.y
  const magA = Math.hypot(a.x, a.y)
  const magB = Math.hypot(b.x, b.y)
  if (magA === 0 || magB === 0) return 0
  return dot / (magA * magB)
}

/** Euclidean distance — lower is closer */
export function euclideanDistance(a: Vec2, b: Vec2): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function similarityFromDistance(distance: number): number {
  return 1 / (1 + distance)
}

export function roundScore(value: number, digits = 2): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}
