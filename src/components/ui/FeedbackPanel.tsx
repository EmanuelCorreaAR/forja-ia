import type { FeedbackTone } from '@/domain/types'

type FeedbackPanelProps = {
  title: string
  message: string
  tone?: FeedbackTone
}

export function FeedbackPanel({
  title,
  message,
  tone = 'neutral',
}: FeedbackPanelProps) {
  return (
    <div
      className={`feedback-panel feedback-panel--${tone === 'neutral' ? 'hint' : tone}`}
      role="status"
      aria-live="polite"
    >
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  )
}
