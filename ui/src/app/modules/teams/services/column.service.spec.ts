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

import {ColumnService} from './column.service';
import {Observable} from 'rxjs/index';
import {Column} from '../../domain/column';

describe('ColumnService', () => {
  let service: ColumnService;
  let mockWebsocketService;
  const mockHttpClient = jasmine.createSpyObj({get: new Observable(), put: new Observable()});

  const teamId = 'team-id';

  beforeEach(() => {
    mockWebsocketService = jasmine.createSpyObj({updateColumnTitle: null});
    service = new ColumnService(mockHttpClient, mockWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchColumns', () => {
    it('should request Columns from the columns api', () => {
      const returnObj = service.fetchColumns(teamId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/team/${teamId}/columns`);
      expect(returnObj instanceof Observable).toBe(true);
    });
  });

  describe('updateColumn', () => {
    it('should send a put request to columns api', () => {
      const newTitle = 'title 2';

      const testColumn: Column = {
        id: 1,
        topic: 'happy',
        title: newTitle,
        teamId: teamId
      };

      service.updateColumn(testColumn);

      expect(mockWebsocketService.updateColumnTitle).toHaveBeenCalledWith(testColumn);
    });
  });
});
