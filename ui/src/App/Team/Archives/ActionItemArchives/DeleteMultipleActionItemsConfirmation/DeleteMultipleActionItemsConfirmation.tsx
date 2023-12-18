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
import ConfirmationModal from 'Common/ConfirmationModal/ConfirmationModal';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import ActionItemService from 'Services/Api/ActionItemService';
import { ModalContentsState } from 'State/ModalContentsState';
import { TeamState } from 'State/TeamState';

interface Props {
	actionItemIds: number[];
	onActionItemDeletion(): void;
}

function DeleteMultipleActionItemsConfirmation(props: Readonly<Props>) {
	const { actionItemIds, onActionItemDeletion } = props;

	const team = useRecoilValue(TeamState);
	const setModalContents = useSetRecoilState(ModalContentsState);

	const closeModal = () => setModalContents(null);

	const onSubmit = () => {
		ActionItemService.deleteMultiple(team.id, actionItemIds)
			.then(() => {
				onActionItemDeletion();
				closeModal();
			})
			.catch(console.error);
	};

	return (
		<ConfirmationModal
			title="Delete Selected Items?"
			subtitle="Are you sure you want to delete these selected action items? This will permanently erase this data."
			onSubmit={onSubmit}
			onCancel={closeModal}
			cancelButtonText="Cancel"
			submitButtonText="Yes, Delete"
		/>
	);
}

export default DeleteMultipleActionItemsConfirmation;
