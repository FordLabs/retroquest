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

import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AuthService} from '../../../auth/auth.service';
import {TeamService} from '../../../teams/services/team.service';
import {RecaptchaComponent} from 'ng-recaptcha';
import {concatMap, map} from 'rxjs/operators';
import {EMPTY} from 'rxjs';
import {Observable} from 'rxjs/internal/Observable';
import {HttpResponse} from '@angular/common/http';
import {of} from 'rxjs/internal/observable/of';

@Component({
  selector: 'rq-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginComponent implements OnInit {

  constructor(private teamService: TeamService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  @ViewChild(RecaptchaComponent) recaptchaComponent: RecaptchaComponent;

  teamName: string;
  password: string;
  errorMessage: string;

  ngOnInit() {
    const teamId = this.route.snapshot.params['teamId'] as string;
    if (teamId) {
      this.teamService.fetchTeamName(teamId).subscribe(
        (teamName) => {
          this.teamName = teamName;
        },
        (error) => {
        });
    }
  }

  requestCaptchaStateAndLogIn(): void {
    if (!this.validateInput()) {
      return;
    }

    this.teamService.isCaptchaEnabledForTeam(this.teamName).pipe(
      map(response => JSON.parse(response.body).captchaEnabled),
      concatMap(captchaEnabled => this.loginOrExecuteReCaptcha(captchaEnabled))
    ).subscribe(
      response => this.handleResponse(response),
      error => this.handleError(error)
    );
  }

  login(captchaResponse: string): void {
    this.teamService.login(this.teamName, this.password, captchaResponse)
      .subscribe(
        response => this.handleResponse(response),
        error => this.handleError(error)
      );
  }

  private loginOrExecuteReCaptcha(captchaEnabled): Observable<HttpResponse<Object>> {
    if (captchaEnabled) {
      this.recaptchaComponent.reset();
      this.recaptchaComponent.execute();
      return EMPTY;
    }
    return this.teamService.login(this.teamName, this.password, null);
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

    this.errorMessage = '';
    return true;
  }

  private handleResponse(response): void {
    AuthService.setToken(response.body);
    const teamId = response.headers.get('location');
    this.router.navigateByUrl(`/team/${teamId}`);
  }

  private handleError(error) {
    error.error = JSON.parse(error.error);
    this.errorMessage = error.error.message ? error.error.message : `${error.status} ${error.error}`;
    console.error('A login error occurred: ', this.errorMessage);
    return of(this.errorMessage);
  }

}
