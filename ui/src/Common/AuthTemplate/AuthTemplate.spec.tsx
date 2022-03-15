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

import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import mockAxios from 'axios';
import { RecoilRoot } from 'recoil';

import { Contributor } from '../../Types/Contributor';

import AuthTemplate from './AuthTemplate';

const mockContributors: Contributor[] = [
	{
		accountUrl: 'https://github.com/contributor-1',
		image: '/9j/2wCEAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw',
	},
	{
		accountUrl: 'https://github.com/contributor-2',
		image: '/8j/2wCEAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw',
	},
];

describe('AuthTemplate', () => {
	beforeEach(() => {
		mockAxios.get = jest.fn().mockResolvedValue({
			data: mockContributors,
		});
	});

	it('should render the logo, header, sub header, children, footer, and contributors', async () => {
		render(
			<MemoryRouter initialEntries={['/team/team-id']}>
				<RecoilRoot>
					<AuthTemplate header="header" subHeader="sub header">
						<div>children</div>
					</AuthTemplate>
				</RecoilRoot>
			</MemoryRouter>
		);

		await screen.findByAltText('https://github.com/contributor-1');
		screen.getByAltText('https://github.com/contributor-2');

		screen.getAllByText('RetroQuest');
		screen.getByText('FordLabs');
		screen.getByText('header');
		screen.getByText('sub header');
		screen.getByText('children');
		screen.getByText('Github');
	});
});
