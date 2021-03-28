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
import {Thought} from '../../domain/thought';
import {createMockHttpClient, createMockWebSocketService, createMockWsService} from '../../utils/testutils';
import {WebsocketService} from './websocket.service';
import {HttpClient} from '@angular/common/http';
import {WsService} from './ws.service';

describe('ThoughtService', () => {
  let service: ThoughtService;
  let mockHttpClient: HttpClient;
  let mockWebsocketService: WsService;

  const thought: Thought = {
    id: 0,
    teamId: 'team-id',
    topic: 'happy',
    message: 'a message',
    hearts: 0,
    discussed: false,
    columnTitle: null
  };

  beforeEach(() => {
    // @ts-ignore
    mockHttpClient = createMockHttpClient();
    // @ts-ignore
    mockWebsocketService = createMockWsService();

    service = new ThoughtService(mockHttpClient, mockWebsocketService);
  });

  describe('fetchThoughts', () => {
    it('should request thoughts from the thoughts api', () => {
      const teamId = 'team-id';

      const returnObj = service.fetchThoughts(teamId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/team/${teamId}/thoughts`);
      expect(returnObj instanceof Observable).toBe(true);
    });
  });

  describe('addThought', () => {
    it('should send thought to the thoughts websocket', () => {
      service.addThought(thought);
      expect(mockWebsocketService.createThought).toHaveBeenCalledWith(thought);
    });
  });

  describe('updateThought', () => {
    it('should send update to thoughts websocket', () => {
      service.updateThought(thought);
      expect(mockWebsocketService.updateThought).toHaveBeenCalledWith(thought);
    });
  });

  describe('deleteThought', () => {
    it('should send delete to thoughts websocket', () => {
      service.deleteThought(thought);
      expect(mockWebsocketService.deleteThought).toHaveBeenCalledWith(thought);
    });
  });
});
