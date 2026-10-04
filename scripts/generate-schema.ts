import { cwd } from 'node:process'

import PackageJson from '@npmcli/package-json'
import { isPlainObject, isString } from 'es-toolkit'

import { configurationJsonSchema } from '../src/configuration.ts'

const pkgJson = await PackageJson.load(cwd())

if (!isString(pkgJson.content.displayName)) {
  throw new Error('package.json is missing a displayName field.')
}

pkgJson.update({
  contributes: {
    ...(isPlainObject(pkgJson.content.contributes) ? pkgJson.content.contributes : {}),
    // Bridge the converter's JsonSchema type to the manifest's JSON value type.
    configuration: {
      title: pkgJson.content.displayName,
      ...configurationJsonSchema,
    } as PackageJson.Content[string],
  },
})

await pkgJson.save()
