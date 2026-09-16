import type { LlmStep } from '@/domain/levels/llm/types'

/** Pasos deterministas — la opción correcta no siempre es la primera */
export const LLM_STEPS: LlmStep[] = [
  {
    id: 'step-1',
    context: 'El gato está sentado sobre la',
    options: [
      { id: 'techo', text: 'techo', probability: 0.18 },
      { id: 'alfombra', text: 'alfombra', probability: 0.62 },
      { id: 'luna', text: 'luna', probability: 0.06 },
      { id: 'mesa', text: 'mesa', probability: 0.14 },
    ],
    correctOptionId: 'alfombra',
  },
  {
    id: 'step-2',
    context: 'El gato está sentado sobre la alfombra',
    options: [
      { id: 'volando', text: 'volando', probability: 0.09 },
      { id: 'period', text: '.', probability: 0.33 },
      { id: 'porque', text: 'porque', probability: 0.41 },
      { id: 'y', text: 'y', probability: 0.17 },
    ],
    correctOptionId: 'porque',
  },
  {
    id: 'step-3',
    context: 'El gato está sentado sobre la alfombra porque',
    options: [
      { id: 'pizza', text: 'pizza', probability: 0.12 },
      { id: 'el', text: 'el', probability: 0.25 },
      { id: 'quantum', text: 'quantum', probability: 0.08 },
      { id: 'esta', text: 'está', probability: 0.55 },
    ],
    correctOptionId: 'esta',
  },
  {
    id: 'step-4',
    context: 'El gato está sentado sobre la alfombra porque está',
    options: [
      { id: 'era', text: 'era', probability: 0.36 },
      { id: 'explotado', text: 'explotado', probability: 0.05 },
      { id: 'muy', text: 'muy', probability: 0.48 },
      { id: 'escribio', text: 'escribió', probability: 0.11 },
    ],
    correctOptionId: 'muy',
  },
  {
    id: 'step-5',
    context: 'El gato está sentado sobre la alfombra porque está muy',
    options: [
      { id: 'invisible', text: 'invisible', probability: 0.19 },
      { id: 'caliente', text: 'caliente', probability: 0.44 },
      { id: 'un', text: 'un', probability: 0.28 },
      { id: 'debuggeando', text: 'debuggeando', probability: 0.09 },
    ],
    correctOptionId: 'caliente',
  },
]

export const LLM_TARGET_SEQUENCE =
  'El gato está sentado sobre la alfombra porque está muy caliente'

export const LLM_OBJECTIVE_KEY = 'levels.llm.objective'
