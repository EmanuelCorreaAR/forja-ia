import type { EmbeddingDocument, EmbeddingQuery } from '@/domain/levels/embeddings/types'

/**
 * Desayuno + intruso léxico.
 * El tramposo habla de “desayuno” pero es mueble, no comida.
 */
export const EMBEDDING_DOCUMENTS: EmbeddingDocument[] = [
  {
    id: 'doc-a',
    label: 'A',
    text: 'Mesa de desayuno de roble con cajones y bancos a juego',
    position: { x: 0.48, y: 0.52 },
    cluster: 'near_miss',
    trap: true,
  },
  {
    id: 'doc-b',
    label: 'B',
    text: 'Receta: tostadas francesas esponjosas con miel',
    position: { x: 0.18, y: 0.84 },
    cluster: 'target',
  },
  {
    id: 'doc-c',
    label: 'C',
    text: 'Cómo calibrar un telescopio newtoniano',
    position: { x: 0.88, y: 0.18 },
    cluster: 'far',
  },
  {
    id: 'doc-d',
    label: 'D',
    text: 'Batido de avena y banana listo en 3 minutos',
    position: { x: 0.26, y: 0.78 },
    cluster: 'target',
  },
  {
    id: 'doc-e',
    label: 'E',
    text: 'Historia del café en las montañas de Colombia',
    position: { x: 0.55, y: 0.48 },
    cluster: 'near_miss',
  },
  {
    id: 'doc-f',
    label: 'F',
    text: 'Huevos revueltos cremosos para la mañana',
    position: { x: 0.22, y: 0.72 },
    cluster: 'target',
  },
  {
    id: 'doc-g',
    label: 'G',
    text: 'Manual de instalación de paneles solares',
    position: { x: 0.8, y: 0.28 },
    cluster: 'far',
  },
  {
    id: 'doc-h',
    label: 'H',
    text: 'Catálogo de vajilla: platos y tazas para la mesa del desayuno',
    position: { x: 0.58, y: 0.42 },
    cluster: 'near_miss',
  },
]

export const EMBEDDING_QUERY: EmbeddingQuery = {
  id: 'query-breakfast',
  text: 'Necesito ideas de comida rica para el desayuno.',
  position: { x: 0.2, y: 0.8 },
}

/** Exactamente los top-K más cercanos a la query (por distancia 2D) */
export const EMBEDDING_TOP_K = 3

export const EMBEDDING_TARGET_DOC_IDS = ['doc-b', 'doc-d', 'doc-f'] as const

export const EMBEDDING_TRAP_DOC_ID = 'doc-a'
