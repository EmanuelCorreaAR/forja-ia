import { useEffect, useMemo, useReducer, useRef } from 'react'
import { LLM_CHAOS_CONTEXT } from '@/data/llm'
import {
  createInitialLlmState,
  evaluateLlm,
  getActiveOptions,
  getCurrentChaosRound,
  getCurrentStep,
  isLastChaosRound,
  reduceLlmState,
} from '@/domain/levels/llm/evaluate'
import {
  buildChallengeCode,
  formatShareText,
} from '@/domain/shareScore'
import { useProgress } from '@/context/ProgressContext'
import { LevelLayout } from '@/components/layout/LevelLayout'
import { ChallengePanel } from '@/components/ui/ChallengePanel'
import { FeedbackPanel } from '@/components/ui/FeedbackPanel'
import { MissionPanel } from '@/components/ui/MissionPanel'
import { ParameterControl } from '@/components/ui/ParameterControl'
import { ProbabilityBar } from '@/components/ui/ProbabilityBar'
import { ShareCard } from '@/components/ui/ShareCard'
import { SuccessState } from '@/components/ui/SuccessState'
import { Token } from '@/components/ui/Token'
import { t } from '@/i18n'

export function Level1LLMPage() {
  const { completeLevel } = useProgress()
  const startedAtRef = useRef<number | null>(null)
  const [state, dispatch] = useReducer(reduceLlmState, undefined, () =>
    createInitialLlmState(0),
  )

  useEffect(() => {
    if (startedAtRef.current == null) {
      startedAtRef.current = performance.now()
    }
  }, [])

  useEffect(() => {
    if (!state.completed) return
    const evaluation = evaluateLlm(state)
    completeLevel('llm', {
      attempts: state.attempts,
      elapsedMs: Math.round(
        performance.now() - (startedAtRef.current ?? performance.now()),
      ),
      score: evaluation.metrics?.score,
    })
  }, [state.completed, state.attempts, completeLevel, state])

  const step = getCurrentStep(state)
  const chaosRound = getCurrentChaosRound(state)
  const options = getActiveOptions(state)
  const evaluation = evaluateLlm(state)
  const revealing = state.phase === 'reveal' && !state.completed
  const showTemp =
    state.predictCompleted || state.mode === 'chaos' || state.stepIndex >= 2
  const lastChaos = state.mode === 'chaos' && isLastChaosRound(state)

  const contextText =
    state.mode === 'chaos'
      ? (chaosRound?.context ?? LLM_CHAOS_CONTEXT)
      : (step?.context ?? '')

  const elapsedMs = Math.round(
    performance.now() - (startedAtRef.current ?? performance.now()),
  )

  const share = useMemo(() => {
    if (!state.completed) return null
    const challengeCode = buildChallengeCode('llm', {
      score: state.score,
      attempts: state.attempts,
      streak: state.bestStreak,
      chaos: state.chaosScore,
      temp: state.temperature,
    })
    const metrics = [
      { label: t('common.attempts'), value: String(state.attempts) },
      { label: t('levels.llm.streakLabel'), value: String(state.bestStreak) },
      {
        label: t('levels.llm.chaosScoreLabel'),
        value: String(state.chaosScore),
      },
      {
        label: t('levels.llm.tempLabel'),
        value: state.temperature.toFixed(1),
      },
    ]
    const shareText = formatShareText({
      levelLabel: t('levels.llm.subtitle'),
      challengeCode,
      score: state.score,
      lines: metrics.map((metric) => `${metric.label}: ${metric.value}`),
    })
    return { challengeCode, metrics, shareText, score: state.score }
  }, [state])

  const tone =
    evaluation.status === 'success'
      ? 'success'
      : evaluation.status === 'failed'
        ? 'error'
        : revealing && state.lastCorrect
          ? 'success'
          : 'hint'

  return (
    <LevelLayout
      kicker={t('levels.llm.levelLabel')}
      title={t('levels.llm.subtitle')}
      attempts={state.attempts}
      onReset={() => {
        startedAtRef.current = performance.now()
        dispatch({ type: 'RESET' })
      }}
    >
      <div className="row" style={{ marginBottom: '0.75rem' }}>
        <span className="badge badge--ok">
          {t('levels.llm.scoreLabel')}: {state.score}
        </span>
        <span className="badge">
          {t('levels.llm.streakLabel')}: {state.streak}
        </span>
        {state.mode === 'chaos' ? (
          <span className="badge">
            {t('levels.llm.chaosScoreLabel')}: {state.chaosScore}
          </span>
        ) : null}
      </div>

      <MissionPanel
        mission={
          state.mode === 'chaos'
            ? t('levels.llm.chaosMission')
            : t('levels.llm.mission')
        }
      />

      <ChallengePanel>
        <div className="panel stack">
          <h2>{t('levels.llm.contextLabel')}</h2>
          <div className="context-box" aria-live="polite">
            {contextText}{' '}
            {!state.completed ? (
              <span className="token-slot">{t('levels.llm.nextTokenSlot')}</span>
            ) : null}
          </div>

          {showTemp ? (
            <div className="stack" style={{ gap: '0.35rem' }}>
              <ParameterControl
                id="temperature"
                label={t('levels.llm.tempLabel')}
                valueLabel={state.temperature.toFixed(1)}
              >
                <div className="row" style={{ width: '100%' }}>
                  <span className="note">{t('levels.llm.tempLow')}</span>
                  <input
                    id="temperature"
                    type="range"
                    min={0.1}
                    max={1}
                    step={0.1}
                    value={state.temperature}
                    disabled={state.completed}
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_TEMPERATURE',
                        temperature: Number(e.target.value),
                      })
                    }
                    style={{ flex: 1 }}
                  />
                  <span className="note">{t('levels.llm.tempHigh')}</span>
                </div>
              </ParameterControl>
              <p className="note" style={{ margin: 0 }}>
                {revealing || state.mode === 'chaos'
                  ? t('levels.llm.tempHelp')
                  : t('levels.llm.tempHelpBlind')}
              </p>
            </div>
          ) : null}

          {!state.completed &&
          !(state.predictCompleted && state.mode === 'predict') ? (
            <>
              <div className="section-heading">
                <h3>{t('levels.llm.optionsLabel')}</h3>
                <p className="note">
                  {revealing
                    ? showTemp
                      ? t('levels.llm.revealHint')
                      : t('levels.llm.revealHintEarly')
                    : t('levels.llm.pickHint')}
                </p>
              </div>
              <div className="stack">
                {options.map((option) => {
                  const selected = state.lastChoiceId === option.id
                  const isTop =
                    revealing &&
                    option.id ===
                      [...options].sort(
                        (a, b) => b.probability - a.probability,
                      )[0]?.id
                  return (
                    <div
                      key={option.id}
                      className={`row token-row ${isTop ? 'token-row--top' : ''}`}
                    >
                      <Token
                        text={option.text}
                        selected={selected}
                        correct={
                          revealing
                            ? selected
                              ? state.lastCorrect
                              : isTop
                                ? true
                                : null
                            : null
                        }
                        disabled={revealing}
                        onClick={() =>
                          dispatch({
                            type: 'SELECT_TOKEN',
                            optionId: option.id,
                          })
                        }
                      />
                      {revealing ? (
                        <ProbabilityBar
                          value={option.probability}
                          label={`${Math.round(option.probability * 100)}%`}
                        />
                      ) : (
                        <span className="mono muted token-hidden-prob">??%</span>
                      )}
                    </div>
                  )
                })}
              </div>

              {revealing ? (
                <div className="row">
                  {state.mode === 'chaos' && lastChaos ? null : (
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => dispatch({ type: 'CONTINUE' })}
                    >
                      {state.lastCorrect === false
                        ? t('levels.llm.retry')
                        : state.mode === 'chaos'
                          ? t('levels.llm.chaosNext')
                          : t('levels.llm.continue')}
                    </button>
                  )}
                  {state.mode === 'chaos' ? (
                    <button
                      type="button"
                      className={`btn ${lastChaos ? 'btn--primary' : ''}`}
                      onClick={() => dispatch({ type: 'FINISH_CHAOS' })}
                    >
                      {t('levels.llm.finishChaos')}
                    </button>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : null}

          {state.predictCompleted && state.mode === 'predict' && !state.completed ? (
            <div className="row">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => dispatch({ type: 'ENTER_CHAOS' })}
              >
                {t('levels.llm.enterChaos')}
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => dispatch({ type: 'FINISH_PREDICT' })}
              >
                {t('levels.llm.skipChaos')}
              </button>
            </div>
          ) : null}

          {state.mode === 'chaos' && !state.completed && !revealing ? (
            <button
              type="button"
              className="btn"
              onClick={() => dispatch({ type: 'FINISH_CHAOS' })}
            >
              {t('levels.llm.finishChaos')}
            </button>
          ) : null}
        </div>

        <div className="panel stack">
          <FeedbackPanel
            title={t(evaluation.titleKey, evaluation.messageParams)}
            message={t(evaluation.messageKey, evaluation.messageParams)}
            tone={tone}
          />

          {state.completed && share ? (
            <>
              <SuccessState
                title={t('common.explanation')}
                explanation={t('levels.llm.explanation')}
              />
              <ShareCard
                challengeCode={share.challengeCode}
                score={share.score}
                metrics={[
                  ...share.metrics,
                  {
                    label: t('share.time'),
                    value: `${(elapsedMs / 1000).toFixed(1)}s`,
                  },
                ]}
                shareText={share.shareText}
              />
            </>
          ) : null}
        </div>
      </ChallengePanel>
    </LevelLayout>
  )
}
