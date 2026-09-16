import type { LlmStep } from '@/domain/levels/llm/types'

/** Deterministic next-token steps — no randomness */
export const LLM_STEPS: LlmStep[] = [
  {
    id: 'step-1',
    context: 'The cat is sitting on the',
    options: [
      { id: 'mat', text: 'mat', probability: 0.62 },
      { id: 'roof', text: 'roof', probability: 0.18 },
      { id: 'table', text: 'table', probability: 0.14 },
      { id: 'moon', text: 'moon', probability: 0.06 },
    ],
    correctOptionId: 'mat',
  },
  {
    id: 'step-2',
    context: 'The cat is sitting on the mat',
    options: [
      { id: 'because', text: 'because', probability: 0.41 },
      { id: 'period', text: '.', probability: 0.33 },
      { id: 'and', text: 'and', probability: 0.17 },
      { id: 'flying', text: 'flying', probability: 0.09 },
    ],
    correctOptionId: 'because',
  },
  {
    id: 'step-3',
    context: 'The cat is sitting on the mat because',
    options: [
      { id: 'it', text: 'it', probability: 0.55 },
      { id: 'quantum', text: 'quantum', probability: 0.08 },
      { id: 'pizza', text: 'pizza', probability: 0.12 },
      { id: 'the', text: 'the', probability: 0.25 },
    ],
    correctOptionId: 'it',
  },
  {
    id: 'step-4',
    context: 'The cat is sitting on the mat because it',
    options: [
      { id: 'is', text: 'is', probability: 0.48 },
      { id: 'exploded', text: 'exploded', probability: 0.05 },
      { id: 'wrote', text: 'wrote', probability: 0.11 },
      { id: 'was', text: 'was', probability: 0.36 },
    ],
    correctOptionId: 'is',
  },
  {
    id: 'step-5',
    context: 'The cat is sitting on the mat because it is',
    options: [
      { id: 'warm', text: 'warm', probability: 0.44 },
      { id: 'a', text: 'a', probability: 0.28 },
      { id: 'debugging', text: 'debugging', probability: 0.09 },
      { id: 'invisible', text: 'invisible', probability: 0.19 },
    ],
    correctOptionId: 'warm',
  },
]

export const LLM_TARGET_SEQUENCE =
  'The cat is sitting on the mat because it is warm'

export const LLM_OBJECTIVE_KEY = 'levels.llm.objective'
