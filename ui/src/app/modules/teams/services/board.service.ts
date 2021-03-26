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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from '../../domain/board';
import * as moment from 'moment';
import { Thought } from '../../domain/thought';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(private http: HttpClient) {}

  fetchBoards(teamId: string, pageIndex: number): Observable<Array<Board>> {
    const params = {
      pageIndex: pageIndex.toString(),
    };

    return new Observable((subscriber) => {
      this.http
        .get(`/api/team/${teamId}/boards`, { params })
        .subscribe((data: Array<Object>) => {
          data.map((boardObject) => {
            boardObject['dateCreated'] = moment(boardObject['dateCreated']);
          });
          subscriber.next(data as Array<Board>);
        });
    });
  }

  createBoard(teamId: string, thoughts: Array<Thought>): Observable<Board> {
    return new Observable((subscriber) => {
      this.http
        .post(`/api/team/${teamId}/board`, { teamId, thoughts })
        .subscribe((data) => {
          subscriber.next(data as Board);
        });
    });
  }

  deleteBoard(teamId: string, boardId: number): Observable<any> {
    return this.http.delete(`/api/team/${teamId}/board/${boardId}`);
  }

  fetchThoughtsForBoard(teamId: string, boardId: number): Observable<any> {
    return this.http.get(`/api/team/${teamId}/board/${boardId}/thoughts`);
  }
}
