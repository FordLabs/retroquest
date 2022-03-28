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
import { useRecoilValue, useSetRecoilState } from 'recoil';

import ModalContentsWrapper from '../../../../../Common/ModalContentsWrapper/ModalContentsWrapper';
import BoardService from '../../../../../Services/Api/BoardService';
import { ModalContentsState } from '../../../../../State/ModalContentsState';
import { TeamState } from '../../../../../State/TeamState';

import './ArchiveRetroConfirmation.scss';

function ArchiveRetroConfirmation() {
	const team = useRecoilValue(TeamState);
	const setModalContents = useSetRecoilState(ModalContentsState);

	const closeModal = () => setModalContents(null);

	const handleSubmit = () => {
		BoardService.archiveRetro(team.id)
			.then(() => closeModal())
			.catch(console.error);
	};

	return (
		<ModalContentsWrapper
			testId="archiveRetroDialog"
			className="archive-retro-dialog"
			title="Do you want to end the retro for everybody?"
			subtitle="This will permanently archive all thoughts!"
			buttons={{
				cancel: { text: 'Nope', onClick: closeModal },
				confirm: { text: 'Yes!', onClick: handleSubmit },
			}}
		/>
	);
}

export default ArchiveRetroConfirmation;
