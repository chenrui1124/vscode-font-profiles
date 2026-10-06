import { toJsonSchema } from '@valibot/to-json-schema'
import { range, zipObject } from 'es-toolkit'
import * as v from 'valibot'

// Registered OpenType features: https://learn.microsoft.com/en-us/typography/opentype/spec/featurelist
const registeredOpenTypeFeatureTags = [
  'aalt',
  'abvf',
  'abvm',
  'abvs',
  'afrc',
  'akhn',
  'apkn',
  'blwf',
  'blwm',
  'blws',
  'calt',
  'case',
  'ccmp',
  'cfar',
  'chws',
  'cjct',
  'clig',
  'cpct',
  'cpsp',
  'cswh',
  'curs',
  'c2pc',
  'c2sc',
  'dist',
  'dlig',
  'dnom',
  'dtls',
  'expt',
  'falt',
  'fin2',
  'fin3',
  'fina',
  'flac',
  'frac',
  'fwid',
  'half',
  'haln',
  'halt',
  'hist',
  'hkna',
  'hlig',
  'hngl',
  'hojo',
  'hwid',
  'init',
  'isol',
  'ital',
  'jalt',
  'jp78',
  'jp83',
  'jp90',
  'jp04',
  'kern',
  'lfbd',
  'liga',
  'ljmo',
  'lnum',
  'locl',
  'ltra',
  'ltrm',
  'mark',
  'med2',
  'medi',
  'mgrk',
  'mkmk',
  'mset',
  'nalt',
  'nlck',
  'nukt',
  'numr',
  'onum',
  'opbd',
  'ordn',
  'ornm',
  'palt',
  'pcap',
  'pkna',
  'pnum',
  'pref',
  'pres',
  'pstf',
  'psts',
  'pwid',
  'qwid',
  'rand',
  'rclt',
  'rkrf',
  'rlig',
  'rphf',
  'rtbd',
  'rtla',
  'rtlm',
  'ruby',
  'rvrn',
  'salt',
  'sinf',
  'size',
  'smcp',
  'smpl',
  'ssty',
  'stch',
  'subs',
  'sups',
  'swsh',
  'titl',
  'tjmo',
  'tnam',
  'tnum',
  'trad',
  'twid',
  'unic',
  'valt',
  'vapk',
  'vatu',
  'vchw',
  'vert',
  'vhal',
  'vjmo',
  'vkna',
  'vkrn',
  'vpal',
  'vrt2',
  'vrtr',
  'zero',
] as const

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

type CvNumber = Exclude<`${Digit}${Digit}`, '00'>

type SsNumber = `0${Exclude<Digit, '0'>}` | `1${Digit}` | '20'

type OpenTypeFeatureTag =
  | (typeof registeredOpenTypeFeatureTags)[number]
  | `cv${CvNumber}`
  | `ss${SsNumber}`

const openTypeFeatureTags: readonly OpenTypeFeatureTag[] = [
  ...registeredOpenTypeFeatureTags,
  ...(range(1, 100).map(n => `cv${String(n).padStart(2, '0')}`) as OpenTypeFeatureTag[]),
  ...(range(1, 21).map(n => `ss${String(n).padStart(2, '0')}`) as OpenTypeFeatureTag[]),
]

const FontFeatures = v.object(
  zipObject(
    openTypeFeatureTags,
    openTypeFeatureTags.map(() => v.boolean())
  )
)

const FontWeight = v.union([
  v.picklist(['normal', 'bold']),
  v.pipe(v.number(), v.minValue(1), v.maxValue(1000)),
])

const FontSize = v.pipe(v.number(), v.minValue(6), v.maxValue(100))

export const FontProfile = v.strictObject({
  name: v.pipe(v.string(), v.minLength(1), v.description('Name of the font profile.')),
  description: v.pipe(
    v.optional(v.string()),
    v.description('Additional text shown next to the profile name when selecting a profile.')
  ),
  settings: v.pipe(
    v.partial(
      v.strictObject({
        'editor.fontFamily': v.string(),
        'editor.fontLigatures': v.union([v.boolean(), v.partial(FontFeatures)]),
        'editor.fontSize': FontSize,
        'editor.fontWeight': FontWeight,
        'editor.letterSpacing': v.pipe(v.number(), v.minValue(-5), v.maxValue(20)),
        'editor.lineHeight': v.pipe(v.number(), v.minValue(0), v.maxValue(150)),
        'terminal.integrated.fontFamily': v.string(),
        'terminal.integrated.fontSize': FontSize,
        'terminal.integrated.fontWeight': FontWeight,
        'terminal.integrated.letterSpacing': v.pipe(v.number(), v.minValue(-5), v.maxValue(20)),
        'terminal.integrated.lineHeight': v.pipe(v.number(), v.minValue(1)),
      })
    ),
    v.description('VS Code font settings applied by this profile.')
  ),
})

export type FontProfile = v.InferOutput<typeof FontProfile>

const Configuration = v.object({
  'fontProfiles.profiles': v.optional(
    v.pipe(
      v.array(FontProfile),
      v.title('Font Profiles'),
      v.description('Named editor and terminal font profiles.')
    ),
    () => []
  ),
})

const { $schema: _, ...configurationJsonSchema } = toJsonSchema(Configuration)

export { configurationJsonSchema }
