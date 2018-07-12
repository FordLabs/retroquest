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

import {CreateComponent} from './create.page';
import {AuthService} from '../../../auth/auth.service';
import {Subject} from 'rxjs';

describe('CreateComponent', () => {
  let component: CreateComponent;
  let mockTeamService;
  let mockRouter;

  beforeEach(() => {
    mockTeamService = jasmine.createSpyObj({'create': new Subject()});
    mockRouter = jasmine.createSpyObj({'navigateByUrl': null});

    spyOn(AuthService, 'setToken');
    spyOn(console, 'error');

    component = new CreateComponent(mockTeamService, mockRouter);
  });

  describe('create', () => {
    it('should set the error message for empty teamName', () => {
      component.teamName = '';

      component.create();

      expect(component.errorMessage).toEqual('Please enter a team name');
    });

    it('should set the error message for empty password', () => {
      component.teamName = 'Team Name';
      component.password = '';

      component.create();

      expect(component.errorMessage).toEqual('Please enter a password');
    });

    it('should set the error message and return false with miss matching passwords', () => {
      component.teamName = 'Team Name';
      component.password = 'p4ssw0rd';
      component.confirmPassword = 'password';

      component.create();

      expect(component.errorMessage).toEqual('Please enter matching passwords');
    });

    it('should not set an error when the teamName and password are not empty and the passwords match', () => {
      component.teamName = 'Team Name';
      component.password = 'p4ssw0rd';
      component.confirmPassword = 'p4ssw0rd';

      component.create();

      expect(component.errorMessage).toEqual('');
    });

    it('should set jwt as cookie and navigate to team page', () => {
      component.teamName = 'Team Name';
      component.password = 'p4ssw0rd';
      component.confirmPassword = 'p4ssw0rd';

      const teamUrl = 'team/teamId';
      const jwt = 'im.a.jwt';
      const httpResponse = {
        body: jwt,
        headers: {
          get() {
            return teamUrl;
          }
        }
      };

      component.create();
      mockTeamService.create().next(httpResponse);

      expect(AuthService.setToken).toHaveBeenCalledWith(jwt);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(teamUrl);
    });

    it('should set the error message and log it', () => {
      component.teamName = 'Team Name';
      component.password = 'p4ssw0rd';
      component.confirmPassword = 'p4ssw0rd';

      const httpErrorMessage = 'server error message';
      const error = {
        error: JSON.stringify({message: httpErrorMessage})
      };

      component.create();
      mockTeamService.create().error(error);

      expect(component.errorMessage).toEqual(httpErrorMessage);
      expect(console.error).toHaveBeenCalledWith('A registration error occurred:', httpErrorMessage);
    });
  });
});
