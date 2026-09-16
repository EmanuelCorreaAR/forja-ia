import { useEffect, useReducer, useRef } from 'react'
import { LLM_STEPS, LLM_TARGET_SEQUENCE } from '@/data/llm'
import {
  createInitialLlmState,
  evaluateLlm,
  getCurrentStep,
  reduceLlmState,
} from '@/domain/levels/llm/evaluate'
import { useProgress } from '@/context/ProgressContext'
import { LevelLayout } from '@/components/layout/LevelLayout'
import { ChallengePanel } from '@/components/ui/ChallengePanel'
import { FeedbackPanel } from '@/components/ui/FeedbackPanel'
import { ProbabilityBar } from '@/components/ui/ProbabilityBar'
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
  const evaluation = evaluateLlm(state)
  const revealing = state.phase === 'reveal' && !state.completed
  const isLastReveal =
    revealing &&
    state.lastCorrect === true &&
    state.stepIndex >= LLM_STEPS.length - 1

  let displayText = ''
  if (state.completed) {
    displayText = LLM_TARGET_SEQUENCE
  } else if (revealing && state.lastCorrect && step) {
    displayText = `${step.context} ${state.chosenTokens[state.chosenTokens.length - 1] ?? ''}`.trim()
  } else {
    displayText = step?.context ?? ''
  }

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
      kicker={t('levels.llm.title')}
      title={t('levels.llm.subtitle')}
      objective={t('levels.llm.objective')}
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
      </div>

      <ChallengePanel>
        <div className="panel stack">
          <h2>{t('levels.llm.contextLabel')}</h2>
          <div className="context-box" aria-live="polite">
            {displayText}
            {!state.completed && !(revealing && state.lastCorrect) ? (
              <>
                {' '}
                <span
                  className="token-slot"
                  aria-label={t('levels.llm.nextTokenSlot')}
                >
                  {t('levels.llm.nextTokenSlot')}
                </span>
              </>
            ) : null}
          </div>

          {!state.completed && step ? (
            <>
              <h3>{t('levels.llm.optionsLabel')}</h3>
              <p className="note">
                {revealing
                  ? t('levels.llm.revealHint')
                  : t('levels.llm.pickHint')}
              </p>
              <div className="stack">
                {step.options.map((option) => {
                  const selected = state.lastChoiceId === option.id
                  const isTop = option.id === step.correctOptionId
                  return (
                    <div
                      key={option.id}
                      className={`row token-row ${revealing && isTop ? 'token-row--top' : ''}`}
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
                        disabled={revealing && state.lastCorrect === true}
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
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => dispatch({ type: 'CONTINUE' })}
                >
                  {state.lastCorrect === false
                    ? t('levels.llm.retry')
                    : isLastReveal
                      ? t('levels.llm.finish')
                      : t('levels.llm.continue')}
                </button>
              ) : null}
            </>
          ) : null}
        </div>

        <div className="panel stack">
          <FeedbackPanel
            title={t(evaluation.titleKey, evaluation.messageParams)}
            message={t(evaluation.messageKey, evaluation.messageParams)}
            tone={tone}
          />

          {state.completed ? (
            <SuccessState
              title={t('common.explanation')}
              explanation={t('levels.llm.explanation')}
            />
          ) : null}
        </div>
      </ChallengePanel>
    </LevelLayout>
  )
}
