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

import ResetPasswordPage from './ResetPasswordPage';

jest.mock('Services/Api/TeamService');

describe('Reset Password Page', () => {
	it('should have a field for password and password confirmation, plus a disabled submit button', async () => {
		renderWithToken('');
		expect(screen.getByLabelText('New Password')).toBeInTheDocument();
		const submitButton = screen.getByText('Reset Password');
		expect(submitButton).toBeInTheDocument();
		expect(submitButton).toBeDisabled();
	});

	it('should enable submit button once user types into form', () => {
		renderWithToken('');
		typeIntoNewPasswordField();
		expect(screen.getByText('Reset Password')).not.toBeDisabled();
	});

	it('should send passwords to the backend on submission', async () => {
		renderWithToken('');
		submitValidForm();

		await waitFor(() =>
			expect(TeamService.setPassword).toHaveBeenCalledWith(
				'p@ssw0rd',
				expect.anything()
			)
		);
	});

	it('should send the secret code in the body to the backend on submission', async () => {
		renderWithToken('ABC123');
		submitValidForm();

		await waitFor(() =>
			expect(TeamService.setPassword).toHaveBeenCalledWith(
				expect.anything(),
				'ABC123'
			)
		);
	});

	it('should not send to the API if there is no password', () => {
		renderWithToken('');
		submitValidForm('');
		expect(TeamService.setPassword).toHaveBeenCalledTimes(0);
	});

	it('should show "Saved!" if the backend returns 200 after submission', async () => {
		renderWithToken('ABC321');
		submitValidForm();

		await screen.findByText('Saved!');
	});

	it('should not show "Saved!" if the form is not submitted', async () => {
		renderWithToken('ABC321');
		expect(screen.queryByText('Saved!')).not.toBeInTheDocument();
	});
});

function submitValidForm(password: string = 'p@ssw0rd') {
	typeIntoNewPasswordField(password);
	fireEvent.click(screen.getByText('Reset Password'));
}

function typeIntoNewPasswordField(password: string = 'p@ssw0rd') {
	fireEvent.change(screen.getByLabelText('New Password'), {
		target: { value: password },
	});
}

function renderWithToken(token: string) {
	const initialEntry =
		token !== '' ? '/change-password?token=' + token : '/change-password';
	render(
		<MemoryRouter initialEntries={[initialEntry]}>
			<Routes>
				<Route element={<ResetPasswordPage />} path={'/change-password'} />
			</Routes>
		</MemoryRouter>
	);
}
