module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    "prettier",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'unused-imports', 'react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        'argsIgnorePattern': '^_',
        'destructuredArrayIgnorePattern': '^_',
        'varsIgnorePattern': '^_'
      }
    ],
    'unused-imports/no-unused-imports': 'warn',
    "quotes": [
      'error',
      'single',
      { 'avoidEscape': true }],
    'prefer-const': [
      'error',
      { 'destructuring': 'all' }
    ],
    'max-lines': [
      'warn',
      {'max': 500}
    ],
    'max-lines-per-function': [
      'warn',
      { 'max': 50 }
    ]
  },
}
