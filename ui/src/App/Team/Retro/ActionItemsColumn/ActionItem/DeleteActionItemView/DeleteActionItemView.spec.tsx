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
import { getMockActionItem } from 'Services/Api/__mocks__/ActionItemService';
import { mockTeam } from 'Services/Api/__mocks__/TeamService';
import ActionItemService from 'Services/Api/ActionItemService';
import { TeamState } from 'State/TeamState';
import Action from 'Types/Action';
import renderWithRecoilRoot from 'Utils/renderWithRecoilRoot';

import { ActionItemViewState } from '../ActionItem';

import DeleteActionItemView from './DeleteActionItemView';

jest.mock('Services/Api/ActionItemService');

describe('Delete Action Item View', () => {
	let mockSetViewState: jest.Mock;

	const fakeActionItem: Action = getMockActionItem();
	let container: string | Element;

	beforeEach(() => {
		mockSetViewState = jest.fn();

		({ container } = renderWithRecoilRoot(
			<DeleteActionItemView
				height={50}
				setViewState={mockSetViewState}
				actionItemId={fakeActionItem.id}
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

		expect(mockSetViewState).toHaveBeenCalledWith(ActionItemViewState.DEFAULT);
		expect(ActionItemService.delete).not.toHaveBeenCalled();
	});

	it('should not delete thought when user cancels deletion', () => {
		userEvent.click(screen.getByText('No'));

		expect(mockSetViewState).toHaveBeenCalledWith(ActionItemViewState.DEFAULT);
		expect(ActionItemService.delete).not.toHaveBeenCalled();
	});

	it('should delete thought when user confirms deletion', async () => {
		userEvent.click(screen.getByText('Yes'));

		await waitFor(() =>
			expect(ActionItemService.delete).toHaveBeenCalledWith(
				mockTeam.id,
				fakeActionItem.id
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
