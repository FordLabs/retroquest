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

import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import { getMockActionItem } from '../../../../../Services/Api/__mocks__/ActionItemService';
import { ActionItemState } from '../../../../../State/ActionItemState';

import ActionItemModal from './ActionItemModal';

describe('Action Item Modal', () => {
	it('should render action item with disabled animations', () => {
		const mockAction = getMockActionItem();
		const fadeInAnimationClass = 'fade-in';
		const fadeOutAnimationClass = 'fade-out';

		render(
			<RecoilRoot
				initializeState={({ set }) => {
					set(ActionItemState, [mockAction]);
				}}
			>
				<ActionItemModal actionItemId={mockAction.id} />
			</RecoilRoot>
		);

		screen.getByText(mockAction.task);
		screen.getByDisplayValue(mockAction.assignee);
		const actionItem = screen.getByTestId('actionItem');
		expect(actionItem.className).not.toContain(fadeInAnimationClass);
		expect(actionItem.className).not.toContain(fadeOutAnimationClass);
	});
});
