import { describe, expect, it } from 'vitest'
import {
  createInitialLlmState,
  evaluateLlm,
  reduceLlmState,
} from '@/domain/levels/llm/evaluate'
import { LLM_STEPS } from '@/data/llm'

function playCorrectPath() {
  let state = createInitialLlmState()
  for (const step of LLM_STEPS) {
    state = reduceLlmState(state, {
      type: 'SELECT_TOKEN',
      optionId: step.correctOptionId,
    })
    state = reduceLlmState(state, { type: 'CONTINUE' })
  }
  return state
}

describe('Level 1 — LLM', () => {
  it('starts in blind guess mode', () => {
    const state = createInitialLlmState()
    expect(state.phase).toBe('guess')
    expect(evaluateLlm(state).status).toBe('incomplete')
  })

  it('reveals probabilities after a wrong guess without advancing', () => {
    let state = createInitialLlmState()
    state = reduceLlmState(state, { type: 'SELECT_TOKEN', optionId: 'luna' })
    expect(state.phase).toBe('reveal')
    expect(state.stepIndex).toBe(0)
    expect(state.attempts).toBe(1)
    expect(evaluateLlm(state).status).toBe('failed')
  })

  it('does not count score until a correct blind or recovered hit', () => {
    let state = createInitialLlmState()
    state = reduceLlmState(state, { type: 'SELECT_TOKEN', optionId: 'luna' })
    state = reduceLlmState(state, { type: 'CONTINUE' })
    expect(state.phase).toBe('guess')
    state = reduceLlmState(state, {
      type: 'SELECT_TOKEN',
      optionId: 'alfombra',
    })
    expect(state.score).toBeGreaterThan(0)
    expect(state.phase).toBe('reveal')
  })

  it('completes only after continue on the final token', () => {
    const state = playCorrectPath()
    expect(state.completed).toBe(true)
    expect(evaluateLlm(state).status).toBe('success')
    expect(state.chosenTokens).toEqual([
      'alfombra',
      'porque',
      'está',
      'muy',
      'caliente',
    ])
    expect(state.attempts).toBe(0)
    expect(state.score).toBeGreaterThan(0)
  })

  it('is deterministic for the same actions', () => {
    const run = () => {
      let state = createInitialLlmState()
      state = reduceLlmState(state, { type: 'SELECT_TOKEN', optionId: 'techo' })
      state = reduceLlmState(state, { type: 'CONTINUE' })
      state = reduceLlmState(state, {
        type: 'SELECT_TOKEN',
        optionId: 'alfombra',
      })
      return state
    }
    expect(run()).toEqual(run())
  })
})
