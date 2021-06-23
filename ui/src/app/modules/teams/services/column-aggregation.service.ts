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

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ColumnCombinerResponse} from '../../domain/column-combiner-response';
import {Observable} from 'rxjs';

@Injectable()
export class ColumnAggregationService {

  constructor(private httpClient: HttpClient) {
  }

  getColumns(teamId: string): Observable<ColumnCombinerResponse> {
    return this.httpClient.get<ColumnCombinerResponse>(`/api/v2/team/${teamId}/columns`, {observe: 'body'});
  }

}
