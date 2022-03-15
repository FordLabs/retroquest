/*
 * Copyright (c) 2021 Ford Motor Company
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

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FeedbackStars from './FeedbackStars';

describe('Tooltip', () => {
	it('should hover stars', () => {
		render(<FeedbackStarTestRenderer />);

		hoverStar(4);

		expectActiveStars(4);
	});

	it('should select stars', () => {
		render(<FeedbackStarTestRenderer />);
		expectSelectedStars(0);

		clickStar(3);
		expectSelectedStars(3);

		clickStar(5);
		expectSelectedStars(5);

		clickStar(1);
		expectSelectedStars(1);

		resetStars();
		expectSelectedStars(0);
	});

	it('should not hover stars after select', () => {
		render(<FeedbackStarTestRenderer />);

		clickStar(4);
		hoverStar(5);

		expectActiveStars(4);
	});
});

function FeedbackStarTestRenderer() {
	const [stars, setStars] = React.useState(0);

	return (
		<>
			<div>selected:{stars}</div>
			<div onClick={() => setStars(0)}>reset</div>
			<FeedbackStars value={stars} onChange={setStars} />
		</>
	);
}

function getStarTestId(starIndex: number) {
	return `feedback-star-${starIndex}`;
}

function clickStar(count: number) {
	userEvent.click(screen.getByTestId(getStarTestId(count)));
}

function hoverStar(count: number) {
	userEvent.hover(screen.getByTestId(getStarTestId(count)));
}

function resetStars() {
	userEvent.click(screen.getByText('reset'));
}

function expectActiveStars(count: number) {
	for (let i = 0; i < count; i++) {
		expect(screen.getByTestId(getStarTestId(i + 1)).className).toContain(
			'active'
		);
	}
	for (let i = count; i < 5; i++) {
		expect(screen.getByTestId(getStarTestId(i + 1)).className).not.toContain(
			'active'
		);
	}
}

function expectSelectedStars(count: number) {
	screen.getByText(`selected:${count}`);
}
