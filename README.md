# Font Profiles

Switch between named font profiles for the VS Code editor and terminal.

## Usage

The following is an example configuration for `settings.json`. Adjust the fonts and values to suit your setup:

```json
{
  "fontProfiles.profiles": [
    {
      "name": "My Fira Code Profile",
      "description": "Fira Code with custom font features",
      "settings": {
        "editor.fontFamily": "Fira Code",
        "editor.fontLigatures": {
          "cv01": true,
          "cv02": true,
          "ss01": true
        },
        "editor.fontSize": 13.5,
        "editor.letterSpacing": 0.1,
        "editor.lineHeight": 1.4
      }
    },
    {
      "name": "My JetBrains Mono Profile",
      "settings": {
        "editor.fontFamily": "JetBrains Mono",
        "editor.fontLigatures": {
          "liga": true,
          "calt": true,
          "cv01": true,
          "cv07": true,
          "cv10": true,
          "cv19": true
        },
        "editor.fontSize": 13.5,
        "editor.letterSpacing": 0.2,
        "editor.lineHeight": 1.4
      }
    }
  ]
}
```

Open the Command Palette, run **Font Profiles: Switch Profile**, and choose a profile.

Each profile needs a nonempty `name` and a `settings` object. An optional `description` appears beside its name in the picker.

## How profiles are applied

Selecting a profile updates your global VS Code settings. Settings not included in the profile stay unchanged.

The profile's fonts are placed first, followed by your existing fonts, with duplicates removed. For example, selecting `Fira Code` changes `Consolas, monospace` to `Fira Code, Consolas, monospace`.

Quotes around font names are preserved. Keep them when needed, such as in `'0xProto Mono'`.

## Supported settings

| Setting                             | Supported value                                                    |
| ----------------------------------- | ------------------------------------------------------------------ |
| `editor.fontFamily`                 | Comma-separated font names                                         |
| `editor.fontLigatures`              | Boolean, or an object of OpenType feature tags with Boolean values |
| `editor.fontSize`                   | Number from 6 to 100                                               |
| `editor.fontWeight`                 | `"normal"`, `"bold"`, or a number from 1 to 1000                   |
| `editor.letterSpacing`              | Number from -5 to 20                                               |
| `editor.lineHeight`                 | Number from 0 to 150                                               |
| `terminal.integrated.fontFamily`    | Comma-separated font names                                         |
| `terminal.integrated.fontSize`      | Number from 6 to 100                                               |
| `terminal.integrated.fontWeight`    | `"normal"`, `"bold"`, or a number from 1 to 1000                   |
| `terminal.integrated.letterSpacing` | Number from -5 to 20                                               |
| `terminal.integrated.lineHeight`    | Number of at least 1                                               |
