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

export type LlmChallengeState = {
  stepIndex: number
  chosenTokens: string[]
  lastChoiceId: string | null
  lastCorrect: boolean | null
  attempts: number
  startedAt: number
  completed: boolean
}

export type LlmAction =
  | { type: 'SELECT_TOKEN'; optionId: string }
  | { type: 'RESET' }
