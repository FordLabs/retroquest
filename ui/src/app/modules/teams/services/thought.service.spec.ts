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

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DataService } from '../../data.service';
import { createMockHttpClient } from '../../utils/testutils';

import { ThoughtService } from './thought.service';

describe('ThoughtService', () => {
  let service: ThoughtService;
  let mockHttpClient: HttpClient;

  const dataService: DataService = new DataService();
  const teamId = 'teamId';

  function createTestThought(team: string, id: number = Math.floor(Math.random() * 999999999)) {
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
    dataService.team.id = teamId;

    service = new ThoughtService(mockHttpClient, dataService);
  });

  describe('Fetch Thoughts', () => {
    it('should request thoughts from the thoughts api', () => {
      const returnObj = service.fetchThoughts(teamId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/team/${teamId}/thoughts`);
      expect(returnObj instanceof Observable).toBe(true);
    });
  });

  describe('Add Thought', () => {
    it('should send a message', () => {
      const testThought = createTestThought(teamId);

      service.addThought(testThought);

      expect(mockHttpClient.post).toHaveBeenCalledWith(`/api/team/${teamId}/thought`, JSON.stringify(testThought), {
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });

  describe('Update Thought', () => {
    it('should heart a thought', () => {
      const testThought = createTestThought(teamId, 1);
      service.heartThought(testThought);
      expect(mockHttpClient.put).toHaveBeenCalledWith(`/api/team/${teamId}/thought/${testThought.id}/heart`, {});
    });

    it('should update if a thought is discussed', () => {
      const testThought = createTestThought(teamId, 1);
      const expectedBody = { discussed: false };
      service.updateDiscussionStatus(testThought, false);
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `/api/team/${teamId}/thought/${testThought.id}/discuss`,
        JSON.stringify(expectedBody),
        { headers: { 'Content-Type': 'application/json' } }
      );
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
        { headers: { 'Content-Type': 'application/json' } }
      );
    });

    it('should update a thought message', () => {
      const testThought = createTestThought(teamId, 1);
      const newMessage = 'Something else';

      service.updateMessage(testThought, newMessage);

      const expectedBody = {
        message: newMessage,
      };

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `/api/team/${teamId}/thought/${testThought.id}/message`,
        JSON.stringify(expectedBody),
        { headers: { 'Content-Type': 'application/json' } }
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
