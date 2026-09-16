import {
  EMBEDDING_DOCUMENTS,
  EMBEDDING_QUERY,
  EMBEDDING_TARGET_DOC_IDS,
} from '@/data/embeddings'
import type { EvaluationResult } from '@/domain/types'
import {
  euclideanDistance,
  roundScore,
  similarityFromDistance,
} from './similarity'
import type { EmbeddingsAction, EmbeddingsChallengeState } from './types'

export function createInitialEmbeddingsState(
  startedAt = 0,
): EmbeddingsChallengeState {
  return {
    selectedDocIds: [],
    attempts: 0,
    startedAt,
    completed: false,
    lastEvaluationPassed: null,
  }
}

export function getDocumentScores() {
  return EMBEDDING_DOCUMENTS.map((doc) => {
    const distance = euclideanDistance(doc.position, EMBEDDING_QUERY.position)
    const similarity = roundScore(similarityFromDistance(distance), 3)
    return {
      doc,
      distance: roundScore(distance, 3),
      similarity,
    }
  }).sort((a, b) => b.similarity - a.similarity)
}

export function reduceEmbeddingsState(
  state: EmbeddingsChallengeState,
  action: EmbeddingsAction,
): EmbeddingsChallengeState {
  switch (action.type) {
    case 'RESET':
      return createInitialEmbeddingsState(state.startedAt)
    case 'TOGGLE_DOC': {
      if (state.completed) return state
      const exists = state.selectedDocIds.includes(action.docId)
      const selectedDocIds = exists
        ? state.selectedDocIds.filter((id) => id !== action.docId)
        : [...state.selectedDocIds, action.docId]
      return {
        ...state,
        selectedDocIds,
        lastEvaluationPassed: null,
      }
    }
    case 'SUBMIT': {
      if (state.completed) return state
      const target = new Set<string>(EMBEDDING_TARGET_DOC_IDS)
      const selected = new Set(state.selectedDocIds)
      const passed =
        selected.size === target.size &&
        [...target].every((id) => selected.has(id))

      return {
        ...state,
        attempts: state.attempts + 1,
        lastEvaluationPassed: passed,
        completed: passed,
      }
    }
    default:
      return state
  }
}

export function evaluateEmbeddings(
  state: EmbeddingsChallengeState,
): EvaluationResult {
  if (state.completed) {
    return {
      status: 'success',
      titleKey: 'levels.embeddings.feedback.successTitle',
      messageKey: 'levels.embeddings.feedback.successMessage',
      metrics: {
        attempts: state.attempts,
        elapsedMs: 0,
        score: Math.max(100 - (state.attempts - 1) * 12, 40),
        configSnapshot: { selectedDocIds: state.selectedDocIds },
      },
    }
  }

  if (state.lastEvaluationPassed === false) {
    const selected = new Set(state.selectedDocIds)
    const target = new Set<string>(EMBEDDING_TARGET_DOC_IDS)
    const missing = [...target].filter((id) => !selected.has(id))
    const extra = [...selected].filter((id) => !target.has(id))

    if (missing.length > 0 && extra.length === 0) {
      return {
        status: 'failed',
        titleKey: 'levels.embeddings.feedback.missingTitle',
        messageKey: 'levels.embeddings.feedback.missingMessage',
      }
    }
    if (extra.length > 0) {
      return {
        status: 'failed',
        titleKey: 'levels.embeddings.feedback.extraTitle',
        messageKey: 'levels.embeddings.feedback.extraMessage',
      }
    }
    return {
      status: 'failed',
      titleKey: 'levels.embeddings.feedback.wrongTitle',
      messageKey: 'levels.embeddings.feedback.wrongMessage',
    }
  }

  return {
    status: 'incomplete',
    titleKey: 'levels.embeddings.feedback.incompleteTitle',
    messageKey: 'levels.embeddings.feedback.incompleteMessage',
  }
}
