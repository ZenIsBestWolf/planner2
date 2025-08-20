import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintPrettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import unicorn from 'eslint-plugin-unicorn';

export default tseslint.config(
  { ignores: ['dist', 'webpack.config.js'] },
  eslintPrettierRecommended,
  // Future contributors, if the linter is too aggressive, below is the line you probably want to remove.
  unicorn.configs['all'],
  {
    settings: { react: { version: '19.0.0' } },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./src/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/restrict-template-expressions': 'off',
      // My files, my rules!.
      'unicorn/filename-case': 'off',
      // Extremely annoying
      'unicorn/prevent-abbreviations': 'off',
      // Extremely annoying for "className"
      'unicorn/no-keyword-prefix': 'off',
      // Conflicts with Prettier
      'unicorn/no-nested-ternary': 'off',
      // Started flagging "return null;" in React components
      'unicorn/no-null': 'off',
    },
  },
);
