export type ShareMetric = {
  label: string
  value: string
}

export type SharePayload = {
  levelId: string
  levelLabel: string
  score: number
  metrics: ShareMetric[]
  challengeCode: string
  shareText: string
}

/** Stable non-crypto hash for local challenge codes */
export function hashString(input: string): number {
  let hash = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function buildChallengeCode(
  levelId: string,
  parts: Record<string, string | number | boolean | undefined>,
): string {
  const canonical = Object.keys(parts)
    .sort()
    .map((key) => `${key}:${String(parts[key] ?? '')}`)
    .join('|')
  const digest = hashString(`${levelId}|${canonical}`).toString(16).toUpperCase()
  const prefix =
    levelId === 'llm'
      ? 'LLM'
      : levelId === 'embeddings'
        ? 'EMB'
        : levelId === 'tools'
          ? 'TLS'
          : 'RAG'
  return `${prefix}-${digest.slice(0, 4)}`
}

export function formatShareText(payload: {
  levelLabel: string
  challengeCode: string
  score: number
  lines: string[]
}): string {
  return [
    `Forja IA — ${payload.levelLabel}`,
    `Puntos: ${payload.score}`,
    ...payload.lines,
    `Código: ${payload.challengeCode}`,
    '¿Podés superar esto? → Forja IA',
  ].join('\n')
}
