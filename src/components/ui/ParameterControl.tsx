type ParameterControlProps = {
  id: string
  label: React.ReactNode
  valueLabel?: string
  children: React.ReactNode
}

export function ParameterControl({
  id,
  label,
  valueLabel,
  children,
}: ParameterControlProps) {
  return (
    <div className="parameter-control">
      <label htmlFor={id}>
        {label}
        {valueLabel ? ` · ${valueLabel}` : ''}
      </label>
      {children}
    </div>
  )
}
