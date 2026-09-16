import type { EmbeddingDocument, EmbeddingQuery } from '@/domain/levels/embeddings/types'

/** Pedagogical 2D projection — fixed coords for determinism */
export const EMBEDDING_DOCUMENTS: EmbeddingDocument[] = [
  {
    id: 'doc-cake-1',
    text: 'How to bake a chocolate cake',
    position: { x: 0.22, y: 0.78 },
    cluster: 'cake',
  },
  {
    id: 'doc-cake-2',
    text: 'Chocolate cake recipe',
    position: { x: 0.28, y: 0.72 },
    cluster: 'cake',
  },
  {
    id: 'doc-bike-1',
    text: 'How to repair a bicycle',
    position: { x: 0.78, y: 0.25 },
    cluster: 'bike',
  },
  {
    id: 'doc-bike-2',
    text: 'Bike maintenance guide',
    position: { x: 0.84, y: 0.32 },
    cluster: 'bike',
  },
  {
    id: 'doc-pizza-1',
    text: 'Best pizza recipes',
    position: { x: 0.55, y: 0.58 },
    cluster: 'pizza',
  },
]

export const EMBEDDING_QUERY: EmbeddingQuery = {
  id: 'query-cake',
  text: 'I want instructions for making chocolate cake.',
  position: { x: 0.25, y: 0.75 },
}

/** Player must select exactly these two nearest cake docs */
export const EMBEDDING_TARGET_DOC_IDS = ['doc-cake-1', 'doc-cake-2'] as const
