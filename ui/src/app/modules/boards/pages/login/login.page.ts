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

import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from '../../../auth/auth.service';
import {TeamService} from '../../../teams/services/team.service';

@Component({
  selector: 'rq-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginComponent {

  constructor (private teamService: TeamService, private router: Router) {
  }

  teamName: string;
  password: string;
  errorMessage: string;

  validateInput (): boolean {
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

  login (): void {
    if (this.validateInput()) {
      this.teamService.login(this.teamName, this.password)
        .subscribe(
          (response) => {
            this.handleLoginResponse(response);
          },
          (error) => {
            this.handleLoginError(error);
          }
        );
    }
  }

  handleLoginResponse (response): void {
    AuthService.setToken(response.body);
    const teamId = response.headers.get('location');
    this.router.navigateByUrl( `/team/${teamId}`);
  }

  handleLoginError (error) {
    error.error = JSON.parse(error.error);

    if (error.error.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = `${error.status} ${error.error}`;
    }

    console.error('A login error occurred:', this.errorMessage);
  }
}
