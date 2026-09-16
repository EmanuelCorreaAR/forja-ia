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

export type ChaosOption = {
  id: string
  text: string
  logit: number
  absurdity: number
}

export type ChaosRound = {
  id: string
  context: string
  options: ChaosOption[]
}

/** Mini-arco CHAOS: cada pasada cambia el contexto (no es el mismo loop). */
export const LLM_CHAOS_ROUNDS: ChaosRound[] = [
  {
    id: 'chaos-reality-fridge',
    context: 'La IA abrió la heladera de la realidad y encontró un',
    options: [
      { id: 'queso', text: 'queso', logit: 1.4, absurdity: 0.15 },
      { id: 'ovni', text: 'ovni', logit: 0.7, absurdity: 0.85 },
      { id: 'portal', text: 'portal', logit: 0.9, absurdity: 0.88 },
      { id: 'volcan', text: 'volcán', logit: 0.4, absurdity: 0.95 },
    ],
  },
  {
    id: 'chaos-ceo-prompt',
    context: 'El CEO le pidió a la IA “sé creativa” y ella respondió con un',
    options: [
      { id: 'meme', text: 'meme', logit: 1.3, absurdity: 0.7 },
      { id: 'dinosaurio', text: 'dinosaurio', logit: 0.5, absurdity: 0.92 },
      { id: 'powerpoint', text: 'PowerPoint', logit: 1.6, absurdity: 0.25 },
      { id: 'agujero', text: 'agujero negro', logit: 0.6, absurdity: 0.9 },
    ],
  },
  {
    id: 'chaos-autocomplete',
    context: 'El autocompletado del universo escribió: “mañana voy a',
    options: [
      { id: 'trabajar', text: 'trabajar”', logit: 1.8, absurdity: 0.1 },
      { id: 'implosionar', text: 'implosionar”', logit: 0.55, absurdity: 0.93 },
      { id: 'bailar', text: 'bailar con un ovni”', logit: 0.7, absurdity: 0.86 },
      { id: 'debuggear', text: 'debuggear el clima”', logit: 0.85, absurdity: 0.8 },
    ],
  },
  {
    id: 'chaos-final-boss',
    context: 'Antes del credits, el modelo susurró el token prohibido:',
    options: [
      { id: 'fin', text: 'FIN', logit: 1.5, absurdity: 0.2 },
      { id: '42', text: '42', logit: 1.0, absurdity: 0.75 },
      { id: 'glitch', text: 'glitch', logit: 0.8, absurdity: 0.88 },
      { id: 'queso-final', text: 'queso cósmico', logit: 0.45, absurdity: 0.97 },
    ],
  },
]

/** @deprecated use LLM_CHAOS_ROUNDS — kept for any leftover imports */
export const LLM_CHAOS_OPTIONS = LLM_CHAOS_ROUNDS[0]!.options

export const LLM_CHAOS_CONTEXT = LLM_CHAOS_ROUNDS[0]!.context
