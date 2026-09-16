import { describe, expect, it } from 'vitest'
import {
  createInitialEmbeddingsState,
  evaluateEmbeddings,
  getDocumentScores,
  reduceEmbeddingsState,
} from '@/domain/levels/embeddings/evaluate'
import {
  cosineSimilarity,
  euclideanDistance,
  roundScore,
} from '@/domain/levels/embeddings/similarity'
import { EMBEDDING_TARGET_DOC_IDS } from '@/data/embeddings'

describe('Level 2 — Embeddings similarity', () => {
  it('computes deterministic cosine similarity', () => {
    const a = { x: 0.2, y: 0.8 }
    const b = { x: 0.25, y: 0.75 }
    expect(roundScore(cosineSimilarity(a, b), 4)).toBe(
      roundScore(cosineSimilarity(a, b), 4),
    )
    expect(euclideanDistance(a, a)).toBe(0)
  })

  it('ranks cake documents closest to the query', () => {
    const ranked = getDocumentScores()
    expect(ranked[0]?.doc.cluster).toBe('cake')
    expect(ranked[1]?.doc.cluster).toBe('cake')
  })

  it('fails when wrong documents are selected', () => {
    let state = createInitialEmbeddingsState()
    state = reduceEmbeddingsState(state, {
      type: 'TOGGLE_DOC',
      docId: 'doc-bike-1',
    })
    state = reduceEmbeddingsState(state, { type: 'SUBMIT' })
    expect(evaluateEmbeddings(state).status).toBe('failed')
  })

  it('succeeds when both target docs are selected', () => {
    let state = createInitialEmbeddingsState()
    for (const id of EMBEDDING_TARGET_DOC_IDS) {
      state = reduceEmbeddingsState(state, { type: 'TOGGLE_DOC', docId: id })
    }
    state = reduceEmbeddingsState(state, { type: 'SUBMIT' })
    expect(state.completed).toBe(true)
    expect(evaluateEmbeddings(state).status).toBe('success')
  })
})
