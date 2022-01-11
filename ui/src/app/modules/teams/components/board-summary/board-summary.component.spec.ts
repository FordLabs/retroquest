/*
 * Copyright (c) 2022 Ford Motor Company
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

import { Subject } from 'rxjs';

import { Board, emptyBoardWithThought } from '../../../domain/board';
import { createMockEventEmitter } from '../../../utils/testutils';
import { BoardService } from '../../services/board.service';

import { BoardSummaryComponent } from './board-summary.component';

describe('BoardSummaryComponent', () => {
  let deleteBoardSubject: Subject<any>;
  let mockBoardService: BoardService;
  let router;
  let component: BoardSummaryComponent;

  beforeEach(() => {
    deleteBoardSubject = new Subject();
    mockBoardService = {
      deleteBoard: jest.fn().mockReturnValue(deleteBoardSubject),
    } as unknown as BoardService;
    router = { navigateByUrl: jest.fn() };

    component = new BoardSummaryComponent(mockBoardService, router);
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
      jest.spyOn(mockBoardService.deleteBoard('team-id', boardToDelete.id), 'subscribe');
      component.deleteBoard(boardToDelete);
      expect(mockBoardService.deleteBoard('team-id', boardToDelete.id).subscribe).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    it('should emit a boardDeleted event', () => {
      const boardToDelete: Board = emptyBoardWithThought();
      component.boardDeleted = createMockEventEmitter();
      component.deleteBoard(boardToDelete);
      deleteBoardSubject.next();
      expect(component.boardDeleted.emit).toHaveBeenCalledWith(boardToDelete.id);
    });
  });

  describe('routeToBoard', () => {
    const fakeTeamId = 'id';
    const fakeBoardId = 1;

    beforeEach(() => {
      component.teamId = fakeTeamId;
      component.board = new Board();
      component.board.id = fakeBoardId;

      component.routeToBoard();
    });

    it('should navigate to the specified board', () => {
      expect(router.navigateByUrl).toHaveBeenCalledWith(`/team/${fakeTeamId}/archives/${fakeBoardId}`);
    });
  });
});
