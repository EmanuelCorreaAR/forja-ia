import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import {
  RAG_CHUNK_SIZE_OPTIONS,
  RAG_DOCUMENTS,
  RAG_QUESTION,
  RAG_TOP_K_OPTIONS,
} from '@/data/rag'
import {
  createInitialRagState,
  evaluateRag,
  reduceRagState,
} from '@/domain/levels/rag/evaluate'
import type { ChunkSize, TopK } from '@/domain/levels/rag/types'
import {
  buildChallengeCode,
  formatShareText,
} from '@/domain/shareScore'
import { useProgress } from '@/context/ProgressContext'
import { LevelLayout } from '@/components/layout/LevelLayout'
import { ChallengePanel } from '@/components/ui/ChallengePanel'
import { Chunk } from '@/components/ui/Chunk'
import { FeedbackPanel } from '@/components/ui/FeedbackPanel'
import { ParameterControl } from '@/components/ui/ParameterControl'
import { Connection, PipelineNode } from '@/components/ui/PipelineNode'
import { MissionPanel } from '@/components/ui/MissionPanel'
import { ShareCard } from '@/components/ui/ShareCard'
import { SuccessState } from '@/components/ui/SuccessState'
import { t } from '@/i18n'

export function Level3RAGPage() {
  const { completeLevel } = useProgress()
  const startedAtRef = useRef<number | null>(null)
  const unlockedRef = useRef(false)
  const [docsOpen, setDocsOpen] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const [state, dispatch] = useReducer(reduceRagState, undefined, () =>
    createInitialRagState(0),
  )

  useEffect(() => {
    if (startedAtRef.current == null) {
      startedAtRef.current = performance.now()
    }
  }, [])

  useEffect(() => {
    if (state.mode !== 'nightmare' || state.completed || state.timedOut) return
    if (state.deadlineAt == null) return
    const id = window.setInterval(() => {
      const tick = Date.now()
      setNow(tick)
      if (tick >= state.deadlineAt!) {
        dispatch({ type: 'TIMEOUT' })
      }
    }, 250)
    return () => window.clearInterval(id)
  }, [
    state.mode,
    state.deadlineAt,
    state.completed,
    state.timedOut,
  ])

  useEffect(() => {
    if (!state.repairCompleted || unlockedRef.current) return
    unlockedRef.current = true
    completeLevel('rag', {
      attempts: state.attempts,
      elapsedMs: Math.round(
        performance.now() - (startedAtRef.current ?? performance.now()),
      ),
      score: Math.max(100 - state.attempts * 10, 35),
    })
  }, [state.repairCompleted, state.attempts, completeLevel])

  const evaluation = evaluateRag(state)
  const run = state.lastRun
  const included = run?.retrieved.filter((r) => r.included) ?? []
  const tone =
    evaluation.status === 'success'
      ? 'success'
      : evaluation.status === 'failed'
        ? 'error'
        : 'hint'
  const score = state.completed
    ? Math.max(100 - state.attempts * 10, 35)
    : 0

  const remainingMs =
    state.mode === 'nightmare' && state.deadlineAt != null
      ? Math.max(0, state.deadlineAt - now)
      : null

  const elapsedMs = Math.round(
    performance.now() - (startedAtRef.current ?? performance.now()),
  )

  const share = useMemo(() => {
    if (!state.completed) return null
    const tokens =
      (state.lastRun?.contextChunkIds.length ?? 0) * state.config.chunkSize
    const challengeCode = buildChallengeCode('rag', {
      score,
      attempts: state.attempts,
      tokens,
      mode: state.mode,
      time: elapsedMs,
    })
    const metrics = [
      { label: t('common.attempts'), value: String(state.attempts) },
      {
        label: t('share.time'),
        value: `${(elapsedMs / 1000).toFixed(1)}s`,
      },
      { label: t('levels.rag.tokensLabel'), value: String(tokens) },
    ]
    const shareText = formatShareText({
      levelLabel: t('levels.rag.subtitle'),
      challengeCode,
      score,
      lines: [
        `Modo: ${state.mode}`,
        `Intentos: ${state.attempts}`,
        `Tokens contexto: ${tokens}`,
        `Tiempo: ${(elapsedMs / 1000).toFixed(1)}s`,
      ],
    })
    return { challengeCode, metrics, shareText, score }
  }, [
    state.completed,
    state.attempts,
    state.lastRun,
    state.config.chunkSize,
    state.mode,
    score,
    elapsedMs,
  ])

  const locked = state.completed || state.timedOut

  return (
    <LevelLayout
      kicker={t('levels.rag.title')}
      title={t('levels.rag.subtitle')}
      attempts={state.attempts}
      onReset={() => {
        startedAtRef.current = performance.now()
        unlockedRef.current = false
        dispatch({ type: 'RESET' })
      }}
    >
      <div className="row" style={{ marginBottom: '0.75rem' }}>
        <span className="badge badge--ok">
          {t('levels.rag.scoreLabel')}: {score}
        </span>
        {state.mode === 'nightmare' ? (
          <span className={`badge ${state.timedOut ? 'badge--warn' : ''}`}>
            {t('levels.rag.nightmareBadge')}
            {remainingMs != null
              ? ` · ${Math.ceil(remainingMs / 1000)}s`
              : ''}
          </span>
        ) : (
          <span className="badge">{t('levels.rag.repairBadge')}</span>
        )}
      </div>

      <MissionPanel
        mission={
          state.mode === 'nightmare'
            ? t('levels.rag.nightmareMission')
            : t('levels.rag.mission')
        }
      />

      <ChallengePanel>
        <div className="stack">
          <div className="panel stack">
            <h2>{t('levels.rag.questionLabel')}</h2>
            <div className="context-box">{RAG_QUESTION}</div>
            {run && !run.success ? (
              <div className="bot-fail">
                <p className="note" style={{ margin: 0 }}>
                  {t('levels.rag.botBrokenLabel')}
                </p>
                <div className="context-box context-box--fail">
                  {t(run.answerKey)}
                </div>
              </div>
            ) : null}
          </div>

          <div className="panel stack docs-panel">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0 }}>{t('levels.rag.docsLabel')}</h2>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setDocsOpen((v) => !v)}
                aria-expanded={docsOpen}
              >
                {docsOpen
                  ? t('levels.rag.docsToggleHide')
                  : t('levels.rag.docsToggleShow')}
              </button>
            </div>
            <p className="note">{t('levels.rag.docsHint')}</p>
            <div
              className={`docs-panel__body ${docsOpen ? 'is-open' : ''}`}
              aria-hidden={!docsOpen}
            >
              {docsOpen ? (
                <ul className="doc-list">
                  {RAG_DOCUMENTS.map((doc) => (
                    <li key={doc.id}>
                      <strong>{doc.title}</strong>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          <div className="panel stack">
            <h2>{t('levels.rag.paramsLabel')}</h2>

            <ParameterControl
              id="chunk-size"
              label={t('levels.rag.chunkSize')}
              valueLabel={t(
                `levels.rag.chunkSizeOptions.${state.config.chunkSize}`,
              )}
            >
              <select
                id="chunk-size"
                value={state.config.chunkSize}
                disabled={locked}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_CHUNK_SIZE',
                    chunkSize: Number(e.target.value) as ChunkSize,
                  })
                }
              >
                {RAG_CHUNK_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {t(`levels.rag.chunkSizeOptions.${size}`)}
                  </option>
                ))}
              </select>
            </ParameterControl>
            <p className="note">{t('levels.rag.chunkSizeHelp')}</p>

            <ParameterControl
              id="top-k"
              label={t('levels.rag.topK')}
              valueLabel={String(state.config.topK)}
            >
              <select
                id="top-k"
                value={state.config.topK}
                disabled={locked}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_TOP_K',
                    topK: Number(e.target.value) as TopK,
                  })
                }
              >
                {RAG_TOP_K_OPTIONS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </ParameterControl>
            <p className="note">{t('levels.rag.topKHelp')}</p>

            <ParameterControl
              id="threshold"
              label={t('levels.rag.threshold')}
              valueLabel={state.config.threshold.toFixed(2)}
            >
              <div className="row" style={{ width: '100%' }}>
                <span className="note">{t('levels.rag.thresholdLow')}</span>
                <input
                  id="threshold"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={state.config.threshold}
                  disabled={locked}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_THRESHOLD',
                      threshold: Number(e.target.value),
                    })
                  }
                  style={{ flex: 1 }}
                />
                <span className="note">{t('levels.rag.thresholdHigh')}</span>
              </div>
            </ParameterControl>
            <p className="note">{t('levels.rag.thresholdHelp')}</p>

            <button
              type="button"
              className="btn btn--primary"
              disabled={locked}
              onClick={() => dispatch({ type: 'RUN' })}
            >
              {t('levels.rag.runCta')}
            </button>
          </div>
        </div>

        <div className="stack">
          <div className="panel">
            <h2>{t('levels.rag.storyLabel')}</h2>
            <div className="pipeline pipeline--compact">
              <PipelineNode label={t('levels.rag.pipeline.documents')} active />
              <Connection />
              <PipelineNode
                label={t('levels.rag.pipeline.chunking')}
                active
                detail={String(state.config.chunkSize)}
              />
              <Connection />
              <PipelineNode
                label={t('levels.rag.pipeline.vectorSearch')}
                active={Boolean(run)}
                detail={`${state.config.topK} · ${state.config.threshold.toFixed(2)}`}
              />
              <Connection />
              <PipelineNode
                label={t('levels.rag.pipeline.retrievedContext')}
                active={Boolean(included.length)}
                detail={run ? `${included.length}` : '0'}
              />
              <Connection />
              <PipelineNode
                label={t('levels.rag.pipeline.answer')}
                active={Boolean(run)}
              />
            </div>
          </div>

          {run ? (
            <div className="panel stack">
              <h2>{t('levels.rag.contextLabel')}</h2>
              {included.length === 0 ? (
                <p className="muted">{t('levels.rag.answers.empty')}</p>
              ) : (
                included.map(({ chunk }) => (
                  <Chunk
                    key={chunk.id}
                    id={chunk.id}
                    text={chunk.text}
                    similarity={chunk.similarity}
                    included
                  />
                ))
              )}

              {run.retrieved.some(
                (r) => !r.included && r.reason !== 'not_ranked',
              ) ? (
                <details>
                  <summary className="note">
                    {t('levels.rag.retrievedLabel')}
                  </summary>
                  <div className="stack" style={{ marginTop: '0.5rem' }}>
                    {run.retrieved
                      .filter((r) => r.reason !== 'not_ranked')
                      .map(({ chunk, included: on }) => (
                        <Chunk
                          key={`all-${chunk.id}`}
                          id={chunk.id}
                          text={chunk.text}
                          similarity={chunk.similarity}
                          included={on}
                        />
                      ))}
                  </div>
                </details>
              ) : null}
            </div>
          ) : null}

          {run && run.success ? (
            <div className="panel stack">
              <h2>{t('levels.rag.answerLabel')}</h2>
              <div className="context-box">{t(run.answerKey)}</div>
            </div>
          ) : null}

          <FeedbackPanel
            title={t(evaluation.titleKey)}
            message={t(evaluation.messageKey)}
            tone={tone}
          />

          {state.completed && share ? (
            <>
              <ShareCard
                challengeCode={share.challengeCode}
                score={share.score}
                metrics={share.metrics}
                shareText={share.shareText}
              />
              {state.mode === 'repair' && !state.nightmareCompleted ? (
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() =>
                    dispatch({ type: 'ENTER_NIGHTMARE', now: Date.now() })
                  }
                >
                  {t('levels.rag.enterNightmare')}
                </button>
              ) : null}
              <SuccessState
                title={t('common.explanation')}
                explanation={
                  state.mode === 'nightmare'
                    ? t('levels.rag.nightmareExplanation')
                    : t('levels.rag.explanation')
                }
              />
            </>
          ) : null}

          {state.timedOut ? (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() =>
                dispatch({ type: 'ENTER_NIGHTMARE', now: Date.now() })
              }
            >
              {t('levels.rag.retryNightmare')}
            </button>
          ) : null}
        </div>
      </ChallengePanel>
    </LevelLayout>
  )
}
