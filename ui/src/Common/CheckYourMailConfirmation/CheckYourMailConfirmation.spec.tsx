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

import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import { MutableSnapshot } from 'recoil';
import ContributorsService from 'Services/Api/ContributorsService';
import { ThemeState } from 'State/ThemeState';
import Theme from 'Types/Theme';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import CheckYourMailConfirmation from './CheckYourMailConfirmation';

jest.mock('Services/Api/ContributorsService');

describe('Check Your Mail Confirmation', () => {
	it('should render checkbox in confirmation screen as dark turquoise in light mode', async () => {
		await renderCheckYourMailConfirmation(({ set }) => {
			set(ThemeState, Theme.LIGHT);
		});
		const checkedCheckboxIcon = await screen.findByTestId(
			'checkedCheckboxIcon'
		);
		expect(checkedCheckboxIcon.getAttribute('fill')).toBe('#16a085');
	});

	it('should render checkbox in confirmation screen as light turquoise in dark mode', async () => {
		await renderCheckYourMailConfirmation(({ set }) => {
			set(ThemeState, Theme.DARK);
		});
		const checkedCheckboxIcon = await screen.findByTestId(
			'checkedCheckboxIcon'
		);
		expect(checkedCheckboxIcon.getAttribute('fill')).toBe('#1abc9c');
	});
});

async function renderCheckYourMailConfirmation(
	recoilState?: (mutableSnapshot: MutableSnapshot) => void
) {
	renderWithRecoilRoot(
		<MemoryRouter>
			<CheckYourMailConfirmation paragraph1="" paragraph2="" />
		</MemoryRouter>,
		recoilState
	);
	await waitFor(() => expect(ContributorsService.get).toHaveBeenCalled());
}
