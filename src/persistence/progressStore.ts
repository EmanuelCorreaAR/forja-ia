import {
  createDefaultProgress,
  PROGRESS_VERSION,
} from '@/domain/progress'
import type { ProgressState } from '@/domain/types'

const STORAGE_KEY = 'forja-ia.progress.v1'
const LEGACY_STORAGE_KEY = 'ai-forge.progress.v1'

function parseProgress(raw: string): ProgressState | null {
  try {
    const parsed = JSON.parse(raw) as ProgressState
    if (parsed.version !== PROGRESS_VERSION) return null
    return {
      ...createDefaultProgress(),
      ...parsed,
      unlocked: parsed.unlocked?.length ? parsed.unlocked : ['llm'],
    }
  } catch {
    return null
  }
}

export function loadProgress(): ProgressState {
  if (typeof localStorage === 'undefined') {
    return createDefaultProgress()
  }

  const current = localStorage.getItem(STORAGE_KEY)
  if (current) {
    return parseProgress(current) ?? createDefaultProgress()
  }

  const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
  if (legacy) {
    const migrated = parseProgress(legacy)
    if (migrated) {
      saveProgress(migrated)
      localStorage.removeItem(LEGACY_STORAGE_KEY)
      return migrated
    }
  }

  return createDefaultProgress()
}

export function saveProgress(progress: ProgressState): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function clearProgress(): void {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(LEGACY_STORAGE_KEY)
}
