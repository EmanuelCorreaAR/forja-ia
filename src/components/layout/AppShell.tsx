import { Link, useLocation } from 'react-router-dom'
import { ForgeMark } from '@/components/ui/ForgeMark'
import { t } from '@/i18n'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="app-shell">
      {!isHome ? (
        <header className="topbar">
          <Link to="/" className="brand-link" aria-label={t('brand.name')}>
            <ForgeMark className="brand-mark" />
            <span className="brand-text">
              <span className="brand-name">{t('brand.name')}</span>
              <span className="brand-tag">{t('brand.tagline')}</span>
            </span>
          </Link>
          <Link to="/" className="btn btn--ghost">
            {t('nav.home')}
          </Link>
        </header>
      ) : null}
      <main>{children}</main>
    </div>
  )
}
