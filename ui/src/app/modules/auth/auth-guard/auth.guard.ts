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
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {Observable, Subscriber} from 'rxjs';
import {TeamService} from '../../teams/services/team.service';
import {AuthService} from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private teamService: TeamService,
    private router: Router
  ) {
  }

  private navigateToTeamLoginPage(subscriber: Subscriber<boolean>, teamId: string) {
    this.router.navigate(['login', teamId]);
    subscriber.next(true);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state): Observable<boolean> | Promise<boolean> | boolean {

    return new Observable<boolean>(subscriber => {
      const urls = state.url.split('/');
      const teamId = urls[2];

      if (AuthService.getToken()) {

        this.teamService.validateTeamId(teamId).subscribe(
          () => {
            subscriber.next(true);
          },
          () => this.navigateToTeamLoginPage(subscriber, teamId)
        );
      } else {
        this.navigateToTeamLoginPage(subscriber, teamId);
      }

    });
  }
}
