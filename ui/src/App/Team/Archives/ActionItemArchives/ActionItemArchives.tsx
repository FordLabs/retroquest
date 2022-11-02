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

import React, { useCallback, useEffect, useState } from 'react';
import ArchivedActionItem from 'Common/ArchivedActionItem/ArchivedActionItem';
import Checkbox from 'Common/Checkbox/Checkbox';
import NotFoundSection from 'Common/NotFoundSection/NotFoundSection';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import ActionItemService from 'Services/Api/ActionItemService';
import { ActionItemState } from 'State/ActionItemState';
import { ModalContentsState } from 'State/ModalContentsState';
import { TeamState } from 'State/TeamState';

import DeleteMultipleActionItemsConfirmation from './DeleteMultipleActionItemsConfirmation/DeleteMultipleActionItemsConfirmation';

import './ActionItemArchives.scss';

function ActionItemArchives() {
	const team = useRecoilValue(TeamState);
	const [actionItems, setActionItems] = useRecoilState(ActionItemState);
	const setModalContents = useSetRecoilState(ModalContentsState);

	const [selectedActionItemIds, setSelectedActionItemIds] = useState<number[]>(
		[]
	);

	const getActionItems = useCallback(() => {
		ActionItemService.get(team.id, true)
			.then(setActionItems)
			.catch(console.error);
	}, [setActionItems, team.id]);

	useEffect(() => {
		if (team.id) getActionItems();
	}, [getActionItems, team.id]);

	function onActionItemCheckboxClick(actionItemId: number, isChecked: boolean) {
		setSelectedActionItemIds((selectedItems: number[]) => {
			if (isChecked) {
				return [...selectedItems, actionItemId];
			} else {
				return [...selectedItems].filter((i) => i !== actionItemId);
			}
		});
	}

	function onDeleteSelectedBtnClick() {
		setModalContents({
			title: 'Delete Selected Items?',
			component: (
				<DeleteMultipleActionItemsConfirmation
					actionItemIds={selectedActionItemIds}
					onActionItemDeletion={getActionItems}
				/>
			),
		});
	}

	return (
		<div className="action-item-archives">
			{actionItems.length ? (
				<>
					<div className="action-item-archives-header">
						<div>
							<h1 className="action-item-archives-title">
								Action Item Archives
							</h1>
							<p className="action-item-archives-description">
								Examine completed action items from your team’s previous
								retrospectives
							</p>
						</div>
						<div className="actions-container">
							{selectedActionItemIds.length > 0 && (
								<button
									className="delete-selected-button"
									onClick={onDeleteSelectedBtnClick}
								>
									<i className="fa fa-trash fa-lg" aria-hidden="true" />
									Delete Selected
								</button>
							)}
							<Checkbox
								className="select-action-items-checkbox"
								id="select-action-items"
								value="Select All"
								label="Select All"
								onChange={(checked) => console.log('checked', checked)}
							/>
						</div>
					</div>
					<ul className="archived-action-items">
						{actionItems.map((actionItem) => {
							return (
								<li key={`archived-action-${actionItem.id}`}>
									<ArchivedActionItem
										actionItem={actionItem}
										onActionItemDeletion={getActionItems}
										onActionItemCheckboxClick={onActionItemCheckboxClick}
									/>
								</li>
							);
						})}
					</ul>
				</>
			) : (
				<NotFoundSection
					paragraph={
						<>
							Archives will appear when retros are ended with{' '}
							<span className="bold">completed action items</span>.
						</>
					}
				/>
			)}
		</div>
	);
}

export default ActionItemArchives;
