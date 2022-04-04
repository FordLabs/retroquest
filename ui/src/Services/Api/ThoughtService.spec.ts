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
import CreateThoughtRequest from '../../Types/CreateThoughtRequest';
import Topic from '../../Types/Topic';

import { getMockThought } from './__mocks__/ThoughtService';
import ThoughtService from './ThoughtService';

describe('Thought Service', () => {
	const teamId = 'team-id';
	const thoughtId = 1;
	const fakeToken = 'fake-token';
	const mockConfig = { headers: { Authorization: `Bearer ${fakeToken}` } };

	beforeEach(() => {
		mockGetCookie.mockReturnValue(fakeToken);
	});

	describe('create', () => {
		it('should create a new thought for column', async () => {
			const expectedThought = getMockThought(Topic.HAPPY, 1);
			axios.post = jest.fn().mockResolvedValue({ data: expectedThought });

			const createThoughtRequest: CreateThoughtRequest = {
				message: 'I had a thought..',
				topic: Topic.HAPPY,
				columnId: 10,
			};

			const actualThought = await ThoughtService.create(
				teamId,
				createThoughtRequest
			);
			expect(actualThought).toEqual(expectedThought);
			expect(axios.post).toHaveBeenCalledWith(
				`/api/team/${teamId}/thought`,
				createThoughtRequest,
				mockConfig
			);
		});
	});

	describe('getThoughts', () => {
		it('should get all thoughts for current retro', async () => {
			const expectedThoughts = [
				getMockThought(Topic.HAPPY, 1),
				getMockThought(Topic.UNHAPPY, 3),
				getMockThought(Topic.CONFUSED, 2),
			];
			axios.get = jest.fn().mockResolvedValue({ data: expectedThoughts });
			const actualThoughts = await ThoughtService.getThoughts(teamId);
			expect(actualThoughts).toEqual(expectedThoughts);
			expect(axios.get).toHaveBeenCalledWith(
				`/api/team/${teamId}/thoughts`,
				mockConfig
			);
		});
	});

	describe('delete', () => {
		it('should delete a thought', () => {
			ThoughtService.delete(teamId, thoughtId);
			expect(axios.delete).toHaveBeenCalledWith(
				`/api/team/${teamId}/thought/${thoughtId}`,
				mockConfig
			);
		});
	});

	describe('upvoteThought', () => {
		it('should update the upvotes for a thought', () => {
			ThoughtService.upvoteThought(teamId, thoughtId);
			expect(axios.put).toHaveBeenCalledWith(
				`/api/team/${teamId}/thought/${thoughtId}/heart`,
				mockConfig
			);
		});
	});

	describe('updateDiscussionStatus', () => {
		it('should update the discussion status of a thought', () => {
			const discussedState = true;
			ThoughtService.updateDiscussionStatus(teamId, thoughtId, discussedState);
			expect(axios.put).toHaveBeenCalledWith(
				`/api/team/${teamId}/thought/${thoughtId}/discuss`,
				{ discussed: discussedState },
				mockConfig
			);
		});
	});

	describe('updateMessage', () => {
		it('should the message of a thought', () => {
			const updatedThoughtMessage = 'I changed my mind..';
			ThoughtService.updateMessage(teamId, thoughtId, updatedThoughtMessage);
			expect(axios.put).toHaveBeenCalledWith(
				`/api/team/${teamId}/thought/${thoughtId}/message`,
				{ message: updatedThoughtMessage },
				mockConfig
			);
		});
	});

	describe('updateColumn', () => {
		it('should update column on thought', async () => {
			await ThoughtService.updateColumn(teamId, 100, 20);
			expect(axios.put).toHaveBeenCalledWith(
				`/api/team/${teamId}/thought/${100}/column-id`,
				{
					columnId: 20,
				},
				mockConfig
			);
		});
	});
});
