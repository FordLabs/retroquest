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

import axios, { AxiosResponse } from 'axios';

import { Column } from '../../Types/Column';

import getAuthConfig from './getAuthConfig';

const ColumnService = {
	getColumns(teamId: string): Promise<Column[]> {
		const url = `/api/team/${teamId}/columns`;
		return axios.get(url, getAuthConfig()).then((response) => response.data);
	},

	updateTitle(
		teamId: string,
		columnId: number,
		title: string
	): Promise<AxiosResponse<void>> {
		const url = `/api/team/${teamId}/column/${columnId}/title`;
		return axios.put(url, { title }, getAuthConfig());
	},
};

export default ColumnService;
