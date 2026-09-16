import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  createDefaultProgress,
  getLevelStatus,
  recordBestResult,
  unlockNextLevel,
} from '@/domain/progress'
import type { ProgressState } from '@/domain/types'
import { loadProgress, saveProgress } from '@/persistence/progressStore'

type ProgressContextValue = {
  progress: ProgressState
  completeLevel: (
    levelId: string,
    result: { attempts: number; elapsedMs: number; score?: number },
  ) => void
  statusOf: (levelId: string) => 'locked' | 'available' | 'completed'
  resetAll: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())

  const completeLevel = useCallback(
    (
      levelId: string,
      result: { attempts: number; elapsedMs: number; score?: number },
    ) => {
      setProgress((current) => {
        let next = unlockNextLevel(current, levelId)
        next = recordBestResult(next, levelId, result)
        saveProgress(next)
        return next
      })
    },
    [],
  )

  const statusOf = useCallback(
    (levelId: string) => getLevelStatus(levelId, progress),
    [progress],
  )

  const resetAll = useCallback(() => {
    const next = createDefaultProgress()
    setProgress(next)
    saveProgress(next)
  }, [])

  const value = useMemo(
    () => ({ progress, completeLevel, statusOf, resetAll }),
    [progress, completeLevel, statusOf, resetAll],
  )

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
