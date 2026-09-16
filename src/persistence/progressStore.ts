import {
  createDefaultProgress,
  PROGRESS_VERSION,
} from '@/domain/progress'
import type { ProgressState } from '@/domain/types'

const STORAGE_KEY = 'ai-forge.progress.v1'

export function loadProgress(): ProgressState {
  if (typeof localStorage === 'undefined') {
    return createDefaultProgress()
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultProgress()
    const parsed = JSON.parse(raw) as ProgressState
    if (parsed.version !== PROGRESS_VERSION) {
      return createDefaultProgress()
    }
    return {
      ...createDefaultProgress(),
      ...parsed,
      unlocked: parsed.unlocked?.length ? parsed.unlocked : ['llm'],
    }
  } catch {
    return createDefaultProgress()
  }
}

export function saveProgress(progress: ProgressState): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function clearProgress(): void {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
