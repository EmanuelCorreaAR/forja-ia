import {
  EMBEDDING_DOCUMENTS,
  EMBEDDING_QUERY,
  EMBEDDING_TARGET_DOC_IDS,
  EMBEDDING_TOP_K,
  EMBEDDING_TRAP_DOC_ID,
} from '@/data/embeddings'
import type { EvaluationResult } from '@/domain/types'
import {
  euclideanDistance,
  roundScore,
  similarityFromDistance,
} from './similarity'
import type { EmbeddingsAction, EmbeddingsChallengeState } from './types'

const PERFECT_SCORE = 100
const ATTEMPT_PENALTY = 15

export function createInitialEmbeddingsState(
  startedAt = 0,
): EmbeddingsChallengeState {
  return {
    selectedDocIds: [],
    phase: 'guess',
    attempts: 0,
    score: 0,
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
  })
}

/** Orden de juego (no ordenado por similitud — eso spoilearía) */
export function getPlayOrderScores() {
  return getDocumentScores()
}

export function getRankedScores() {
  return [...getDocumentScores()].sort((a, b) => b.similarity - a.similarity)
}

export function getTargetDocIds(): string[] {
  return getRankedScores()
    .slice(0, EMBEDDING_TOP_K)
    .map((s) => s.doc.id)
}

export function getTrapDocId(): string {
  return (
    EMBEDDING_DOCUMENTS.find((doc) => doc.trap)?.id ?? EMBEDDING_TRAP_DOC_ID
  )
}

export function averageSelectedSimilarity(selectedDocIds: string[]): number {
  const scores = getDocumentScores()
  if (selectedDocIds.length === 0) return 0
  const sum = selectedDocIds.reduce((acc, id) => {
    const hit = scores.find((item) => item.doc.id === id)
    return acc + (hit?.similarity ?? 0)
  }, 0)
  return roundScore(sum / selectedDocIds.length, 3)
}

export function reduceEmbeddingsState(
  state: EmbeddingsChallengeState,
  action: EmbeddingsAction,
): EmbeddingsChallengeState {
  switch (action.type) {
    case 'RESET':
      return createInitialEmbeddingsState(state.startedAt)

    case 'RETRY': {
      if (state.completed || state.phase !== 'reveal') return state
      return {
        ...state,
        phase: 'guess',
        selectedDocIds: [],
        lastEvaluationPassed: null,
      }
    }

    case 'TOGGLE_DOC': {
      if (state.completed || state.phase === 'reveal') return state
      const exists = state.selectedDocIds.includes(action.docId)
      let selectedDocIds: string[]
      if (exists) {
        selectedDocIds = state.selectedDocIds.filter((id) => id !== action.docId)
      } else if (state.selectedDocIds.length >= EMBEDDING_TOP_K) {
        selectedDocIds = [...state.selectedDocIds.slice(1), action.docId]
      } else {
        selectedDocIds = [...state.selectedDocIds, action.docId]
      }
      return {
        ...state,
        selectedDocIds,
        lastEvaluationPassed: null,
      }
    }

    case 'SUBMIT': {
      if (state.completed || state.phase === 'reveal') return state
      if (state.selectedDocIds.length !== EMBEDDING_TOP_K) return state

      const target = new Set(getTargetDocIds())
      void EMBEDDING_TARGET_DOC_IDS
      const selected = new Set(state.selectedDocIds)
      const passed =
        selected.size === target.size &&
        [...target].every((id) => selected.has(id))

      const attempts = passed ? state.attempts : state.attempts + 1
      const avgSim = averageSelectedSimilarity(state.selectedDocIds)
      const score = passed
        ? Math.max(
            PERFECT_SCORE -
              state.attempts * ATTEMPT_PENALTY +
              Math.round((avgSim - 0.9) * 50),
            40,
          )
        : state.score

      return {
        ...state,
        phase: 'reveal',
        attempts,
        score,
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
  const avgSim = averageSelectedSimilarity(state.selectedDocIds)

  if (state.completed) {
    return {
      status: 'success',
      titleKey: 'levels.embeddings.feedback.successTitle',
      messageKey: 'levels.embeddings.feedback.successMessage',
      messageParams: {
        score: state.score,
        topK: EMBEDDING_TOP_K,
        avgSim,
      },
      metrics: {
        attempts: state.attempts,
        elapsedMs: 0,
        score: state.score,
        configSnapshot: {
          selectedDocIds: state.selectedDocIds,
          avgSimilarity: avgSim,
        },
      },
    }
  }

  if (state.phase === 'reveal' && state.lastEvaluationPassed === false) {
    const target = new Set(getTargetDocIds())
    const selected = new Set(state.selectedDocIds)
    const hits = [...selected].filter((id) => target.has(id)).length
    const trapId = getTrapDocId()
    const pickedTrap = selected.has(trapId)

    if (pickedTrap) {
      return {
        status: 'failed',
        titleKey: 'levels.embeddings.feedback.trapTitle',
        messageKey: 'levels.embeddings.feedback.trapMessage',
        messageParams: { topK: EMBEDDING_TOP_K },
      }
    }

    if (hits === 0) {
      return {
        status: 'failed',
        titleKey: 'levels.embeddings.feedback.missedAllTitle',
        messageKey: 'levels.embeddings.feedback.missedAllMessage',
        messageParams: { topK: EMBEDDING_TOP_K },
      }
    }

    return {
      status: 'failed',
      titleKey: 'levels.embeddings.feedback.partialTitle',
      messageKey: 'levels.embeddings.feedback.partialMessage',
      messageParams: { hits, topK: EMBEDDING_TOP_K },
    }
  }

  return {
    status: 'incomplete',
    titleKey: 'levels.embeddings.feedback.incompleteTitle',
    messageKey: 'levels.embeddings.feedback.incompleteMessage',
    messageParams: { topK: EMBEDDING_TOP_K },
  }
}
