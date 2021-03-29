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

import {Observable} from 'rxjs/index';
import {ThoughtService} from './thought.service';
import {createMockHttpClient} from '../../utils/testutils';
import {HttpClient} from '@angular/common/http';
import {RxStompService} from '@stomp/ng2-stompjs';
import {DataService} from '../../data.service';

describe('ThoughtService', () => {
  let service: ThoughtService;
  let spiedStompService: RxStompService;
  let mockHttpClient: HttpClient;
  const dataService: DataService = new DataService();
  const teamId = 'teamId';

  function createTestThought(team: string, id: number = null) {
    return {
      'id': id,
      'teamId': team,
      'topic': 'confused',
      'message': 'asd',
      'hearts': 0,
      'discussed': false,
      'columnTitle': {'id': 2, 'topic': 'confused', 'title': 'Confused', 'teamId': 'test'}
    };
  }

  beforeEach(() => {
    // @ts-ignore
    mockHttpClient = createMockHttpClient();

    // @ts-ignore
    spiedStompService = {
      publish: jest.fn(),
    } as RxStompService;

    dataService.team.id = teamId;

    service = new ThoughtService(mockHttpClient, spiedStompService, dataService);

  });

  describe('fetchThoughts', () => {
    it('should request thoughts from the thoughts api', () => {
      const returnObj = service.fetchThoughts(teamId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/team/${teamId}/thoughts`);
      expect(returnObj instanceof Observable).toBe(true);
    });
  });

  describe('addThought', () => {

    it('should send a message', () => {
      const testThought = createTestThought(teamId);

      service.addThought(testThought);

      expect(spiedStompService.publish).toHaveBeenCalledWith(
        {destination: `/app/${testThought.teamId}/thought/create`, body: JSON.stringify(testThought)}
      );
    });

    it('does not allow messages to be sent for other teams', () => {
      const testThought = createTestThought('hacker');

      service.addThought(testThought);

      expect(spiedStompService.publish).not.toHaveBeenCalled();
    });
  });

  describe('updateThought', () => {
    it('should send a message', () => {
      const testThought = createTestThought(teamId, 1);

      service.updateThought(testThought);

      expect(spiedStompService.publish).toHaveBeenCalledWith(
        {destination: `/app/${testThought.teamId}/thought/edit`, body: JSON.stringify(testThought)}
      );
    });

    it('does not allow messages to be updated for other teams', () => {
      const testThought = createTestThought('hacker', 1);

      service.updateThought(testThought);

      expect(spiedStompService.publish).not.toHaveBeenCalled();
    });
  });

  describe('deleteThought', () => {
    it('should send a message', () => {

      const testThought = createTestThought(teamId, 1);
      service.deleteThought(testThought);

      expect(spiedStompService.publish).toHaveBeenCalledWith(
        {destination: `/app/${testThought.teamId}/thought/delete`, body: JSON.stringify(testThought)}
      );
    });

    it('does not allow messages to be deleted for other teams', () => {
      const testThought = createTestThought('hacker', 1);

      service.deleteThought(testThought);

      expect(spiedStompService.publish).not.toHaveBeenCalled();
    });

  });
});
