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
import { mockBoards } from 'Services/Api/__mocks__/BoardService';

import ArchivedBoardTile from './ArchivedBoardTile';

describe('Archived Board Tile', () => {
	let onViewBtnClick: jest.Mock<any, any>;
	let onDeleteBtnClick: jest.Mock<any, any>;

	beforeEach(() => {
		onViewBtnClick = jest.fn();
		onDeleteBtnClick = jest.fn();
		render(
			<ArchivedBoardTile
				board={mockBoards[0]}
				onViewBtnClick={onViewBtnClick}
				onDeleteBtnClick={onDeleteBtnClick}
			/>
		);
	});

	it('should display the number of thoughts in a board', () => {
		screen.getByText('1');
	});

	it('should display the date the board was archived', () => {
		screen.getByText('October 1st, 1982');
	});

	it('should display view button', () => {
		screen.getByText('View');
	});

	it('should trigger onViewButtonClick when clicking "View" button', () => {
		fireEvent.click(screen.getByText('View'));
		expect(onViewBtnClick).toHaveBeenCalledWith(mockBoards[0]);
	});

	it('should trigger onDeleteButtonClick when clicking "Delete" button', () => {
		fireEvent.click(screen.getByText('Delete'));
		expect(onDeleteBtnClick).toHaveBeenCalledWith(mockBoards[0]);
	});
});
