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

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecaptchaComponent } from 'ng-recaptcha';
import { of } from 'rxjs';
import { TeamService } from '../../../teams/services/team.service';

@Component({
  selector: 'rq-update-password',
  templateUrl: './update-password.page.html',
  styleUrls: ['./update-password.page.scss'],
})
export class UpdatePasswordComponent implements OnInit {
  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  @ViewChild(RecaptchaComponent) recaptchaComponent: RecaptchaComponent;

  teamId: string;
  previousPassword: string;
  newPassword: string;
  confirmPassword: string;
  errorMessage: string;

  ngOnInit() {
    this.teamId = this.route.snapshot.params['teamId'];
  }

  updatePassword(): void {
    if (this.validateInput()) {
      this.teamService
        .updatePassword(this.teamId, this.previousPassword, this.newPassword)
        .subscribe(
          (response) => this.handleResponse(response),
          (error) => this.handleError(error)
        );
    }
  }

  private validateInput(): boolean {
    if (!this.previousPassword || this.previousPassword === '') {
      this.errorMessage = 'Please enter your original password';
      return false;
    }

    if (!this.newPassword || this.newPassword === '') {
      this.errorMessage = 'Please enter a new password';
      return false;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Please enter matching new passwords';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  private handleResponse(response): void {
    this.router.navigateByUrl(`team/${this.teamId}`);
  }

  private handleError(error) {
    error.error = JSON.parse(error.error);
    this.errorMessage = error.error.message
      ? error.error.message
      : `${error.status} ${error.error}`;
    console.error('A registration error occurred: ', this.errorMessage);
    return of(this.errorMessage);
  }
}
