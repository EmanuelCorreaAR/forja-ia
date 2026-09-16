import { describe, expect, it } from 'vitest'
import {
  createDefaultProgress,
  getLevelStatus,
  recordBestResult,
  unlockNextLevel,
} from '@/domain/progress'

describe('Progress unlock flow', () => {
  it('starts with only LLM unlocked', () => {
    const progress = createDefaultProgress()
    expect(getLevelStatus('llm', progress)).toBe('available')
    expect(getLevelStatus('embeddings', progress)).toBe('locked')
    expect(getLevelStatus('rag', progress)).toBe('locked')
    expect(getLevelStatus('tools', progress)).toBe('locked')
  })

  it('unlocks embeddings after completing LLM', () => {
    let progress = createDefaultProgress()
    progress = unlockNextLevel(progress, 'llm')
    expect(getLevelStatus('llm', progress)).toBe('completed')
    expect(getLevelStatus('embeddings', progress)).toBe('available')
  })

  it('unlocks rag after embeddings', () => {
    let progress = createDefaultProgress()
    progress = unlockNextLevel(progress, 'llm')
    progress = unlockNextLevel(progress, 'embeddings')
    expect(getLevelStatus('rag', progress)).toBe('available')
  })

  it('unlocks tools after rag', () => {
    let progress = createDefaultProgress()
    progress = unlockNextLevel(progress, 'llm')
    progress = unlockNextLevel(progress, 'embeddings')
    progress = unlockNextLevel(progress, 'rag')
    expect(getLevelStatus('tools', progress)).toBe('available')
  })

  it('keeps best score when improved', () => {
    let progress = createDefaultProgress()
    progress = recordBestResult(progress, 'llm', {
      attempts: 8,
      elapsedMs: 4000,
      score: 60,
    })
    progress = recordBestResult(progress, 'llm', {
      attempts: 5,
      elapsedMs: 3000,
      score: 80,
    })
    expect(progress.bestResults.llm?.score).toBe(80)
  })
})
