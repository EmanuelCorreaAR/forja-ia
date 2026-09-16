import {
  RAG_INITIAL_CONFIG,
  RAG_NIGHTMARE_CONFIG,
  RAG_NIGHTMARE_MS,
} from '@/data/rag'
import type { EvaluationResult } from '@/domain/types'
import { runRagPipeline } from './retrieve'
import type { RagAction, RagChallengeState } from './types'

export function createInitialRagState(startedAt = 0): RagChallengeState {
  const config = { ...RAG_INITIAL_CONFIG }
  const lastRun = runRagPipeline(config)
  return {
    mode: 'repair',
    config,
    attempts: 0,
    startedAt,
    completed: false,
    repairCompleted: false,
    nightmareCompleted: false,
    deadlineAt: null,
    timedOut: false,
    lastRun,
  }
}

export function reduceRagState(
  state: RagChallengeState,
  action: RagAction,
): RagChallengeState {
  switch (action.type) {
    case 'RESET':
      return createInitialRagState(state.startedAt)

    case 'SET_CHUNK_SIZE':
      if (state.completed || state.timedOut) return state
      return {
        ...state,
        config: { ...state.config, chunkSize: action.chunkSize },
      }

    case 'SET_TOP_K':
      if (state.completed || state.timedOut) return state
      return {
        ...state,
        config: { ...state.config, topK: action.topK },
      }

    case 'SET_THRESHOLD':
      if (state.completed || state.timedOut) return state
      return {
        ...state,
        config: {
          ...state.config,
          threshold: clampThreshold(action.threshold),
        },
      }

    case 'ENTER_NIGHTMARE': {
      if (!state.repairCompleted || state.nightmareCompleted) return state
      const config = { ...RAG_NIGHTMARE_CONFIG }
      return {
        ...state,
        mode: 'nightmare',
        config,
        completed: false,
        timedOut: false,
        deadlineAt: action.now + RAG_NIGHTMARE_MS,
        attempts: 0,
        lastRun: runRagPipeline(config),
      }
    }

    case 'TIMEOUT': {
      if (state.mode !== 'nightmare' || state.completed) return state
      return {
        ...state,
        timedOut: true,
      }
    }

    case 'RUN': {
      if (state.completed || state.timedOut) return state
      const lastRun = runRagPipeline(state.config)
      const completed = lastRun.success
      return {
        ...state,
        attempts: lastRun.success ? state.attempts : state.attempts + 1,
        lastRun,
        completed,
        repairCompleted:
          state.mode === 'repair' && completed
            ? true
            : state.repairCompleted,
        nightmareCompleted:
          state.mode === 'nightmare' && completed
            ? true
            : state.nightmareCompleted,
      }
    }

    default:
      return state
  }
}

function clampThreshold(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.min(1, Math.max(0, Math.round(value * 100) / 100))
}

export function evaluateRag(state: RagChallengeState): EvaluationResult {
  if (state.timedOut) {
    return {
      status: 'failed',
      titleKey: 'levels.rag.feedback.timeoutTitle',
      messageKey: 'levels.rag.feedback.timeoutMessage',
    }
  }

  if (state.completed && state.lastRun) {
    return {
      status: 'success',
      titleKey: state.lastRun.feedbackTitleKey,
      messageKey: state.lastRun.feedbackKey,
      metrics: {
        attempts: state.attempts,
        elapsedMs: 0,
        score: Math.max(100 - state.attempts * 10, 35),
        tokensUsed: state.lastRun.contextChunkIds.length * state.config.chunkSize,
        simulatedCost: state.lastRun.contextChunkIds.length * 0.002,
        configSnapshot: {
          ...state.config,
          mode: state.mode,
        },
      },
    }
  }

  if (state.lastRun && !state.lastRun.success) {
    return {
      status: 'failed',
      titleKey: state.lastRun.feedbackTitleKey,
      messageKey: state.lastRun.feedbackKey,
    }
  }

  return {
    status: 'incomplete',
    titleKey: 'levels.rag.feedback.idleTitle',
    messageKey: 'levels.rag.feedback.idleMessage',
  }
}
