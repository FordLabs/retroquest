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

import { Contributor } from '../../Types/Contributor';

import { CONTRIBUTORS_API_PATH } from './ApiConstants';

const ContributorsService = {
	get(): Promise<Contributor[]> {
		return axios.get(CONTRIBUTORS_API_PATH).then((res) => {
			const contributors: Contributor[] = [...res.data].map(
				(contributor: Contributor) => ({
					accountUrl: contributor.accountUrl,
					image: `data:image/png;base64,${contributor.image}`,
				})
			);
			return contributors;
		});
	},
};

export default ContributorsService;
