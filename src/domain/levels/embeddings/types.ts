export type Vec2 = { x: number; y: number }

export type EmbeddingDocument = {
  id: string
  text: string
  /** Etiqueta corta en el mapa (A, B, C…) */
  label: string
  position: Vec2
  cluster: 'target' | 'near_miss' | 'far'
}

export type EmbeddingQuery = {
  id: string
  text: string
  position: Vec2
}

export type EmbeddingsPhase = 'guess' | 'reveal'

export type EmbeddingsChallengeState = {
  selectedDocIds: string[]
  phase: EmbeddingsPhase
  attempts: number
  score: number
  startedAt: number
  completed: boolean
  lastEvaluationPassed: boolean | null
}

export type EmbeddingsAction =
  | { type: 'TOGGLE_DOC'; docId: string }
  | { type: 'SUBMIT' }
  | { type: 'RETRY' }
  | { type: 'RESET' }
