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

import InputEmail from './InputEmail';

describe('Input Email', () => {
	describe('Validation Message', () => {
		const expectedValidationMessage = 'Valid email address required';

		it('should show validation message on focus', () => {
			render(<InputEmail value="" onChange={() => {}} />);
			expect(screen.queryByText(expectedValidationMessage)).toBeNull();
			screen.getByTestId('emailInput').focus();
			expect(screen.getByText(expectedValidationMessage)).toBeDefined();
		});

		it('should hide validation message when user types a valid email (even on focus)', () => {
			function TestComponent() {
				const [email, setEmail] = useState<string>('');
				return <InputEmail value={email} onChange={setEmail} />;
			}

			render(<TestComponent />);
			expect(screen.queryByText(expectedValidationMessage)).toBeNull();
			const passwordInput = screen.getByTestId('emailInput');
			userEvent.type(passwordInput, 'e@');
			expect(screen.getByText(expectedValidationMessage)).toBeDefined();
			userEvent.type(passwordInput, 'e@m');
			passwordInput.focus();
			expect(screen.queryByText(expectedValidationMessage)).toBeNull();
		});

		it('should not show validation message if email is not required', () => {
			render(<InputEmail value="" onChange={() => {}} required={false} />);
			expect(screen.queryByText(expectedValidationMessage)).toBeNull();
			screen.getByTestId('emailInput').focus();
			expect(screen.queryByText(expectedValidationMessage)).toBeNull();
		});
	});
});
