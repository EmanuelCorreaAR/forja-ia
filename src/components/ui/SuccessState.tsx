type SuccessStateProps = {
  title: string
  explanation: string
  children?: React.ReactNode
}

export function SuccessState({ title, explanation, children }: SuccessStateProps) {
  return (
    <div className="success-state" role="status">
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p className="muted" style={{ margin: 0 }}>
        {explanation}
      </p>
      {children}
    </div>
  )
}
