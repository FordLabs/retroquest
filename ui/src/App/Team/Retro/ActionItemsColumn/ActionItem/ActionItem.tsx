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

import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { ActionItemByIdState } from '../../../../../State/ActionItemState';

import DefaultActionItemView from './DefaultActionItemView/DefaultActionItemView';
import DeleteActionItemView from './DeleteActionItemView/DeleteActionItemView';
import EditActionItemView from './EditActionItemView/EditActionItemView';

export enum ActionItemViewState {
	DELETE_ACTION_ITEM = 'delete-action-item',
	EDIT_ACTION_ITEM = 'edit-action-item',
	DEFAULT = 'default-action-item',
}

interface Props {
	actionItemId: number;
}

function ActionItem(props: Props) {
	const { actionItemId } = props;

	const actionItem = useRecoilValue(ActionItemByIdState(actionItemId));

	const [viewState, setViewState] = useState<ActionItemViewState>(
		ActionItemViewState.DEFAULT
	);
	const [actionItemMinHeight, setActionItemMinHeight] = useState<number>();

	if (!actionItem) return <></>;

	switch (viewState) {
		case ActionItemViewState.DELETE_ACTION_ITEM:
			return (
				<DeleteActionItemView
					actionItemId={actionItem.id}
					setViewState={setViewState}
					height={actionItemMinHeight}
				/>
			);
		case ActionItemViewState.EDIT_ACTION_ITEM:
			return (
				<EditActionItemView
					actionItem={actionItem}
					setViewState={setViewState}
				/>
			);
		default:
			return (
				<DefaultActionItemView
					actionItem={actionItem}
					setViewState={setViewState}
					setActionItemMinHeight={setActionItemMinHeight}
				/>
			);
	}
}

export default ActionItem;
