import { Link } from 'react-router-dom'
import { Term } from '@/components/ui/Term'
import { t } from '@/i18n'

type LevelCardProps = {
  title: string
  subtitle: string
  description: string
  status: 'locked' | 'available' | 'completed'
  to: string
  order: number
  /** Glossary id for the category label */
  termId: string
}

const STATUS_LABEL: Record<LevelCardProps['status'], string> = {
  locked: 'home.locked',
  available: 'home.availableStatus',
  completed: 'home.completed',
}

export function LevelCard({
  title,
  subtitle,
  description,
  status,
  to,
  order,
  termId,
}: LevelCardProps) {
  const locked = status === 'locked'
  const content = (
    <>
      <div className="level-card__meta">
        <span>#{String(order).padStart(2, '0')}</span>
        <span
          className={`badge ${status === 'completed' ? 'badge--ok' : locked ? 'badge--locked' : ''}`}
        >
          {status === 'completed' ? '✓ ' : ''}
          {t(STATUS_LABEL[status])}
        </span>
      </div>
      <h3 className="level-card__title">{subtitle}</h3>
      <p className="level-card__desc">{description}</p>
      <span className="mono muted">
        <Term id={termId} label={title} variant="static" />
      </span>
    </>
  )

  if (locked) {
    return (
      <div className="level-card is-locked" aria-disabled="true">
        {content}
      </div>
    )
  }

  return (
    <Link
      to={to}
      className={`level-card ${status === 'completed' ? 'is-completed' : ''}`}
    >
      {content}
    </Link>
  )
}
