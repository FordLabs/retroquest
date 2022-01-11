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
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataService } from '../../../data.service';

import { Team } from './team';

@Component({
  selector: 'rq-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss'],
})
export class UserViewComponent implements OnInit {
  teamList: Array<Team> = [];
  existingTeamName = '';
  existingTeamPassword = '';

  newTeamName = '';
  userName = '';

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dataService: DataService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.userName = params.user;

      this.getTeamsAttachedToUser();
    });
  }

  addExistingTeamToUser() {
    this.http
      .put(
        `/api/user/${this.userName}/team`,
        { name: this.existingTeamName, password: this.existingTeamPassword },
        { observe: 'response' }
      )
      .subscribe(
        () => {
          this.getTeamsAttachedToUser();

          this.existingTeamName = '';
          this.existingTeamPassword = '';
        },
        () => {
          console.log(`An error occurred creating the team ${this.newTeamName}`);
          this.existingTeamName = '';
          this.existingTeamPassword = '';
        }
      );
  }

  addNewTeamToUser() {
    this.http.post(`/api/user/${this.userName}/team`, { name: this.newTeamName }, { observe: 'response' }).subscribe(
      () => {
        this.getTeamsAttachedToUser();

        this.newTeamName = '';
      },
      () => {
        console.log(`An error occurred creating the team ${this.newTeamName}`);
        this.newTeamName = '';
      }
    );
  }

  getTeamsAttachedToUser() {
    this.http.get(`/api/user/${this.userName}/team`, { observe: 'response' }).subscribe((response) => {
      this.teamList = response.body as Array<Team>;
    });
  }

  fetchColumnsForTeamTest(teamId: string) {
    this.router.navigateByUrl(`/team/${teamId}`);
    // this.columnAggregationService.getColumns(teamId).subscribe(response => {
    //   console.log('GOT columns for team ', teamId, response);
    // });
  }
}
