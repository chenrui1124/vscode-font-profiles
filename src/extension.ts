import { isNil } from 'es-toolkit'
import { match, P } from 'ts-pattern'
import * as v from 'valibot'
import * as vscode from 'vscode'

import { FontProfile } from './configuration.ts'
import { keyOf, parseFontFamily, uniqFontFamily } from './utils.ts'

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('fontProfiles.switchProfile', async () => {
    const editorConfig = vscode.workspace.getConfiguration('editor')
    const terminalIntegratedConfig = vscode.workspace.getConfiguration('terminal.integrated')
    const fontProfilesConfig = vscode.workspace.getConfiguration('fontProfiles')

    const { output, success } = v.safeParse(
      v.pipe(
        v.array(v.unknown()),
        v.filterItems(it => v.is(FontProfile, it)),
        v.mapItems(it => v.parse(FontProfile, it))
      ),
      fontProfilesConfig.get('profiles')
    )

    if (!success) {
      await vscode.window.showErrorMessage(
        'Font profiles configuration is invalid. Check the fontProfiles.profiles setting.'
      )
      return
    }

    if (output.length === 0) {
      await vscode.window.showErrorMessage(
        'No font profiles are configured. Add a profile to the fontProfiles.profiles setting.'
      )
      return
    }

    const picked = await vscode.window.showQuickPick(
      output.map(it => ({
        label: it.name,
        description: it.description,
        profile: it,
      })),
      { placeHolder: 'Select a font profile' }
    )
    if (isNil(picked)) {
      return
    }
    const { profile } = picked

    for (const key of keyOf(profile.settings)) {
      await match(key)
        .with(P.string.endsWith('fontFamily'), key =>
          match(profile.settings[key])
            .with(P.string, fontFamily => {
              const config = match(key)
                .with(P.string.startsWith('editor'), () => editorConfig)
                .with(P.string.startsWith('terminal.integrated'), () => terminalIntegratedConfig)
                .exhaustive()
              return config.update(
                'fontFamily',
                uniqFontFamily([
                  ...parseFontFamily(fontFamily),
                  ...match(config.inspect('fontFamily')?.globalValue)
                    .with(P.string, parseFontFamily)
                    .otherwise(() => []),
                ]).join(', '),
                vscode.ConfigurationTarget.Global
              )
            })
            .otherwise(() => {})
        )

        .with('editor.fontLigatures', () =>
          match(profile.settings['editor.fontLigatures'])
            .with(P.boolean, fontLigatures =>
              editorConfig.update('fontLigatures', fontLigatures, vscode.ConfigurationTarget.Global)
            )
            .with(P.record(P.string, P.boolean), fontLigatures =>
              editorConfig.update(
                'fontLigatures',
                Object.entries(fontLigatures)
                  .map(([feature, enabled]) => `'${feature}' ${enabled ? 'on' : 'off'}`)
                  .join(', '),
                vscode.ConfigurationTarget.Global
              )
            )
            .otherwise(() => {})
        )

        .otherwise(key =>
          match(profile.settings[key])
            .with(P.nonNullable, value =>
              match(key)
                .with(P.string.startsWith('editor'), () => editorConfig)
                .with(P.string.startsWith('terminal.integrated'), () => terminalIntegratedConfig)
                .exhaustive()
                .update(
                  key.replaceAll('editor.', '').replaceAll('terminal.integrated.', ''),
                  value,
                  vscode.ConfigurationTarget.Global
                )
            )
            .otherwise(() => {})
        )
    }
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
