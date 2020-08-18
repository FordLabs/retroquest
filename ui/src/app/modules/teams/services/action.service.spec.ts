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

import {ActionItemService} from './action.service';
import {Observable} from 'rxjs/index';
import {ActionItem} from '../../domain/action-item';
import {HttpClient} from '@angular/common/http';
import {WebsocketService} from './websocket.service';

describe('ActionItemService', () => {
  let service: ActionItemService;
  let mockHttpClient: HttpClient;
  let mockWebSocket: WebsocketService;

  const actionItem: ActionItem = {
    id: 0,
    teamId: 'team-id',
    task: 'action actionItem',
    completed: false,
    assignee: null,
    dateCreated: null,
    archived: false
  };

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj(
      {
        get: new Observable(),
        post: new Observable(),
        put: new Observable(),
        delete: new Observable()
      });

    mockWebSocket = jasmine.createSpyObj(
      {
        createActionItem: null,
        deleteActionItem: null,
        updateActionItem: null
      }
    );
    service = new ActionItemService(mockHttpClient, mockWebSocket);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addActionItem', () => {
    it('should add over websocket', () => {
      service.addActionItem(actionItem);
      expect(mockWebSocket.createActionItem).toHaveBeenCalledWith(actionItem);
    });
  });

  describe('deleteActionItem', () => {
    it('should send delete request to the ActionItem api via websocket', () => {
      service.deleteActionItem(actionItem);
      expect(mockWebSocket.deleteActionItem).toHaveBeenCalledWith(actionItem);
    });
  });

  describe('updateActionItem', () => {
    it('should send an update command to the ActionItem api via websocket', () => {
      service.updateActionItem(actionItem);
      expect(mockWebSocket.updateActionItem).toHaveBeenCalledWith(actionItem);
    });
  });

  describe('fetchArchivedActionItems', () => {
    const fakeTeamId = 'fake-team-id';

    it('should call the backend api with the correct url', () => {
      service.fetchArchivedActionItems(fakeTeamId);
      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/team/${fakeTeamId}/action-items/archived`);
    });
  });

});
