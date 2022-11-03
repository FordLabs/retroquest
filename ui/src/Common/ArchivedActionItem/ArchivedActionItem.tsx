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

import React, { useEffect, useState } from 'react';
import DeleteSingleActionItemConfirmation from 'App/Team/Archives/ActionItemArchives/DeleteSingleActionItemConfirmation/DeleteSingleActionItemConfirmation';
import { useSetRecoilState } from 'recoil';
import { ModalContentsState } from 'State/ModalContentsState';
import Action from 'Types/Action';

import AssigneeInput from '../AssigneeInput/AssigneeInput';
import {
	CheckboxButton,
	ColumnItemButtonGroup,
	DeleteButton,
} from '../ColumnItemButtons';
import { DateCreated } from '../DateCreated/DateCreated';

import './ArchivedActionItem.scss';

interface Props {
	actionItem: Action;
	isSelected: boolean;
	onActionItemDeletion(): void;
	onActionItemCheckboxClick?(actionItemId: number, isChecked: boolean): void;
}

function ArchivedActionItem(props: Props) {
	const {
		actionItem,
		isSelected = false,
		onActionItemDeletion,
		onActionItemCheckboxClick,
	} = props;

	const setModalContents = useSetRecoilState(ModalContentsState);

	const [isChecked, setIsChecked] = useState<boolean>(isSelected);

	function deleteActionItem() {
		setModalContents({
			title: 'Delete Action Item?',
			component: (
				<DeleteSingleActionItemConfirmation
					actionItemId={actionItem.id}
					onActionItemDeletion={onActionItemDeletion}
				/>
			),
		});
	}

	useEffect(() => {
		setIsChecked(isSelected);
	}, [isSelected]);

	return (
		<div className="archived-action-item">
			<div className="archived-action-item-task">{actionItem.task}</div>
			<div className="archived-action-item-bottom">
				<AssigneeInput assignee={actionItem.assignee} readOnly />
			</div>
			<ColumnItemButtonGroup>
				<DateCreated date={actionItem.dateCreated} readOnly />
				<DeleteButton aria-label="Delete" onClick={deleteActionItem} />
				<CheckboxButton
					aria-label="Mark as complete"
					tooltipText={{ checked: 'Unselect', unchecked: 'Select' }}
					checked={isChecked}
					onClick={(checked) => {
						setIsChecked(checked);
						if (onActionItemCheckboxClick) {
							onActionItemCheckboxClick(actionItem.id, checked);
						}
					}}
				/>
			</ColumnItemButtonGroup>
		</div>
	);
}

export default ArchivedActionItem;
