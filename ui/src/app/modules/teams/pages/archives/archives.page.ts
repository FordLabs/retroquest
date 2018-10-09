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

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TeamService} from '../../services/team.service';
import {Board} from '../../../domain/board';
import {BoardsService} from '../../services/boards.service';

@Component({
  selector: 'rq-archives',
  templateUrl: './archives.page.html',
  styleUrls: ['./archives.page.scss']
})
export class ArchivesPageComponent implements OnInit {
  teamId: string;
  teamName: string;
  boards: Array<Board>;

  constructor(private activeRoute: ActivatedRoute,
              private teamsService: TeamService,
              private boardsService: BoardsService) {
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params) => {
      this.teamId = params.teamId;
      this.teamsService.fetchTeamName(this.teamId).subscribe(teamName => {
        this.teamName = teamName;
      });
      this.boardsService.fetchBoards(this.teamId).subscribe(boards => {
        this.boards = boards;
      });
    });
  }

}
