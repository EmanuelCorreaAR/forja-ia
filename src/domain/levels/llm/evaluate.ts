import { LLM_STEPS, LLM_TARGET_SEQUENCE } from '@/data/llm'
import type { EvaluationResult } from '@/domain/types'
import type { LlmAction, LlmChallengeState, TokenOption } from './types'

export function createInitialLlmState(startedAt = 0): LlmChallengeState {
  return {
    stepIndex: 0,
    chosenTokens: [],
    lastChoiceId: null,
    lastCorrect: null,
    attempts: 0,
    startedAt,
    completed: false,
  }
}

export function getCurrentStep(state: LlmChallengeState) {
  return LLM_STEPS[state.stepIndex] ?? null
}

export function getBuiltSequence(state: LlmChallengeState): string {
  if (state.chosenTokens.length === 0) {
    return LLM_STEPS[0]?.context ?? ''
  }
  const lastStepIndex = Math.min(state.chosenTokens.length - 1, LLM_STEPS.length - 1)
  const base = LLM_STEPS[lastStepIndex]?.context ?? ''
  const lastToken = state.chosenTokens[state.chosenTokens.length - 1]
  return `${base} ${lastToken}`.replace(/\s+\./g, '.')
}

export function reduceLlmState(
  state: LlmChallengeState,
  action: LlmAction,
): LlmChallengeState {
  switch (action.type) {
    case 'RESET':
      return createInitialLlmState(state.startedAt)
    case 'SELECT_TOKEN': {
      if (state.completed) return state
      const step = getCurrentStep(state)
      if (!step) return state

      const option = step.options.find((o) => o.id === action.optionId)
      if (!option) return state

      const correct = option.id === step.correctOptionId
      const attempts = state.attempts + 1

      if (!correct) {
        return {
          ...state,
          attempts,
          lastChoiceId: option.id,
          lastCorrect: false,
        }
      }

      const chosenTokens = [...state.chosenTokens, option.text]
      const nextIndex = state.stepIndex + 1
      const completed = nextIndex >= LLM_STEPS.length

      return {
        ...state,
        attempts,
        chosenTokens,
        stepIndex: completed ? state.stepIndex : nextIndex,
        lastChoiceId: option.id,
        lastCorrect: true,
        completed,
      }
    }
    default:
      return state
  }
}

export function evaluateLlm(state: LlmChallengeState): EvaluationResult {
  if (state.completed) {
    return {
      status: 'success',
      titleKey: 'levels.llm.feedback.successTitle',
      messageKey: 'levels.llm.feedback.successMessage',
      metrics: {
        attempts: state.attempts,
        elapsedMs: 0,
        score: Math.max(100 - (state.attempts - LLM_STEPS.length) * 8, 40),
        tokensUsed: state.chosenTokens.length,
        configSnapshot: { sequence: getBuiltSequence(state) },
      },
    }
  }

  if (state.lastCorrect === false) {
    return {
      status: 'failed',
      titleKey: 'levels.llm.feedback.wrongTitle',
      messageKey: 'levels.llm.feedback.wrongMessage',
    }
  }

  return {
    status: 'incomplete',
    titleKey: 'levels.llm.feedback.incompleteTitle',
    messageKey: 'levels.llm.feedback.incompleteMessage',
    messageParams: {
      current: state.stepIndex + 1,
      total: LLM_STEPS.length,
      target: LLM_TARGET_SEQUENCE,
    },
  }
}

export function getOptionProbability(
  options: TokenOption[],
  optionId: string,
): number {
  return options.find((o) => o.id === optionId)?.probability ?? 0
}
