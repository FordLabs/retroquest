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

import { Component, Input, OnInit } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { Board } from '../../../domain/board';
import { BoardService } from '../../services/board.service';
import { Themes } from '../../../domain/Theme';
import { DataService } from '../../../data.service';
import { ActionItemService } from '../../services/action.service';
import { ActionItem } from '../../../domain/action-item';

@Component({
  selector: 'rq-archives',
  templateUrl: './archives.page.html',
  styleUrls: ['./archives.page.scss'],
})
export class ArchivesPageComponent implements OnInit {
  @Input() theme: Themes = Themes.Light;

  teamId: string;
  teamName: string;
  boards: Array<Board> = [];
  globalWindowRef: Window = window;
  countSortEnabled = false;
  thoughtArchivesAreLoading = true;
  actionItemArchivesAreLoading = true;
  selectedArchives = 'thoughts';
  archivedActionItems: Array<ActionItem> = [];
  selectedActionItem: ActionItem;
  dialogIsVisible = false;
  boardPageIndex = 0;

  constructor(
    private dataService: DataService,
    private teamsService: TeamService,
    private boardService: BoardService,
    private actionItemService: ActionItemService
  ) {}

  ngOnInit() {
    this.teamId = this.dataService.team.id;
    this.teamName = this.dataService.team.name;
    this.theme = this.dataService.theme;

    this.dataService.themeChanged.subscribe((theme) => (this.theme = theme));

    this.fetchBoards(this.teamId, this.boardPageIndex);

    this.actionItemService.fetchArchivedActionItems(this.teamId).subscribe(
      (actionItems) => {
        this.archivedActionItems = actionItems;
        this.actionItemArchivesAreLoading = false;
      },
      () => {
        this.actionItemArchivesAreLoading = false;
      }
    );
  }

  get thoughtArchivesAreSelected(): boolean {
    return this.selectedArchives === 'thoughts';
  }

  get actionItemArchivesAreSelected(): boolean {
    return this.selectedArchives === 'action items';
  }

  get darkThemeIsEnabled(): boolean {
    return this.theme === Themes.Dark;
  }

  removeBoardFromBoards(boardId: number) {
    this.boards = this.boards.filter((board) => {
      return board.id !== boardId;
    });
  }

  toggleCountSort() {
    this.countSortEnabled = !this.countSortEnabled;
  }

  get archiveBoardList(): Array<Board> {
    if (this.countSortEnabled) {
      return this.boards
        .slice()
        .sort((a, b) => b.thoughts.length - a.thoughts.length);
    }
    return this.boards;
  }

  showDialog(actionItem: ActionItem) {
    this.selectedActionItem = actionItem;
    this.dialogIsVisible = true;
  }

  get noActionItemArchivesWereFound(): boolean {
    return (
      this.archivedActionItems.length === 0 && !this.thoughtArchivesAreLoading
    );
  }

  fetchBoards(teamId: string, pageIndex: number) {
    this.boardService.fetchBoards(teamId, pageIndex).subscribe(
      (boards) => {
        this.boards.push(...boards);
        this.thoughtArchivesAreLoading = false;
      },
      () => {
        this.thoughtArchivesAreLoading = false;
      }
    );
  }

  onScroll() {
    console.log('scroll', this.boardPageIndex);
    this.fetchBoards(this.teamId, ++this.boardPageIndex);
  }
}
