import type { LlmStep } from '@/domain/levels/llm/types'

/**
 * Rondas jugables: el contexto mueve las probs.
 * logits fijos → temperatura redistribuye de forma determinista.
 */
export const LLM_ROUNDS: LlmStep[] = [
  {
    id: 'fridge-dog',
    context: 'El perro abrió la heladera y encontró un',
    options: [
      { id: 'queso', text: 'queso', logit: 2.4 },
      { id: 'ovni', text: 'ovni', logit: 0.4 },
      { id: 'volcan', text: 'volcán', logit: 0.1 },
      { id: 'dinosaurio', text: 'dinosaurio', logit: 0.6 },
    ],
    correctOptionId: 'queso',
  },
  {
    id: 'fridge-astronaut',
    context: 'El astronauta abrió la heladera y encontró un',
    options: [
      { id: 'queso', text: 'queso', logit: 0.8 },
      { id: 'ovni', text: 'ovni', logit: 0.5 },
      { id: 'tubo', text: 'tubo de oxígeno', logit: 2.2 },
      { id: 'dinosaurio', text: 'dinosaurio', logit: 0.3 },
    ],
    correctOptionId: 'tubo',
  },
  {
    id: 'fridge-pirate',
    context: 'El pirata abrió la heladera y encontró un',
    options: [
      { id: 'mapa', text: 'mapa del tesoro', logit: 2.1 },
      { id: 'queso', text: 'queso', logit: 0.9 },
      { id: 'laptop', text: 'laptop', logit: 0.2 },
      { id: 'yogur', text: 'yogur', logit: 0.7 },
    ],
    correctOptionId: 'mapa',
  },
  {
    id: 'fridge-hacker',
    context: 'El hacker abrió la heladera y encontró un',
    options: [
      { id: 'pendrive', text: 'pendrive', logit: 2.0 },
      { id: 'queso', text: 'queso', logit: 0.6 },
      { id: 'firewall', text: 'firewall', logit: 1.1 },
      { id: 'lechuga', text: 'lechuga', logit: 0.4 },
    ],
    correctOptionId: 'pendrive',
  },
]

/** Tokens válidos en CHAOS (absurdo pero aún “jugable”) */
export const LLM_CHAOS_OPTIONS = [
  { id: 'queso', text: 'queso', logit: 1.2, absurdity: 0.2 },
  { id: 'ovni', text: 'ovni', logit: 0.8, absurdity: 0.85 },
  { id: 'dinosaurio', text: 'dinosaurio', logit: 0.7, absurdity: 0.9 },
  { id: 'volcan', text: 'volcán', logit: 0.5, absurdity: 0.95 },
  { id: 'meem', text: 'meme', logit: 0.9, absurdity: 0.75 },
  { id: 'portal', text: 'portal', logit: 0.6, absurdity: 0.88 },
] as const

export const LLM_CHAOS_CONTEXT =
  'La IA abrió la heladera de la realidad y encontró un'
