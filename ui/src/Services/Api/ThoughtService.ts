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

import CreateThoughtRequest from '../../Types/CreateThoughtRequest';
import Thought from '../../Types/Thought';

import { getThoughtApiPath } from './ApiConstants';
import getAuthConfig from './getAuthConfig';

const ThoughtService = {
	create(
		teamId: string,
		createThoughtRequest: CreateThoughtRequest
	): Promise<Thought> {
		const url = getThoughtApiPath(teamId);
		return axios
			.post(url, createThoughtRequest, getAuthConfig())
			.then((response) => response.data);
	},

	getThoughts(teamId: string): Promise<Thought[]> {
		const url = `/api/team/${teamId}/thoughts`;
		return axios.get(url, getAuthConfig()).then((response) => response.data);
	},

	delete(teamId: string, thoughtId: number): Promise<void> {
		const url = `${getThoughtApiPath(teamId)}/${thoughtId}`;
		return axios.delete(url, getAuthConfig());
	},

	upvoteThought(teamId: string, thoughtId: number): Promise<void> {
		const url = `${getThoughtApiPath(teamId)}/${thoughtId}/heart`;
		return axios.put(url, getAuthConfig());
	},

	updateDiscussionStatus(
		teamId: string,
		thoughtId: number,
		discussed: boolean
	) {
		const url = `${getThoughtApiPath(teamId)}/${thoughtId}/discuss`;
		return axios.put(url, { discussed }, getAuthConfig());
	},

	updateMessage(
		teamId: string,
		thoughtId: number,
		updatedThoughtMessage: string
	) {
		const url = `${getThoughtApiPath(teamId)}/${thoughtId}/message`;
		return axios.put(url, { message: updatedThoughtMessage }, getAuthConfig());
	},

	updateColumn(
		teamId: string,
		thoughtId: number,
		columnId: number
	): Promise<void> {
		const url = `${getThoughtApiPath(teamId)}/${thoughtId}/column-id`;
		return axios.put(url, { columnId }, getAuthConfig());
	},
};

export default ThoughtService;
