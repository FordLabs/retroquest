module.exports = {
  root: true,
  ignorePatterns: ['projects/**/*', 'jest.config.js'],
  extends: ['prettier'],
  plugins: ['unused-imports'],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['tsconfig.app.json', 'tsconfig.spec.json'],
        createDefaultProgram: true,
      },
      extends: [
        'plugin:@angular-eslint/ng-cli-compat',
        'plugin:@angular-eslint/template/process-inline-templates',
      ],
      rules: {
        '@angular-eslint/directive-selector': [
          'error',
          { type: 'attribute', prefix: 'rq', style: 'camelCase' },
        ],
        '@angular-eslint/component-selector': [
          'error',
          { type: 'element', prefix: 'rq', style: 'kebab-case' },
        ],
        '@angular-eslint/no-host-metadata-property': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/consistent-type-definitions': 'error',
        '@typescript-eslint/dot-notation': 'off',
        '@typescript-eslint/explicit-member-accessibility': [
          'off',
          {
            accessibility: 'explicit',
          },
        ],
        '@typescript-eslint/member-ordering': 'off',
        '@typescript-eslint/naming-convention': 'off',
        'brace-style': ['error', '1tbs'],
        'id-blacklist': 'off',
        'id-match': 'off',
        'no-underscore-dangle': 'off',
        'prefer-arrow/prefer-arrow-functions': 'off',
        'no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
      },
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {},
    },
  ],
};
