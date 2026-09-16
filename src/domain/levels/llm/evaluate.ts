import { LLM_CHAOS_OPTIONS, LLM_ROUNDS } from '@/data/llm'
import type { EvaluationResult } from '@/domain/types'
import type {
  LlmAction,
  LlmChallengeState,
  TokenOption,
} from './types'

const POINTS_CLEAN_HIT = 20
const STREAK_BONUS = 5

export function softmaxWithTemperature(
  logits: number[],
  temperature: number,
): number[] {
  const t = Math.min(1.5, Math.max(0.1, temperature))
  const scaled = logits.map((logit) => logit / t)
  const max = Math.max(...scaled)
  const exps = scaled.map((value) => Math.exp(value - max))
  const sum = exps.reduce((acc, value) => acc + value, 0)
  return exps.map((value) => value / sum)
}

export function withProbabilities(
  options: TokenOption[],
  temperature: number,
): Array<TokenOption & { probability: number }> {
  const probs = softmaxWithTemperature(
    options.map((option) => option.logit),
    temperature,
  )
  return options.map((option, index) => ({
    ...option,
    probability: Math.round(probs[index]! * 1000) / 1000,
  }))
}

export function createInitialLlmState(startedAt = 0): LlmChallengeState {
  return {
    mode: 'predict',
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
    temperature: 0.7,
    chaosScore: 0,
    chaosPicks: [],
    predictCompleted: false,
    completed: false,
    startedAt,
  }
}

export function getCurrentStep(state: LlmChallengeState) {
  if (state.mode === 'chaos') return null
  return LLM_ROUNDS[state.stepIndex] ?? null
}

export function getActiveOptions(state: LlmChallengeState) {
  if (state.mode === 'chaos') {
    return withProbabilities(
      LLM_CHAOS_OPTIONS.map((option) => ({
        id: option.id,
        text: option.text,
        logit: option.logit,
      })),
      state.temperature,
    )
  }
  const step = getCurrentStep(state)
  if (!step) return []
  return withProbabilities(step.options, state.temperature)
}

export function getTopOptionId(
  options: Array<TokenOption & { probability: number }>,
) {
  return [...options].sort((a, b) => b.probability - a.probability)[0]?.id
}

export function reduceLlmState(
  state: LlmChallengeState,
  action: LlmAction,
): LlmChallengeState {
  switch (action.type) {
    case 'RESET':
      return createInitialLlmState(state.startedAt)

    case 'SET_TEMPERATURE':
      return {
        ...state,
        temperature: clampTemp(action.temperature),
      }

    case 'ENTER_CHAOS':
      if (!state.predictCompleted || state.completed) return state
      return {
        ...state,
        mode: 'chaos',
        phase: 'guess',
        lastChoiceId: null,
        lastCorrect: null,
        chaosPicks: [],
        chaosScore: 0,
      }

    case 'FINISH_CHAOS':
      if (state.mode !== 'chaos') return state
      return {
        ...state,
        completed: true,
        score: Math.max(state.score, state.chaosScore),
      }

    case 'FINISH_PREDICT':
      if (!state.predictCompleted || state.completed) return state
      return {
        ...state,
        completed: true,
      }

    case 'CONTINUE': {
      if (state.completed) return state
      if (state.phase !== 'reveal') return state

      if (state.mode === 'chaos') {
        return {
          ...state,
          phase: 'guess',
          lastChoiceId: null,
          lastCorrect: null,
        }
      }

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
      if (nextIndex >= LLM_ROUNDS.length) {
        return {
          ...state,
          predictCompleted: true,
          phase: 'reveal',
        }
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
      if (
        state.phase === 'reveal' &&
        state.lastCorrect === true &&
        state.mode === 'predict'
      ) {
        return state
      }

      if (state.mode === 'chaos') {
        const options = getActiveOptions(state)
        const option = options.find((item) => item.id === action.optionId)
        if (!option) return state
        const meta = LLM_CHAOS_OPTIONS.find((item) => item.id === option.id)
        const absurdity = meta?.absurdity ?? 0.5
        const rarity = 1 - option.probability
        const gained = Math.round((absurdity * 0.65 + rarity * 0.35) * 100)
        return {
          ...state,
          phase: 'reveal',
          lastChoiceId: option.id,
          lastCorrect: true,
          chaosPicks: [...state.chaosPicks, option.text],
          chaosScore: state.chaosScore + gained,
        }
      }

      const step = getCurrentStep(state)
      if (!step) return state
      const options = getActiveOptions(state)
      const option = options.find((item) => item.id === action.optionId)
      if (!option) return state

      const isHit = option.id === step.correctOptionId

      if (!isHit) {
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

function clampTemp(value: number) {
  if (Number.isNaN(value)) return 0.7
  return Math.min(1, Math.max(0.1, Math.round(value * 100) / 100))
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
        chaosScore: state.chaosScore,
      },
      metrics: {
        attempts: state.attempts,
        elapsedMs: 0,
        score: state.score,
        tokensUsed: state.chosenTokens.length + state.chaosPicks.length,
        configSnapshot: {
          temperature: state.temperature,
          chaosScore: state.chaosScore,
        },
      },
    }
  }

  if (state.mode === 'chaos' && state.phase === 'reveal') {
    return {
      status: 'incomplete',
      titleKey: 'levels.llm.feedback.chaosHitTitle',
      messageKey: 'levels.llm.feedback.chaosHitMessage',
      messageParams: { chaosScore: state.chaosScore },
    }
  }

  if (state.predictCompleted && state.mode === 'predict') {
    return {
      status: 'incomplete',
      titleKey: 'levels.llm.feedback.predictDoneTitle',
      messageKey: 'levels.llm.feedback.predictDoneMessage',
    }
  }

  if (state.phase === 'reveal' && state.lastCorrect === false) {
    const options = [...getActiveOptions(state)].sort(
      (a, b) => b.probability - a.probability,
    )
    const top = options[0]
    const picked = options.find((item) => item.id === state.lastChoiceId)
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
    const options = getActiveOptions(state)
    const picked = options.find((item) => item.id === state.lastChoiceId)
    return {
      status: 'incomplete',
      titleKey: 'levels.llm.feedback.hitTitle',
      messageKey: 'levels.llm.feedback.hitMessage',
      messageParams: {
        token: picked?.text ?? '',
        prob: Math.round((picked?.probability ?? 0) * 100),
        current: state.stepIndex + 1,
        total: LLM_ROUNDS.length,
      },
    }
  }

  return {
    status: 'incomplete',
    titleKey:
      state.mode === 'chaos'
        ? 'levels.llm.feedback.chaosTitle'
        : 'levels.llm.feedback.incompleteTitle',
    messageKey:
      state.mode === 'chaos'
        ? 'levels.llm.feedback.chaosMessage'
        : 'levels.llm.feedback.incompleteMessage',
    messageParams: {
      current: state.stepIndex + 1,
      total: LLM_ROUNDS.length,
    },
  }
}
