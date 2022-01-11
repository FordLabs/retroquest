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
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../../data.service';
import { Column } from '../../domain/column';

@Injectable()
export class ColumnService {
  constructor(private http: HttpClient, private dataService: DataService) {}

  fetchColumns(teamId): Observable<Array<Column>> {
    return this.http.get<Array<Column>>(`/api/team/${teamId}/columns`);
  }

  updateColumn(column: Column): void {
    this.http
      .put(`/api/team/${this.dataService.team.id}/column/${column.id}/title`, JSON.stringify({ title: column.title }), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .subscribe();
  }
}
