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

import React, { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import ActionItemDisplayOnly from '../../../Common/ActionItemDisplayOnly/ActionItemDisplayOnly';
import NotFoundSection from '../../../Common/NotFoundSection/NotFoundSection';
import ActionItemService from '../../../Services/Api/ActionItemService';
import {
	ActionItemState,
	ActiveActionItemsState,
} from '../../../State/ActionItemState';
import { TeamState } from '../../../State/TeamState';

import './RadiatorPage.scss';

function RadiatorPage(): React.ReactElement {
	const team = useRecoilValue(TeamState);
	const setActionItems = useSetRecoilState(ActionItemState);
	const activeActionItems = useRecoilValue(ActiveActionItemsState);

	useEffect(() => {
		if (team.id) {
			ActionItemService.get(team.id, false)
				.then(setActionItems)
				.catch(console.error);
		}

		return () => {
			setActionItems([]);
		};
	}, [setActionItems, team.id]);

	return (
		<div className="radiator-page">
			<div className="radiator-subheader" />
			<div className="radiator-page-content">
				{activeActionItems.length ? (
					<>
						<h1 className="radiator-page-title">Radiator</h1>
						<p className="radiator-page-description">
							Take a look at all your team's active action items
						</p>
						<ul className="radiator-page-action-items">
							{activeActionItems.map((actionItem) => {
								return (
									<li key={`radiator-action-item-${actionItem.id}`}>
										<ActionItemDisplayOnly actionItem={actionItem} />
									</li>
								);
							})}
						</ul>
					</>
				) : (
					<NotFoundSection
						subHeader="No active action items were found."
						paragraph={
							<>
								You can create new action items on the{' '}
								<span className="bold">retro page</span>.
							</>
						}
					/>
				)}
			</div>
		</div>
	);
}

export default RadiatorPage;
