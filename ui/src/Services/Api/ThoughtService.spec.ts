/*
 * Copyright (c) 2022. Ford Motor Company
 *  All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import axios from 'axios';

import Topic from '../../Types/Topic';

import { getMockThought } from './__mocks__/ThoughtService';
import ThoughtService from './ThoughtService';

jest.mock('axios');

describe('Thought Service', () => {
	const teamId = 'team-id';
	const mockConfig = { headers: { Authorization: `Bearer mock-jwt-token` } };

	it('should get all thoughts for a team', async () => {
		const expected = [getMockThought(Topic.HAPPY, false, 1)];
		axios.get = jest.fn().mockResolvedValue({ data: expected });

		const actual = await ThoughtService.getThoughts(teamId);

		expect(actual).toEqual(expected);
		expect(axios.get).toHaveBeenCalledWith(
			`/api/team/${teamId}/thoughts`,
			mockConfig
		);
	});

	it('should delete a thought', async () => {
		await ThoughtService.delete(teamId, 100);
		expect(axios.delete).toHaveBeenCalledWith(
			`/api/team/${teamId}/thought/${100}`,
			mockConfig
		);
	});

	it('should upvote a thought', async () => {
		await ThoughtService.upvoteThought(teamId, 100);
		expect(axios.put).toHaveBeenCalledWith(
			`/api/team/${teamId}/thought/${100}/heart`,
			mockConfig
		);
	});

	it('should update discussion status of a thought', async () => {
		await ThoughtService.updateDiscussionStatus(teamId, 100, true);
		expect(axios.put).toHaveBeenCalledWith(
			`/api/team/${teamId}/thought/${100}/discuss`,
			{
				discussed: true,
			},
			mockConfig
		);
	});

	it('should update message on thought', async () => {
		await ThoughtService.updateMessage(teamId, 100, 'new message');
		expect(axios.put).toHaveBeenCalledWith(
			`/api/team/${teamId}/thought/${100}/message`,
			{
				message: 'new message',
			},
			mockConfig
		);
	});

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
