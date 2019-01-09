/*
 * Copyright (c) 2018 Ford Motor Company
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

import {Observable} from 'rxjs/internal/Observable';
import {ActivatedRouteSnapshot, UrlSegment} from '@angular/router';
import {Subject} from 'rxjs/internal/Subject';
import {AuthGuard} from './auth.guard';

describe('AuthGuard', () => {

  let guard: AuthGuard;
  let mockRouter;
  let mockTeamService;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj( {
      navigate: null,
      navigateByUrl: null
    });
    mockTeamService = jasmine.createSpyObj({validateTeamId: new Subject()});
    guard = new AuthGuard(mockTeamService, mockRouter);
  });

  it('should navigate to the login page when navigating to a team page you are not authorized to see', () => {
    const mockNextRouteSnapshot = new ActivatedRouteSnapshot();
    mockNextRouteSnapshot.url = [
      new UrlSegment('team', null),
      new UrlSegment('incorrect-team', null)
    ];

    const mockState = null;

    (guard.canActivate(mockNextRouteSnapshot, mockState) as Observable<boolean>).subscribe(() => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['login', 'incorrect-team']);
    });
    mockTeamService.validateTeamId().error();
  });

  it('should navigate to the desired page when you are authorized to see it', () => {
    const mockNextRouteSnapshot = new ActivatedRouteSnapshot();
    mockNextRouteSnapshot.url = [
      new UrlSegment('team', null),
      new UrlSegment('incorrect-team', null)
    ];

    const mockState = null;

    (guard.canActivate(mockNextRouteSnapshot, mockState) as Observable<boolean>).subscribe(() => {
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
    mockTeamService.validateTeamId().next();
  });
});
