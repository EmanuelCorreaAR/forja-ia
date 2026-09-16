import { useEffect, useReducer, useRef } from 'react'
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
import { useProgress } from '@/context/ProgressContext'
import { LevelLayout } from '@/components/layout/LevelLayout'
import { ChallengePanel } from '@/components/ui/ChallengePanel'
import { Chunk } from '@/components/ui/Chunk'
import { DocumentCard } from '@/components/ui/Document'
import { FeedbackPanel } from '@/components/ui/FeedbackPanel'
import { ParameterControl } from '@/components/ui/ParameterControl'
import { Connection, PipelineNode } from '@/components/ui/PipelineNode'
import { SuccessState } from '@/components/ui/SuccessState'
import { t } from '@/i18n'

export function Level3RAGPage() {
  const { completeLevel } = useProgress()
  const startedAtRef = useRef<number | null>(null)
  const [state, dispatch] = useReducer(reduceRagState, undefined, () =>
    createInitialRagState(0),
  )

  useEffect(() => {
    if (startedAtRef.current == null) {
      startedAtRef.current = performance.now()
    }
  }, [])

  useEffect(() => {
    if (!state.completed) return
    const evaluation = evaluateRag(state)
    completeLevel('rag', {
      attempts: state.attempts,
      elapsedMs: Math.round(
        performance.now() - (startedAtRef.current ?? performance.now()),
      ),
      score: evaluation.metrics?.score,
    })
  }, [state.completed, state.attempts, completeLevel, state])

  const evaluation = evaluateRag(state)
  const run = state.lastRun
  const tone =
    evaluation.status === 'success'
      ? 'success'
      : evaluation.status === 'failed'
        ? 'error'
        : 'hint'

  return (
    <LevelLayout
      kicker={t('levels.rag.title')}
      title={t('levels.rag.subtitle')}
      objective={t('levels.rag.objective')}
      attempts={state.attempts}
      onReset={() => {
        startedAtRef.current = performance.now()
        dispatch({ type: 'RESET' })
      }}
    >
      <ChallengePanel>
        <div className="stack">
          <div className="panel stack">
            <h2>{t('levels.rag.questionLabel')}</h2>
            <div className="context-box">{RAG_QUESTION}</div>
          </div>

          <div className="panel stack">
            <h2>{t('levels.rag.docsLabel')}</h2>
            {RAG_DOCUMENTS.map((doc) => (
              <DocumentCard key={doc.id} title={doc.title} body={doc.body} />
            ))}
          </div>

          <div className="panel stack">
            <h2>{t('levels.rag.paramsLabel')}</h2>
            <ParameterControl
              id="chunk-size"
              label={t('levels.rag.chunkSize')}
              valueLabel={String(state.config.chunkSize)}
            >
              <select
                id="chunk-size"
                value={state.config.chunkSize}
                disabled={state.completed}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_CHUNK_SIZE',
                    chunkSize: Number(e.target.value) as ChunkSize,
                  })
                }
              >
                {RAG_CHUNK_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </ParameterControl>

            <ParameterControl
              id="top-k"
              label={t('levels.rag.topK')}
              valueLabel={String(state.config.topK)}
            >
              <select
                id="top-k"
                value={state.config.topK}
                disabled={state.completed}
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

            <ParameterControl
              id="threshold"
              label={t('levels.rag.threshold')}
              valueLabel={state.config.threshold.toFixed(2)}
            >
              <input
                id="threshold"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={state.config.threshold}
                disabled={state.completed}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_THRESHOLD',
                    threshold: Number(e.target.value),
                  })
                }
              />
            </ParameterControl>

            <button
              type="button"
              className="btn btn--primary"
              disabled={state.completed}
              onClick={() => dispatch({ type: 'RUN' })}
            >
              {t('levels.rag.runCta')}
            </button>
          </div>
        </div>

        <div className="stack">
          <div className="panel">
            <h2>{t('levels.rag.pipelineLabel')}</h2>
            <div className="pipeline">
              <PipelineNode label="Documents" active />
              <Connection />
              <PipelineNode
                label="Chunking"
                active
                detail={`size ${state.config.chunkSize}`}
              />
              <Connection />
              <PipelineNode label="Embeddings" active />
              <Connection />
              <PipelineNode
                label="Vector Search"
                active={Boolean(run)}
                detail={`topK ${state.config.topK} · thr ${state.config.threshold.toFixed(2)}`}
              />
              <Connection />
              <PipelineNode
                label="Retrieved Context"
                active={Boolean(run?.contextChunkIds.length)}
                detail={
                  run ? `${run.contextChunkIds.length} chunks` : undefined
                }
              />
              <Connection />
              <PipelineNode label="LLM" active={Boolean(run)} />
              <Connection />
              <PipelineNode label="Answer" active={Boolean(run)} />
            </div>
          </div>

          {run ? (
            <div className="panel stack">
              <h2>{t('levels.rag.retrievedLabel')}</h2>
              {run.retrieved
                .filter((r) => r.reason !== 'not_ranked' || r.included)
                .slice(0, state.config.topK + 2)
                .map(({ chunk, included }) => (
                  <Chunk
                    key={chunk.id}
                    id={chunk.id}
                    text={chunk.text}
                    similarity={chunk.similarity}
                    included={included}
                  />
                ))}
            </div>
          ) : null}

          {run ? (
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

          {state.completed ? (
            <SuccessState
              title={t('common.explanation')}
              explanation={t('levels.rag.explanation')}
            />
          ) : null}
        </div>
      </ChallengePanel>
    </LevelLayout>
  )
}
