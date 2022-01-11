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

import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { AuthService } from '../../../auth/auth.service';
import { TeamService } from '../../../teams/services/team.service';

@Component({
  selector: 'rq-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.scss'],
})
export class LoginUserComponent implements OnInit {
  constructor(private teamService: TeamService, private router: Router) {}

  teamName: string;
  password: string;
  confirmPassword: string;
  errorMessage: string;

  ngOnInit(): void {}

  requestCaptchaStateAndCreateTeam() {
    if (!this.validateInput()) {
      return;
    }

    this.teamService
      .isCaptchaEnabled()
      .pipe(
        map((response) => JSON.parse(response.body).captchaEnabled),
        concatMap(() => this.createTeamOrExecuteCaptcha())
      )
      .subscribe(
        (response) => this.handleResponse(response),
        (error) => this.handleError(error)
      );
  }

  private createTeamOrExecuteCaptcha(): Observable<HttpResponse<Object>> {
    return this.teamService.createUser(this.teamName, this.password);
  }

  create(): void {
    this.teamService.createUser(this.teamName, this.password).subscribe(
      (response) => this.handleResponse(response),
      (error) => this.handleError(error)
    );
  }

  private validateInput(): boolean {
    if (!this.teamName || this.teamName === '') {
      this.errorMessage = 'Please enter a team name';
      return false;
    }

    if (!this.password || this.password === '') {
      this.errorMessage = 'Please enter a password';
      return false;
    }

    if (this.confirmPassword !== this.password) {
      this.errorMessage = 'Please enter matching passwords';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  private handleResponse(response): void {
    AuthService.setToken(response.body);
    const teamUrl = response.headers.get('location');
    this.router.navigateByUrl(teamUrl);
  }

  private handleError(error) {
    error.error = JSON.parse(error.error);
    this.errorMessage = error.error.message ? error.error.message : `${error.status} ${error.error}`;
    console.error('A registration error occurred: ', this.errorMessage);
    return of(this.errorMessage);
  }
}
