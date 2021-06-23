/*
 * Copyright (c) 2021 Ford Motor Company
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/index';

import { Column } from '../../domain/column';
import { RxStompService } from '@stomp/ng2-stompjs';
import { DataService } from '../../data.service';

@Injectable()
export class ColumnService {
  constructor(
    private http: HttpClient,
    private rxStompService: RxStompService,
    private dataService: DataService
  ) {}

  fetchColumns(teamId): Observable<Array<Column>> {
    return this.http.get<Array<Column>>(`/api/team/${teamId}/columns`);
  }

  private validTeamId(teamId: string) {
    return this.dataService.team.id === teamId;
  }

  updateColumn(column: Column): void {
    if (this.validTeamId(column.teamId)) {
      this.rxStompService.publish({
        destination: `/app/${this.dataService.team.id}/column-title/${column.id}/edit`,
        body: JSON.stringify(column),
      });
    }
  }
}
