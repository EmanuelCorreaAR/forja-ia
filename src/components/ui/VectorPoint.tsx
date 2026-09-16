type VectorPointProps = {
  x: number
  y: number
  label?: string
  kind?: 'doc' | 'query'
  selected?: boolean
  near?: boolean
  trap?: boolean
  anonymous?: boolean
  onClick?: () => void
  disabled?: boolean
}

export function VectorPoint({
  x,
  y,
  label = '',
  kind = 'doc',
  selected,
  near,
  trap,
  anonymous,
  onClick,
  disabled,
}: VectorPointProps) {
  const className = [
    'vector-point',
    kind === 'query' ? 'is-query' : '',
    selected ? 'is-selected' : '',
    anonymous ? 'is-anonymous' : '',
    near ? 'is-near' : 'is-far',
    trap ? 'is-trap' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const accessibleName =
    kind === 'query'
      ? label || 'query'
      : anonymous
        ? 'documento sin etiquetar'
        : label

  return (
    <button
      type="button"
      className={className}
      style={{ left: `${x * 100}%`, top: `${(1 - y) * 100}%` }}
      onClick={onClick}
      disabled={disabled || kind === 'query'}
      aria-label={accessibleName}
      aria-pressed={kind === 'query' ? undefined : selected}
      title={anonymous ? undefined : label || undefined}
    >
      <span className="vector-point__dot" aria-hidden="true" />
      {!anonymous && label ? (
        <span className="vector-point__label" aria-hidden="true">
          {label}
        </span>
      ) : null}
    </button>
  )
}
