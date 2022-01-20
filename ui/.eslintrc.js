/*
 * Copyright (c) 2022 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
module.exports = {
  root: true,
  ignorePatterns: ['projects/**/*', 'jest.config.js', 'src/react/pages/login/ReactLoginPageWrapper.tsx'],
  extends: ['prettier', 'plugin:@typescript-eslint/recommended', 'plugin:storybook/recommended'],
  plugins: ['unused-imports', 'cypress', 'simple-import-sort'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    semi: 2,
    'max-len': ['error', { code: 120 }],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Node.js builtins. You could also generate this regex if you use a `.js` config.
          // For example: `^(${require("module").builtinModules.join("|")})(/|$)`
          [
            // eslint-disable-next-line max-len
            '^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)',
          ], // Packages. `react` related packages come first.
          ['^react', '^@?\\w'], // Internal packages.
          ['^(@|@company|@ui|components|utils|config|vendored-lib)(/.*|$)'], // Side effect imports.
          ['^\\u0000'], // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'], // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // Style imports.
          ['^.+\\.s?css$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
  },
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['tsconfig.app.json', 'tsconfig.spec.json'],
        createDefaultProgram: true,
      },
      extends: ['plugin:@angular-eslint/ng-cli-compat', 'plugin:@angular-eslint/template/process-inline-templates'],
      rules: {
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'rq',
            style: 'camelCase',
          },
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'rq',
            style: 'kebab-case',
          },
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
        'id-blacklist': 'off',
        'id-match': 'off',
        'no-underscore-dangle': 'off',
        'prefer-arrow/prefer-arrow-functions': 'off',
        'no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'max-len': 'off',
      },
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {
        'simple-import-sort/imports': 'off',
        'simple-import-sort/exports': 'off',
      },
    },
  ],
};
