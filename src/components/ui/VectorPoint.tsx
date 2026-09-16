type VectorPointProps = {
  x: number
  y: number
  label: string
  kind?: 'doc' | 'query'
  selected?: boolean
  near?: boolean
  onClick?: () => void
  disabled?: boolean
}

export function VectorPoint({
  x,
  y,
  label,
  kind = 'doc',
  selected,
  near,
  onClick,
  disabled,
}: VectorPointProps) {
  const className = [
    'vector-point',
    kind === 'query' ? 'is-query' : '',
    selected ? 'is-selected' : '',
    near ? 'is-near' : 'is-far',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={className}
      style={{ left: `${x * 100}%`, top: `${(1 - y) * 100}%` }}
      onClick={onClick}
      disabled={disabled || kind === 'query'}
      aria-label={label}
      aria-pressed={selected}
      title={label}
    >
      <span className="vector-point__dot" />
      <span className="vector-point__label">{label}</span>
    </button>
  )
}
