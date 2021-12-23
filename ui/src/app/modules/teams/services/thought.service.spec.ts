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

import { Observable } from 'rxjs';
import { ThoughtService } from './thought.service';
import {
  createMockHttpClient,
  createMockRxStompService,
} from '../../utils/testutils';
import { HttpClient } from '@angular/common/http';
import { RxStompService } from '@stomp/ng2-stompjs';
import { DataService } from '../../data.service';

describe('ThoughtService', () => {
  let service: ThoughtService;
  let spiedStompService: RxStompService;
  let mockHttpClient: HttpClient;

  const dataService: DataService = new DataService();
  const teamId = 'teamId';

  function createTestThought(
    team: string,
    id: number = Math.floor(Math.random() * 999999999)
  ) {
    return {
      id,
      teamId: team,
      topic: 'confused',
      message: 'asd',
      hearts: 0,
      discussed: false,
      columnTitle: {
        id: 2,
        topic: 'confused',
        title: 'Confused',
        teamId: 'test',
      },
    };
  }

  beforeEach(() => {
    mockHttpClient = createMockHttpClient();

    spiedStompService = createMockRxStompService();

    dataService.team.id = teamId;

    service = new ThoughtService(
      mockHttpClient,
      spiedStompService,
      dataService
    );
  });

  describe('Fetch Thoughts', () => {
    it('should request thoughts from the thoughts api', () => {
      const returnObj = service.fetchThoughts(teamId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `/api/team/${teamId}/thoughts`
      );
      expect(returnObj instanceof Observable).toBe(true);
    });
  });

  describe('Add Thought', () => {
    it('should send a message', () => {
      const testThought = createTestThought(teamId);

      service.addThought(testThought);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `/api/team/${teamId}/thought`,
        JSON.stringify(testThought),
        {headers: {'Content-Type': 'application/json'}}
      );
    });
  });

  describe('Update Thought', () => {
    it('should send a message', () => {
      const testThought = createTestThought(teamId, 1);

      service.updateThought(testThought);

      expect(spiedStompService.publish).toHaveBeenCalledWith({
        destination: `/app/${testThought.teamId}/thought/${testThought.id}/edit`,
        body: JSON.stringify(testThought),
      });
    });

    it('does not allow messages to be updated for other teams', () => {
      const testThought = createTestThought('hacker', 1);

      service.updateThought(testThought);

      expect(spiedStompService.publish).not.toHaveBeenCalled();
    });

    it('should update if a thought is discussed', () => {
      const testThought = createTestThought(teamId, 1);
      service.discussThought(testThought);
      expect(mockHttpClient.put).toHaveBeenCalledWith(`/api/team/${teamId}/thought/${testThought.id}/discuss`, {});
    });

    it('should update a thought topic', () => {
      const testThought = createTestThought(teamId, 1);
      const newTopic = 'move';

      service.moveThought(testThought.id, newTopic);

      const expectedBody = {
        topic: newTopic,
      };

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `/api/team/${teamId}/thought/${testThought.id}/topic`,
        JSON.stringify(expectedBody),
        {headers: {'Content-Type': 'application/json'}}
      );
    });
  });

  describe('Delete Thought', () => {
    it('should send a message', () => {
      const testThought = createTestThought(teamId, 1);
      service.deleteThought(testThought);
      expect(mockHttpClient.delete).toHaveBeenCalledWith(`/api/team/${teamId}/thought/${testThought.id}`);
    });
  });
});
