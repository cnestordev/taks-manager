import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  // Frontend Configuration
  {
    files: ['src/**/*.{js,jsx}'], // Apply to all frontend files in 'src' directory
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  // Backend Configuration
  {
    files: ['backend/**/*.js'], // Apply to all backend files in 'backend' directory
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script', // Use script mode for CommonJS (`require`/`module.exports`)
      globals: globals.node, // Use Node.js globals (`__dirname`, `module`, etc.)
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-undef': 'off', // Disable 'no-undef' for Node.js globals (`require`, `module`, etc.)
      'no-console': 'off', // Allow console statements in backend files
    },
  },
];
