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

import React from 'react';
import DeleteColumnItem from 'Common/ColumnItem/DeleteColumnItem/DeleteColumnItem';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import ActionItemService from 'Services/Api/ActionItemService';
import { ModalContentsState } from 'State/ModalContentsState';
import { TeamState } from 'State/TeamState';

import { ActionItemViewState } from '../ActionItem';

interface Props {
	actionItemId: number;
	setViewState: (viewState: ActionItemViewState) => void;
	height: number | undefined;
}

function DeleteActionItemView(props: Readonly<Props>) {
	const { actionItemId, setViewState, height } = props;

	const setModalContents = useSetRecoilState(ModalContentsState);
	const team = useRecoilValue(TeamState);

	const closeModal = () => setModalContents(null);

	const deleteActionItem = () => {
		ActionItemService.deleteOne(team.id, actionItemId)
			.then(closeModal)
			.catch(console.error);
	};

	return (
		<DeleteColumnItem
			onCancel={() => setViewState(ActionItemViewState.DEFAULT)}
			onConfirm={deleteActionItem}
			height={height}
		>
			Delete this Action Item?
		</DeleteColumnItem>
	);
}

export default DeleteActionItemView;
