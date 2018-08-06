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

import {WebsocketService} from './websocket.service';
import {Observable} from 'rxjs/internal/Observable';
import {Column} from '../domain/column';
import createSpyObj = jasmine.createSpyObj;

describe('WebsocketService', () => {
  let service: WebsocketService;
  let spiedClient;
  const teamId = 'teamId';

  beforeEach(() => {
    spiedClient = createSpyObj({
      connect: null,
      subscribe: {messages: new Observable()},
      send: null
    });
    spiedClient.onConnect = new Observable();
    spiedClient.errors = new Observable();

    service = new WebsocketService();
    service.stompClient = spiedClient;
  });

  it('should set teamId', () => {
    service.openWebsocket(teamId).subscribe();
    expect(service.teamId).toBe(teamId);
  });

  it('should call connect on client', () => {
    service.openWebsocket(teamId).subscribe();
    expect(service.stompClient.connect).toHaveBeenCalled();
  });

  describe('getProtocol', () => {
    it('should return ws:// when the location.protocol is http', () => {
      expect(WebsocketService.getWsProtocol({protocol: 'http:'})).toBe('ws://');
    });

    it('should return wss:// when the location.protocol is https', () => {
      expect(WebsocketService.getWsProtocol({protocol: 'https:'})).toBe('wss://');
    });
  });

  describe('closeWebsocket', () => {
    it('should close the current websocket', () => {
      service.closeWebsocket();
      expect(service.stompClient).toBeNull();
      expect(service.websocket).toBeNull();
    });
  });

  describe('getWebsocketState', () => {
    it('should return close when the websocket was never opened', () => {
      const state = service.getWebsocketState();
      expect(state).toEqual(WebSocket.CLOSED);
    });

    it('should return the state of the websocket after opening', () => {
      service.websocket = {
        readyState: WebSocket.OPEN
      };
      const state = service.getWebsocketState();
      expect(state).toEqual(WebSocket.OPEN);
    });
  });

  describe('thoughtsTopic', () => {

    it('should throw an error if called without opening the websocket', () => {
      try {
        service.thoughtsTopic();
        expect(true).toBeFalsy();
      } catch (e) {
        expect(e).toEqual(jasmine.any(Error));
      }
    });

    it('should subscribe to the thoughts topic', () => {
      service.openWebsocket(teamId).subscribe();

      service.thoughtsTopic().subscribe();

      expect(service.stompClient.subscribe).toHaveBeenCalledWith(`/topic/${teamId}/thoughts`);
    });

  });

  describe('actionItemTopic', () => {

    it('should throw an error if called without opening the websocket', () => {
      try {
        service.actionItemTopic();
        expect(true).toBeFalsy();
      } catch (e) {
        expect(e).toEqual(jasmine.any(Error));
      }
    });

    it('should subscribe to the action item topic', () => {
      service.openWebsocket(teamId).subscribe();

      service.actionItemTopic().subscribe();

      expect(service.stompClient.subscribe).toHaveBeenCalledWith(`/topic/${teamId}/action-items`);
    });

  });

  describe('columnTitleTopic', () => {

    it('should throw an error if called without opening the websocket', () => {
      try {
        service.columnTitleTopic();
        expect(true).toBeFalsy();
      } catch (e) {
        expect(e).toEqual(jasmine.any(Error));
      }
    });

    it('should subscribe to the column title topic', () => {
      service.openWebsocket(teamId).subscribe();

      service.columnTitleTopic().subscribe();

      expect(service.stompClient.subscribe).toHaveBeenCalledWith(`/topic/${teamId}/column-titles`);
    });

  });


  describe('createThought', () => {

    it('should send a message', () => {
      const fakeThought = {
        'id': null,
        'teamId': 'test',
        'topic': 'confused',
        'message': 'asd',
        'hearts': 0,
        'discussed': false,
        'columnTitle': {'id': 2, 'topic': 'confused', 'title': 'Confused', 'teamId': 'test'}
      };

      service.openWebsocket(teamId).subscribe();
      service.createThought(fakeThought);

      expect(service.stompClient.send).toHaveBeenCalledWith(
        `/app/${teamId}/thought/create`,
        JSON.stringify(fakeThought)
      );
    });
  });

  describe('deleteThought', () => {
    it('should send a message', () => {
      const fakeThought = {
        'id': 1,
        'teamId': 'test',
        'topic': 'confused',
        'message': 'asd',
        'hearts': 0,
        'discussed': false,
        'columnTitle': {'id': 2, 'topic': 'confused', 'title': 'Confused', 'teamId': 'test'}
      };

      service.openWebsocket(teamId).subscribe();
      service.deleteThought(fakeThought);

      expect(service.stompClient.send).toHaveBeenCalledWith(
        `/app/${teamId}/thought/${fakeThought.id}/delete`,
        null
      );
    });
  });

  describe('updateThought', () => {
    it('should send a message', () => {
      const fakeThought = {
        'id': 1,
        'teamId': 'test',
        'topic': 'confused',
        'message': 'asd',
        'hearts': 0,
        'discussed': false,
        'columnTitle': {'id': 2, 'topic': 'confused', 'title': 'Confused', 'teamId': 'test'}
      };

      service.openWebsocket(teamId).subscribe();
      service.updateThought(fakeThought);

      expect(service.stompClient.send).toHaveBeenCalledWith(
        `/app/${teamId}/thought/${fakeThought.id}/edit`,
        JSON.stringify(fakeThought)
      );
    });
  });

  describe('updateActionItem', () => {
    it('should send a message', () => {
      const fakeActionItem = {
        id: 1,
        task: '',
        completed: false,
        teamId: '',
        assignee: '',
        dateCreated: null
      };

      service.openWebsocket(teamId).subscribe();
      service.updateActionItem(fakeActionItem);

      expect(service.stompClient.send).toHaveBeenCalledWith(
        `/app/${teamId}/action-item/${fakeActionItem.id}/edit`,
        JSON.stringify(fakeActionItem)
      );
    });
  });

  describe('updateColumnTitle', () => {
    it('should send a message', () => {
      const fakeColumnTitle: Column = {
        id: 1,
        teamId: '',
        topic: '',
        title: ''
      };

      service.openWebsocket(teamId).subscribe();
      service.updateColumnTitle(fakeColumnTitle);

      expect(service.stompClient.send).toHaveBeenCalledWith(
        `/app/${teamId}/column-title/${fakeColumnTitle.id}/edit`,
        JSON.stringify(fakeColumnTitle)
      );
    });
  });

  describe('createActionItem', () => {
    it('should send a message', () => {
      const fakeActionItem = {
        id: 1,
        task: '',
        completed: false,
        teamId: '',
        assignee: '',
        dateCreated: null
      };

      service.openWebsocket(teamId).subscribe();
      service.createActionItem(fakeActionItem);

      expect(service.stompClient.send).toHaveBeenCalledWith(
        `/app/${teamId}/action-item/create`,
        JSON.stringify(fakeActionItem)
      );
    });
  });

  describe('deleteActionItem', () => {
    it('should send a message', () => {
      const fakeActionItem = {
        id: 1,
        task: '',
        completed: false,
        teamId: '',
        assignee: '',
        dateCreated: null
      };

      service.openWebsocket(teamId).subscribe();
      service.deleteActionItem(fakeActionItem);

      expect(service.stompClient.send).toHaveBeenCalledWith(
        `/app/${teamId}/action-item/${fakeActionItem.id}/delete`,
        null
      );
    });
  });
});
