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

import {LoginComponent} from './login.page';
import {AuthService} from '../../../auth/auth.service';
import {Subject, throwError} from 'rxjs';
import {of} from 'rxjs/internal/observable/of';
import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let mockTeamService;
  let mockRouter;
  let mockRecaptchaComponent;
  let mockTeamNameResponse: Subject<string>;
  let mockActivatedRoute;

  beforeEach(() => {
    mockTeamNameResponse = new Subject<string>();
    mockTeamService = jasmine.createSpyObj('teamService', {
      login: new Subject(),
      isCaptchaEnabledForTeam: new Subject(),
      fetchTeamName: mockTeamNameResponse
    });

    mockActivatedRoute = new ActivatedRoute();

    mockActivatedRoute.snapshot = new ActivatedRouteSnapshot();
    mockActivatedRoute.snapshot.params = {teamId: 'the-devs'};

    mockRouter = jasmine.createSpyObj({navigateByUrl: null});
    mockRecaptchaComponent = jasmine.createSpyObj({reset: null, execute: null});

    spyOn(AuthService, 'setToken');
    spyOn(console, 'error');

    component = new LoginComponent(mockTeamService, mockActivatedRoute, mockRouter);
    component.recaptchaComponent = mockRecaptchaComponent;
  });

  describe('ngOnInit', () => {
    it('should set the team name from the API based on the team-uri in the route', () => {
      const teamNameInAPI = 'The Devs';
      component.ngOnInit();
      expect(mockTeamService.fetchTeamName).toHaveBeenCalledWith(mockActivatedRoute.snapshot.params['teamId']);
      mockTeamNameResponse.next(teamNameInAPI);
      expect(component.teamName).toEqual(teamNameInAPI);
    });
    it('should not set the team name from the API if team name does not exist', () => {
      component.ngOnInit();
      expect(mockTeamService.fetchTeamName).toHaveBeenCalledWith(mockActivatedRoute.snapshot.params['teamId']);
      mockTeamNameResponse.error(new Error('something wrong'));
      expect(component.teamName).toBeFalsy();
    });
    it('should not set the team name from the API based on the team-uri in the route if the team does not exist', () => {
      mockActivatedRoute.snapshot.params = {};
      component.ngOnInit();
      expect(mockTeamService.fetchTeamName).not.toHaveBeenCalledWith(mockActivatedRoute.snapshot.params['teamId']);
      expect(component.teamName).toBeFalsy();
    });
  });


  describe('requestCaptchaStateAndLogIn', () => {
    it('should set the error message for empty teamName', () => {
      component.teamName = '';

      component.requestCaptchaStateAndLogIn();

      expect(component.errorMessage).toEqual('Please enter a team name');
    });

    it('should set the error message for empty password', () => {
      component.teamName = 'Team Name';
      component.password = '';

      component.requestCaptchaStateAndLogIn();

      expect(component.errorMessage).toEqual('Please enter a password');
    });

    it('should not set an error message when the teamName and password are not empty', () => {
      component.teamName = 'Team Name';
      component.password = 'p4ssw0rd';

      component.requestCaptchaStateAndLogIn();

      expect(component.errorMessage).toEqual('');
    });

    it('should execute recaptcha when captcha is enabled', () => {
      component.teamName = 'some team';
      component.password = 'some password';

      const captchaResponse: HttpResponse<string> = new HttpResponse({
        body: JSON.stringify({captchaEnabled: true})
      });

      const loginResponse: HttpResponse<string> = new HttpResponse({
        body: 'im.a.jwt',
        headers: new HttpHeaders({location: 'teamId'})
      });

      mockTeamService.isCaptchaEnabledForTeam.and.returnValue(of(captchaResponse));
      mockTeamService.login.and.returnValue(loginResponse);

      component.requestCaptchaStateAndLogIn();

      expect(mockRecaptchaComponent.execute).toHaveBeenCalled();
    });

    it('should not execute recaptcha when captcha is disabled', () => {
      component.teamName = 'some team';
      component.password = 'some password';

      const captchaResponse: HttpResponse<string> = new HttpResponse({
        body: JSON.stringify({captchaEnabled: false})
      });
      mockTeamService.isCaptchaEnabledForTeam.and.returnValue(of(captchaResponse));

      component.requestCaptchaStateAndLogIn();

      expect(mockTeamService.login).toHaveBeenCalled();
      expect(mockRecaptchaComponent.execute).not.toHaveBeenCalled();
    });

    it('should set the error message and log it when login has an error', () => {
      component.teamName = 'some team';
      component.password = 'some password';

      const captchaResponse: HttpResponse<string> = new HttpResponse({
        body: JSON.stringify({captchaEnabled: false})
      });

      const httpErrorMessage = 'server error message';
      const error = {error: JSON.stringify({message: httpErrorMessage})};

      mockTeamService.isCaptchaEnabledForTeam.and.returnValue(of(captchaResponse));
      mockTeamService.login.and.returnValue(throwError(error));

      component.requestCaptchaStateAndLogIn();

      expect(console.error).toHaveBeenCalledWith('A login error occurred: ', httpErrorMessage);
    });

    it('should set the error message and log it when isCaptchaEnabledForTeam has an error', () => {
      component.teamName = 'some team';
      component.password = 'some password';

      const httpErrorMessage = 'server error message';
      const error = {error: JSON.stringify({message: httpErrorMessage})};

      mockTeamService.isCaptchaEnabledForTeam.and.returnValue(throwError(error));

      component.requestCaptchaStateAndLogIn();

      expect(console.error).toHaveBeenCalledWith('A login error occurred: ', httpErrorMessage);
    });

    it('should not call login when isCaptchaEnabledForTeam has an error', () => {
      component.teamName = 'Team Name';
      component.password = 'p4ssw0rd';

      const error = {error: JSON.stringify({message: 'error'})};

      mockTeamService.isCaptchaEnabledForTeam.and.returnValue(throwError(error));

      component.requestCaptchaStateAndLogIn();

      expect(mockTeamService.login).not.toHaveBeenCalled();
    });

  });

  describe('login', () => {
    it('should set jwt as cookie and navigate to team page', () => {
      component.teamName = 'Team Name';
      component.password = 'p4ssw0rd';

      const teamId = 'teamId';
      const jwt = 'im.a.jwt';

      const loginResponse: HttpResponse<string> = new HttpResponse({
        body: jwt,
        headers: new HttpHeaders({location: teamId})
      });

      mockTeamService.login.and.returnValue(of(loginResponse));

      component.login('some captcha');

      expect(AuthService.setToken).toHaveBeenCalledWith(jwt);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(`/team/${teamId}`);
    });

    it('should set the error message and log it', () => {
      component.teamName = 'some team';
      component.password = 'some password';

      const httpErrorMessage = 'server error message';
      const error = {
        error: JSON.stringify({message: httpErrorMessage})
      };

      mockTeamService.login.and.returnValue(throwError(error));
      component.login('some captcha');

      expect(component.errorMessage).toEqual(httpErrorMessage);
      expect(console.error).toHaveBeenCalledWith('A login error occurred: ', httpErrorMessage);
    });
  });
});
