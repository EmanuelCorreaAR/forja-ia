import { describe, expect, it } from 'vitest'
import {
  createInitialRagState,
  evaluateRag,
  reduceRagState,
} from '@/domain/levels/rag/evaluate'
import { runRagPipeline } from '@/domain/levels/rag/retrieve'

describe('Level 3 — RAG', () => {
  it('starts with a broken configuration that fails', () => {
    const initial = createInitialRagState()
    const result = runRagPipeline(initial.config)
    expect(result.success).toBe(false)
  })

  it('retrieves no chunks when threshold is too high', () => {
    const result = runRagPipeline({
      chunkSize: 100,
      topK: 3,
      threshold: 0.99,
    })
    expect(result.contextChunkIds).toHaveLength(0)
    expect(result.answerKind).toBe('empty')
  })

  it('misses relevant context with oversized noisy chunks', () => {
    const result = runRagPipeline({
      chunkSize: 400,
      topK: 3,
      threshold: 0.4,
    })
    expect(result.success).toBe(false)
  })

  it('solves RAG with a sensible configuration', () => {
    let state = createInitialRagState()
    state = reduceRagState(state, { type: 'SET_CHUNK_SIZE', chunkSize: 200 })
    state = reduceRagState(state, { type: 'SET_TOP_K', topK: 2 })
    state = reduceRagState(state, { type: 'SET_THRESHOLD', threshold: 0.5 })
    state = reduceRagState(state, { type: 'RUN' })
    expect(state.completed).toBe(true)
    expect(evaluateRag(state).status).toBe('success')
    expect(state.lastRun?.contextChunkIds.length).toBeGreaterThan(0)
  })

  it('is deterministic for identical configs', () => {
    const config = { chunkSize: 100 as const, topK: 2 as const, threshold: 0.5 }
    expect(runRagPipeline(config)).toEqual(runRagPipeline(config))
  })

  it('can succeed with chunk size 50 when enough relevant pieces are retrieved', () => {
    const result = runRagPipeline({
      chunkSize: 50,
      topK: 3,
      threshold: 0.45,
    })
    expect(result.success).toBe(true)
  })
})
