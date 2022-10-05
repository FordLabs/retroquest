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

import { fireEvent, screen, waitFor } from '@testing-library/react';
import TeamService from 'Services/Api/TeamService';
import { TeamState } from 'State/TeamState';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import AddBoardOwnersForm from './AddBoardOwnersForm';

jest.mock('Services/Api/TeamService');

describe('Add Board Owners Form', () => {
	it('should fill out form with one email and successfully submit form', async () => {
		const email1 = 'email1@mail.co';
		renderAddBoardOwnersForm();

		typeIntoFirstEmailField(email1);
		submitForm();

		await waitFor(() =>
			expect(TeamService.updateTeamEmailAddresses).toHaveBeenCalledWith(
				'team-id',
				email1,
				''
			)
		);
	});

	it('should fill out form with two emails and successfully submit form', async () => {
		const email1 = 'email1@mail.co';
		const email2 = 'email2@mail.co';
		renderAddBoardOwnersForm();

		typeIntoFirstEmailField(email1);
		typeIntoSecondEmailField(email2);
		submitForm();

		await waitFor(() =>
			expect(TeamService.updateTeamEmailAddresses).toHaveBeenCalledWith(
				'team-id',
				email1,
				email2
			)
		);
	});

	it('should not enable submit button until first email field is populated and valid', () => {
		renderAddBoardOwnersForm();

		expect(getSubmitButton()).toBeDisabled();
		typeIntoFirstEmailField('a@');
		expect(getSubmitButton()).toBeDisabled();
		typeIntoFirstEmailField('a@a');
		expect(getSubmitButton()).toBeEnabled();
	});

	describe('Form errors', () => {
		beforeEach(() => {
			renderAddBoardOwnersForm();

			expect(screen.queryByTestId('inputValidationMessage')).toBeNull();
			expect(screen.queryByTestId('formErrorMessage')).toBeNull();
		});

		it('should warn user when primary email is not valid', () => {
			const invalidEmail = 'Aaaaa.com';
			typeIntoFirstEmailField(invalidEmail);

			expect(screen.getByText('Valid email address required')).toBeDefined();
		});

		it('should warn user when secondary email is not valid', () => {
			const invalidEmail = 'Aaaaa.com';
			typeIntoSecondEmailField(invalidEmail);

			expect(screen.getByText('Valid email address required')).toBeDefined();
		});
	});
});

function renderAddBoardOwnersForm() {
	renderWithRecoilRoot(<AddBoardOwnersForm />, ({ set }) => {
		set(TeamState, {
			id: 'team-id',
			name: 'Team Name',
			email: '',
			secondaryEmail: '',
		});
	});
}

function typeIntoFirstEmailField(email: string) {
	fireEvent.change(screen.getByLabelText('Email Address 1'), {
		target: { value: email },
	});
}

function typeIntoSecondEmailField(email: string) {
	fireEvent.change(
		screen.getByLabelText('Second Teammate’s Email (optional)'),
		{
			target: { value: email },
		}
	);
}

function getSubmitButton() {
	return screen.getByText('Add Email');
}

function submitForm() {
	fireEvent.click(getSubmitButton());
}
