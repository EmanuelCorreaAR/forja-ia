export type TokenOption = {
  id: string
  text: string
  /** Logit base fijo — las probs se derivan con temperatura */
  logit: number
  probability?: number
}

export type LlmStep = {
  id: string
  context: string
  options: TokenOption[]
  correctOptionId: string
}

export type LlmMode = 'predict' | 'chaos'

export type LlmPhase = 'guess' | 'reveal'

export type LlmChallengeState = {
  mode: LlmMode
  stepIndex: number
  chosenTokens: string[]
  lastChoiceId: string | null
  lastCorrect: boolean | null
  phase: LlmPhase
  attempts: number
  streak: number
  bestStreak: number
  score: number
  cleanStep: boolean
  temperature: number
  chaosScore: number
  chaosPicks: string[]
  chaosRoundIndex: number
  predictCompleted: boolean
  completed: boolean
  startedAt: number
}

export type LlmAction =
  | { type: 'SELECT_TOKEN'; optionId: string }
  | { type: 'CONTINUE' }
  | { type: 'SET_TEMPERATURE'; temperature: number }
  | { type: 'ENTER_CHAOS' }
  | { type: 'FINISH_CHAOS' }
  | { type: 'FINISH_PREDICT' }
  | { type: 'RESET' }
