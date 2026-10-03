import { defineConfig } from 'vite-plus'

export default defineConfig({
  pack: [
    {
      name: 'extension',
      entry: ['src/extension.ts'],
      outDir: 'dist',
      platform: 'node',
      sourcemap: true,
      deps: { neverBundle: ['vscode'], alwaysBundle: [/./] },
      outputOptions: { entryFileNames: '[name].js', sourcemapExcludeSources: true },
    },
    {
      name: 'tests',
      entry: ['src/**/*.ts'],
      root: 'src',
      outDir: 'out',
      unbundle: true,
      platform: 'node',
      sourcemap: true,
      deps: { neverBundle: ['vscode'] },
      outputOptions: { entryFileNames: '[name].js' },
    },
  ],
  fmt: {
    arrowParens: 'avoid',
    jsxSingleQuote: true,
    printWidth: 100,
    semi: false,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'es5',
    sortImports: true,
    sortPackageJson: {
      sortScripts: true,
    },
  },
  lint: {
    plugins: [],
    categories: { correctness: 'off' },
    env: { builtin: true, es2022: true, node: true },
    ignorePatterns: ['dist/**', 'out/**'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      curly: 'warn',
      eqeqeq: 'warn',
      'no-throw-literal': 'warn',
    },
  },
})
