/** Shared challenge domain types — UI-agnostic */

export type ChallengeId = 'llm' | 'embeddings' | 'rag'

export type LevelStatus = 'locked' | 'available' | 'completed'

export type EvaluationStatus = 'incomplete' | 'failed' | 'success'

export type FeedbackTone = 'neutral' | 'error' | 'success' | 'hint'

export type EvaluationResult = {
  status: EvaluationStatus
  titleKey: string
  messageKey: string
  messageParams?: Record<string, string | number>
  metrics?: ChallengeMetrics
}

export type ChallengeMetrics = {
  attempts: number
  elapsedMs: number
  score?: number
  tokensUsed?: number
  simulatedCost?: number
  configSnapshot?: Record<string, unknown>
}

export type LevelMeta = {
  id: ChallengeId | string
  order: number
  titleKey: string
  subtitleKey: string
  descriptionKey: string
  route: string
  implemented: boolean
}

export type ProgressState = {
  unlocked: string[]
  completed: string[]
  bestResults: Record<
    string,
    {
      attempts: number
      elapsedMs: number
      score?: number
      completedAt: string
    }
  >
  version: number
}
