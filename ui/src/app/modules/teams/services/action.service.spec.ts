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
import {ActionItem, emptyActionItem} from '../../domain/action-item';
import {HttpClient} from '@angular/common/http';
import {WebsocketService} from './websocket.service';
import {RxStompService} from '@stomp/ng2-stompjs';
import {DataService} from '../../data.service';
import {ThoughtService} from './thought.service';

describe('ActionItemService', () => {
  let service: ActionItemService;
  let spiedStompService: RxStompService;
  let mockHttpClient: HttpClient;
  const dataService: DataService = new DataService();
  const teamId = 'teamId';


  function createActionItem(team: string, id: number = null) {
    return {
      id: id,
      teamId: team,
      task: 'action actionItem',
      completed: false,
      assignee: null,
      dateCreated: null,
      archived: false
    };
  }

  beforeEach(() => {
    // @ts-ignore
    mockHttpClient = {
      get: jest.fn().mockReturnValue(new Observable()),
      post: jest.fn().mockReturnValue(new Observable()),
      put: jest.fn().mockReturnValue(new Observable()),
      delete: jest.fn().mockReturnValue(new Observable()),
    } as HttpClient;

    // @ts-ignore
    spiedStompService = {
      publish: jest.fn(),
    } as RxStompService;

    dataService.team.id = teamId;

    service = new ActionItemService(mockHttpClient, spiedStompService, dataService);
  });

  describe('addActionItem', () => {
    it('should add over websocket', () => {
      const actionItem = createActionItem(teamId);
      service.addActionItem(actionItem);
      expect(spiedStompService.publish).toHaveBeenCalledWith(
        {destination: `/app/${dataService.team.id}/action-item/create`, body: JSON.stringify(actionItem)}
      );
    });

    it('should not add with invalid team id', () => {
      const actionItem = createActionItem('hacker');
      service.addActionItem(actionItem);
      expect(spiedStompService.publish).not.toHaveBeenCalled();
    });
  });

  describe('deleteActionItem', () => {

    it('should delete over websocket', () => {
      const actionItem = createActionItem(teamId);
      service.deleteActionItem(actionItem);
      expect(spiedStompService.publish).toHaveBeenCalledWith(
        {destination: `/app/${dataService.team.id}/action-item/delete`, body: JSON.stringify(actionItem)}
      );
    });

    it('should not delete with invalid team id', () => {
      const actionItem = createActionItem('hacker');
      service.deleteActionItem(actionItem);
      expect(spiedStompService.publish).not.toHaveBeenCalled();
    });

  });

  describe('updateActionItem', () => {
    it('should delete over websocket', () => {
      const actionItem = createActionItem(teamId);
      service.updateActionItem(actionItem);
      expect(spiedStompService.publish).toHaveBeenCalledWith(
        {destination: `/app/${dataService.team.id}/action-item/edit`, body: JSON.stringify(actionItem)}
      );
    });

    it('should not delete with invalid team id', () => {
      const actionItem = createActionItem('hacker');
      service.updateActionItem(actionItem);
      expect(spiedStompService.publish).not.toHaveBeenCalled();
    });
  });

  describe('fetchArchivedActionItems', () => {
    const fakeTeamId = 'fake-team-id';

    it('should call the backend api with the correct url', () => {
      service.fetchArchivedActionItems(fakeTeamId);
      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/team/${fakeTeamId}/action-items/archived`);
    });
  });

  describe('archiveActionItems', () => {
    const archivedActionItems = new Array<ActionItem>();
    const firstActionItem = createActionItem(teamId, 1);
    const secondActionItem = createActionItem(teamId, 2);
    archivedActionItems.push(firstActionItem, secondActionItem);

    it('should call the backend api with the correct url', () => {
      service.archiveActionItems(archivedActionItems);
      expect(spiedStompService.publish).toHaveBeenCalledTimes(2);
      expect(spiedStompService.publish).toHaveBeenCalledWith(
        {destination: `/app/${dataService.team.id}/action-item/edit`, body: JSON.stringify(firstActionItem)}
      );
      expect(spiedStompService.publish).toHaveBeenCalledWith(
        {destination: `/app/${dataService.team.id}/action-item/edit`, body: JSON.stringify(secondActionItem)}
      );
    });
  });
});
