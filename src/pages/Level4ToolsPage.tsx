import { useEffect, useMemo, useReducer, useRef } from 'react'
import {
  NIGHTMARE_CATALOG,
  NIGHTMARE_USER_MESSAGE_KEY,
  TOOLS_MISSIONS,
  getToolDef,
} from '@/data/tools'
import {
  computeToolsScore,
  createInitialToolsState,
  evaluateTools,
  getCurrentMission,
  percent,
  reduceToolsState,
} from '@/domain/levels/tools/evaluate'
import type { ToolId } from '@/domain/levels/tools/types'
import { useProgress } from '@/context/ProgressContext'
import { LevelLayout } from '@/components/layout/LevelLayout'
import { ArcTrail } from '@/components/ui/ArcTrail'
import { FeedbackPanel } from '@/components/ui/FeedbackPanel'
import { MissionPanel } from '@/components/ui/MissionPanel'
import { ResultMetrics } from '@/components/ui/ResultMetrics'
import { SuccessState } from '@/components/ui/SuccessState'
import { Term } from '@/components/ui/Term'
import { t } from '@/i18n'

export function Level4ToolsPage() {
  const { completeLevel } = useProgress()
  const startedAtRef = useRef<number | null>(null)
  const unlockedRef = useRef(false)
  const [state, dispatch] = useReducer(reduceToolsState, undefined, () =>
    createInitialToolsState(0),
  )

  useEffect(() => {
    if (startedAtRef.current == null) {
      startedAtRef.current = performance.now()
    }
  }, [])

  useEffect(() => {
    if (!state.actCompleted || unlockedRef.current) return
    unlockedRef.current = true
    const elapsedMs = Math.round(
      performance.now() - (startedAtRef.current ?? performance.now()),
    )
    completeLevel('tools', {
      attempts: state.attempts,
      elapsedMs,
      score: computeToolsScore(state.metrics, state.attempts, elapsedMs),
    })
  }, [state.actCompleted, state.attempts, state.metrics, completeLevel])

  const mission = getCurrentMission(state)
  const evaluation = evaluateTools(state)
  const elapsedMs = Math.round(
    performance.now() - (startedAtRef.current ?? performance.now()),
  )
  const score = computeToolsScore(state.metrics, state.attempts, elapsedMs)

  const catalogIds: ToolId[] =
    state.mode === 'nightmare'
      ? NIGHTMARE_CATALOG
      : (mission?.catalog ?? [])

  const tone =
    evaluation.status === 'success'
      ? 'success'
      : evaluation.status === 'failed'
        ? 'error'
        : 'hint'

  const resultMetrics = useMemo(() => {
    if (!state.actCompleted) return null
    return [
      {
        label: t('levels.tools.metrics.score'),
        value: String(score),
      },
      {
        label: t('levels.tools.metrics.toolSelection'),
        value: `${percent(state.metrics.toolSelectionHits, state.metrics.toolSelectionTotal)}%`,
      },
      {
        label: t('levels.tools.metrics.argumentAccuracy'),
        value: `${percent(state.metrics.argumentHits, state.metrics.argumentTotal)}%`,
      },
      {
        label: t('levels.tools.metrics.unnecessaryCalls'),
        value: String(state.metrics.unnecessaryCalls),
      },
      {
        label: t('levels.tools.metrics.precision'),
        value: `${percent(state.metrics.precisionHits, state.metrics.precisionTotal)}%`,
      },
      {
        label: t('levels.tools.metrics.attempts'),
        value: String(state.attempts),
      },
      {
        label: t('levels.tools.metrics.time'),
        value: `${(elapsedMs / 1000).toFixed(1)}s`,
      },
    ]
  }, [state, score, elapsedMs])

  const userMessage =
    state.mode === 'nightmare'
      ? t(NIGHTMARE_USER_MESSAGE_KEY)
      : mission
        ? t(mission.userMessageKey)
        : ''

  const showActComplete =
    state.actCompleted && state.mode === 'act' && state.completed
  const showNightmareComplete =
    state.mode === 'nightmare' && state.nightmareCompleted

  return (
    <LevelLayout
      kicker={t('levels.tools.levelLabel')}
      title={t('levels.tools.subtitle')}
      attempts={state.attempts}
      onReset={() => {
        startedAtRef.current = performance.now()
        unlockedRef.current = false
        dispatch({ type: 'RESET' })
      }}
    >
      <p className="tools-hook">{t('levels.tools.hook')}</p>
      <ArcTrail />

      <div className="row" style={{ marginBottom: '0.5rem' }}>
        {state.mode === 'nightmare' ? (
          <span className="badge badge--warn">
            {t('levels.tools.nightmareBadge')}
          </span>
        ) : (
          <span className="badge">
            {t('levels.tools.missionProgress', {
              current: state.missionIndex + 1,
              total: TOOLS_MISSIONS.length,
            })}
          </span>
        )}
        <span className="badge">
          <Term id="precision" label={t('levels.tools.metrics.precision')} />:{' '}
          {state.metrics.precisionTotal === 0
            ? '—'
            : `${percent(
                state.metrics.precisionHits,
                state.metrics.precisionTotal,
              )}% (${state.metrics.precisionHits}/${state.metrics.precisionTotal})`}
        </span>
      </div>

      <MissionPanel
        mission={
          state.mode === 'nightmare'
            ? t('levels.tools.nightmareMission')
            : t('levels.tools.mission')
        }
      />

      <div className="tools-grid">
        <section className="panel stack">
          <h2 style={{ margin: 0 }}>{t('levels.tools.userLabel')}</h2>
          <p className="tools-user-msg">“{userMessage}”</p>

          <h3 style={{ margin: '0.5rem 0 0' }}>
            {t('levels.tools.catalogLabel')}
          </h3>
          <ul className="tools-catalog">
            {catalogIds.map((id) => {
              const def = getToolDef(id)
              const selected =
                state.mode === 'act' &&
                state.selected?.kind === 'tool' &&
                state.selected.toolId === id
              const nightmareSelected =
                state.mode === 'nightmare' &&
                state.nightmareDraft?.toolId === id
              const active = selected || nightmareSelected
              return (
                <li key={id}>
                  <button
                    type="button"
                    className={`tools-catalog__item ${active ? 'is-active' : ''}`}
                    disabled={
                      Boolean(state.lastRun?.precise) ||
                      showActComplete ||
                      showNightmareComplete
                    }
                    onClick={() => {
                      if (state.mode === 'nightmare') {
                        dispatch({ type: 'NIGHTMARE_SET_TOOL', toolId: id })
                      } else {
                        dispatch({ type: 'SELECT_TOOL', toolId: id })
                      }
                    }}
                  >
                    <span className="mono">{id}</span>
                    <span className="muted">{t(def.descriptionKey)}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <button
            type="button"
            className={`btn btn--ghost ${
              (state.mode === 'act' && state.selected?.kind === 'no_tool') ||
              (state.mode === 'nightmare' &&
                state.selected?.kind === 'no_tool' &&
                !state.nightmareDraft)
                ? 'is-active'
                : ''
            }`}
            disabled={
              Boolean(state.lastRun?.precise) ||
              showActComplete ||
              showNightmareComplete
            }
            onClick={() => {
              if (state.mode === 'nightmare') {
                dispatch({ type: 'NIGHTMARE_SET_NO_TOOL' })
              } else {
                dispatch({ type: 'SELECT_NO_TOOL' })
              }
            }}
          >
            <Term
              id="noTool"
              label={t('levels.tools.noTool')}
              variant="static"
            />
          </button>
        </section>

        <section className="panel stack tools-builder">
          <h2 style={{ margin: 0 }}>{t('levels.tools.builderLabel')}</h2>

          {state.mode === 'nightmare' && state.nightmareDraft ? (
            <div className="tools-call">
              <p className="tools-call__label">
                <Term id="toolCall" label={t('levels.tools.brokenCallLabel')} />
              </p>
              <pre className="tools-json">
                {JSON.stringify(
                  {
                    tool: state.nightmareDraft.toolId,
                    arguments: state.nightmareDraft.args,
                  },
                  null,
                  2,
                )}
              </pre>
              <p className="tools-call__label">
                <Term id="args" label={t('levels.tools.argsLabel')} />
              </p>
              <div className="tools-call__fields">
                {getToolDef(state.nightmareDraft.toolId).args.map((arg) => (
                  <label key={arg.name} className="tools-arg">
                    <span className="mono">
                      {arg.name}
                      <span className="muted"> : {arg.type}</span>
                    </span>
                    <input
                      className="input"
                      value={String(state.nightmareDraft?.args[arg.name] ?? '')}
                      disabled={Boolean(state.lastRun?.precise)}
                      onChange={(e) =>
                        dispatch({
                          type: 'NIGHTMARE_SET_ARG',
                          name: arg.name,
                          value: e.target.value,
                        })
                      }
                      placeholder={t(arg.descriptionKey)}
                    />
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          {state.mode === 'act' && state.selected?.kind === 'tool' ? (
            <div className="tools-call">
              <p className="mono tools-call__tool">{state.selected.toolId}</p>
              <p className="tools-call__label">
                <Term id="args" label={t('levels.tools.argsLabel')} />
              </p>
              <div className="tools-call__fields">
                {getToolDef(state.selected.toolId).args.map((arg) => (
                  <label key={arg.name} className="tools-arg">
                    <span className="mono">{arg.name}</span>
                    <input
                      className="input"
                      value={
                        state.selected?.kind === 'tool'
                          ? (state.selected.args[arg.name] ?? '')
                          : ''
                      }
                      disabled={Boolean(state.lastRun?.precise)}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_ARG',
                          name: arg.name,
                          value: e.target.value,
                        })
                      }
                      placeholder={
                        mission?.addressHint && arg.name === 'address'
                          ? mission.addressHint
                          : t(arg.descriptionKey)
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          {state.selected?.kind === 'no_tool' ? (
            <p className="mono">{t('levels.tools.noTool')}</p>
          ) : null}

          {!state.selected && state.mode === 'act' ? (
            <p className="muted" style={{ margin: 0 }}>
              {t('levels.tools.feedback.idleMessage')}
            </p>
          ) : null}

          <div className="row">
            <button
              type="button"
              className="btn btn--primary"
              disabled={
                showActComplete ||
                showNightmareComplete ||
                Boolean(state.lastRun?.precise) ||
                (state.mode === 'act' && !state.selected) ||
                (state.mode === 'nightmare' &&
                  !state.nightmareDraft &&
                  state.selected?.kind !== 'no_tool')
              }
              onClick={() => dispatch({ type: 'EXECUTE' })}
            >
              {t('levels.tools.execute')}
            </button>
            {state.lastRun && !state.lastRun.precise ? (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => dispatch({ type: 'RETRY' })}
              >
                {t('levels.tools.retry')}
              </button>
            ) : null}
            {state.mode === 'act' && state.lastRun?.precise && !state.actCompleted ? (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => dispatch({ type: 'NEXT_MISSION' })}
              >
                {state.missionIndex >= TOOLS_MISSIONS.length - 1
                  ? t('levels.tools.finishAct')
                  : t('levels.tools.nextMission')}
              </button>
            ) : null}
          </div>
        </section>
      </div>

      {state.lastRun ? (
        <section className="panel stack">
          <h2 style={{ margin: 0 }}>{t('levels.tools.resultLabel')}</h2>
          {state.lastRun.detailLines?.length ? (
            <pre className="tools-json">
              {state.lastRun.detailLines.join('\n')}
            </pre>
          ) : null}
          <FeedbackPanel
            title={t(evaluation.titleKey, evaluation.messageParams)}
            message={t(evaluation.messageKey, evaluation.messageParams)}
            tone={tone}
          />
        </section>
      ) : (
        <FeedbackPanel
          title={t(evaluation.titleKey)}
          message={t(evaluation.messageKey)}
          tone="hint"
        />
      )}

      {showActComplete && resultMetrics ? (
        <>
          <ResultMetrics metrics={resultMetrics} />
          {!state.nightmareCompleted ? (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => dispatch({ type: 'ENTER_NIGHTMARE' })}
            >
              {t('levels.tools.enterNightmare')}
            </button>
          ) : null}
          <SuccessState
            title={t('common.explanation')}
            explanation={t('levels.tools.explanation')}
          />
        </>
      ) : null}

      {showNightmareComplete && resultMetrics ? (
        <>
          <ResultMetrics metrics={resultMetrics} />
          <SuccessState
            title={t('common.explanation')}
            explanation={t('levels.tools.nightmareExplanation')}
          />
        </>
      ) : null}
    </LevelLayout>
  )
}
