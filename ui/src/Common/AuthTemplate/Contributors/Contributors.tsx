/*
 * Copyright (c) 2021 Ford Motor Company
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

import React, { useEffect, useState } from 'react';

import ContributorsService from '../../../Services/Api/ContributorsService';
import { Contributor } from '../../../Types/Contributor';

import './Contributors.scss';

function Contributors() {
	const [contributors, setContributors] = useState<Contributor[]>([]);

	useEffect(() => {
		ContributorsService.get().then(setContributors).catch(console.error);
	}, []);

	return (
		<div className="contributors">
			<div className="contributors-title-container">
				<div className="contributors-title">Code Contributors</div>
				<div className="contributors-sub-title">
					Some of the people that help make{' '}
					<span className="logo-span">RetroQuest</span> possible
				</div>
			</div>
			<div className="contributor-list">
				{contributors.map((contributor, index) => (
					<a
						href={contributor.accountUrl}
						target="_blank"
						rel="noopener noreferrer"
						key={contributor.accountUrl}
						data-testid={`rq-contributor-${index}`}
						className="contributor-link"
					>
						<img
							className="contributor-image"
							src={contributor.image}
							alt={contributor.accountUrl}
						/>
					</a>
				))}
			</div>
		</div>
	);
}

export default Contributors;
