type DocumentProps = {
  title: string
  body?: string
  selected?: boolean
  onClick?: () => void
  meta?: React.ReactNode
}

export function DocumentCard({
  title,
  body,
  selected,
  onClick,
  meta,
}: DocumentProps) {
  if (onClick) {
    return (
      <button
        type="button"
        className={`doc-item ${selected ? 'is-selected' : ''}`}
        onClick={onClick}
        aria-pressed={selected}
      >
        <strong>{title}</strong>
        {body ? <span className="muted">{body}</span> : null}
        {meta}
      </button>
    )
  }

  return (
    <div className={`doc-item ${selected ? 'is-selected' : ''}`}>
      <strong>{title}</strong>
      {body ? <span className="muted">{body}</span> : null}
      {meta}
    </div>
  )
}
