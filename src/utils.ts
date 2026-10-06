import { uniqBy } from 'es-toolkit'
import type { ObjectKeys } from 'es-toolkit/types'

export const keyOf = <T extends object>(obj: T) => Object.keys(obj) as ObjectKeys<T>[]

export const parseFontFamily = (input: string): string[] =>
  (input.match(/(?:[^,"']|"[^"]*"|'[^']*')+/g) ?? [])
    .map(it => it.trim())
    .filter(it => it !== '' && !/^(["'])\s*\1$/.test(it))

export const uniqFontFamily = (input: string[]): string[] =>
  uniqBy(input, it => {
    const genericFontFamilies = new Set([
      'serif',
      'sans-serif',
      'monospace',
      'cursive',
      'fantasy',
      'system-ui',
      'ui-serif',
      'ui-sans-serif',
      'ui-monospace',
      'ui-rounded',
      'emoji',
      'math',
      'fangsong',
    ])
    const font = it.trim()
    const quoted = font.match(/^(["'])(.*)\1$/)
    const name = (quoted?.[2] ?? font).toLowerCase()

    // A quoted generic name refers to a literal font, not the generic family.
    return `${!quoted && genericFontFamilies.has(name) ? 'generic' : 'family'}:${name}`
  })
