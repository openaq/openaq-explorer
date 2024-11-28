import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
<<<<<<< HEAD
<<<<<<< HEAD
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';
=======
import solidPlugin from 'eslint-plugin-solid';
import prettier from 'eslint-config-prettier';
>>>>>>> 5fc8c9f (rebase)
=======
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';
>>>>>>> 8d0a3b6 (automated changes for CDK)

export default [
  js.configs.recommended,
  {
<<<<<<< HEAD
<<<<<<< HEAD
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
=======
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      solid: solidPlugin,
>>>>>>> 5fc8c9f (rebase)
=======
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
>>>>>>> 8d0a3b6 (automated changes for CDK)
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
<<<<<<< HEAD
<<<<<<< HEAD
        project: './tsconfig.json',
      },
    },
    rules: {
      ...tsPlugin.configs['recommended'].rules,
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: ['**/*test.ts'],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': ['error'],
      'import/prefer-default-export': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          ts: 'never',
        },
      ],
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/cdk.out/**',
      '**/dist/**',
      '**/*.js',
      '**/*.d.ts',
    ],
  },
  prettierConfig,
=======
        ecmaFeatures: {
          jsx: true,
        },
=======
        project: './tsconfig.json',
>>>>>>> 8d0a3b6 (automated changes for CDK)
      },
    },
    rules: {
      ...tsPlugin.configs['recommended'].rules,
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: ['**/*test.ts'],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': ['error'],
      'import/prefer-default-export': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          ts: 'never',
        },
      ],
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/cdk.out/**',
      '**/dist/**',
      '**/*.js',
      '**/*.d.ts',
    ],
  },
<<<<<<< HEAD
  prettier,
>>>>>>> 5fc8c9f (rebase)
=======
  prettierConfig,
>>>>>>> 8d0a3b6 (automated changes for CDK)
];
