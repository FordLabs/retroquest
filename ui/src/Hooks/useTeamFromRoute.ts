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

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import TeamService from 'Services/Api/TeamService';
import { TeamState } from 'State/TeamState';
import Team from 'Types/Team';

function useTeamFromRoute(): Team {
	const { teamId = '' } = useParams();
	const [team, setTeam] = useRecoilState(TeamState);

	useEffect(() => {
		if (teamId) {
			TeamService.getTeam(teamId)
				.then((activeTeam) => {
					document.title = `${activeTeam.name} | RetroQuest`;
					setTeam(activeTeam);
				})
				.catch(console.error);
		}
	}, [teamId, setTeam]);

	return team;
}

export default useTeamFromRoute;
