import { describe, expect, it } from 'vitest'
import {
  createInitialLlmState,
  evaluateLlm,
  reduceLlmState,
} from '@/domain/levels/llm/evaluate'
import { LLM_STEPS } from '@/data/llm'

describe('Level 1 — LLM', () => {
  it('starts incomplete', () => {
    const state = createInitialLlmState()
    expect(evaluateLlm(state).status).toBe('incomplete')
  })

  it('fails on wrong token without advancing', () => {
    let state = createInitialLlmState()
    state = reduceLlmState(state, { type: 'SELECT_TOKEN', optionId: 'moon' })
    expect(state.stepIndex).toBe(0)
    expect(state.lastCorrect).toBe(false)
    expect(evaluateLlm(state).status).toBe('failed')
  })

  it('completes when the full target path is chosen', () => {
    let state = createInitialLlmState()
    for (const step of LLM_STEPS) {
      state = reduceLlmState(state, {
        type: 'SELECT_TOKEN',
        optionId: step.correctOptionId,
      })
    }
    expect(state.completed).toBe(true)
    expect(evaluateLlm(state).status).toBe('success')
    expect(state.chosenTokens).toEqual([
      'mat',
      'because',
      'it',
      'is',
      'warm',
    ])
  })

  it('is deterministic for the same actions', () => {
    const run = () => {
      let state = createInitialLlmState()
      state = reduceLlmState(state, { type: 'SELECT_TOKEN', optionId: 'roof' })
      state = reduceLlmState(state, { type: 'SELECT_TOKEN', optionId: 'mat' })
      return state
    }
    expect(run()).toEqual(run())
  })
})
