import { describe, expect, it } from 'vitest'
import {
  buildChallengeCode,
  formatShareText,
  hashString,
} from '@/domain/shareScore'

describe('shareScore', () => {
  it('hashes deterministically', () => {
    expect(hashString('abc')).toBe(hashString('abc'))
  })

  it('builds stable challenge codes', () => {
    const a = buildChallengeCode('rag', { score: 90, attempts: 2 })
    const b = buildChallengeCode('rag', { attempts: 2, score: 90 })
    expect(a).toBe(b)
    expect(a.startsWith('RAG-')).toBe(true)
  })

  it('formats share text', () => {
    const text = formatShareText({
      levelLabel: 'RAG',
      challengeCode: 'RAG-ABCD',
      score: 88,
      lines: ['Intentos: 2'],
    })
    expect(text).toContain('RAG-ABCD')
    expect(text).toContain('Score: 88')
  })
})
