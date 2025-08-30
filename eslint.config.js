import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';

export default tseslint.config([
  // ignore build + the config itself to avoid “self-linting” noise
  globalIgnores([
    'dist',
    'build',
    'coverage',
    'node_modules',
    'eslint.config.*',
  ]),

  // App source
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      // Turn OFF all ESLint rules that conflict with Prettier:
      prettier,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    rules: {
      // Remove these two lines if you had them before — they conflict with Prettier:
      // 'object-curly-newline': 'off',
      // 'object-property-newline': 'off',
    },
  },

  // Node runtime config files (no stylistic rules here)
  {
    files: [
      '**/*config.{ts,js}',
      'vite.config.{ts,js}',
      'postcss.config.{ts,js}',
      'tailwind.config.{ts,js}',
    ],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parser: tseslint.parser,
      globals: { ...globals.node },
    },
    rules: {}, // keep stylistic rules off for config files
  },
]);
