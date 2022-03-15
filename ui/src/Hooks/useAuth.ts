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
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import {
	getLoginPagePathWithTeamId,
	getRetroPagePathWithTeamId,
} from '../RouteConstants';
import { AuthResponse } from '../Services/Api/TeamService';
import CookieService from '../Services/CookieService';
import { TeamState } from '../State/TeamState';

interface UseAuth {
	login: (authResponse: AuthResponse) => void;
	logout: () => void;
}

export default function useAuth(): UseAuth {
	const team = useRecoilValue(TeamState);
	const navigate = useNavigate();

	const logout = () => {
		CookieService.clearToken();

		const loginPagePath = getLoginPagePathWithTeamId(team.id);
		navigate(loginPagePath, { replace: true });
	};

	const login = ({ token, teamId }: AuthResponse) => {
		CookieService.setToken(token);

		const retroPagePath = getRetroPagePathWithTeamId(teamId);
		navigate(retroPagePath, { replace: true });
	};

	return {
		login,
		logout,
	};
}
