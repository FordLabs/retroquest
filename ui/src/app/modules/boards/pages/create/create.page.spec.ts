/*
 *  Copyright (c) 2020 Ford Motor Company
 *  All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import {CreateComponent} from './create.page';
import {AuthService} from '../../../auth/auth.service';
import {Subject, throwError} from 'rxjs';
import {of} from 'rxjs/internal/observable/of';
import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {createMockRecaptchaComponent, createMockRouter} from '../../../utils/testutils';
import {TeamService} from '../../../teams/services/team.service';

describe('CreateComponent', () => {
  let component: CreateComponent;
  let mockTeamService: TeamService;
  let mockRouter;
  let mockRecaptchaComponent;

  beforeEach(() => {
    // @ts-ignore
    mockTeamService = {
      create: jest.fn().mockReturnValue(new Subject()),
      isCaptchaEnabled: jest.fn().mockReturnValue(new Subject()),
    } as TeamService;
    mockRouter = createMockRouter();
    mockRecaptchaComponent = createMockRecaptchaComponent();

    spyOn(AuthService, 'setToken');
    spyOn(console, 'error');

    component = new CreateComponent(mockTeamService, mockRouter);
    component.recaptchaComponent = mockRecaptchaComponent;
  });

  describe('requestCaptchaStateAndCreateTeam', () => {
    it('should set the error message for empty teamName', () => {
      component.teamName = '';

      component.requestCaptchaStateAndCreateTeam();

      expect(component.errorMessage).toEqual('Please enter a team name');
    });

    it('should set the error message for empty password', () => {
      component.teamName = 'Team Name';
      component.password = '';

      component.requestCaptchaStateAndCreateTeam();

      expect(component.errorMessage).toEqual('Please enter a password');
    });

    it('should set the error message and return false with miss matching passwords', () => {
      component.teamName = 'Team Name';
      component.password = 'p4ssw0rd';
      component.confirmPassword = 'password';

      component.requestCaptchaStateAndCreateTeam();

      expect(component.errorMessage).toEqual('Please enter matching passwords');
    });

    it('should not set an error when the teamName and password are not empty and the passwords match', () => {
      component.teamName = 'Team Name';
      component.password = 'p4ssw0rd';
      component.confirmPassword = 'p4ssw0rd';

      component.requestCaptchaStateAndCreateTeam();

      expect(component.errorMessage).toEqual('');
    });

    it('should set jwt as cookie and navigate to team page when captcha is disabled', () => {
      component.teamName = 'Team Name';
      component.password = 'p4ssw0rd';
      component.confirmPassword = 'p4ssw0rd';

      const teamUrl = 'team/teamId';
      const jwt = 'im.a.jwt';
      const createTeamResponse: HttpResponse<string> = new HttpResponse({
        body: jwt,
        headers: new HttpHeaders({location: teamUrl})
      });

      const captchaResponse: HttpResponse<string> = new HttpResponse({
        body: JSON.stringify({captchaEnabled: false})
      });

      mockTeamService.isCaptchaEnabled = jest.fn().mockReturnValue(of(captchaResponse));
      mockTeamService.create = jest.fn().mockReturnValue(of(createTeamResponse));

      component.requestCaptchaStateAndCreateTeam();

      expect(AuthService.setToken).toHaveBeenCalledWith(jwt);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(teamUrl);
    });

    it('should set the error message and log it when create has an error', () => {
      component.teamName = 'Team Name';
      component.password = 'p4ssw0rd';
      component.confirmPassword = 'p4ssw0rd';

      const httpErrorMessage = 'server error message';
      const error = {error: JSON.stringify({message: httpErrorMessage})};

      const captchaResponse: HttpResponse<string> = new HttpResponse({
        body: JSON.stringify({captchaEnabled: false})
      });

      mockTeamService.isCaptchaEnabled = jest.fn().mockReturnValue(of(captchaResponse));
      mockTeamService.create = jest.fn().mockReturnValue(throwError(error));

      component.requestCaptchaStateAndCreateTeam();

      expect(component.errorMessage).toEqual(httpErrorMessage);
      expect(console.error).toHaveBeenCalledWith('A registration error occurred: ', httpErrorMessage);
    });

    it('should set the error message and log it when isCaptchaEnabled has an error', () => {
      component.teamName = 'Team Name';
      component.password = 'p4ssw0rd';
      component.confirmPassword = 'p4ssw0rd';

      const httpErrorMessage = 'server error message';
      const error = {
        error: JSON.stringify({message: httpErrorMessage})
      };

      mockTeamService.isCaptchaEnabled = jest.fn().mockReturnValue(throwError(error));

      component.requestCaptchaStateAndCreateTeam();

      expect(component.errorMessage).toEqual(httpErrorMessage);
      expect(console.error).toHaveBeenCalledWith('A registration error occurred: ', httpErrorMessage);
    });

    it('should not call create when isCaptchaEnabled has an error', () => {
      component.teamName = 'Team Name';
      component.password = 'p4ssw0rd';
      component.confirmPassword = 'p4ssw0rd';

      const error = {error: JSON.stringify({message: 'error'})};

      mockTeamService.isCaptchaEnabled = jest.fn().mockReturnValue(throwError(error));

      component.requestCaptchaStateAndCreateTeam();

      expect(mockTeamService.create).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should set jwt as cookie and navigate to team page', () => {
      component.teamName = 'Team Name';
      component.password = 'p4ssw0rd';
      component.confirmPassword = 'p4ssw0rd';

      const teamUrl = 'team/teamId';
      const jwt = 'im.a.jwt';

      const loginResponse: HttpResponse<string> = new HttpResponse({
        body: jwt,
        headers: new HttpHeaders({location: teamUrl})
      });

      mockTeamService.create = jest.fn().mockReturnValue(of(loginResponse));

      component.create('some captcha');

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

      mockTeamService.create = jest.fn().mockReturnValue(throwError(error));
      component.create('some captcha');

      expect(component.errorMessage).toEqual(httpErrorMessage);
      expect(console.error).toHaveBeenCalledWith('A registration error occurred: ', httpErrorMessage);
    });
  });
});
