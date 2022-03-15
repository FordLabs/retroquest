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

import React from 'react';
import { themes } from '@storybook/theming';

import '../src/Styles/main.scss';
import '@fortawesome/fontawesome-free/css/all.css';

export const globalTypes = {
	theme: {
		name: 'Theme',
		description: 'Theme',
		defaultValue: '',
		toolbar: {
			icon: 'mirror',
			items: [
				{ value: '', right: '⬜️️', title: 'Light Theme' },
				{ value: 'dark-theme', right: '⬛️', title: 'Dark Theme' },
			],
		},
	},
};

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	docs: {
		theme: themes.dark,
	},
};

const withThemeProvider = (Story, context) => {
	addClassNamesToBody(context.globals.theme);

	return <Story {...context} />;
};

function addClassNamesToBody(theme) {
	let classNames = document.body.getAttribute('class').split(' ');
	classNames = classNames.filter((className) => className !== 'dark-theme');
	classNames.push(theme);

	document.body.setAttribute('class', classNames.join(' '));
}

export const decorators = [withThemeProvider];
