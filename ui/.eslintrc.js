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
	extends: ['react-app', 'react-app/jest', 'plugin:jsx-a11y/recommended'],
	ignorePatterns: ['./.prettierrc.js', './.stylelintrc.js'],
	plugins: ['jsx-a11y', 'cypress', 'simple-import-sort'],
	env: {
		'cypress/globals': true,
	},
	rules: {
		'jsx-a11y/click-events-have-key-events': 'off', // @todo resolve and set back to error
		'jsx-a11y/no-static-element-interactions': 'off', // @todo resolve and set back to error
		'jest/no-mocks-import': 'off',
		'testing-library/prefer-presence-queries': 'off',
		'testing-library/no-render-in-setup': 'off',
		'@typescript-eslint/consistent-type-definitions': 'off',
		'simple-import-sort/imports': [
			'error',
			{
				groups: [
					// Node.js builtins. You could also generate this regex if you use a `.js` config.
					// For example: `^(${require("module").builtinModules.join("|")})(/|$)`
					[
						'^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)',
					],
					// Packages. `react` related packages come first.
					['^react', '^@?\\w'],
					// Internal packages.
					['^(@|@company|@ui|components|utils|config|vendored-lib)(/.*|$)'],
					// Side effect imports.
					['^\\u0000'],
					// Parent imports. Put `..` last.
					['^\\.\\.(?!/?$)', '^\\.\\./?$'],
					// Other relative imports. Put same-folder imports and `.` last.
					['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
					// Style imports.
					['^.+\\.s?css$'],
				],
			},
		],
		'simple-import-sort/exports': 'error',
	},
};
