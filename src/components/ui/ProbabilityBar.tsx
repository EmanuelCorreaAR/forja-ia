type ProbabilityBarProps = {
  value: number
  label?: string
}

export function ProbabilityBar({ value, label }: ProbabilityBarProps) {
  const pct = Math.round(value * 100)
  return (
    <div className="probability-bar" aria-label={label ?? `Probabilidad ${pct}%`}>
      <div className="probability-bar__track">
        <div className="probability-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="probability-bar__label">{label ?? `${pct}%`}</div>
    </div>
  )
}
