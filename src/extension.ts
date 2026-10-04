import { isBoolean, isNotNil, isPlainObject, isString } from 'es-toolkit'
import * as v from 'valibot'
import * as vscode from 'vscode'

import { FontProfile } from './configuration.ts'

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

    const validProfiles = success ? output : []

    const picked = await vscode.window.showQuickPick(
      validProfiles.map(it => it.name),
      { placeHolder: 'Select a font profile' }
    )
    if (!picked) {
      return
    }

    const profile = validProfiles.find(it => it.name === picked)
    if (profile) {
      const editorFontFamily = profile.settings['editor.fontFamily']
      if (isNotNil(editorFontFamily)) {
        const previousEditorFontFamily = editorConfig.inspect('fontFamily')?.globalValue
        if (isString(previousEditorFontFamily)) {
          await editorConfig.update(
            'fontFamily',
            [
              editorFontFamily,
              ...previousEditorFontFamily
                .split(',')
                .map(it => it.trim())
                .filter(it => it !== editorFontFamily),
            ].join(', '),
            vscode.ConfigurationTarget.Global
          )
        } else {
          await editorConfig.update(
            'fontFamily',
            editorFontFamily,
            vscode.ConfigurationTarget.Global
          )
        }
      }

      const editorFontLigatures = profile.settings['editor.fontLigatures']
      if (isBoolean(editorFontLigatures)) {
        await editorConfig.update(
          'fontLigatures',
          editorFontLigatures,
          vscode.ConfigurationTarget.Global
        )
      } else if (isPlainObject(editorFontLigatures)) {
        await editorConfig.update(
          'fontLigatures',
          Object.entries(editorFontLigatures)
            .map(([feature, enabled]) => `'${feature}' ${enabled ? 'on' : 'off'}`)
            .join(', '),
          vscode.ConfigurationTarget.Global
        )
      }

      const editorFontSize = profile.settings['editor.fontSize']
      if (isNotNil(editorFontSize)) {
        await editorConfig.update('fontSize', editorFontSize, vscode.ConfigurationTarget.Global)
      }

      const editorFontWeight = profile.settings['editor.fontWeight']
      if (isNotNil(editorFontWeight)) {
        await editorConfig.update('fontWeight', editorFontWeight, vscode.ConfigurationTarget.Global)
      }

      const editorFontLetterSpacing = profile.settings['editor.letterSpacing']
      if (isNotNil(editorFontLetterSpacing)) {
        await editorConfig.update(
          'letterSpacing',
          editorFontLetterSpacing,
          vscode.ConfigurationTarget.Global
        )
      }

      const editorFontLinHeight = profile.settings['editor.lineHeight']
      if (isNotNil(editorFontLinHeight)) {
        await editorConfig.update(
          'lineHeight',
          editorFontLinHeight,
          vscode.ConfigurationTarget.Global
        )
      }

      const terminalIntegratedFontFamily = profile.settings['terminal.integrated.fontFamily']
      if (isString(terminalIntegratedFontFamily)) {
        const previousTerminalIntegratedFontFamily =
          terminalIntegratedConfig.inspect('fontFamily')?.globalValue
        if (isString(previousTerminalIntegratedFontFamily)) {
          await terminalIntegratedConfig.update(
            'fontFamily',
            [
              terminalIntegratedFontFamily,
              ...previousTerminalIntegratedFontFamily
                .split(',')
                .map(it => it.trim())
                .filter(it => it !== terminalIntegratedFontFamily),
            ].join(', '),
            vscode.ConfigurationTarget.Global
          )
        } else {
          await terminalIntegratedConfig.update(
            'fontFamily',
            terminalIntegratedFontFamily,
            vscode.ConfigurationTarget.Global
          )
        }
      }

      const terminalIntegratedFontSize = profile.settings['terminal.integrated.fontSize']
      if (isNotNil(terminalIntegratedFontSize)) {
        await terminalIntegratedConfig.update(
          'fontSize',
          terminalIntegratedFontSize,
          vscode.ConfigurationTarget.Global
        )
      }

      const terminalIntegratedFontWeight = profile.settings['terminal.integrated.fontWeight']
      if (isNotNil(terminalIntegratedFontWeight)) {
        await terminalIntegratedConfig.update(
          'fontWeight',
          terminalIntegratedFontWeight,
          vscode.ConfigurationTarget.Global
        )
      }

      const terminalIntegratedLetterSpacing = profile.settings['terminal.integrated.letterSpacing']
      if (isNotNil(terminalIntegratedLetterSpacing)) {
        await terminalIntegratedConfig.update(
          'letterSpacing',
          terminalIntegratedLetterSpacing,
          vscode.ConfigurationTarget.Global
        )
      }

      const terminalIntegratedLineHeight = profile.settings['terminal.integrated.lineHeight']
      if (isNotNil(terminalIntegratedLineHeight)) {
        await terminalIntegratedConfig.update(
          'lineHeight',
          terminalIntegratedLineHeight,
          vscode.ConfigurationTarget.Global
        )
      }
    }
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
