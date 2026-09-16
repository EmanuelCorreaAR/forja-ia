import { Link } from 'react-router-dom'
import { t } from '@/i18n'

type LevelLayoutProps = {
  kicker: string
  title: string
  objective: string
  attempts: number
  onReset: () => void
  children: React.ReactNode
}

export function LevelLayout({
  kicker,
  title,
  objective,
  attempts,
  onReset,
  children,
}: LevelLayoutProps) {
  return (
    <div className="level-layout">
      <div className="level-header">
        <div>
          <p className="level-kicker">{kicker}</p>
          <h1>{title}</h1>
          <p className="muted" style={{ margin: '0.5rem 0 0', maxWidth: '40rem' }}>
            <strong>{t('common.objective')}: </strong>
            {objective}
          </p>
        </div>
        <div className="row">
          <span className="badge" aria-live="polite">
            {t('common.attempts')}: {attempts}
          </span>
          <button type="button" className="btn btn--ghost" onClick={onReset}>
            {t('common.reset')}
          </button>
          <Link to="/" className="btn btn--ghost">
            {t('nav.backHome')}
          </Link>
        </div>
      </div>
      {children}
    </div>
  )
}
