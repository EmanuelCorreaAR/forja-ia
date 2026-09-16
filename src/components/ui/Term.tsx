import { useId } from 'react'
import { t } from '@/i18n'

type TermProps = {
  /** Glossary id, e.g. "precision" → glossary.precision */
  id: string
  /** Override the visible text; defaults to the glossary term */
  label?: string
  /**
   * Static terms skip the focusable label, for use inside links,
   * labels and buttons where it would fight with the parent control.
   * The tooltip still opens on hover and when the parent gets focus.
   */
  variant?: 'interactive' | 'static'
  className?: string
}

export function Term({
  id,
  label,
  variant = 'interactive',
  className,
}: TermProps) {
  const tipId = useId()
  const text = label ?? t(`glossary.${id}.term`)
  const definition = t(`glossary.${id}.definition`)
  const interactive = variant === 'interactive'
  const classes = ['term', interactive ? null : 'term--static', className]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes}>
      <span
        className="term__label"
        tabIndex={interactive ? 0 : undefined}
        aria-describedby={tipId}
      >
        {text}
      </span>
      <span className="term__tip" role="tooltip" id={tipId}>
        {definition}
      </span>
    </span>
  )
}
