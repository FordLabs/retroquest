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
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import ThoughtService from 'Services/Api/ThoughtService';
import { TeamState } from 'State/TeamState';
import Thought from 'Types/Thought';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import { mockTeam } from '../../../../../../Services/Api/__mocks__/TeamService';
import { ThoughtItemViewState } from '../ThoughtItem';

import DeleteThoughtView from './DeleteThoughtView';

jest.mock('Services/Api/ThoughtService');

describe('Delete Thought View', () => {
	let mockSetViewState: jest.Mock<any, any>;

	const fakeThought: Thought = {
		id: 12,
		message: 'fake message',
		hearts: 3,
		discussed: false,
		columnId: 1,
	};
	let container: string | Element;

	beforeEach(() => {
		mockSetViewState = jest.fn();

		({ container } = renderWithRecoilRoot(
			<DeleteThoughtView
				height={50}
				setViewState={mockSetViewState}
				thoughtId={fakeThought.id}
			/>,
			({ set }) => {
				set(TeamState, mockTeam);
			}
		));
	});

	it('should render without axe errors', async () => {
		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	it('should set view state when user clicks escape', () => {
		userEvent.type(document.body, '{Escape}');

		expect(mockSetViewState).toHaveBeenCalledWith(ThoughtItemViewState.DEFAULT);
		expect(ThoughtService.delete).not.toHaveBeenCalled();
	});

	it('should not delete thought when user cancels deletion', () => {
		userEvent.click(screen.getByText('Cancel'));

		expect(mockSetViewState).toHaveBeenCalledWith(ThoughtItemViewState.DEFAULT);
		expect(ThoughtService.delete).not.toHaveBeenCalled();
	});

	it('should delete thought when user confirms deletion', async () => {
		userEvent.click(screen.getByText('Yes, Delete'));

		await waitFor(() =>
			expect(ThoughtService.delete).toHaveBeenCalledWith(
				mockTeam.id,
				fakeThought.id
			)
		);
	});

	it('should assign height', () => {
		expect(screen.getByTestId('deleteColumnItem')).toHaveAttribute(
			'style',
			'height: 50px;'
		);
	});
});
