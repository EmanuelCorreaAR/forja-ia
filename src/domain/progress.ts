import type { LevelMeta, ProgressState } from '@/domain/types'

export const PROGRESS_VERSION = 1

export const IMPLEMENTED_LEVEL_IDS = ['llm', 'embeddings', 'rag', 'tools'] as const

export const LEVELS: LevelMeta[] = [
  {
    id: 'llm',
    order: 1,
    titleKey: 'levels.llm.title',
    subtitleKey: 'levels.llm.subtitle',
    descriptionKey: 'levels.llm.cardDescription',
    route: '/level/llm',
    implemented: true,
  },
  {
    id: 'embeddings',
    order: 2,
    titleKey: 'levels.embeddings.title',
    subtitleKey: 'levels.embeddings.subtitle',
    descriptionKey: 'levels.embeddings.cardDescription',
    route: '/level/embeddings',
    implemented: true,
  },
  {
    id: 'rag',
    order: 3,
    titleKey: 'levels.rag.title',
    subtitleKey: 'levels.rag.subtitle',
    descriptionKey: 'levels.rag.cardDescription',
    route: '/level/rag',
    implemented: true,
  },
  {
    id: 'tools',
    order: 4,
    titleKey: 'levels.tools.title',
    subtitleKey: 'levels.tools.subtitle',
    descriptionKey: 'levels.tools.cardDescription',
    route: '/level/tools',
    implemented: true,
  },
  {
    id: 'mcp',
    order: 5,
    titleKey: 'levels.future.mcp.title',
    subtitleKey: 'levels.future.mcp.subtitle',
    descriptionKey: 'levels.future.locked',
    route: '/level/mcp',
    implemented: false,
  },
  {
    id: 'agents',
    order: 6,
    titleKey: 'levels.future.agents.title',
    subtitleKey: 'levels.future.agents.subtitle',
    descriptionKey: 'levels.future.locked',
    route: '/level/agents',
    implemented: false,
  },
  {
    id: 'context',
    order: 7,
    titleKey: 'levels.future.context.title',
    subtitleKey: 'levels.future.context.subtitle',
    descriptionKey: 'levels.future.locked',
    route: '/level/context',
    implemented: false,
  },
  {
    id: 'evaluation',
    order: 8,
    titleKey: 'levels.future.evaluation.title',
    subtitleKey: 'levels.future.evaluation.subtitle',
    descriptionKey: 'levels.future.locked',
    route: '/level/evaluation',
    implemented: false,
  },
  {
    id: 'security',
    order: 9,
    titleKey: 'levels.future.security.title',
    subtitleKey: 'levels.future.security.subtitle',
    descriptionKey: 'levels.future.locked',
    route: '/level/security',
    implemented: false,
  },
  {
    id: 'cost',
    order: 10,
    titleKey: 'levels.future.cost.title',
    subtitleKey: 'levels.future.cost.subtitle',
    descriptionKey: 'levels.future.locked',
    route: '/level/cost',
    implemented: false,
  },
  {
    id: 'latency',
    order: 11,
    titleKey: 'levels.future.latency.title',
    subtitleKey: 'levels.future.latency.subtitle',
    descriptionKey: 'levels.future.locked',
    route: '/level/latency',
    implemented: false,
  },
  {
    id: 'multi-agent',
    order: 12,
    titleKey: 'levels.future.multiAgent.title',
    subtitleKey: 'levels.future.multiAgent.subtitle',
    descriptionKey: 'levels.future.locked',
    route: '/level/multi-agent',
    implemented: false,
  },
]

export function createDefaultProgress(): ProgressState {
  return {
    version: PROGRESS_VERSION,
    unlocked: ['llm'],
    completed: [],
    bestResults: {},
  }
}

export function getLevelStatus(
  levelId: string,
  progress: ProgressState,
): 'locked' | 'available' | 'completed' {
  const level = LEVELS.find((l) => l.id === levelId)
  if (!level) return 'locked'
  if (!level.implemented) return 'locked'
  if (progress.completed.includes(levelId)) return 'completed'
  if (progress.unlocked.includes(levelId)) return 'available'
  return 'locked'
}

export function unlockNextLevel(
  progress: ProgressState,
  completedId: string,
): ProgressState {
  const current = LEVELS.find((l) => l.id === completedId)
  if (!current) return progress

  const next = LEVELS.find(
    (l) => l.implemented && l.order === current.order + 1,
  )

  const completed = progress.completed.includes(completedId)
    ? progress.completed
    : [...progress.completed, completedId]

  const unlocked = next
    ? progress.unlocked.includes(next.id)
      ? progress.unlocked
      : [...progress.unlocked, next.id]
    : progress.unlocked

  return { ...progress, completed, unlocked }
}

export function recordBestResult(
  progress: ProgressState,
  levelId: string,
  result: {
    attempts: number
    elapsedMs: number
    score?: number
  },
): ProgressState {
  const previous = progress.bestResults[levelId]
  const better =
    !previous ||
    (result.score ?? 0) > (previous.score ?? 0) ||
    ((result.score ?? 0) === (previous.score ?? 0) &&
      result.attempts < previous.attempts)

  if (!better) return progress

  return {
    ...progress,
    bestResults: {
      ...progress.bestResults,
      [levelId]: {
        ...result,
        completedAt: 'local',
      },
    },
  }
}
