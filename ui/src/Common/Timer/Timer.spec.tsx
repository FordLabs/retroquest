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

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';

import { DropdownOption } from '../Dropdown/Dropdown';

import Timer from './Timer';

const expectedOption_30Sec = {
	label: '00:30',
	value: 30,
};
const expectedOption_1Min = {
	label: '01:00',
	value: 60,
};
const expectedOption_5Min = {
	label: '05:00',
	value: 300,
};
const expectedOption_10Min = {
	label: '10:00',
	value: 600,
};

describe('Timer', () => {
	let container: string | Element;

	beforeEach(() => {
		jest.useFakeTimers();

		({ container } = render(<Timer />));
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should render without axe errors', async () => {
		jest.useRealTimers();
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should show hidden label for accessibility', () => {
		expect(screen.getByLabelText('Timer amount')).toBeDefined();
	});

	describe('Set Timer', () => {
		it('should set timer to 30s', () => {
			userEvent.selectOptions(
				getSelect(),
				expectedOption_30Sec.value.toString()
			);
			confirmOptionIsSelected(expectedOption_30Sec);
		});

		it('should set timer to 1min', () => {
			userEvent.selectOptions(
				getSelect(),
				expectedOption_1Min.value.toString()
			);
			confirmOptionIsSelected(expectedOption_1Min);
		});

		it('should set timer to 5min', () => {
			userEvent.selectOptions(
				getSelect(),
				expectedOption_5Min.value.toString()
			);
			confirmOptionIsSelected(expectedOption_5Min);
		});

		it('should set timer to 10min', () => {
			userEvent.selectOptions(
				getSelect(),
				expectedOption_10Min.value.toString()
			);
			confirmOptionIsSelected(expectedOption_10Min);
		});
	});

	describe('Using Timer', () => {
		it('should display 5 minutes as the default', () => {
			confirmOptionIsSelected(expectedOption_5Min);
		});

		it('should not change time if play button is not pressed', () => {
			advanceTimersSafely(1010);
			confirmOptionIsSelected(expectedOption_5Min);
		});

		it('should count time down when play button is pressed', async () => {
			startTimer();
			advanceTimersSafely(3010);
			await screen.findByText('04:57');
		});

		it('should stop the timer if the pause button is pressed', () => {
			startTimer();
			advanceTimersSafely(3010);
			pauseTimer();
			advanceTimersSafely(3010);
			screen.getByText('04:57');
		});

		it('should reset the timer when the reset button is pressed', () => {
			startTimer();
			advanceTimersSafely(3010);
			resetTimer();
			confirmOptionIsSelected(expectedOption_5Min);
		});
	});

	describe('Display states', () => {
		it('should not show pause button if timer is not running', () => {
			const pauseButton = screen.queryByAltText('Pause timer');
			expect(pauseButton).toBeNull();
		});

		it('should not show play button if timer is running', () => {
			startTimer();
			const playButton = screen.queryByAltText('Start timer');
			expect(playButton).toBeNull();
		});

		it('should not show dropdown when timer is paused or running', () => {
			const querySelect = () => screen.queryByTestId('dropdown-select');
			expect(querySelect()).not.toBeNull();
			startTimer();
			expect(querySelect()).toBeNull();
			pauseTimer();
			expect(querySelect()).toBeNull();
			resetTimer();
			expect(querySelect()).toBeDefined();
		});
	});
});

function advanceTimersSafely(duration: number) {
	act(() => {
		jest.advanceTimersByTime(duration);
	});
}

function confirmOptionIsSelected(expectedOption: DropdownOption) {
	const actualOption: HTMLOptionElement = screen.getByRole('option', {
		name: expectedOption.label,
	});
	expect(actualOption.selected).toBe(true);
	expect(actualOption.label).toBe(expectedOption.label);
	expect(actualOption.value).toBe(expectedOption.value.toString());
}

function getSelect() {
	return screen.getByTestId('dropdown-select');
}

function startTimer() {
	userEvent.click(screen.getByAltText('Start timer'));
}

function pauseTimer() {
	userEvent.click(screen.getByAltText('Pause timer'));
}

function resetTimer() {
	userEvent.click(screen.getByAltText('Reset timer'));
}
