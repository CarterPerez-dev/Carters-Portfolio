// ©AngelaMos | 2025
// stylelint.config.js

/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier-scss'],
  rules: {
    'block-no-empty': true,
    'declaration-no-important': true,
    'color-no-invalid-hex': true,
    'property-no-unknown': true,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global']
      }
    ],

    'selector-class-pattern': [
      '^[a-z]([a-z0-9-]+)?(__[a-z0-9]([a-z0-9-]+)?)?(--[a-z0-9]([a-z0-9-]+)?)?$|^[a-z][a-zA-Z0-9]*$',
      {
        message:
          'Selector should be in BEM format (e.g., .block__element--modifier) or CSS Modules camelCase (e.g., .testButton)',
      },
    ],
    'property-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'scss/at-rule-no-unknown': true,
    'scss/declaration-nested-properties-no-divided-groups': true,
    'scss/dollar-variable-no-missing-interpolation': true,
    'no-descending-specificity': null,
  },
  ignoreFiles: [
    'node_modules/**',
    'dist/**',
    'build/**',
    '**/*.js',
    '**/*.ts',
    '**/*.tsx',
  ],
  overrides: [
    {
      files: ['**/utilities/**/*.scss', '**/base/_reset.scss', '**/base/_typography.scss'],
      rules: {
        'declaration-no-important': null,
        'scss/comment-no-empty': null,
      },
    },
    {
      files: ['**/ComparisonChart.module.scss', '**/AnswerDistribution.module.scss'],
      rules: {
        'declaration-no-important': null,
      },
    },
  ],
};
