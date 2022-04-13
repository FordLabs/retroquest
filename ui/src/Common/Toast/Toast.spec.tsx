/*
 * Copyright (c) 2022. Ford Motor Company
 *  All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { Toast, ToastLevel } from './Toast';

describe('Toast', () => {
	it('should display content passed to Toast', () => {
		createToast();
		screen.getByText('Something appears to have gone wrong.');
	});

	it('should display title passed to Toast', () => {
		createToast();
		screen.getByText('Uh Oh');
	});

	describe('Toast Level', () => {
		it('should default Toast level to error', () => {
			createToast();
			expect(getToastElement()).toHaveClass('error');
		});

		it("should have 'error' toast level class", () => {
			createToastWithLevel(ToastLevel.ERROR);
			expect(getToastElement()).toHaveClass('error');
		});

		it("should have 'warning' toast level class", () => {
			createToastWithLevel(ToastLevel.WARNING);
			expect(screen.getByTestId('toast')).toHaveClass('warning');
		});

		it("should have 'info' toast level class", () => {
			createToastWithLevel(ToastLevel.INFO);
			expect(screen.getByTestId('toast')).toHaveClass('info');
		});
	});

	it('should close handler when close button clicked', () => {
		const mockCloseHandler = jest.fn();
		render(
			<Toast title="Uh Oh" handleClose={mockCloseHandler}>
				Something appears to have gone wrong.
			</Toast>
		);
		fireEvent.click(screen.getByText('Close'));
		expect(mockCloseHandler).toHaveBeenCalled();
	});
});

function createToast() {
	render(
		<Toast title="Uh Oh" handleClose={() => null}>
			Something appears to have gone wrong.
		</Toast>
	);
}

function createToastWithLevel(level: ToastLevel) {
	render(
		<Toast title="Uh Oh" toastLevel={level} handleClose={() => null}>
			Something appears to have gone wrong.
		</Toast>
	);
}

function getToastElement() {
	return screen.getByTestId('toast');
}
