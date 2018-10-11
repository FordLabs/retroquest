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

import {BoardsService} from './boards.service';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import * as moment from 'moment';


describe('BoardsService', () => {
  let service: BoardsService;
  let mockHttpClient: HttpClient;
  let getRequestSubject: Subject<Array<Object>>;

  beforeEach(() => {
    getRequestSubject = new Subject();
    mockHttpClient = jasmine.createSpyObj({get: getRequestSubject});
    service = new BoardsService(mockHttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe(`fetchBoards`, () => {
    it(`should request thoughts from the thoughts api`, () => {
      const teamId = 'team-id';

      service.fetchBoards(teamId).subscribe();

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/team/${teamId}/boards`);
    });

    it('should send the boards on successful request', function () {
      const teamId = 'team-id';
      const expectedBoards = [
        {
          id: 1,
          dateCreated: moment(),
          teamId: teamId,
          thoughts: []
        }
      ];

      service.fetchBoards(teamId).subscribe(boards => {
        expect(boards).toBe(expectedBoards);
      });
      getRequestSubject.next(expectedBoards);
    });
  });
});
