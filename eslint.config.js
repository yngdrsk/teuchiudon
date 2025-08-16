import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config([
  // Laravel固有のディレクトリを除外
  {
    ignores: [
      'dist',
      'public/build/**',
      'vendor/**',
      'storage/**',
      'bootstrap/cache/**',
      'node_modules/**'
    ]
  },
  {
    // Laravelでは resources/js 以下のTypeScriptファイルが対象
    files: ['resources/js/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: './tsconfig.app.json',
      },
    },
    rules: {
      // Laravel/React開発に適した追加ルール
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
    },
  },
])
