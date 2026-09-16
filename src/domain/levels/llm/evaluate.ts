import { LLM_STEPS } from '@/data/llm'
import type { EvaluationResult } from '@/domain/types'
import type { LlmAction, LlmChallengeState, TokenOption } from './types'

const POINTS_CLEAN_HIT = 20
const STREAK_BONUS = 5

export function createInitialLlmState(startedAt = 0): LlmChallengeState {
  return {
    stepIndex: 0,
    chosenTokens: [],
    lastChoiceId: null,
    lastCorrect: null,
    phase: 'guess',
    attempts: 0,
    streak: 0,
    bestStreak: 0,
    score: 0,
    cleanStep: true,
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
  const lastStepIndex = Math.min(
    state.chosenTokens.length - 1,
    LLM_STEPS.length - 1,
  )
  const base = LLM_STEPS[lastStepIndex]?.context ?? ''
  const lastToken = state.chosenTokens[state.chosenTokens.length - 1]
  return `${base} ${lastToken}`.replace(/\s+\./g, '.')
}

export function getTopOption(step: { options: TokenOption[] }) {
  return [...step.options].sort((a, b) => b.probability - a.probability)[0]
}

export function reduceLlmState(
  state: LlmChallengeState,
  action: LlmAction,
): LlmChallengeState {
  switch (action.type) {
    case 'RESET':
      return createInitialLlmState(state.startedAt)

    case 'CONTINUE': {
      if (state.completed) return state
      if (state.phase !== 'reveal') return state

      if (state.lastCorrect === false) {
        return {
          ...state,
          phase: 'guess',
          lastChoiceId: null,
          lastCorrect: null,
        }
      }

      if (state.lastCorrect !== true) return state

      const nextIndex = state.stepIndex + 1
      if (nextIndex >= LLM_STEPS.length) {
        return { ...state, completed: true, phase: 'reveal' }
      }

      return {
        ...state,
        stepIndex: nextIndex,
        phase: 'guess',
        lastChoiceId: null,
        lastCorrect: null,
        cleanStep: true,
      }
    }

    case 'SELECT_TOKEN': {
      if (state.completed) return state
      if (state.phase === 'reveal' && state.lastCorrect === true) return state

      const step = getCurrentStep(state)
      if (!step) return state

      const option = step.options.find((o) => o.id === action.optionId)
      if (!option) return state

      const correct = option.id === step.correctOptionId

      if (!correct) {
        return {
          ...state,
          phase: 'reveal',
          attempts: state.attempts + 1,
          streak: 0,
          cleanStep: false,
          lastChoiceId: option.id,
          lastCorrect: false,
        }
      }

      const gained =
        (state.cleanStep ? POINTS_CLEAN_HIT : Math.floor(POINTS_CLEAN_HIT / 2)) +
        (state.cleanStep && state.streak > 0 ? STREAK_BONUS : 0)
      const streak = state.cleanStep ? state.streak + 1 : 1

      return {
        ...state,
        phase: 'reveal',
        chosenTokens: [...state.chosenTokens, option.text],
        lastChoiceId: option.id,
        lastCorrect: true,
        streak,
        bestStreak: Math.max(state.bestStreak, streak),
        score: state.score + gained,
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
      messageParams: {
        score: state.score,
        bestStreak: state.bestStreak,
      },
      metrics: {
        attempts: state.attempts,
        elapsedMs: 0,
        score: state.score,
        tokensUsed: state.chosenTokens.length,
        configSnapshot: { sequence: getBuiltSequence(state) },
      },
    }
  }

  if (state.phase === 'reveal' && state.lastCorrect === false) {
    const step = getCurrentStep(state)
    const top = step ? getTopOption(step) : null
    const picked = step?.options.find((o) => o.id === state.lastChoiceId)
    return {
      status: 'failed',
      titleKey: 'levels.llm.feedback.wrongTitle',
      messageKey: 'levels.llm.feedback.wrongMessage',
      messageParams: {
        picked: picked?.text ?? '',
        pickedProb: Math.round((picked?.probability ?? 0) * 100),
        top: top?.text ?? '',
        topProb: Math.round((top?.probability ?? 0) * 100),
      },
    }
  }

  if (state.phase === 'reveal' && state.lastCorrect === true) {
    const step = getCurrentStep(state)
    const picked = step?.options.find((o) => o.id === state.lastChoiceId)
    const isLast = state.stepIndex >= LLM_STEPS.length - 1
    return {
      status: 'incomplete',
      titleKey: 'levels.llm.feedback.hitTitle',
      messageKey: isLast
        ? 'levels.llm.feedback.hitLastMessage'
        : 'levels.llm.feedback.hitMessage',
      messageParams: {
        token: picked?.text ?? '',
        prob: Math.round((picked?.probability ?? 0) * 100),
        current: state.stepIndex + 1,
        total: LLM_STEPS.length,
      },
    }
  }

  return {
    status: 'incomplete',
    titleKey: 'levels.llm.feedback.incompleteTitle',
    messageKey: 'levels.llm.feedback.incompleteMessage',
    messageParams: {
      current: state.stepIndex + 1,
      total: LLM_STEPS.length,
    },
  }
}

export function getOptionProbability(
  options: TokenOption[],
  optionId: string,
): number {
  return options.find((o) => o.id === optionId)?.probability ?? 0
}
