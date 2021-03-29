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

import {WebsocketService} from './websocket.service';
import {Observable} from 'rxjs/internal/Observable';
import {Column} from '../../domain/column';
import {DataService} from '../../data.service';
import {StompClient} from '@elderbyte/ts-stomp';

describe('WebsocketService', () => {
  let service: WebsocketService;
  const dataService: DataService = new DataService();
  let spiedClient;
  const teamId = 'teamId';

  beforeEach(() => {
    // @ts-ignore
    spiedClient = {
      connect: jest.fn(),
      subscribe: jest.fn(),
      send: jest.fn()
    } as StompClient;
    spiedClient.onConnect = new Observable();
    spiedClient.errors = new Observable();

    dataService.team.id = teamId;
    service = new WebsocketService(dataService);
    service.stompClient = spiedClient;
  });

  it('should call connect on client', () => {
    service.openWebsocket().subscribe();
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

  describe('sendHeartbeat', () => {
    beforeEach(() => {
      // @ts-ignore
      service.stompClient = {
        send: jest.fn()
      } as StompClient;
      service.sendHeartbeat();
    });

    it('should send a heartbeat ping to the backend with the team id in the url', () => {
      expect(service.stompClient.send).toHaveBeenCalledWith(`/app/heartbeat/ping/${teamId}`, '');
    });
  });

  describe('closeWebsocket', () => {
    it('should close the current websocket', () => {
      service.intervalId = 1;

      service.closeWebsocket();
      expect(service.stompClient).toBeNull();
      expect(service.websocket).toBeNull();
      expect(service.intervalId).toBeNull();
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

  describe('actionItemTopic', () => {

    it('should throw an error if called without opening the websocket', () => {
      try {
        service.actionItemTopic();
        expect(true).toBeFalsy();
      } catch (e) {
        expect(e).toEqual(expect.any(Error));
      }
    });

    it('should subscribe to the action item topic', () => {
      service.openWebsocket().subscribe();

      service.actionItemTopic().subscribe();

      expect(service.stompClient.subscribe).toHaveBeenCalledWith(`/topic/${teamId}/action-items`);
    });

  });

  describe('columnTitleTopic', () => {

    it('should subscribe to the column title topic', async () => {
      service.columnTitleTopic().subscribe();
      expect(service.stompClient.subscribe).toHaveBeenCalledWith(`/topic/${teamId}/column-titles`);
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

      service.openWebsocket().subscribe();
      service.updateColumnTitle(fakeColumnTitle);

      expect(service.stompClient.send).toHaveBeenCalledWith(
        `/app/${teamId}/column-title/${fakeColumnTitle.id}/edit`,
        JSON.stringify(fakeColumnTitle)
      );
    });
  });

  describe('deleteActionItem', () => {
    it('should call the end retro websocket with no message', () => {
      service.openWebsocket().subscribe();
      service.endRetro();

      expect(service.stompClient.send).toHaveBeenCalledWith(`/app/${teamId}/end-retro`, null);
    });
  });
});
