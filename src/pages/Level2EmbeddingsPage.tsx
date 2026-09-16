import { useEffect, useReducer, useRef } from 'react'
import { EMBEDDING_DOCUMENTS, EMBEDDING_QUERY } from '@/data/embeddings'
import {
  createInitialEmbeddingsState,
  evaluateEmbeddings,
  getDocumentScores,
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
  const scores = getDocumentScores()

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
      objective={t('levels.embeddings.objective')}
      attempts={state.attempts}
      onReset={() => {
        startedAtRef.current = performance.now()
        dispatch({ type: 'RESET' })
      }}
    >
      <p className="note" style={{ marginTop: 0 }}>
        {t('common.simplification')}
      </p>

      <ChallengePanel>
        <div className="panel stack">
          <h2>{t('levels.embeddings.mapLabel')}</h2>
          <div className="vector-map" role="img" aria-label={t('levels.embeddings.mapLabel')}>
            <VectorPoint
              x={EMBEDDING_QUERY.position.x}
              y={EMBEDDING_QUERY.position.y}
              label="query"
              kind="query"
            />
            {EMBEDDING_DOCUMENTS.map((doc) => {
              const score = scores.find((s) => s.doc.id === doc.id)
              const near = (score?.similarity ?? 0) >= 0.85
              return (
                <VectorPoint
                  key={doc.id}
                  x={doc.position.x}
                  y={doc.position.y}
                  label={doc.id.replace('doc-', '')}
                  selected={state.selectedDocIds.includes(doc.id)}
                  near={near}
                  disabled={state.completed}
                  onClick={() => dispatch({ type: 'TOGGLE_DOC', docId: doc.id })}
                />
              )
            })}
          </div>

          <div>
            <h3>{t('levels.embeddings.queryLabel')}</h3>
            <div className="context-box">{EMBEDDING_QUERY.text}</div>
          </div>
        </div>

        <div className="panel stack">
          <h2>{t('levels.embeddings.docsLabel')}</h2>
          {scores.map(({ doc, similarity }) => (
            <DocumentCard
              key={doc.id}
              title={doc.text}
              selected={state.selectedDocIds.includes(doc.id)}
              onClick={
                state.completed
                  ? undefined
                  : () => dispatch({ type: 'TOGGLE_DOC', docId: doc.id })
              }
              meta={<SimilarityScore value={similarity} digits={3} />}
            />
          ))}

          <div className="row">
            <button
              type="button"
              className="btn btn--primary"
              disabled={state.completed || state.selectedDocIds.length === 0}
              onClick={() => dispatch({ type: 'SUBMIT' })}
            >
              {t('common.submit')}
            </button>
            <span className="mono muted">
              {t('levels.embeddings.selectedLabel')}: {state.selectedDocIds.length}
            </span>
          </div>

          <FeedbackPanel
            title={t(evaluation.titleKey)}
            message={t(evaluation.messageKey)}
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
