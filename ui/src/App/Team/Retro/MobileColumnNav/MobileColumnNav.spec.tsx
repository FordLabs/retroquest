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
import { render, screen, within } from '@testing-library/react';

import { mockColumns } from '../../../../Services/Api/__mocks__/ColumnService';

import MobileColumnNav from './MobileColumnNav';

const selectedClass = 'selected';

describe('Mobile Column Nav', () => {
	it('should set selected column as selected', () => {
		render(
			<MobileColumnNav
				columns={mockColumns}
				selectedIndex={1}
				setSelectedIndex={jest.fn()}
			/>
		);
		const buttons = screen.getAllByRole('button');
		expect(buttons[0].getAttribute('class')).not.toContain(selectedClass);
		expect(buttons[1].getAttribute('class')).toContain(selectedClass);
		expect(buttons[2].getAttribute('class')).not.toContain(selectedClass);
		expect(buttons[3].getAttribute('class')).not.toContain(selectedClass);
	});

	it('should treat a selected action item like a selected column', () => {
		render(
			<MobileColumnNav
				columns={mockColumns}
				selectedIndex={3}
				setSelectedIndex={jest.fn()}
			/>
		);
		const buttons = screen.getAllByRole('button');
		expect(buttons[0].getAttribute('class')).not.toContain(selectedClass);
		expect(buttons[1].getAttribute('class')).not.toContain(selectedClass);
		expect(buttons[2].getAttribute('class')).not.toContain(selectedClass);
		expect(buttons[3].getAttribute('class')).toContain(selectedClass);
	});

	it('should display column titles on buttons', () => {
		render(
			<MobileColumnNav
				columns={mockColumns}
				selectedIndex={1}
				setSelectedIndex={jest.fn()}
			/>
		);
		const buttons = screen.getAllByRole('button');
		expect(within(buttons[0]).queryByText('Happy Column')).not.toBeNull();
		expect(within(buttons[1]).queryByText('Confused Column')).not.toBeNull();
		expect(within(buttons[2]).queryByText('Sad Column')).not.toBeNull();
		expect(
			within(buttons[3]).queryByText('Action Items Column')
		).not.toBeNull();
	});

	it('should change selected column when clicked', () => {
		const setSelectedIndex = jest.fn();
		render(
			<MobileColumnNav
				columns={mockColumns}
				selectedIndex={1}
				setSelectedIndex={setSelectedIndex}
			/>
		);
		const columnButton = screen.getByText('Happy Column');
		columnButton.click();
		expect(setSelectedIndex).toHaveBeenCalledWith(0);
	});
});
