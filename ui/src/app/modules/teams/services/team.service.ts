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

import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient) {
  }

  create(name: string, password: string): Observable<HttpResponse<string>> {
    return this.http.post(
      '/api/team',
      {name, password},
      {observe: 'response', responseType: 'text'}
    );
  }

  login(name: string, password: string, captchaResponse: string): Observable<HttpResponse<string>> {
    return this.http.post(
      '/api/team/login',
      {name, password, captchaResponse},
      {observe: 'response', responseType: 'text'}
    );
  }

  fetchTeamName(teamId): Observable<string> {
    return this.http.get(
      `/api/team/${teamId}/name`,
      {responseType: 'text'}
    );
  }

  validateTeamId(teamId): Observable<HttpResponse<Object>> {
    return this.http.get(
      `/api/team/${teamId}/validate`,
      {observe: 'response'}
    );
  }
}
