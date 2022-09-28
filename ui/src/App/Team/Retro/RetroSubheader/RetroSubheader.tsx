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
import Timer from 'Common/Timer/Timer';
import fileSaver from 'file-saver';
import useAuth from 'Hooks/useAuth';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import TeamService from 'Services/Api/TeamService';
import { ModalContentsState } from 'State/ModalContentsState';
import { TeamState } from 'State/TeamState';

import ArchiveRetroDialog from './ArchiveRetroConfirmation/ArchiveRetroConfirmation';
import FeedbackForm from './FeedbackForm/FeedbackForm';

import './RetroSubheader.scss';

function RetroSubheader(): JSX.Element {
	const { logout } = useAuth();

	const setModalContents = useSetRecoilState(ModalContentsState);
	const team = useRecoilValue(TeamState);

	const downloadCSV = () => {
		TeamService.getCSV(team.id)
			.then((csvData) => fileSaver.saveAs(csvData, `${team.id}-board.csv`))
			.catch(console.error);
	};

	return (
		<div className="retro-subheader">
			<div className="retro-subheader-container">
				<Timer />
				<ul className="retro-subheader-links">
					<li>
						<button
							className="feedback-button button button-secondary-old"
							onClick={() =>
								setModalContents({
									component: <FeedbackForm />,
									title: 'Feedback',
								})
							}
						>
							<span className="button-text">Give Feedback</span>
							<i className="far fa-comments button-icon" aria-hidden="true" />
						</button>
					</li>
					<li>
						<button
							className="download-csv-button button button-secondary-old"
							onClick={downloadCSV}
						>
							<span className="button-text">Download CSV</span>
							<i className="fas fa-download button-icon" aria-hidden="true" />
						</button>
					</li>
					<li>
						<button
							className="download-csv-button button button-secondary-old"
							onClick={logout}
						>
							<span className="button-text">Log Out</span>
							<i className="fas fa-download button-icon" aria-hidden="true" />
						</button>
					</li>
					<li>
						<button
							className="archive-button button button-primary-old"
							onClick={() =>
								setModalContents({
									title: 'Archive Retro',
									component: <ArchiveRetroDialog />,
								})
							}
						>
							Archive Retro
						</button>
					</li>
				</ul>
			</div>
		</div>
	);
}

export default RetroSubheader;
