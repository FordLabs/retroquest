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

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Board} from '../../../domain/board';
import {BoardService} from '../../services/board.service';
import {Themes} from '../../../domain/Theme';

@Component({
  selector: 'rq-board-summary',
  templateUrl: './board-summary.component.html',
  styleUrls: ['./board-summary.component.scss'],
  host: {
    '[class.dark-theme]': 'theme'
  }
})
export class BoardSummaryComponent {
  @Input() board: Board;
  @Input() teamId: string;
  @Input() theme: Themes = Themes.Light;

  @Output() boardDeleted: EventEmitter<number>;

  deleteWasToggled: boolean;

  constructor(private boardService: BoardService) {
    this.boardDeleted = new EventEmitter();
    this.deleteWasToggled = false;
  }

  get darkThemeIsEnabled(): boolean {
    return this.theme === Themes.Dark;
  }

  deleteBoard(board: Board) {
    this.boardService.deleteBoard(this.teamId, board.id).subscribe(() => {
      this.boardDeleted.emit(board.id);
    });
  }
}
