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

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecoilRoot } from 'recoil';
import { mockTeam } from 'Services/Api/__mocks__/TeamService';
import BoardService from 'Services/Api/BoardService';
import { ModalContents, ModalContentsState } from 'State/ModalContentsState';
import { TeamState } from 'State/TeamState';
import { RecoilObserver } from 'Utils/RecoilObserver';

import DeleteBoardConfirmation from './DeleteBoardConfirmation';

jest.mock('Services/Api/BoardService');

describe('Delete Board Confirmation', () => {
	let modalContent: ModalContents | null;
	let onBoardDeletion: jest.Mock<any, any>;
	const boardId: number = 8432;

	beforeEach(() => {
		jest.clearAllMocks();

		modalContent = null;
		onBoardDeletion = jest.fn();

		render(
			<RecoilRoot
				initializeState={({ set }) => {
					set(TeamState, mockTeam);
					set(ModalContentsState, {
						title: 'Title',
						component: <>component</>,
					});
				}}
			>
				<RecoilObserver
					recoilState={ModalContentsState}
					onChange={(value: ModalContents) => {
						modalContent = value;
					}}
				/>
				<DeleteBoardConfirmation
					boardId={boardId}
					onBoardDeletion={onBoardDeletion}
				/>
			</RecoilRoot>
		);
	});

	it('should ask user if they want to delete archived thoughts', () => {
		expect(screen.getByText('Delete Archived Thoughts?')).toBeInTheDocument();
	});

	it('should delete board and close modal', async () => {
		userEvent.click(screen.getByText('Yes, Delete'));

		await waitFor(() =>
			expect(BoardService.deleteBoard).toHaveBeenCalledWith(
				mockTeam.id,
				boardId
			)
		);
		expect(onBoardDeletion).toHaveBeenCalled();
		expect(modalContent).toBe(null);
	});

	it('should cancel deleting of a board', () => {
		userEvent.click(screen.getByText('Cancel'));

		expect(BoardService.deleteBoard).not.toHaveBeenCalled();
		expect(onBoardDeletion).not.toHaveBeenCalled();
		expect(modalContent).toBe(null);
	});
});
