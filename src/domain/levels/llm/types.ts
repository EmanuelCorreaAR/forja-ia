export type TokenOption = {
  id: string
  text: string
  probability: number
}

export type LlmStep = {
  id: string
  context: string
  options: TokenOption[]
  correctOptionId: string
}

export type LlmPhase = 'guess' | 'reveal'

export type LlmChallengeState = {
  stepIndex: number
  chosenTokens: string[]
  lastChoiceId: string | null
  lastCorrect: boolean | null
  phase: LlmPhase
  /** Solo suma cuando falla un intento a ciegas */
  attempts: number
  streak: number
  bestStreak: number
  score: number
  cleanStep: boolean
  startedAt: number
  completed: boolean
}

export type LlmAction =
  | { type: 'SELECT_TOKEN'; optionId: string }
  | { type: 'CONTINUE' }
  | { type: 'RESET' }
