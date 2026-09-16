import { t } from '@/i18n'

type MissionPanelProps = {
  mission: string
}

export function MissionPanel({ mission }: MissionPanelProps) {
  return (
    <div className="panel stack mission-panel">
      <h2 style={{ margin: 0 }}>{t('common.missionLabel')}</h2>
      <p className="muted" style={{ margin: 0 }}>
        {mission}
      </p>
    </div>
  )
}
