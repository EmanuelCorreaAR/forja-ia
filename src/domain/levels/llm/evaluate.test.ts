import { describe, expect, it } from 'vitest'
import { LLM_CHAOS_ROUNDS, LLM_ROUNDS } from '@/data/llm'
import {
  createInitialLlmState,
  evaluateLlm,
  reduceLlmState,
  softmaxWithTemperature,
  withProbabilities,
} from '@/domain/levels/llm/evaluate'

describe('Level 1 — LLM game', () => {
  it('applies temperature deterministically', () => {
    const logits = [2.4, 0.4, 0.1, 0.6]
    expect(softmaxWithTemperature(logits, 0.2)).toEqual(
      softmaxWithTemperature(logits, 0.2),
    )
    const sharp = softmaxWithTemperature(logits, 0.2)
    const flat = softmaxWithTemperature(logits, 1)
    expect(sharp[0]!).toBeGreaterThan(flat[0]!)
  })

  it('completes predict rounds then unlocks chaos', () => {
    let state = createInitialLlmState()
    for (const round of LLM_ROUNDS) {
      state = reduceLlmState(state, {
        type: 'SELECT_TOKEN',
        optionId: round.correctOptionId,
      })
      state = reduceLlmState(state, { type: 'CONTINUE' })
    }
    expect(state.predictCompleted).toBe(true)
    state = reduceLlmState(state, { type: 'ENTER_CHAOS' })
    expect(state.mode).toBe('chaos')
    expect(state.chaosRoundIndex).toBe(0)
    state = reduceLlmState(state, {
      type: 'SELECT_TOKEN',
      optionId: LLM_CHAOS_ROUNDS[0]!.options[1]!.id,
    })
    expect(state.chaosScore).toBeGreaterThan(0)
    state = reduceLlmState(state, { type: 'FINISH_CHAOS' })
    expect(evaluateLlm(state).status).toBe('success')
  })

  it('advances chaos through distinct contexts', () => {
    let state = createInitialLlmState()
    for (const round of LLM_ROUNDS) {
      state = reduceLlmState(state, {
        type: 'SELECT_TOKEN',
        optionId: round.correctOptionId,
      })
      state = reduceLlmState(state, { type: 'CONTINUE' })
    }
    state = reduceLlmState(state, { type: 'ENTER_CHAOS' })
    const firstContext = LLM_CHAOS_ROUNDS[0]!.context

    state = reduceLlmState(state, {
      type: 'SELECT_TOKEN',
      optionId: LLM_CHAOS_ROUNDS[0]!.options[0]!.id,
    })
    state = reduceLlmState(state, { type: 'CONTINUE' })
    expect(state.chaosRoundIndex).toBe(1)
    expect(LLM_CHAOS_ROUNDS[1]!.context).not.toBe(firstContext)

    // last round: CONTINUE no-op
    state = {
      ...state,
      chaosRoundIndex: LLM_CHAOS_ROUNDS.length - 1,
      phase: 'reveal',
      lastCorrect: true,
    }
    const stuck = reduceLlmState(state, { type: 'CONTINUE' })
    expect(stuck.chaosRoundIndex).toBe(LLM_CHAOS_ROUNDS.length - 1)
    expect(stuck.phase).toBe('reveal')
  })

  it('counts failed predict attempts only', () => {
    let state = createInitialLlmState()
    state = reduceLlmState(state, { type: 'SELECT_TOKEN', optionId: 'ovni' })
    expect(state.attempts).toBe(1)
    state = reduceLlmState(state, { type: 'CONTINUE' })
    state = reduceLlmState(state, { type: 'SELECT_TOKEN', optionId: 'queso' })
    expect(state.attempts).toBe(1)
  })

  it('does not farm chaos score by re-clicking during reveal', () => {
    let state = createInitialLlmState()
    for (const round of LLM_ROUNDS) {
      state = reduceLlmState(state, {
        type: 'SELECT_TOKEN',
        optionId: round.correctOptionId,
      })
      state = reduceLlmState(state, { type: 'CONTINUE' })
    }
    state = reduceLlmState(state, { type: 'ENTER_CHAOS' })
    const pickId = LLM_CHAOS_ROUNDS[0]!.options[1]!.id
    state = reduceLlmState(state, { type: 'SELECT_TOKEN', optionId: pickId })
    const afterFirst = state.chaosScore
    expect(afterFirst).toBeGreaterThan(0)
    state = reduceLlmState(state, { type: 'SELECT_TOKEN', optionId: pickId })
    expect(state.chaosScore).toBe(afterFirst)
    state = reduceLlmState(state, { type: 'CONTINUE' })
    state = reduceLlmState(state, {
      type: 'SELECT_TOKEN',
      optionId: LLM_CHAOS_ROUNDS[1]!.options[1]!.id,
    })
    expect(state.chaosScore).toBeGreaterThan(afterFirst)
  })

  it('exposes probabilities from logits', () => {
    const options = withProbabilities(LLM_ROUNDS[0]!.options, 0.7)
    const sum = options.reduce((acc, item) => acc + item.probability, 0)
    expect(sum).toBeGreaterThan(0.99)
    expect(sum).toBeLessThan(1.01)
  })
})
