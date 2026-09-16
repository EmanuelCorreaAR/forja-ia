import { t } from '@/i18n'

type SimilarityScoreProps = {
  value: number
  digits?: number
}

export function SimilarityScore({ value, digits = 2 }: SimilarityScoreProps) {
  const label = t('common.similarity')
  return (
    <span
      className="similarity-score"
      aria-label={`${label} ${value.toFixed(digits)}`}
    >
      {label} {value.toFixed(digits)}
    </span>
  )
}
