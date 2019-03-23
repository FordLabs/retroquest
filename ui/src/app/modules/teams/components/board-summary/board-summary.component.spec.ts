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

import {BoardSummaryComponent} from './board-summary.component';
import {Board, emptyBoardWithThought} from '../../../domain/board';
import {BoardService} from '../../services/board.service';
import {Subject} from 'rxjs';
import any = jasmine.any;

describe('BoardSummaryComponent', () => {
  let deleteBoardSubject: Subject<any>;
  let mockBoardService: BoardService;
  let mockEvent: Event;
  let component: BoardSummaryComponent;

  beforeEach(() => {
    deleteBoardSubject = new Subject();
    mockBoardService = jasmine.createSpyObj({deleteBoard: deleteBoardSubject});
    mockEvent = jasmine.createSpyObj({preventDefault: null});
    component = new BoardSummaryComponent(mockBoardService);
    component.teamId = 'team-id';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteBoard', () => {
    it('should call deleteBoard in the boardService', () => {
      const boardToDelete: Board = emptyBoardWithThought();
      component.deleteBoard(boardToDelete);
      expect(mockBoardService.deleteBoard).toHaveBeenCalledWith('team-id', boardToDelete.id);
    });

    it('should subscribe to the return value of deleteBoard', () => {
      const boardToDelete: Board = emptyBoardWithThought();
      spyOn(mockBoardService.deleteBoard('team-id', boardToDelete.id), 'subscribe');
      component.deleteBoard(boardToDelete);
      expect(mockBoardService.deleteBoard('team-id', boardToDelete.id).subscribe).toHaveBeenCalledWith(any(Function));
    });

    it('should emit a boardDeleted event', () => {
      const boardToDelete: Board = emptyBoardWithThought();
      component.boardDeleted = jasmine.createSpyObj({emit: null});
      component.deleteBoard(boardToDelete);
      deleteBoardSubject.next();
      expect(component.boardDeleted.emit).toHaveBeenCalledWith(boardToDelete.id);
    });
  });
});
