import { describe, expect, it } from 'vitest'
import {
  averageSelectedSimilarity,
  createInitialEmbeddingsState,
  evaluateEmbeddings,
  getTargetDocIds,
  getTrapDocId,
  getRankedScores,
  reduceEmbeddingsState,
} from '@/domain/levels/embeddings/evaluate'
import {
  cosineSimilarity,
  euclideanDistance,
  roundScore,
} from '@/domain/levels/embeddings/similarity'
import {
  EMBEDDING_TARGET_DOC_IDS,
  EMBEDDING_TOP_K,
  EMBEDDING_TRAP_DOC_ID,
} from '@/data/embeddings'

describe('Level 2 — Embeddings intruder', () => {
  it('computes deterministic similarity', () => {
    const a = { x: 0.2, y: 0.8 }
    const b = { x: 0.25, y: 0.75 }
    expect(roundScore(cosineSimilarity(a, b), 4)).toBe(
      roundScore(cosineSimilarity(a, b), 4),
    )
    expect(euclideanDistance(a, a)).toBe(0)
  })

  it('keeps breakfast docs as the top-K nearest neighbors', () => {
    const ranked = getRankedScores()
    const topIds = ranked.slice(0, EMBEDDING_TOP_K).map((s) => s.doc.id)
    expect(topIds.sort()).toEqual([...EMBEDDING_TARGET_DOC_IDS].sort())
    expect(getTargetDocIds().sort()).toEqual(
      [...EMBEDDING_TARGET_DOC_IDS].sort(),
    )
    expect(topIds).not.toContain(EMBEDDING_TRAP_DOC_ID)
  })

  it('flags the lexical trap separately', () => {
    expect(getTrapDocId()).toBe(EMBEDDING_TRAP_DOC_ID)
  })

  it('starts blind and only reveals after submit', () => {
    let state = createInitialEmbeddingsState()
    expect(state.phase).toBe('guess')
    state = reduceEmbeddingsState(state, { type: 'TOGGLE_DOC', docId: 'doc-a' })
    state = reduceEmbeddingsState(state, { type: 'TOGGLE_DOC', docId: 'doc-c' })
    state = reduceEmbeddingsState(state, { type: 'TOGGLE_DOC', docId: 'doc-g' })
    state = reduceEmbeddingsState(state, { type: 'SUBMIT' })
    expect(state.phase).toBe('reveal')
    expect(state.completed).toBe(false)
    expect(evaluateEmbeddings(state).titleKey).toContain('trap')
  })

  it('succeeds only with the exact top-K set', () => {
    let state = createInitialEmbeddingsState()
    for (const id of EMBEDDING_TARGET_DOC_IDS) {
      state = reduceEmbeddingsState(state, { type: 'TOGGLE_DOC', docId: id })
    }
    state = reduceEmbeddingsState(state, { type: 'SUBMIT' })
    expect(state.completed).toBe(true)
    expect(evaluateEmbeddings(state).status).toBe('success')
    expect(state.score).toBeGreaterThanOrEqual(40)
    expect(averageSelectedSimilarity(state.selectedDocIds)).toBeGreaterThan(0.9)
  })

  it('caps selection at top-K', () => {
    let state = createInitialEmbeddingsState()
    state = reduceEmbeddingsState(state, { type: 'TOGGLE_DOC', docId: 'doc-a' })
    state = reduceEmbeddingsState(state, { type: 'TOGGLE_DOC', docId: 'doc-c' })
    state = reduceEmbeddingsState(state, { type: 'TOGGLE_DOC', docId: 'doc-g' })
    state = reduceEmbeddingsState(state, { type: 'TOGGLE_DOC', docId: 'doc-e' })
    expect(state.selectedDocIds).toEqual(['doc-c', 'doc-g', 'doc-e'])
  })
})
