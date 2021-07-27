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

import { ColumnService } from './column.service';
import { Observable } from 'rxjs/index';
import { Column } from '../../domain/column';
import {
  createMockHttpClient,
  createMockRxStompService,
} from '../../utils/testutils';
import { DataService } from '../../data.service';

describe('ColumnService', () => {
  let service: ColumnService;
  let mockHttpClient;
  let spiedStompService;

  const dataService: DataService = new DataService();
  const teamId = 'teamId';

  beforeEach(() => {
    mockHttpClient = createMockHttpClient();
    spiedStompService = createMockRxStompService();
    dataService.team.id = teamId;
    service = new ColumnService(mockHttpClient, spiedStompService, dataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchColumns', () => {
    it('should request Columns from the columns api', () => {
      const returnObj = service.fetchColumns(teamId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `/api/team/${teamId}/columns`
      );
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
        teamId,
      };

      service.updateColumn(testColumn);

      expect(spiedStompService.publish).toHaveBeenCalledWith({
        destination: `/app/${dataService.team.id}/column-title/${testColumn.id}/edit`,
        body: JSON.stringify(testColumn),
      });
    });
    it('cannot update columns for other teams', () => {
      const newTitle = 'title 2';

      const testColumn: Column = {
        id: 1,
        topic: 'happy',
        title: newTitle,
        teamId: 'hacker',
      };

      service.updateColumn(testColumn);

      expect(spiedStompService.publish).not.toHaveBeenCalled();
    });
  });
});
