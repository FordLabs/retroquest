/*
 * Copyright (c) 2021 Ford Motor Company
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
import { render, screen, within } from '@testing-library/react';
import mockAxios from 'axios';

import { Contributor } from '../../../Types/Contributor';

import Contributors from './Contributors';

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

describe('Contributors', () => {
	beforeEach(() => {
		mockAxios.get = jest.fn().mockResolvedValue({ data: mockContributors });
	});

	it('should render contributor images with links to profiles', async () => {
		render(<Contributors />);

		const contributorLink1 = await screen.findByTestId('rq-contributor-0');
		expect(contributorLink1.getAttribute('href')).toBe(
			mockContributors[0].accountUrl
		);
		const contributorImage1 = within(contributorLink1).getByAltText(
			'https://github.com/contributor-1'
		);
		expect(contributorImage1).toBeDefined();
		expect(contributorImage1.getAttribute('src')).toBe(
			'data:image/png;base64,' + mockContributors[0].image
		);

		const contributorLink2 = await screen.findByTestId('rq-contributor-1');
		expect(contributorLink2.getAttribute('href')).toBe(
			mockContributors[1].accountUrl
		);
		const contributorImage2 = within(contributorLink2).getByAltText(
			'https://github.com/contributor-2'
		);
		expect(contributorImage2).toBeDefined();
		expect(contributorImage2.getAttribute('src')).toBe(
			'data:image/png;base64,' + mockContributors[1].image
		);
	});
});
