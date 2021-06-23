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

import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient) {
  }

  create(name: string, password: string, captchaResponse: string): Observable<HttpResponse<string>> {
    return this.doPostRequest('/api/team', name, password, captchaResponse);
  }

  createUser(name: string, password: string): Observable<HttpResponse<string>> {
    return this.doPostRequest('/api/user', name, password);
  }

  login(name: string, password: string, captchaResponse: string): Observable<HttpResponse<string>> {
    return this.http.post(
      '/api/team/login',
      {name, password, captchaResponse},
      {observe: 'response', responseType: 'text'}
    );
  }

  updatePassword(teamId: string, previousPassword: string, newPassword: string): Observable<HttpResponse<string>> {
    return this.http.post(
      '/api/update-password',
      {teamId, previousPassword, newPassword},
      {observe: 'response', responseType: 'text'}
    );
  }

  fetchTeamName(teamId: string): Observable<string> {
    return this.http.get(
      `/api/team/${teamId}/name`,
      {responseType: 'text'}
    );
  }

  validateTeamId(teamId: string): Observable<HttpResponse<Object>> {
    return this.http.get(
      `/api/team/${teamId}/validate`,
      {observe: 'response'}
    );
  }

  isCaptchaEnabledForTeam(teamName: string): Observable<HttpResponse<string>> {
    return this.http.get(
      `/api/team/${teamName}/captcha`,
      {observe: 'response', responseType: 'text'}
    );
  }

  isCaptchaEnabled(): Observable<HttpResponse<string>> {
    return this.http.get(
      `/api/captcha`,
      {observe: 'response', responseType: 'text'}
    );
  }

  private doPostRequest(endpoint: string, name: string, password: string, captchaResponse?: string) {
    const payload = captchaResponse ? {name, password, captchaResponse} : {name, password};
    return this.http.post(
      endpoint,
      payload,
      {observe: 'response', responseType: 'text'}
    );
  }
}
