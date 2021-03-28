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

import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';

import {Thought} from '../../domain/thought';
import {WsService} from './ws.service';

@Injectable()
export class ThoughtService {

  constructor (private http: HttpClient, private websocket: WsService) {
  }

  fetchThoughts (teamId: string): Observable<Array<Thought>> {
    return this.http.get<Array<Thought>>(`/api/team/${teamId}/thoughts`);
  }

  addThought (thought: Thought): void {
    this.websocket.createThought(thought);
  }

  updateThought (thought: Thought): void {
    this.websocket.updateThought(thought);
  }

  deleteThought (thought: Thought): void {
    this.websocket.deleteThought(thought);
  }

}
