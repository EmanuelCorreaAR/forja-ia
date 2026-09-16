import { LEVELS } from '@/domain/progress'
import { useProgress } from '@/context/ProgressContext'
import { LevelCard } from '@/components/ui/LevelCard'
import { ProgressIndicator } from '@/components/ui/ProgressIndicator'
import { t } from '@/i18n'

export function HomePage() {
  const { progress, statusOf } = useProgress()
  const implemented = LEVELS.filter((l) => l.implemented)
  const upcoming = LEVELS.filter((l) => !l.implemented)
  const done = progress.completed.filter((id) =>
    implemented.some((l) => l.id === id),
  ).length

  return (
    <div>
      <section className="hero" aria-labelledby="hero-brand">
        <h1 id="hero-brand" className="hero-brand">
          {t('brand.name')}
        </h1>
        <p className="hero-tagline">{t('brand.tagline')}</p>
        <p className="hero-blurb">{t('brand.blurb')}</p>
      </section>

      <ProgressIndicator
        done={done}
        total={implemented.length}
        label={t('home.progressValue', { done, total: implemented.length })}
      />

      <section aria-labelledby="available-levels">
        <h2 id="available-levels" className="section-title">
          {t('home.available')}
        </h2>
        <div className="level-grid">
          {implemented.map((level) => {
            const status = statusOf(level.id)
            return (
              <LevelCard
                key={level.id}
                order={level.order}
                title={t(level.titleKey)}
                subtitle={t(level.subtitleKey)}
                description={t(level.descriptionKey)}
                status={status}
                to={level.route}
                cta={status === 'completed' ? t('home.completed') : t('home.start')}
              />
            )
          })}
        </div>
      </section>

      <section aria-labelledby="upcoming-levels" style={{ marginTop: '2rem' }}>
        <h2 id="upcoming-levels" className="section-title">
          {t('home.upcoming')}
        </h2>
        <div className="level-grid">
          {upcoming.map((level) => (
            <LevelCard
              key={level.id}
              order={level.order}
              title={t(level.titleKey)}
              subtitle={t(level.subtitleKey)}
              description={t(level.descriptionKey)}
              status="locked"
              to={level.route}
              cta={t('home.locked')}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
