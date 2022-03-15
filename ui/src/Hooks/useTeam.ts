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

import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';

import TeamService from '../Services/Api/TeamService';
import { TeamState } from '../State/TeamState';

interface UseTeam {
	teamId: string;
	teamName: string;
	setTeamName: Function;
}

function useTeam(teamId: string): UseTeam {
	const setTeam = useSetRecoilState(TeamState);
	const [teamName, setTeamName] = useState('');

	useEffect(() => {
		if (teamId) {
			TeamService.getTeamName(teamId).then((activeTeamName) => {
				document.title = `${activeTeamName} | RetroQuest`;

				setTeamName(activeTeamName);
				setTeam({
					name: activeTeamName,
					id: teamId,
				});
			});
		}
	}, [teamId, setTeam]);

	return { teamId, teamName, setTeamName };
}

export default useTeam;
