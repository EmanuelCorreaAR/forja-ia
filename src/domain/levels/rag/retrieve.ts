import { RAG_CHUNKS_BY_SIZE } from '@/data/rag'
import type {
  ChunkSize,
  RagAnswerKind,
  RagConfig,
  RagRunResult,
  RetrievedChunk,
  TopK,
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

  if (included.length === 0) {
    return {
      answerKind: 'empty',
      answerKey: 'levels.rag.answers.empty',
      feedbackTitleKey: 'levels.rag.feedback.emptyTitle',
      feedbackKey: 'levels.rag.feedback.emptyMessage',
      success: false,
    }
  }

  // Success recipe: chunk size 100 or 200, enough relevant context, limited noise
  const goodChunkSize: ChunkSize[] = [100, 200]
  const hasCoreRefund = relevantIncluded.some((r) =>
    r.chunk.text.toLowerCase().includes('full refund within 30 days'),
  )
  const enoughRelevant = relevantIncluded.length >= 1 && hasCoreRefund
  const tooNoisy = irrelevantIncluded.length >= 2
  const topKOk: TopK[] = [2, 3, 5]
  const thresholdOk = config.threshold >= 0.45 && config.threshold <= 0.85

  if (
    goodChunkSize.includes(config.chunkSize) &&
    enoughRelevant &&
    !tooNoisy &&
    topKOk.includes(config.topK) &&
    thresholdOk
  ) {
    // For topK=1 with size 100/200, only one chunk — still OK if it's the core one
    if (config.topK === 1 && relevantIncluded.length === 1 && hasCoreRefund) {
      return {
        answerKind: 'correct',
        answerKey: 'levels.rag.answers.correct',
        feedbackTitleKey: 'levels.rag.feedback.successTitle',
        feedbackKey: 'levels.rag.feedback.successMessage',
        success: true,
      }
    }
    if (config.topK >= 2 && enoughRelevant) {
      return {
        answerKind: 'correct',
        answerKey: 'levels.rag.answers.correct',
        feedbackTitleKey: 'levels.rag.feedback.successTitle',
        feedbackKey: 'levels.rag.feedback.successMessage',
        success: true,
      }
    }
  }

  // Chunk size 50 with only first tiny piece and topK=1 can be incomplete
  if (config.chunkSize === 50 && relevantIncluded.length > 0 && relevantIncluded.length < 2) {
    return {
      answerKind: 'incomplete',
      answerKey: 'levels.rag.answers.incomplete',
      feedbackTitleKey: 'levels.rag.feedback.incompleteTitle',
      feedbackKey: 'levels.rag.feedback.incompleteMessage',
      success: false,
    }
  }

  if (config.chunkSize === 50 && relevantIncluded.length >= 2 && !tooNoisy && thresholdOk) {
    return {
      answerKind: 'correct',
      answerKey: 'levels.rag.answers.correct',
      feedbackTitleKey: 'levels.rag.feedback.successTitle',
      feedbackKey: 'levels.rag.feedback.successMessage',
      success: true,
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

  if (relevantIncluded.length === 0) {
    return {
      answerKind: 'irrelevant',
      answerKey: 'levels.rag.answers.wrong',
      feedbackTitleKey: 'levels.rag.feedback.missedTitle',
      feedbackKey: 'levels.rag.feedback.missedMessage',
      success: false,
    }
  }

  if (tooNoisy) {
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
