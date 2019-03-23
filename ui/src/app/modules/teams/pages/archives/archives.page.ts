/*
 *  Copyright (c) 2018 Ford Motor Company
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

import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TeamService} from '../../services/team.service';
import {Board} from '../../../domain/board';
import {BoardService} from '../../services/board.service';
import {WebsocketService} from '../../services/websocket.service';
import {parseTheme, Themes} from '../../../domain/Theme';
import {DataService} from '../../../data.service';

@Component({
  selector: 'rq-archives',
  templateUrl: './archives.page.html',
  styleUrls: ['./archives.page.scss']
})
export class ArchivesPageComponent implements OnInit {

  @Input() theme: Themes = Themes.Light;

  teamId: string;
  teamName: string;
  boards: Array<Board> = [];
  globalWindowRef: Window = window;

  constructor(private dataService: DataService,
              private teamsService: TeamService,
              private boardService: BoardService,
              private websocketService: WebsocketService) {
  }

  ngOnInit() {
    this.setBackgroundColorToLightVersion();

    this.globalWindowRef.clearInterval(this.websocketService.intervalId);
    this.websocketService.closeWebsocket();

    this.teamId = this.dataService.team.id;
    this.teamName = this.dataService.team.name;

    this.boardService.fetchBoards(this.teamId).subscribe(boards => {
      this.boards = boards;
    });
  }

  get darkThemeIsEnabled(): boolean {
    return this.theme === Themes.Dark;
  }

  removeBoardFromBoards(boardId: number) {
    this.boards = this.boards.filter(board => {
      return board.id !== boardId;
    });
  }

  private setBackgroundColorToLightVersion() {
    document.body.style.backgroundColor = '#ecf0f1';
  }

}
