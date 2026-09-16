type ParameterControlProps = {
  id: string
  label: string
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
