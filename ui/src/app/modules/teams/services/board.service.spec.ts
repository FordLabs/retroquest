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

import { HttpClient } from '@angular/common/http';
import moment from 'moment';
import { Subject } from 'rxjs';

import { Board } from '../../domain/board';
import { emptyThoughtWithColumn } from '../../domain/thought';

import { BoardService } from './board.service';

describe('BoardService', () => {
  let service: BoardService;
  let mockHttpClient: HttpClient;
  let getRequestSubject: () => Subject<Board[]>;
  let postRequestSubject: () => Subject<Board[]>;
  let deleteRequestSubject: () => Subject<Board[]>;

  const teamId = 'team-id';

  beforeEach(() => {
    getRequestSubject = jest.fn().mockReturnValue(new Subject<Board[]>());
    postRequestSubject = jest.fn().mockReturnValue(new Subject<Board[]>());
    deleteRequestSubject = jest.fn().mockReturnValue(new Subject<Board[]>());

    mockHttpClient = {
      get: getRequestSubject,
      post: postRequestSubject,
      delete: deleteRequestSubject,
    } as unknown as HttpClient;
    service = new BoardService(mockHttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe(`fetchBoards`, () => {
    const params = {
      pageIndex: '0',
    };

    it(`should request thoughts from the thoughts api with a page index of 0`, () => {
      service.fetchBoards(teamId, 0).subscribe();
      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/team/${teamId}/boards`, { params });
    });

    it('should send the boards on successful request', () => {
      const expectedBoards: Board[] = [
        {
          id: 1,
          dateCreated: moment(),
          teamId,
          thoughts: [],
        },
      ];

      service.fetchBoards(teamId, 0).subscribe((boards) => {
        expect(boards).toBe(expectedBoards);
      });
      getRequestSubject().next(expectedBoards);
    });
  });

  describe('createBoard', () => {
    it('should call the create board endpoint', () => {
      service.createBoard(teamId);
      expect(mockHttpClient.post).toHaveBeenCalledWith(`/api/team/${teamId}/board`, {});
    });
  });

  describe('deleteBoard', () => {
    it('should call the delete board endpoint', () => {
      const boardId = -1;
      service.deleteBoard(teamId, boardId).subscribe();
      expect(mockHttpClient.delete).toHaveBeenCalledWith(`/api/team/${teamId}/board/${boardId}`);
    });
  });

  describe('fetchThoughtsForBoard', () => {
    it('should call the get thoughts for board endpoint', () => {
      const boardId = -1;
      service.fetchThoughtsForBoard(teamId, boardId).subscribe();
      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/team/${teamId}/board/${boardId}/thoughts`);
    });
  });
});
