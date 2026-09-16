import { es } from './locales/es'

export type MessageTree = typeof es

type NestedValue = string | { [key: string]: NestedValue }

function getByPath(tree: NestedValue, path: string): string | undefined {
  const parts = path.split('.')
  let current: NestedValue | undefined = tree
  for (const part of parts) {
    if (current == null || typeof current === 'string') return undefined
    current = current[part]
  }
  return typeof current === 'string' ? current : undefined
}

function interpolate(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    String(params[key] ?? ''),
  )
}

/** Simple i18n ready for more locales later */
export function t(
  key: string,
  params?: Record<string, string | number>,
): string {
  const value = getByPath(es as NestedValue, key)
  if (!value) return key
  return interpolate(value, params)
}

export { es }
