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

import axios from 'axios';

import { mockGetCookie } from '../../__mocks__/universal-cookie';

import { mockColumns } from './__mocks__/ColumnService';
import ColumnService from './ColumnService';

describe('Column Service', () => {
	const teamId = 'teamId';
	const fakeToken = 'fake-token';
	const mockConfig = { headers: { Authorization: `Bearer ${fakeToken}` } };

	beforeAll(() => {
		mockGetCookie.mockReturnValue(fakeToken);
	});

	describe('getColumns', () => {
		it('should get all columns for team', async () => {
			axios.get = jest.fn().mockResolvedValue({ data: mockColumns });

			const actualColumns = await ColumnService.getColumns(teamId);
			expect(actualColumns).toEqual(mockColumns);
			expect(axios.get).toHaveBeenCalledWith(
				`/api/team/${teamId}/columns`,
				mockConfig
			);
		});
	});

	describe('updateTitle', () => {
		it('should update title for specified column', () => {
			const columnId = 1;
			const newTitle = 'This is New!';
			ColumnService.updateTitle(teamId, columnId, newTitle);
			expect(axios.put).toHaveBeenCalledWith(
				`/api/team/${teamId}/column/${columnId}/title`,
				{ title: newTitle },
				mockConfig
			);
		});
	});
});
