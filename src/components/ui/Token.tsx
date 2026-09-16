type TokenProps = {
  text: string
  selected?: boolean
  correct?: boolean | null
  disabled?: boolean
  onClick?: () => void
  children?: React.ReactNode
}

export function Token({
  text,
  selected,
  correct,
  disabled,
  onClick,
  children,
}: TokenProps) {
  const stateClass =
    selected && correct === true
      ? 'is-correct'
      : selected && correct === false
        ? 'is-wrong'
        : ''

  return (
    <button
      type="button"
      className={`token ${stateClass}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
    >
      <span>{text}</span>
      {children}
    </button>
  )
}
