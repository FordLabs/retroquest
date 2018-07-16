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

import {LoginComponent} from './login.page';
import {AuthService} from '../../../auth/auth.service';
import {Subject} from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let mockTeamService;
  let mockRouter;
  let mockRecaptchaComponent;

  beforeEach(() => {
    mockTeamService = jasmine.createSpyObj({login: new Subject()});
    mockRouter = jasmine.createSpyObj({navigateByUrl: null});
    mockRecaptchaComponent = jasmine.createSpyObj({reset: null, execute: null});

    spyOn(AuthService, 'setToken');
    spyOn(console, 'error');

    component = new LoginComponent(mockTeamService, mockRouter);
    component.recaptchaComponent = mockRecaptchaComponent
  });

  describe('useCaptchaForProd', () => {
    it('should not use captcha in dev mode', () => {
      component.useCaptchaForProd();

      expect(mockRecaptchaComponent.execute).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should set the error message for empty teamName', () => {
      component.teamName = '';

      component.login("some captcha");

      expect(component.errorMessage).toEqual('Please enter a team name');
    });

    it('should set the error message for empty password', () => {
      component.teamName = 'Team Name';
      component.password = '';

      component.login("some captcha");

      expect(component.errorMessage).toEqual('Please enter a password');
    });

    it('should not set an error message when the teamName and password are not empty', () => {
      component.teamName = 'Team Name';
      component.password = 'p4ssw0rd';

      component.login("some captcha");

      expect(component.errorMessage).toEqual('');
    });

    it('should set jwt as cookie and navigate to team page', () => {
      component.teamName = 'Team Name';
      component.password = 'p4ssw0rd';

      const teamId = 'teamId';
      const jwt = 'im.a.jwt';
      const httpResponse = {
        body: jwt,
        headers: {
          get() {
            return teamId;
          }
        }
      };

      component.login("some captcha");
      mockTeamService.login().next(httpResponse);

      expect(AuthService.setToken).toHaveBeenCalledWith(jwt);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(`/team/${teamId}`);
    });

    it('should set the error message and log it', () => {
      component.teamName = "some team";
      component.password = "some password";

      const httpErrorMessage = 'server error message';
      const error = {
        error: JSON.stringify({message: httpErrorMessage})
      };

      component.login("some captcha");
      mockTeamService.login().error(error);

      expect(component.errorMessage).toEqual(httpErrorMessage);
      expect(console.error).toHaveBeenCalledWith('A login error occurred:', httpErrorMessage);
    });
  });
});
