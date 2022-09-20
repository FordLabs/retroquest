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

import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import InputTeamName from './InputTeamName';

describe('Input Team Name', () => {
	describe('Validation Message', () => {
		const expectedValidationMessage =
			'Must have: letters, numbers, and spaces only';

		it('should show validation message on focus', () => {
			render(<InputTeamName value="" onChange={() => {}} />);
			expect(screen.queryByText(expectedValidationMessage)).toBeNull();
			screen.getByTestId('teamNameInput').focus();
			expect(screen.getByText(expectedValidationMessage)).toBeDefined();
		});

		it('should be able to resist validating', () => {
			render(
				<InputTeamName value="" onChange={() => {}} validateInput={false} />
			);
			expect(screen.queryByText(expectedValidationMessage)).toBeNull();
			screen.getByTestId('teamNameInput').focus();
			expect(screen.queryByText(expectedValidationMessage)).toBeNull();
		});

		it('should hide validation message when user types a valid name (even on focus)', () => {
			function TestComponent() {
				const [name, setName] = useState<string>('');
				return (
					<InputTeamName
						value={name}
						onChange={(name, validity) => setName(name)}
					/>
				);
			}

			render(<TestComponent />);
			expect(screen.queryByText(expectedValidationMessage)).toBeNull();
			const teamNameInput = screen.getByTestId('teamNameInput');
			userEvent.type(teamNameInput, 'e@');
			expect(screen.getByText(expectedValidationMessage)).toBeDefined();
			userEvent.clear(teamNameInput);
			userEvent.type(teamNameInput, 'e');
			teamNameInput.focus();
			expect(screen.queryByText(expectedValidationMessage)).toBeNull();
		});
	});
});
