import type { ChallengeId } from '@/domain/types'

/**
 * Lightweight registry so future levels can be plugged in
 * without rewriting app routing/progress wiring.
 */
export type ChallengeRegistration = {
  id: ChallengeId | string
  route: string
  implemented: boolean
}

export const challengeRegistry: ChallengeRegistration[] = [
  { id: 'llm', route: '/level/llm', implemented: true },
  { id: 'embeddings', route: '/level/embeddings', implemented: true },
  { id: 'rag', route: '/level/rag', implemented: true },
  { id: 'tools', route: '/level/tools', implemented: true },
]

export function getChallengeRegistration(id: string) {
  return challengeRegistry.find((c) => c.id === id)
}
