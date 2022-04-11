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

import { act, fireEvent, render, screen } from '@testing-library/react';

import Timer from './Timer';

describe('Timer', () => {
	beforeEach(function () {
		jest.useFakeTimers();
	});

	afterEach(function () {
		jest.useRealTimers();
	});

	it('should display 5 minutes as the default', () => {
		render(<Timer />);
		screen.getByText('05:00');
	});

	it('should not change time if play not pressed', () => {
		render(<Timer />);
		advanceTimersSafely(1010);
		screen.getByText('05:00');
	});

	it('should count time down play button pressed', () => {
		render(<Timer />);
		fireEvent.click(screen.getByAltText('Start timer'));
		advanceTimersSafely(3010);
		screen.getByText('04:57');
	});

	it('should stop the timer if the pause button is pressed', () => {
		render(<Timer />);
		fireEvent.click(screen.getByAltText('Start timer'));
		advanceTimersSafely(3010);
		fireEvent.click(screen.getByAltText('Pause timer'));
		advanceTimersSafely(3010);
		screen.getByText('04:57');
	});

	it('should not show pause button if timer not running', () => {
		render(<Timer />);
		const pauseButton = screen.queryByAltText('Pause timer');
		expect(pauseButton).toBeNull();
	});

	it('should not show play button if timer is running', () => {
		render(<Timer />);
		fireEvent.click(screen.getByAltText('Start timer'));
		const playButton = screen.queryByAltText('Start timer');
		expect(playButton).toBeNull();
	});

	it('should reset the timer when the reset button is pressed', () => {
		render(<Timer />);
		fireEvent.click(screen.getByAltText('Start timer'));
		advanceTimersSafely(3010);
		fireEvent.click(screen.getByAltText('Reset timer'));
		screen.getByText('05:00');
	});
});

function advanceTimersSafely(duration: number) {
	act(() => {
		jest.advanceTimersByTime(duration);
	});
}
