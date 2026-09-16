type ForgeMarkProps = {
  className?: string
  title?: string
}

/** Marca: A / yunque + chispa — sin placa, se apoya en el fondo de la página */
export function ForgeMark({ className, title }: ForgeMarkProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="16 12 32 42"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M18 42 L32 14 L46 42"
        stroke="#3DDC97"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 42 H41"
        stroke="#F4A261"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <circle cx="32" cy="49" r="3.5" fill="#3DDC97" />
    </svg>
  )
}
