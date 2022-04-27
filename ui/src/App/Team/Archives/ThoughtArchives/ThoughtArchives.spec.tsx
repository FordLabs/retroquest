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
import { fireEvent, screen, waitFor } from '@testing-library/react';
import BoardService from 'Services/Api/BoardService';
import { TeamState } from 'State/TeamState';

import renderWithRecoilRoot from '../../../../Utils/renderWithRecoilRoot';

import ThoughtArchives from './ThoughtArchives';

jest.mock('Services/Api/BoardService');

describe('Thought Archives', () => {
	it('should display Archived Boards List by default', async () => {
		await setUpThoughtArchives();
		expect(screen.getByText('Thought Archives')).toBeDefined();
	});

	it('should display board when selected', async () => {
		await setUpThoughtArchives();
		fireEvent.click(screen.getAllByText('View')[0]);

		await waitFor(() => expect(BoardService.getBoard).toHaveBeenCalled());
		expect(screen.getByText('I am a message')).toBeDefined();
	});
});

const setUpThoughtArchives = async () => {
	renderWithRecoilRoot(<ThoughtArchives />, ({ set }) => {
		set(TeamState, { id: 'teamId', name: '' });
	});

	await waitFor(() => expect(BoardService.getBoards).toHaveBeenCalled());
};
