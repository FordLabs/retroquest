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
import teamService from 'Services/Api/TeamService';
import { ModalContentsState } from 'State/ModalContentsState';
import { TeamState } from 'State/TeamState';

import Settings, { SettingsTabs } from '../../../Settings';

import './AddBoardOwnersConfirmation.scss';

interface Props {
	email1: string;
	email2?: string;
}

function AddBoardOwnersConfirmationForm(props: Readonly<Props>) {
	const { email1, email2 = '' } = props;

	const team = useRecoilValue(TeamState);
	const setModalContents = useSetRecoilState(ModalContentsState);

	function onSubmit() {
		teamService
			.updateTeamEmailAddresses(team.id, email1, email2)
			.then(() => {
				setModalContents({
					title: 'Settings',
					component: <Settings activeTab={SettingsTabs.ACCOUNT} />,
				});
			})
			.catch(console.error);
	}

	function onCancel() {
		setModalContents({
			title: 'Settings',
			component: (
				<Settings
					activeTab={SettingsTabs.ACCOUNT}
					accountTabData={{
						email1,
						email2,
					}}
				/>
			),
		});
	}

	return (
		<ConfirmationModal
			title="Add Board Owners?"
			subtitle={`These emails will be the board owners for everyone at ${team.name}.`}
			onSubmit={onSubmit}
			onCancel={onCancel}
			cancelButtonText="Cancel"
			submitButtonText="Yes, Add Board Owners"
			className="add-board-owners-confirmation-form"
		>
			<div className="board-owners-container">
				<div className="board-owners-label">Board Owners</div>
				<div className="team-email">{email1}</div>
				<div className="team-email">{email2}</div>
			</div>
		</ConfirmationModal>
	);
}

export default AddBoardOwnersConfirmationForm;
