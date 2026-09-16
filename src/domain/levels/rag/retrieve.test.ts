import { describe, expect, it } from 'vitest'
import { RAG_NIGHTMARE_CONFIG } from '@/data/rag'
import {
  createInitialRagState,
  evaluateRag,
  reduceRagState,
} from '@/domain/levels/rag/evaluate'
import { runRagPipeline } from '@/domain/levels/rag/retrieve'

describe('Level 3 — RAG ACME', () => {
  it('starts already showing a failed run from the broken config', () => {
    const initial = createInitialRagState()
    expect(initial.lastRun?.success).toBe(false)
    expect(initial.mode).toBe('repair')
    expect(evaluateRag(initial).status).toBe('failed')
  })

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

  it('flags promo-only context as a trap', () => {
    const result = runRagPipeline({
      chunkSize: 50,
      topK: 1,
      threshold: 0.8,
    })
    expect(result.success).toBe(false)
    expect(result.answerKey).toContain('promoTrap')
  })

  it('solves RAG with a sensible configuration', () => {
    let state = createInitialRagState()
    state = reduceRagState(state, { type: 'SET_CHUNK_SIZE', chunkSize: 200 })
    state = reduceRagState(state, { type: 'SET_TOP_K', topK: 2 })
    state = reduceRagState(state, { type: 'SET_THRESHOLD', threshold: 0.5 })
    state = reduceRagState(state, { type: 'RUN' })
    expect(state.completed).toBe(true)
    expect(state.repairCompleted).toBe(true)
    expect(evaluateRag(state).status).toBe('success')
    expect(state.lastRun?.contextChunkIds.length).toBeGreaterThan(0)
  })

  it('enters nightmare after repair with a harder broken config', () => {
    let state = createInitialRagState()
    state = reduceRagState(state, { type: 'SET_CHUNK_SIZE', chunkSize: 200 })
    state = reduceRagState(state, { type: 'SET_TOP_K', topK: 2 })
    state = reduceRagState(state, { type: 'SET_THRESHOLD', threshold: 0.5 })
    state = reduceRagState(state, { type: 'RUN' })
    state = reduceRagState(state, { type: 'ENTER_NIGHTMARE', now: 1_000 })
    expect(state.mode).toBe('nightmare')
    expect(state.completed).toBe(false)
    expect(state.config).toEqual(RAG_NIGHTMARE_CONFIG)
    expect(state.deadlineAt).toBe(61_000)
    expect(state.lastRun?.success).toBe(false)

    state = reduceRagState(state, { type: 'SET_CHUNK_SIZE', chunkSize: 200 })
    state = reduceRagState(state, { type: 'SET_TOP_K', topK: 2 })
    state = reduceRagState(state, { type: 'SET_THRESHOLD', threshold: 0.5 })
    state = reduceRagState(state, { type: 'RUN' })
    expect(state.nightmareCompleted).toBe(true)
    expect(evaluateRag(state).status).toBe('success')
  })

  it('TIMEOUT blocks further runs until rematch', () => {
    let state = createInitialRagState()
    state = reduceRagState(state, { type: 'SET_CHUNK_SIZE', chunkSize: 200 })
    state = reduceRagState(state, { type: 'SET_TOP_K', topK: 2 })
    state = reduceRagState(state, { type: 'SET_THRESHOLD', threshold: 0.5 })
    state = reduceRagState(state, { type: 'RUN' })
    state = reduceRagState(state, { type: 'ENTER_NIGHTMARE', now: 0 })
    state = reduceRagState(state, { type: 'TIMEOUT' })
    expect(state.timedOut).toBe(true)
    expect(evaluateRag(state).titleKey).toContain('timeout')
    const blocked = reduceRagState(state, { type: 'RUN' })
    expect(blocked).toBe(state)
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
