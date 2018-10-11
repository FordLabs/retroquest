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

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Board} from '../../domain/board';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http: HttpClient) {
  }

  fetchBoards(teamId: string): Observable<Array<Board>> {
    return new Observable((subscriber) => {
      this.http.get(`/api/team/${teamId}/boards`).subscribe((data: Array<Object>) => {
        data.map((boardObject) => {
          console.log(boardObject);
          boardObject['dateCreated'] = moment(boardObject['dateCreated']);
        });
        subscriber.next(data as Array<Board>);
      });
    });
  }
}
