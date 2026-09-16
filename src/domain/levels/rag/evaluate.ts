import { RAG_INITIAL_CONFIG } from '@/data/rag'
import type { EvaluationResult } from '@/domain/types'
import { runRagPipeline } from './retrieve'
import type { RagAction, RagChallengeState } from './types'

export function createInitialRagState(startedAt = 0): RagChallengeState {
  return {
    config: { ...RAG_INITIAL_CONFIG },
    attempts: 0,
    startedAt,
    completed: false,
    lastRun: null,
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
      return {
        ...state,
        config: { ...state.config, chunkSize: action.chunkSize },
      }
    case 'SET_TOP_K':
      return {
        ...state,
        config: { ...state.config, topK: action.topK },
      }
    case 'SET_THRESHOLD':
      return {
        ...state,
        config: {
          ...state.config,
          threshold: clampThreshold(action.threshold),
        },
      }
    case 'RUN': {
      if (state.completed) return state
      const lastRun = runRagPipeline(state.config)
      return {
        ...state,
        attempts: lastRun.success ? state.attempts : state.attempts + 1,
        lastRun,
        completed: lastRun.success,
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
        configSnapshot: { ...state.config },
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
