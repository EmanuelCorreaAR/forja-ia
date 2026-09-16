import { useEffect, useMemo, useReducer, useRef } from 'react'
import {
  EMBEDDING_DOCUMENTS,
  EMBEDDING_QUERY,
  EMBEDDING_TOP_K,
} from '@/data/embeddings'
import {
  averageSelectedSimilarity,
  createInitialEmbeddingsState,
  evaluateEmbeddings,
  getPlayOrderScores,
  getTargetDocIds,
  getTrapDocId,
  reduceEmbeddingsState,
} from '@/domain/levels/embeddings/evaluate'
import {
  buildChallengeCode,
  formatShareText,
} from '@/domain/shareScore'
import { useProgress } from '@/context/ProgressContext'
import { LevelLayout } from '@/components/layout/LevelLayout'
import { ChallengePanel } from '@/components/ui/ChallengePanel'
import { DocumentCard } from '@/components/ui/Document'
import { FeedbackPanel } from '@/components/ui/FeedbackPanel'
import { MissionPanel } from '@/components/ui/MissionPanel'
import { ShareCard } from '@/components/ui/ShareCard'
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
  const trapId = getTrapDocId()
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

  const elapsedMs = Math.round(
    performance.now() - (startedAtRef.current ?? performance.now()),
  )
  const avgSim = averageSelectedSimilarity(state.selectedDocIds)

  const share = useMemo(() => {
    if (!state.completed) return null
    const challengeCode = buildChallengeCode('embeddings', {
      score: state.score,
      attempts: state.attempts,
      avgSim,
      time: elapsedMs,
    })
    const metrics = [
      { label: t('common.attempts'), value: String(state.attempts) },
      { label: t('common.similarity'), value: avgSim.toFixed(3) },
      {
        label: t('share.time'),
        value: `${(elapsedMs / 1000).toFixed(1)}s`,
      },
    ]
    const shareText = formatShareText({
      levelLabel: t('levels.embeddings.subtitle'),
      challengeCode,
      score: state.score,
      lines: [
        `Similitud media: ${avgSim.toFixed(3)}`,
        `Intentos: ${state.attempts}`,
        `Tiempo: ${(elapsedMs / 1000).toFixed(1)}s`,
        `Te desafío a superar ${Math.min(0.99, avgSim + 0.01).toFixed(2)}`,
      ],
    })
    return { challengeCode, metrics, shareText }
  }, [state.completed, state.score, state.attempts, avgSim, elapsedMs])

  return (
    <LevelLayout
      kicker={t('levels.embeddings.levelLabel')}
      title={t('levels.embeddings.subtitle')}
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

      <MissionPanel
        mission={t('levels.embeddings.mission', { topK: EMBEDDING_TOP_K })}
      />

      <ChallengePanel className="challenge-panel--map">
        <div className="panel stack">
          <div>
            <h2>{t('levels.embeddings.queryLabel')}</h2>
            <div className="context-box">{EMBEDDING_QUERY.text}</div>
          </div>

          <div className="section-heading">
            <h2>{t('levels.embeddings.mapLabel')}</h2>
            <p className="note">
              {revealing
                ? t('levels.embeddings.mapRevealHint')
                : t('levels.embeddings.mapBlindHint')}
            </p>
          </div>
          <div
            className={`vector-map ${revealing ? 'map-reveal' : ''}`}
            role="img"
            aria-label={t('levels.embeddings.mapLabel')}
          >
            <VectorPoint
              x={EMBEDDING_QUERY.position.x}
              y={EMBEDDING_QUERY.position.y}
              label={t('levels.embeddings.mapQueryLabel')}
              kind="query"
            />
            {EMBEDDING_DOCUMENTS.map((doc) => {
              const selected = state.selectedDocIds.includes(doc.id)
              const isTarget = targets.has(doc.id)
              const isTrap = doc.id === trapId
              return (
                <VectorPoint
                  key={doc.id}
                  x={doc.position.x}
                  y={doc.position.y}
                  label={doc.label}
                  anonymous={!revealing}
                  selected={revealing && selected}
                  near={revealing && isTarget}
                  trap={revealing && isTrap}
                  disabled
                />
              )
            })}
          </div>
        </div>

        <div className="panel stack">
          <div className="section-heading">
            <h2>{t('levels.embeddings.docsLabel')}</h2>
            <p className="note">
              {revealing
                ? t('levels.embeddings.revealHint')
                : t('levels.embeddings.pickHint')}
            </p>
          </div>

          {scores.map(({ doc, similarity }) => {
            const selected = state.selectedDocIds.includes(doc.id)
            const isTarget = targets.has(doc.id)
            const isTrap = doc.id === trapId
            return (
              <DocumentCard
                key={doc.id}
                title={
                  revealing ? `${doc.label}. ${doc.text}` : doc.text
                }
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
                        {isTarget
                          ? t('levels.embeddings.topMark')
                          : isTrap
                            ? t('levels.embeddings.trapMark')
                            : '·'}
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

          {state.completed && share ? (
            <>
              <ShareCard
                challengeCode={share.challengeCode}
                score={state.score}
                metrics={share.metrics}
                shareText={share.shareText}
              />
              <SuccessState
                title={t('common.explanation')}
                explanation={t('levels.embeddings.explanation')}
              />
            </>
          ) : null}
        </div>
      </ChallengePanel>
    </LevelLayout>
  )
}
