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

import { AuthService } from '../../app/modules/auth/auth.service';
import { getLoginPagePathWithTeamId, getRetroPagePathWithTeamId } from '../routes/RouteConstants';
import { AuthResponse } from '../services/api/TeamService';
import CookieService from '../services/CookieService';
import { TeamState } from '../state/TeamState';

interface UseAuth {
  login: (authResponse: AuthResponse) => void;
  logout: () => void;
}

export default function useAuth(): UseAuth {
  const team = useRecoilValue(TeamState);

  const logout = () => {
    CookieService.clearToken();

    // @todo replace with react routing
    window.location.pathname = getLoginPagePathWithTeamId(team.id);
  };

  const login = ({ token, teamId }: AuthResponse) => {
    AuthService.setToken(token);

    // @todo replace with react routing
    window.location.pathname = getRetroPagePathWithTeamId(teamId);
  };

  return {
    login,
    logout,
  };
}
