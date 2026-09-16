import { useEffect, useReducer, useRef } from 'react'
import { LLM_TARGET_SEQUENCE } from '@/data/llm'
import {
  createInitialLlmState,
  evaluateLlm,
  getBuiltSequence,
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
    const elapsedMs = Math.round(
      performance.now() - (startedAtRef.current ?? performance.now()),
    )
    completeLevel('llm', {
      attempts: state.attempts,
      elapsedMs,
      score: evaluation.metrics?.score,
    })
  }, [state.completed, state.attempts, completeLevel, state])

  const step = getCurrentStep(state)
  const evaluation = evaluateLlm(state)
  const sequence = state.completed
    ? LLM_TARGET_SEQUENCE
    : getBuiltSequence(state)

  const tone =
    evaluation.status === 'success'
      ? 'success'
      : evaluation.status === 'failed'
        ? 'error'
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
      <ChallengePanel>
        <div className="panel stack">
          <h2>{t('levels.llm.contextLabel')}</h2>
          <div className="context-box" aria-live="polite">
            {step?.context ?? sequence}
          </div>

          {!state.completed && step ? (
            <>
              <h3>{t('levels.llm.optionsLabel')}</h3>
              <p className="note">{t('levels.llm.pickHint')}</p>
              <div className="stack">
                {step.options.map((option) => {
                  const selected = state.lastChoiceId === option.id
                  return (
                    <div key={option.id} className="row">
                      <Token
                        text={option.text}
                        selected={selected}
                        correct={selected ? state.lastCorrect : null}
                        onClick={() =>
                          dispatch({ type: 'SELECT_TOKEN', optionId: option.id })
                        }
                      />
                      <ProbabilityBar value={option.probability} />
                    </div>
                  )
                })}
              </div>
            </>
          ) : null}

          <div>
            <h3>{t('levels.llm.sequenceLabel')}</h3>
            <p className="mono">{sequence}</p>
          </div>
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
