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
import { fireEvent, render, screen } from '@testing-library/react';

import { mockBoards } from '../../../../../../Services/Api/__mocks__/BoardService';

import ArchivedBoardTile from './ArchivedBoardTile';

describe('Archived Board Tile', () => {
	it('should display the number of thoughts in a board', () => {
		render(
			<ArchivedBoardTile board={mockBoards[0]} onTileClicked={jest.fn()} />
		);
		screen.getByText('1');
	});

	it('should display the date the board was archived', () => {
		render(
			<ArchivedBoardTile board={mockBoards[0]} onTileClicked={jest.fn()} />
		);
		screen.getByText('October 1st, 1982');
	});

	it('should display view button', () => {
		render(
			<ArchivedBoardTile board={mockBoards[0]} onTileClicked={jest.fn()} />
		);
		screen.getByText('View');
	});

	it('should update callback when View is clicked', () => {
		const mockOnClick = jest.fn();
		render(
			<ArchivedBoardTile board={mockBoards[0]} onTileClicked={mockOnClick} />
		);
		fireEvent.click(screen.getByText('View'));
		expect(mockOnClick).toHaveBeenCalledWith(mockBoards[0]);
	});
});
