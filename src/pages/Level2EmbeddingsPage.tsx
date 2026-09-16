import { useEffect, useReducer, useRef } from 'react'
import {
  EMBEDDING_DOCUMENTS,
  EMBEDDING_QUERY,
  EMBEDDING_TOP_K,
} from '@/data/embeddings'
import {
  createInitialEmbeddingsState,
  evaluateEmbeddings,
  getPlayOrderScores,
  getTargetDocIds,
  reduceEmbeddingsState,
} from '@/domain/levels/embeddings/evaluate'
import { useProgress } from '@/context/ProgressContext'
import { LevelLayout } from '@/components/layout/LevelLayout'
import { ChallengePanel } from '@/components/ui/ChallengePanel'
import { DocumentCard } from '@/components/ui/Document'
import { FeedbackPanel } from '@/components/ui/FeedbackPanel'
import { SimilarityScore } from '@/components/ui/SimilarityScore'
import { SuccessState } from '@/components/ui/SuccessState'
import { VectorPoint } from '@/components/ui/VectorPoint'
import { t } from '@/i18n'

export function Level2EmbeddingsPage() {
  const { completeLevel } = useProgress()
  const startedAtRef = useRef<number | null>(null)
  const [state, dispatch] = useReducer(reduceEmbeddingsState, undefined, () =>
    createInitialEmbeddingsState(0),
  )
  const scores = getPlayOrderScores()
  const targets = new Set(getTargetDocIds())
  const revealing = state.phase === 'reveal'

  useEffect(() => {
    if (startedAtRef.current == null) {
      startedAtRef.current = performance.now()
    }
  }, [])

  useEffect(() => {
    if (!state.completed) return
    const evaluation = evaluateEmbeddings(state)
    completeLevel('embeddings', {
      attempts: state.attempts,
      elapsedMs: Math.round(
        performance.now() - (startedAtRef.current ?? performance.now()),
      ),
      score: evaluation.metrics?.score,
    })
  }, [state.completed, state.attempts, completeLevel, state])

  const evaluation = evaluateEmbeddings(state)
  const tone =
    evaluation.status === 'success'
      ? 'success'
      : evaluation.status === 'failed'
        ? 'error'
        : 'hint'

  return (
    <LevelLayout
      kicker={t('levels.embeddings.title')}
      title={t('levels.embeddings.subtitle')}
      objective={t('levels.embeddings.objective', { topK: EMBEDDING_TOP_K })}
      attempts={state.attempts}
      onReset={() => {
        startedAtRef.current = performance.now()
        dispatch({ type: 'RESET' })
      }}
    >
      <p className="note" style={{ marginTop: 0 }}>
        {t('common.simplification')}
      </p>

      <div className="row" style={{ marginBottom: '0.75rem' }}>
        <span className="badge badge--ok">
          {t('levels.embeddings.scoreLabel')}: {state.score}
        </span>
        <span className="badge">
          {t('levels.embeddings.selectedLabel')}: {state.selectedDocIds.length}/
          {EMBEDDING_TOP_K}
        </span>
      </div>

      <ChallengePanel>
        <div className="panel stack">
          <div>
            <h2>{t('levels.embeddings.queryLabel')}</h2>
            <div className="context-box">{EMBEDDING_QUERY.text}</div>
          </div>

          <h2>{t('levels.embeddings.mapLabel')}</h2>
          {revealing ? (
            <div
              className="vector-map map-reveal"
              role="img"
              aria-label={t('levels.embeddings.mapLabel')}
            >
              <VectorPoint
                x={EMBEDDING_QUERY.position.x}
                y={EMBEDDING_QUERY.position.y}
                label={t('levels.embeddings.queryLabel')}
                kind="query"
              />
              {EMBEDDING_DOCUMENTS.map((doc) => {
                const selected = state.selectedDocIds.includes(doc.id)
                const isTarget = targets.has(doc.id)
                return (
                  <VectorPoint
                    key={doc.id}
                    x={doc.position.x}
                    y={doc.position.y}
                    label={doc.label}
                    selected={selected}
                    near={isTarget}
                    disabled
                  />
                )
              })}
            </div>
          ) : (
            <div className="map-placeholder" role="status">
              <p className="mono muted" style={{ margin: 0 }}>
                {t('levels.embeddings.mapHidden')}
              </p>
            </div>
          )}
        </div>

        <div className="panel stack">
          <h2>{t('levels.embeddings.docsLabel')}</h2>
          <p className="note">
            {revealing
              ? t('levels.embeddings.revealHint')
              : t('levels.embeddings.pickHint')}
          </p>

          {scores.map(({ doc, similarity }) => {
            const selected = state.selectedDocIds.includes(doc.id)
            const isTarget = targets.has(doc.id)
            return (
              <DocumentCard
                key={doc.id}
                title={`${doc.label}. ${doc.text}`}
                selected={selected}
                onClick={
                  state.completed || revealing
                    ? undefined
                    : () => dispatch({ type: 'TOGGLE_DOC', docId: doc.id })
                }
                meta={
                  revealing ? (
                    <span className="row" style={{ gap: '0.5rem' }}>
                      <SimilarityScore value={similarity} digits={3} />
                      <span className="mono muted">
                        {isTarget ? t('levels.embeddings.topMark') : '·'}
                      </span>
                    </span>
                  ) : (
                    <span className="mono muted">??</span>
                  )
                }
              />
            )
          })}

          <div className="row">
            {!revealing ? (
              <button
                type="button"
                className="btn btn--primary"
                disabled={
                  state.completed ||
                  state.selectedDocIds.length !== EMBEDDING_TOP_K
                }
                onClick={() => dispatch({ type: 'SUBMIT' })}
              >
                {state.selectedDocIds.length !== EMBEDDING_TOP_K
                  ? t('levels.embeddings.needExact', { topK: EMBEDDING_TOP_K })
                  : t('common.submit')}
              </button>
            ) : !state.completed ? (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => dispatch({ type: 'RETRY' })}
              >
                {t('levels.embeddings.retry')}
              </button>
            ) : null}
          </div>

          <FeedbackPanel
            title={t(evaluation.titleKey, evaluation.messageParams)}
            message={t(evaluation.messageKey, evaluation.messageParams)}
            tone={tone}
          />

          {state.completed ? (
            <SuccessState
              title={t('common.explanation')}
              explanation={t('levels.embeddings.explanation')}
            />
          ) : null}
        </div>
      </ChallengePanel>
    </LevelLayout>
  )
}
