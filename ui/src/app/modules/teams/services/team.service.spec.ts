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

import {TeamService} from './team.service';
import {Observable} from 'rxjs/index';

describe('TeamService', () => {
  let service;
  let mockHttpClient;

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj({get: new Observable(), post: new Observable()});

    service = new TeamService(mockHttpClient);
  });

  describe('create', () => {
    it('should send a post request to the api with valid body', () => {
      const name = 'Team Name';
      const password = 'p4ssw0rd';
      const captchaResponse = 'someHash';

      const returnObj = service.create(name, password, captchaResponse);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/team',
        {name, password, captchaResponse},
        {observe: 'response', responseType: 'text'}
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

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/api/team/login',
        {name, password, captchaResponse},
        {observe: 'response', responseType: 'text'}
      );

      expect(returnObj instanceof Observable).toBe(true);
    });
  });

  describe('fetchTeamName', () => {
    it('should request team name from the name api', () => {
      const teamId = 'team-id';

      const returnObj = service.fetchTeamName(teamId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/team/${teamId}/name`, {responseType: 'text'});
      expect(returnObj instanceof Observable).toBe(true);
    });
  });

  describe('validateTeamId', () => {
    it('should call the backend api to validate the team id in the token', () => {
      const teamId = 'team-id';

      const returnObj = service.validateTeamId(teamId);


      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/team/${teamId}/validate`, {observe: 'response'});
      expect(returnObj instanceof Observable).toBeTruthy();
    });
  });

  describe('isCaptchaEnabledForTeam', () => {
    it('should request captcha state from the team api', () => {
      const teamName = 'team-name';

      const returnObj = service.isCaptchaEnabledForTeam(teamName);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/team/${teamName}/captcha`, {observe: 'response', responseType: 'text' });
      expect(returnObj instanceof Observable).toBe(true);
    });
  });
});
