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

import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import TeamService from '../../../Services/Api/TeamService';

import ChangeTeamDetailsPage from './ChangeTeamDetailsPage';

jest.mock('Services/Api/TeamService');

describe('the change team email form', () => {
	it('should have a field for email1 and email2, plus a submit button', async () => {
		renderWithToken('');
		expect(screen.getByLabelText('Email Address 1')).toBeInTheDocument();
		expect(screen.getByLabelText('Email Address 2')).toBeInTheDocument();
		expect(screen.getByText('Update Team Details')).toBeInTheDocument();
	});

	it('should send emails to the backend on submission', async () => {
		renderWithToken('');
		submitValidForm();

		await waitFor(() =>
			expect(TeamService.setEmails).toHaveBeenCalledWith(
				'email1@email1.email1',
				'email2@email2.email2',
				expect.anything()
			)
		);
	});
	it('should send the secret code in the url to the backend on submission', async () => {
		renderWithToken('ABC123');
		submitValidForm();

		await waitFor(() =>
			expect(TeamService.setEmails).toHaveBeenCalledWith(
				expect.anything(),
				expect.anything(),
				'ABC123'
			)
		);
	});
	it('should show "Saved!" if the backend returns 200 after submission', async () => {
		renderWithToken('ABC321');
		submitValidForm();

		await screen.findByText('Saved!');
	});
});

function submitValidForm() {
	fireEvent.change(screen.getByLabelText('Email Address 1'), {
		target: { value: 'email1@email1.email1' },
	});
	fireEvent.change(screen.getByLabelText('Email Address 2'), {
		target: { value: 'email2@email2.email2' },
	});

	fireEvent.click(screen.getByText('Update Team Details'));
}

function renderWithToken(token: string) {
	const initialEntry =
		token !== '' ? '/change-emails?token=' + token : '/change-emails';
	render(
		<MemoryRouter initialEntries={[initialEntry]}>
			<Routes>
				<Route element={<ChangeTeamDetailsPage />} path={'/change-emails'} />
			</Routes>
		</MemoryRouter>
	);
}
