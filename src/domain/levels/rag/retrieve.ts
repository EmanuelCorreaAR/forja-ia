import { RAG_CHUNKS_BY_SIZE } from '@/data/rag'
import type {
  RagAnswerKind,
  RagConfig,
  RagRunResult,
  RetrievedChunk,
} from './types'

export function retrieveChunks(config: RagConfig): RetrievedChunk[] {
  const chunks = [...RAG_CHUNKS_BY_SIZE[config.chunkSize]].sort(
    (a, b) => b.similarity - a.similarity,
  )

  return chunks.map((chunk, index) => {
    const ranked = index < config.topK
    const aboveThreshold = chunk.similarity >= config.threshold
    const included = ranked && aboveThreshold

    let reason: RetrievedChunk['reason'] = 'not_ranked'
    if (ranked && !aboveThreshold) reason = 'below_threshold'
    else if (included) reason = 'top_k'
    else if (!ranked) reason = 'not_ranked'

    return { chunk, included, reason }
  })
}

function hasCoreRefund(chunks: RetrievedChunk[]): boolean {
  return chunks.some((r) =>
    r.chunk.text
      .toLowerCase()
      .includes('reembolso completo dentro de los 30 días'),
  )
}

/**
 * Reglas simples y enseñables:
 * - sin chunks → vacío
 * - chunks 400 → ruido (casi siempre)
 * - si el pedazo clave de reembolso llega y hay poco ruido → éxito
 * - si llega poco del tema → incompleto
 * - si no llega nada relevante → miss
 */
export function classifyRagAnswer(
  config: RagConfig,
  retrieved: RetrievedChunk[],
): {
  answerKind: RagAnswerKind
  answerKey: string
  feedbackKey: string
  feedbackTitleKey: string
  success: boolean
} {
  const included = retrieved.filter((r) => r.included)
  const relevantIncluded = included.filter((r) => r.chunk.relevant)
  const irrelevantIncluded = included.filter((r) => !r.chunk.relevant)
  const core = hasCoreRefund(included)

  if (included.length === 0) {
    return {
      answerKind: 'empty',
      answerKey: 'levels.rag.answers.empty',
      feedbackTitleKey: 'levels.rag.feedback.emptyTitle',
      feedbackKey: 'levels.rag.feedback.emptyMessage',
      success: false,
    }
  }

  if (config.chunkSize === 400) {
    return {
      answerKind: 'irrelevant',
      answerKey: 'levels.rag.answers.confused',
      feedbackTitleKey: 'levels.rag.feedback.noisyTitle',
      feedbackKey: 'levels.rag.feedback.noisyMessage',
      success: false,
    }
  }

  // Promo 2019 sin el chunk clave = inventa con cara de seguro
  const promoNoise = included.some((r) =>
    r.chunk.sourceDocId.includes('promo'),
  )
  if (promoNoise && !core) {
    return {
      answerKind: 'irrelevant',
      answerKey: 'levels.rag.answers.promoTrap',
      feedbackTitleKey: 'levels.rag.feedback.promoTitle',
      feedbackKey: 'levels.rag.feedback.promoMessage',
      success: false,
    }
  }

  if (core && irrelevantIncluded.length <= 1) {
    // Pedazos muy chicos: hace falta un poco más de detalle
    if (config.chunkSize === 50 && relevantIncluded.length < 2) {
      return {
        answerKind: 'incomplete',
        answerKey: 'levels.rag.answers.incomplete',
        feedbackTitleKey: 'levels.rag.feedback.incompleteTitle',
        feedbackKey: 'levels.rag.feedback.incompleteMessage',
        success: false,
      }
    }

    return {
      answerKind: 'correct',
      answerKey: 'levels.rag.answers.correct',
      feedbackTitleKey: 'levels.rag.feedback.successTitle',
      feedbackKey: 'levels.rag.feedback.successMessage',
      success: true,
    }
  }

  if (relevantIncluded.length === 0) {
    return {
      answerKind: 'irrelevant',
      answerKey: 'levels.rag.answers.wrong',
      feedbackTitleKey: 'levels.rag.feedback.missedTitle',
      feedbackKey: 'levels.rag.feedback.missedMessage',
      success: false,
    }
  }

  if (irrelevantIncluded.length >= 2) {
    return {
      answerKind: 'irrelevant',
      answerKey: 'levels.rag.answers.confused',
      feedbackTitleKey: 'levels.rag.feedback.noisyTitle',
      feedbackKey: 'levels.rag.feedback.noisyMessage',
      success: false,
    }
  }

  return {
    answerKind: 'incomplete',
    answerKey: 'levels.rag.answers.incomplete',
    feedbackTitleKey: 'levels.rag.feedback.incompleteTitle',
    feedbackKey: 'levels.rag.feedback.incompleteMessage',
    success: false,
  }
}

export function runRagPipeline(config: RagConfig): RagRunResult {
  const retrieved = retrieveChunks(config)
  const classification = classifyRagAnswer(config, retrieved)
  return {
    retrieved,
    contextChunkIds: retrieved.filter((r) => r.included).map((r) => r.chunk.id),
    ...classification,
  }
}
