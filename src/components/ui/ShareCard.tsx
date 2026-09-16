import { useState } from 'react'
import { t } from '@/i18n'

type ShareCardProps = {
  title?: string
  challengeCode: string
  score: number
  metrics: { label: string; value: string }[]
  shareText: string
}

export function ShareCard({
  title,
  challengeCode,
  score,
  metrics,
  shareText,
}: ShareCardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="share-card panel stack" role="region" aria-label={t('share.title')}>
      <h3 style={{ margin: 0 }}>{title ?? t('share.title')}</h3>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="badge badge--ok">
          {t('share.score')}: {score}
        </span>
        <span className="badge mono">{challengeCode}</span>
      </div>
      <ul className="share-metrics">
        {metrics.map((metric) => (
          <li key={metric.label}>
            <span>{metric.label}</span>
            <strong className="mono">{metric.value}</strong>
          </li>
        ))}
      </ul>
      <p className="note" style={{ margin: 0 }}>
        {t('share.cta')}
      </p>
      <button type="button" className="btn btn--primary" onClick={handleCopy}>
        {copied ? t('share.copied') : t('share.copy')}
      </button>
    </div>
  )
}
