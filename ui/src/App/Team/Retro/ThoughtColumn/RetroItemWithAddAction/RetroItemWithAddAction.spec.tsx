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

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecoilRoot } from 'recoil';

import Thought from '../../../../../Types/Thought';
import Topic from '../../../../../Types/Topic';

import RetroItemWithAddAction from './RetroItemWithAddAction';

jest.mock('axios');

describe('RetroItemWithAddAction', () => {
	const fakeThought: Thought = {
		id: 0,
		message: 'fake thought',
		hearts: 3,
		discussed: false,
		topic: Topic.HAPPY,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render active retro item', () => {
		renderComponent(fakeThought);

		screen.getByText(fakeThought.message);
		screen.getByTestId('retroItem');
	});

	it('should not animate action item card', () => {
		renderComponent(fakeThought);
		const retroItem = screen.getByTestId('retroItem');
		expect(retroItem.className).not.toContain('fade-in');
		expect(retroItem.className).not.toContain('fade-out');
	});

	describe('Not readonly', () => {
		beforeEach(() => {
			renderComponent(fakeThought);
		});

		it('should show action item form when add action item button is clicked', () => {
			clickAddActionItem();

			screen.getByTestId('addActionItem');
		});

		it('should hide action item form when discard button is clicked', () => {
			clickAddActionItem();

			clickDiscard();

			expect(screen.queryByTestId('addActionItem')).toBeFalsy();
		});
	});

	describe('Readonly', () => {
		beforeEach(() => {
			renderComponent(fakeThought, true);
		});

		it('should not show add action button', () => {
			expect(screen.queryByText('Add Action Item')).toBeFalsy();
		});
	});
});

function clickAddActionItem() {
	userEvent.click(screen.getByText('Add Action Item'));
}

function clickDiscard() {
	userEvent.click(screen.getByText('Discard'));
}

const renderComponent = (fakeThought: Thought, readOnly?: boolean) => {
	render(
		<RecoilRoot>
			<RetroItemWithAddAction
				type={Topic.HAPPY}
				thought={fakeThought}
				readOnly={readOnly}
			/>
		</RecoilRoot>
	);
};
