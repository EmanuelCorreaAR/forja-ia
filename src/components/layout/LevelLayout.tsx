import { Link } from 'react-router-dom'
import { t } from '@/i18n'

type LevelLayoutProps = {
  kicker: string
  title: string
  attempts: number
  onReset: () => void
  children: React.ReactNode
}

export function LevelLayout({
  kicker,
  title,
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
        </div>
        <div className="row">
          <span
            className="badge"
            aria-live="polite"
            title={t('common.attemptsHint')}
          >
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
