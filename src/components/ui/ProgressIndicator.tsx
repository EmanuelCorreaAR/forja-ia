type ProgressIndicatorProps = {
  done: number
  total: number
  label: string
}

export function ProgressIndicator({ done, total, label }: ProgressIndicatorProps) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return (
    <div className="progress-indicator" aria-label={label}>
      <span>{label}</span>
      <div className="progress-bar" aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
