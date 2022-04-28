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
import userEvent from '@testing-library/user-event';

import ArchivedBoardListHeader from './ArchivedBoardListHeader';

describe('Archived Board List Header', () => {
	it('should toggle from ascending to descending and back for date click', () => {
		const onDateClick = jest.fn();
		const onHashClick = jest.fn();
		render(
			<ArchivedBoardListHeader
				onDateClick={onDateClick}
				onHashClick={onHashClick}
			/>
		);

		clickDateSortingButton();
		expect(onDateClick).toHaveBeenCalledWith('ASC');

		clickDateSortingButton();
		expect(onDateClick).toHaveBeenCalledWith('DESC');

		clickDateSortingButton();
		expect(onDateClick).toHaveBeenCalledWith('ASC');
		expect(onHashClick).not.toHaveBeenCalled();
	});

	it('should toggle from descending to ascending and back for hash click', () => {
		const onDateClick = jest.fn();
		const onHashClick = jest.fn();
		render(
			<ArchivedBoardListHeader
				onDateClick={onDateClick}
				onHashClick={onHashClick}
			/>
		);

		clickThoughtCountSortingButton();
		expect(onHashClick).toHaveBeenCalledWith('DESC');

		clickThoughtCountSortingButton();
		expect(onHashClick).toHaveBeenCalledWith('ASC');

		clickThoughtCountSortingButton();
		expect(onHashClick).toHaveBeenCalledWith('DESC');
		expect(onDateClick).not.toHaveBeenCalled();
	});
});

function clickDateSortingButton() {
	userEvent.click(screen.getByText('Date'));
}

function clickThoughtCountSortingButton() {
	userEvent.click(screen.getByText('#'));
}
