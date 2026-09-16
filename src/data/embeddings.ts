import type { EmbeddingDocument, EmbeddingQuery } from '@/domain/levels/embeddings/types'

/**
 * Proyección 2D pedagógica — coords fijas.
 * Incluye near-misses para que no se resuelva solo leyendo “chocolate”.
 */
export const EMBEDDING_DOCUMENTS: EmbeddingDocument[] = [
  {
    id: 'doc-a',
    label: 'A',
    text: 'Reseña: la mejor barra de chocolate belga del supermercado',
    position: { x: 0.42, y: 0.62 },
    cluster: 'near_miss',
  },
  {
    id: 'doc-b',
    label: 'B',
    text: 'Cómo hornear una torta de chocolate esponjosa',
    position: { x: 0.24, y: 0.76 },
    cluster: 'target',
  },
  {
    id: 'doc-c',
    label: 'C',
    text: 'Guía de mantenimiento de frenos de bicicleta',
    position: { x: 0.84, y: 0.22 },
    cluster: 'far',
  },
  {
    id: 'doc-d',
    label: 'D',
    text: 'Ideas de velas y decoración para tortas de cumpleaños',
    position: { x: 0.48, y: 0.55 },
    cluster: 'near_miss',
  },
  {
    id: 'doc-e',
    label: 'E',
    text: 'Receta paso a paso: bizcochuelo de chocolate',
    position: { x: 0.31, y: 0.69 },
    cluster: 'target',
  },
  {
    id: 'doc-f',
    label: 'F',
    text: 'Historia del cacao en Mesoamérica',
    position: { x: 0.58, y: 0.48 },
    cluster: 'near_miss',
  },
  {
    id: 'doc-g',
    label: 'G',
    text: 'Cómo reparar una rueda pinchada',
    position: { x: 0.78, y: 0.28 },
    cluster: 'far',
  },
]

export const EMBEDDING_QUERY: EmbeddingQuery = {
  id: 'query-cake',
  text: 'Necesito instrucciones para preparar un postre de chocolate esponjoso.',
  position: { x: 0.25, y: 0.75 },
}

/** Exactamente los top-K más cercanos a la query (por distancia 2D) */
export const EMBEDDING_TOP_K = 2

export const EMBEDDING_TARGET_DOC_IDS = ['doc-b', 'doc-e'] as const
