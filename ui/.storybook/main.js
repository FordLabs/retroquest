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
const path = require('path');

module.exports = {
	stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/preset-create-react-app',
		'@storybook/addon-links',
		'@storybook/addon-essentials',
	],
	core: {
		builder: 'webpack5',
	},
	previewBody: (body) => `<div>${body}</div>`,
	webpackFinal: async (config, { configType }) => {
		// `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
		// You can change the configuration based on that.
		// 'PRODUCTION' is used when building the static version of storybook.

		config.module.rules.push({
			test: /\.scss$/,
			use: [
				{
					loader: 'style-loader',
				},
				{
					loader: 'css-loader',
					options: { sourceMap: true },
				},
				{
					loader: 'resolve-url-loader',
				},
				{
					loader: 'sass-loader',
					options: { sourceMap: true },
				},
			],
			include: path.resolve(__dirname, './'),
		});

		return config;
	},
};
