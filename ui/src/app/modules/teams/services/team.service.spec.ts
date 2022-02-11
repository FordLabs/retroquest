/*
 * Copyright (c) 2021 Ford Motor Company
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

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TeamService } from './team.service';

describe('TeamService', () => {
  let service;
  let fakeHttpClient: HttpClient;
  let mockedPutObservable;

  beforeEach(() => {
    mockedPutObservable = {subscribe: jest.fn()} as unknown as Observable<Object>;
    const mockGet = jest.fn().mockReturnValue(new Observable());
    const mockPost = jest.fn().mockReturnValue(new Observable());
    const mockPut = jest.fn().mockReturnValue(mockedPutObservable);
    fakeHttpClient = {
      get: mockGet,
      post: mockPost,
      put: mockPut,
    } as unknown as HttpClient;

    service = new TeamService(fakeHttpClient);
  });

  describe('create', () => {
    it('should send a post request to the api with valid body', () => {
      const name = 'Team Name';
      const password = 'p4ssw0rd';
      const captchaResponse = 'someHash';

      const returnObj = service.create(name, password, captchaResponse);

      expect(fakeHttpClient.post).toHaveBeenCalledWith(
        '/api/team',
        { name, password, captchaResponse },
        { observe: 'response', responseType: 'text' }
      );

      expect(returnObj instanceof Observable).toBe(true);
    });
  });

  describe('login', () => {
    it('should send a post request to the api with valid body', () => {
      const name = 'Team Name';
      const password = 'p4ssw0rd';
      const captchaResponse = 'someHash';

      const returnObj = service.login(name, password, captchaResponse);

      expect(fakeHttpClient.post).toHaveBeenCalledWith(
        '/api/team/login',
        { name, password, captchaResponse },
        { observe: 'response', responseType: 'text' }
      );

      expect(returnObj instanceof Observable).toBe(true);
    });
  });

  describe('updatePassword', () => {
    it('should send a post request to the api with valid body', () => {
      const teamId = 'team-name';
      const previousPassword = 'passw0rd';
      const newPassword = 'passw0rd1';

      const returnObj = service.updatePassword(teamId, previousPassword, newPassword);

      expect(fakeHttpClient.post).toHaveBeenCalledWith(
        '/api/update-password',
        { teamId, previousPassword, newPassword },
        { observe: 'response', responseType: 'text' }
      );

      expect(returnObj instanceof Observable).toBe(true);
    });
  });

  describe('fetchTeamName', () => {
    it('should request team name from the name api', () => {
      const teamId = 'team-id';

      const returnObj = service.fetchTeamName(teamId);

      expect(fakeHttpClient.get).toHaveBeenCalledWith(`/api/team/${teamId}/name`, {
        responseType: 'text',
      });
      expect(returnObj instanceof Observable).toBe(true);
    });
  });

  describe('validateTeamId', () => {
    it('should call the backend api to validate the team id in the token', () => {
      const teamId = 'team-id';

      const returnObj = service.validateTeamId(teamId);

      expect(fakeHttpClient.get).toHaveBeenCalledWith(`/api/team/${teamId}/validate`, {
        observe: 'response',
      });
      expect(returnObj instanceof Observable).toBeTruthy();
    });
  });

  describe('isCaptchaEnabledForTeam', () => {
    it('should request captcha state from the team api', () => {
      const teamName = 'team-name';

      const returnObj = service.isCaptchaEnabledForTeam(teamName);

      expect(fakeHttpClient.get).toHaveBeenCalledWith(`/api/team/${teamName}/captcha`, {
        observe: 'response',
        responseType: 'text',
      });
      expect(returnObj instanceof Observable).toBe(true);
    });
  });

  it('should request to end team retro', () => {
    const teamId = 'team-name';
    service.endRetro(teamId);
    expect(fakeHttpClient.put).toHaveBeenCalledWith(`/api/team/${teamId}/end-retro`, {}, {observe: 'response'});
    expect(mockedPutObservable.subscribe).toHaveBeenCalled();
  });
});
