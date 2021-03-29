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

import {Injectable, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';

import {Thought} from '../../domain/thought';
import {RxStompService} from '@stomp/ng2-stompjs';
import {DataService} from '../../data.service';

@Injectable()
export class ThoughtService {

  constructor (private http: HttpClient, private rxStompService: RxStompService, private dataService: DataService) {
  }

  private validTeamId(teamId: string) {
    return this.dataService.team.id === teamId;
  }

  fetchThoughts (teamId: string): Observable<Array<Thought>> {
    return this.http.get<Array<Thought>>(`/api/team/${teamId}/thoughts`);
  }

  addThought (thought: Thought): void {
    if (this.validTeamId(thought.teamId)) {
      this.rxStompService.publish({destination: `/app/${this.dataService.team.id}/thought/create`, body: JSON.stringify(thought)});
    }
  }

  updateThought (thought: Thought): void {
    if (this.validTeamId(thought.teamId)) {
      this.rxStompService.publish({destination: `/app/${this.dataService.team.id}/thought/edit`, body: JSON.stringify(thought)});
    }
  }

  deleteThought (thought: Thought): void {
    if (this.validTeamId(thought.teamId)) {
      this.rxStompService.publish({destination: `/app/${this.dataService.team.id}/thought/delete`, body: JSON.stringify(thought)});
    }
  }


}
