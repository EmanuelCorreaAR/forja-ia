import { SimilarityScore } from './SimilarityScore'

type ChunkProps = {
  id: string
  text: string
  similarity: number
  included: boolean
}

export function Chunk({ id, text, similarity, included }: ChunkProps) {
  return (
    <div
      className={`chunk-item ${included ? 'is-included' : 'is-excluded'}`}
      aria-label={`${id} ${included ? 'incluido' : 'excluido'}`}
    >
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <strong className="mono">{id}</strong>
        <span className="mono" aria-hidden="true">
          {included ? '✓' : '✗'}
        </span>
      </div>
      <span className="muted">{text}</span>
      <SimilarityScore value={similarity} />
    </div>
  )
}
