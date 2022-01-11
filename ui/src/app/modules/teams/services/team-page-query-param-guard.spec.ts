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

import { ActivatedRouteSnapshot } from '@angular/router';

import { createMockRouter } from '../../utils/testutils';

import { TeamPageQueryParamGuard } from './team-page-query-param-guard';

describe('TeamPageQueryParamGuard', () => {
  let service: TeamPageQueryParamGuard;
  let mockRouter;
  const fakeTeamId = 'FAKE TEAM ID';

  beforeEach(() => {
    mockRouter = createMockRouter();
    service = new TeamPageQueryParamGuard(mockRouter);
  });

  it('should continue to the team/teamId url if a team id query param is provided', () => {
    const mockNextRouteSnapshot = new ActivatedRouteSnapshot();
    mockNextRouteSnapshot.params = {
      teamId: fakeTeamId,
    };

    const result = service.canActivate(mockNextRouteSnapshot);
    expect(result).toBeTruthy();
  });

  it('should navigate to the login if no teamId is provided in the query param', async () => {
    const mockNextRouteSnapshot = new ActivatedRouteSnapshot();
    mockNextRouteSnapshot.params = {
      teamId: '',
    };
    await (service.canActivate(mockNextRouteSnapshot) as Promise<boolean>);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
  });
});
