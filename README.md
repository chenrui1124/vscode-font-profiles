# Font Profiles

Run **Font Profiles: Switch Profile** to choose a profile and apply its font settings to your global VS Code settings.

Example configuration for your `settings.json`:

```json
{
  "fontProfiles.profiles": [
    {
      "name": "My Fira Code Profile",
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

## Supported settings

Add `fontProfiles.profiles` to `settings.json` as an array of profiles. Each profile has a nonempty `name` and a `settings` object containing any of these keys:

| Setting                             | Supported value                                                                                     |
| ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| `editor.fontFamily`                 | String                                                                                              |
| `editor.fontLigatures`              | Boolean, or an object of OpenType feature tags with Boolean values (for example, `calt` and `liga`) |
| `editor.fontSize`                   | Number from 6 to 100                                                                                |
| `editor.fontWeight`                 | `"normal"`, `"bold"`, or a number from 1 to 1000                                                    |
| `editor.letterSpacing`              | Number from -5 to 20                                                                                |
| `editor.lineHeight`                 | Number from 0 to 150                                                                                |
| `terminal.integrated.fontFamily`    | String                                                                                              |
| `terminal.integrated.fontSize`      | Number from 6 to 100                                                                                |
| `terminal.integrated.fontWeight`    | `"normal"`, `"bold"`, or a number from 1 to 1000                                                    |
| `terminal.integrated.letterSpacing` | Number from -5 to 20                                                                                |
| `terminal.integrated.lineHeight`    | Number of at least 1                                                                                |
