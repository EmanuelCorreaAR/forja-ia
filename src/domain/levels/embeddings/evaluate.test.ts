import { describe, expect, it } from 'vitest'
import {
  createInitialEmbeddingsState,
  evaluateEmbeddings,
  getTargetDocIds,
  getRankedScores,
  reduceEmbeddingsState,
} from '@/domain/levels/embeddings/evaluate'
import {
  cosineSimilarity,
  euclideanDistance,
  roundScore,
} from '@/domain/levels/embeddings/similarity'
import { EMBEDDING_TARGET_DOC_IDS, EMBEDDING_TOP_K } from '@/data/embeddings'

describe('Level 2 — Embeddings', () => {
  it('computes deterministic similarity', () => {
    const a = { x: 0.2, y: 0.8 }
    const b = { x: 0.25, y: 0.75 }
    expect(roundScore(cosineSimilarity(a, b), 4)).toBe(
      roundScore(cosineSimilarity(a, b), 4),
    )
    expect(euclideanDistance(a, a)).toBe(0)
  })

  it('keeps recipe docs as the top-K nearest neighbors', () => {
    const ranked = getRankedScores()
    const topIds = ranked.slice(0, EMBEDDING_TOP_K).map((s) => s.doc.id)
    expect(topIds).toEqual([...EMBEDDING_TARGET_DOC_IDS])
    expect(getTargetDocIds()).toEqual([...EMBEDDING_TARGET_DOC_IDS])
  })

  it('starts blind and only reveals after submit', () => {
    let state = createInitialEmbeddingsState()
    expect(state.phase).toBe('guess')
    state = reduceEmbeddingsState(state, { type: 'TOGGLE_DOC', docId: 'doc-a' })
    state = reduceEmbeddingsState(state, { type: 'TOGGLE_DOC', docId: 'doc-c' })
    state = reduceEmbeddingsState(state, { type: 'SUBMIT' })
    expect(state.phase).toBe('reveal')
    expect(state.completed).toBe(false)
    expect(evaluateEmbeddings(state).status).toBe('failed')
  })

  it('succeeds only with the exact top-K set', () => {
    let state = createInitialEmbeddingsState()
    for (const id of EMBEDDING_TARGET_DOC_IDS) {
      state = reduceEmbeddingsState(state, { type: 'TOGGLE_DOC', docId: id })
    }
    state = reduceEmbeddingsState(state, { type: 'SUBMIT' })
    expect(state.completed).toBe(true)
    expect(evaluateEmbeddings(state).status).toBe('success')
    expect(state.score).toBe(100)
  })

  it('caps selection at top-K', () => {
    let state = createInitialEmbeddingsState()
    state = reduceEmbeddingsState(state, { type: 'TOGGLE_DOC', docId: 'doc-a' })
    state = reduceEmbeddingsState(state, { type: 'TOGGLE_DOC', docId: 'doc-c' })
    state = reduceEmbeddingsState(state, { type: 'TOGGLE_DOC', docId: 'doc-f' })
    expect(state.selectedDocIds).toEqual(['doc-c', 'doc-f'])
  })
})
