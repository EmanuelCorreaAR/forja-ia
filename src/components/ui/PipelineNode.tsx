type PipelineNodeProps = {
  label: string
  active?: boolean
  detail?: string
}

export function PipelineNode({ label, active, detail }: PipelineNodeProps) {
  return (
    <div className={`pipeline-node ${active ? 'is-active' : ''}`}>
      <span>{label}</span>
      {detail ? <span className="muted">{detail}</span> : null}
    </div>
  )
}

export function Connection() {
  return (
    <div className="connection" aria-hidden="true">
      ↓
    </div>
  )
}
