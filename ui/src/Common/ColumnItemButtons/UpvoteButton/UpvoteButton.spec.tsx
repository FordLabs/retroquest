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

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import UpvoteButton from './UpvoteButton';

describe('Upvote Button', () => {
	const mockOnClick = jest.fn();

	it('should display number of votes', () => {
		render(<UpvoteButton votes={5} />);
		expect(screen.getByText('5')).toBeDefined();
	});

	it('should display star icon', () => {
		render(<UpvoteButton votes={5} />);
		const starIcon = screen.getByTestId('starIcon');
		expect(starIcon).toHaveClass('fas fa-star');
	});

	it('should have tooltip', () => {
		render(<UpvoteButton votes={4} />);
		expect(screen.getByText('Upvote')).toBeDefined();
	});

	it('should handle clicks', () => {
		render(
			<UpvoteButton
				votes={4}
				onClick={mockOnClick}
				data-testid="upvoteButton"
			/>
		);

		const upvoteButton = screen.getByTestId('upvoteButton');
		userEvent.click(upvoteButton);

		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});

	it('can be disabled', () => {
		render(
			<UpvoteButton
				votes={4}
				onClick={mockOnClick}
				disabled={true}
				data-testid="upvoteButton"
			/>
		);
		const upvoteButton = screen.getByTestId('upvoteButton');
		userEvent.click(upvoteButton);

		expect(mockOnClick).toHaveBeenCalledTimes(0);
		expect(upvoteButton).toBeDisabled();
	});
});
