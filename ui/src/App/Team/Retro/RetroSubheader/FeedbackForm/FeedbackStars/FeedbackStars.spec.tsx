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

import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';

import FeedbackStars from './FeedbackStars';

describe('Feedback Stars', () => {
	let container: string | Element;
	const highlightedStarClass = 'highlight';

	beforeEach(() => {
		({ container } = render(<FeedbackStarTestRenderer />));
	});

	it('should render without axe errors', async () => {
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should hover stars', () => {
		hoverStar(4);

		expect(getStar(1).className).toContain(highlightedStarClass);
		expect(getStar(2).className).toContain(highlightedStarClass);
		expect(getStar(3).className).toContain(highlightedStarClass);
		expect(getStar(4).className).toContain(highlightedStarClass);
		expect(getStar(5).className).not.toContain(highlightedStarClass);
	});

	it('should select stars', () => {
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

	it('should still hover stars after select', () => {
		clickStar(2);

		expect(getStar(1).className).toContain(highlightedStarClass);
		expect(getStar(2).className).toContain(highlightedStarClass);
		expect(getStar(3).className).not.toContain(highlightedStarClass);

		hoverStar(3);

		expect(getStar(1).className).toContain(highlightedStarClass);
		expect(getStar(2).className).toContain(highlightedStarClass);
		expect(getStar(3).className).toContain(highlightedStarClass);
		expect(getStar(4).className).not.toContain(highlightedStarClass);
		expect(getStar(5).className).not.toContain(highlightedStarClass);
	});
});

function FeedbackStarTestRenderer() {
	const [stars, setStars] = useState(0);

	return (
		<>
			<div>selected:{stars}</div>
			<button onClick={() => setStars(0)}>reset</button>
			<FeedbackStars value={stars} onChange={setStars} />
		</>
	);
}

const getStar = (starIndex: number) => {
	return screen.getByTestId(getStarTestId(starIndex));
};

function getStarTestId(starIndex: number) {
	return `feedback-star-${starIndex}-input`;
}

function clickStar(starIndex: number) {
	const star = screen.getByTestId(getStarTestId(starIndex));
	userEvent.click(star);
}

function hoverStar(starIndex: number) {
	const star = screen.getByTestId(`feedback-star-${starIndex}-label`);
	userEvent.hover(star);
}

function resetStars() {
	userEvent.click(screen.getByText('reset'));
}

function expectSelectedStars(count: number) {
	screen.getByText(`selected:${count}`);
}
