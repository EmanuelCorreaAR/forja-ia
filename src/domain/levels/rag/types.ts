export type RagChunk = {
  id: string
  sourceDocId: string
  text: string
  /** Precomputed similarity to the fixed query — deterministic */
  similarity: number
  relevant: boolean
}

export type RagDocument = {
  id: string
  title: string
  body: string
}

export type ChunkSize = 50 | 100 | 200 | 400
export type TopK = 1 | 2 | 3 | 5

export type RagConfig = {
  chunkSize: ChunkSize
  topK: TopK
  threshold: number
}

export type RagChallengeState = {
  config: RagConfig
  attempts: number
  startedAt: number
  completed: boolean
  lastRun: RagRunResult | null
}

export type RetrievedChunk = {
  chunk: RagChunk
  included: boolean
  reason: 'top_k' | 'below_threshold' | 'not_ranked'
}

export type RagAnswerKind = 'correct' | 'incomplete' | 'irrelevant' | 'empty'

export type RagRunResult = {
  retrieved: RetrievedChunk[]
  contextChunkIds: string[]
  answerKind: RagAnswerKind
  answerKey: string
  feedbackKey: string
  feedbackTitleKey: string
  success: boolean
}

export type RagAction =
  | { type: 'SET_CHUNK_SIZE'; chunkSize: ChunkSize }
  | { type: 'SET_TOP_K'; topK: TopK }
  | { type: 'SET_THRESHOLD'; threshold: number }
  | { type: 'RUN' }
  | { type: 'RESET' }
