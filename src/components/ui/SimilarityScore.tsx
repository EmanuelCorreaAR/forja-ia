type SimilarityScoreProps = {
  value: number
  digits?: number
}

export function SimilarityScore({ value, digits = 2 }: SimilarityScoreProps) {
  return (
    <span className="similarity-score" aria-label={`Similarity ${value.toFixed(digits)}`}>
      similarity {value.toFixed(digits)}
    </span>
  )
}
