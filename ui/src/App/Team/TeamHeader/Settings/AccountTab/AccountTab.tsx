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

import { useRecoilValue } from 'recoil';
import { TeamState } from 'State/TeamState';

import AddBoardOwnersForm from './AddBoardOwnersForm/AddBoardOwnersForm';

import './AccountTab.scss';

function AccountTab(): JSX.Element {
	const team = useRecoilValue(TeamState);

	function teamHasEmail(): boolean {
		return !!team.email || !!team.secondaryEmail;
	}

	return (
		<div className="tab-body account-tab-body" data-testid="accountTab">
			{!teamHasEmail() && <AddBoardOwnersForm />}
			{teamHasEmail() && (
				<div>
					<div className="label">Board Owners</div>
					<div className="team-email">{team.email}</div>
					<div className="team-email">{team.secondaryEmail}</div>
				</div>
			)}
		</div>
	);
}

export default AccountTab;
