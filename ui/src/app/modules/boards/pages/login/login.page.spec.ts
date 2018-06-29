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

describe('LoginComponent', () => {
  let component: LoginComponent;
  let mockTeamService;
  let mockRouter;

  beforeEach(() => {
    mockTeamService = jasmine.createSpyObj(['login']);
    mockRouter = jasmine.createSpyObj(['navigateByUrl']);

    spyOn(AuthService, 'setToken');
    spyOn(console, 'error');

    component = new LoginComponent(mockTeamService, mockRouter);
  });

  describe('validateInput', () => {
    it('should set the error message and return false with empty teamName', () => {
      component.teamName = '';

      const isValid = component.validateInput();

      expect(isValid).toBe(false);
      expect(component.errorMessage).toEqual('Please enter a team name');
    });

    it('should set the error message and return false with empty password', () => {
      component.teamName = 'Team Name';
      component.password = '';

      const isValid = component.validateInput();

      expect(isValid).toBe(false);
      expect(component.errorMessage).toEqual('Please enter a password');
    });

    it('should return true when the teamName and password are not empty', () => {
      component.teamName = 'Team Name';
      component.password = 'p4ssw0rd';

      const isValid = component.validateInput();

      expect(isValid).toBe(true);
      expect(component.errorMessage).toEqual('');
    });
  });

  describe('handleLoginResponse', () => {

    it('should set jwt as cookie and navigate to team page', () => {
      const teamId = 'teamId';
      const jwt = 'im.a.jwt';
      const httpResponse = {
        body: jwt,
        headers: {
          get () {
            return teamId;
          }
        }
      };

      component.handleLoginResponse(httpResponse);

      expect(AuthService.setToken).toHaveBeenCalledWith(jwt);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(`/team/${teamId}`);
    });
  });

  describe('handleLoginError', () => {
    it('should set the error message and log it', () => {
      const httpErrorMessage = 'server error message';
      const error = {
        error: JSON.stringify({message: httpErrorMessage })
      };

      component.handleLoginError(error);

      expect(component.errorMessage).toEqual(httpErrorMessage);
      expect(console.error).toHaveBeenCalledWith('A login error occurred:', httpErrorMessage);
    });
  });

  describe('login', () => {
    // TODO: test login() with http Observable responses
  });
});
