type ResultMetricsProps = {
  metrics: { label: string; value: string }[]
}

export function ResultMetrics({ metrics }: ResultMetricsProps) {
  return (
    <ul className="result-metrics">
      {metrics.map((metric) => (
        <li key={metric.label}>
          <span>{metric.label}</span>
          <strong className="mono">{metric.value}</strong>
        </li>
      ))}
    </ul>
  )
}
