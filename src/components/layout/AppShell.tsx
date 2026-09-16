import { Link } from 'react-router-dom'
import { t } from '@/i18n'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand-link" aria-label={t('brand.name')}>
          <img className="brand-mark" src="/forge.svg" alt="" />
          <span>
            <span className="brand-name">{t('brand.name')}</span>
            <span className="brand-tag">{t('brand.tagline')}</span>
          </span>
        </Link>
        <Link to="/" className="btn btn--ghost">
          {t('nav.home')}
        </Link>
      </header>
      <main>{children}</main>
    </div>
  )
}
