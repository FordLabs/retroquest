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
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { mockBoards } from 'Services/Api/__mocks__/BoardService';
import { ModalContents, ModalContentsState } from 'State/ModalContentsState';
import { RecoilObserver } from 'Utils/RecoilObserver';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import DeleteBoardConfirmation from '../DeleteBoardConfirmation/DeleteBoardConfirmation';

import ArchivedBoardTile from './ArchivedBoardTile';

describe('Archived Board Tile', () => {
	let onBoardCheckboxClick: jest.Mock<any, any>;
	let onBoardDeletion: jest.Mock<any, any>;
	let modalContent: ModalContents | null;

	beforeEach(() => {
		onBoardDeletion = jest.fn();
		onBoardCheckboxClick = jest.fn();
		renderWithRecoilRoot(
			<MemoryRouter>
				<RecoilObserver
					recoilState={ModalContentsState}
					onChange={(value: ModalContents) => {
						modalContent = value;
					}}
				/>
				<ArchivedBoardTile
					board={mockBoards[0]}
					onBoardDeletion={onBoardDeletion}
					onBoardCheckboxClick={onBoardCheckboxClick}
					isSelected={false}
				/>
			</MemoryRouter>
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

	it('should go to single archived board on "View" button click', () => {
		const viewButton = screen.getByText('View');
		expect(viewButton).toHaveAttribute('href', `/${mockBoards[0].id}`);
	});

	it('should render the deletion checkbox as checked if the props say to', () => {
		expect(screen.getByTestId('checkboxButton')).toHaveAttribute(
			'data-checked',
			'false'
		);
	});

	it('should send a callback when the checkbox is clicked', () => {
		fireEvent.click(screen.getByTestId('checkboxButton'));
		expect(onBoardCheckboxClick).toHaveBeenCalledWith(1, true);
	});

	it('should open delete archived thoughts confirmation modal when clicking "Delete" button', async () => {
		fireEvent.click(screen.getByText('Delete'));
		await waitFor(() =>
			expect(modalContent).toEqual({
				title: 'Delete Archived Thoughts?',
				component: (
					<DeleteBoardConfirmation
						boardId={mockBoards[0].id}
						onBoardDeletion={onBoardDeletion}
					/>
				),
			})
		);
	});
});
