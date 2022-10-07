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
import TeamService from 'Services/Api/TeamService';

import ChangeTeamDetailsPage from './ChangeTeamDetailsPage';

jest.mock('Services/Api/TeamService');

describe('Change Team Details Page', () => {
	it('should have RetroQuest header', () => {
		renderWithToken('');
		expect(screen.getByText('RetroQuest')).toBeDefined();
	});

	it('should have a field for email1 and email2, plus a submit button', async () => {
		renderWithToken('');
		expect(getEmail1InputField()).toBeInTheDocument();
		expect(getEmail2InputField()).toBeInTheDocument();
		expect(screen.getByText('Save Changes')).toBeInTheDocument();
	});

	it('should send emails to the backend on submission', async () => {
		renderWithToken('');
		submitValidForm();

		await waitFor(() =>
			expect(TeamService.updateEmailsWithResetToken).toHaveBeenCalledWith(
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
			expect(TeamService.updateEmailsWithResetToken).toHaveBeenCalledWith(
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
	fireEvent.change(getEmail1InputField(), {
		target: { value: 'email1@email1.email1' },
	});
	fireEvent.change(getEmail2InputField(), {
		target: { value: 'email2@email2.email2' },
	});

	fireEvent.click(screen.getByText('Save Changes'));
}

function getEmail1InputField() {
	return screen.getByLabelText('Email 1');
}

function getEmail2InputField() {
	return screen.getByLabelText('Second Teammate’s Email (optional)');
}

function renderWithToken(token: string) {
	const initialEntry =
		token !== '' ? '/change-emails?token=' + token : '/change-emails';
	render(
		<MemoryRouter initialEntries={[initialEntry]}>
			<Routes>
				<Route element={<ChangeTeamDetailsPage />} path="/change-emails" />
			</Routes>
		</MemoryRouter>
	);
}
