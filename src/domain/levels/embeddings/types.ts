export type Vec2 = { x: number; y: number }

export type EmbeddingDocument = {
  id: string
  text: string
  position: Vec2
  cluster: 'cake' | 'bike' | 'pizza' | 'other'
}

export type EmbeddingQuery = {
  id: string
  text: string
  position: Vec2
}

export type EmbeddingsChallengeState = {
  selectedDocIds: string[]
  attempts: number
  startedAt: number
  completed: boolean
  lastEvaluationPassed: boolean | null
}

export type EmbeddingsAction =
  | { type: 'TOGGLE_DOC'; docId: string }
  | { type: 'SUBMIT' }
  | { type: 'RESET' }
