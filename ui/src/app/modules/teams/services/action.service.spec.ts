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

import { ActionItemService } from './action.service';
import { Observable } from 'rxjs/index';
import { ActionItem } from '../../domain/action-item';
import { HttpClient } from '@angular/common/http';
import { RxStompService } from '@stomp/ng2-stompjs';
import { DataService } from '../../data.service';
import {
  createMockHttpClient,
  createMockRxStompService,
} from '../../utils/testutils';

describe('ActionItemService', () => {
  let service: ActionItemService;
  let spiedStompService: RxStompService;
  let mockHttpClient: HttpClient;
  const dataService: DataService = new DataService();
  const teamId = 'teamId';

  function createActionItem(team: string, id: number = null) {
    return {
      id,
      teamId: team,
      task: 'action actionItem',
      completed: false,
      assignee: null,
      dateCreated: null,
      archived: false,
    };
  }

  beforeEach(() => {
    // @ts-ignore
    mockHttpClient = createMockHttpClient();

    // @ts-ignore
    spiedStompService = createMockRxStompService();

    dataService.team.id = teamId;

    service = new ActionItemService(
      mockHttpClient,
      spiedStompService,
      dataService
    );
  });

  describe('addActionItem', () => {
    it('should add over websocket', () => {
      const actionItem = createActionItem(teamId);
      service.addActionItem(actionItem);
      expect(spiedStompService.publish).toHaveBeenCalledWith({
        destination: `/app/${dataService.team.id}/action-item/create`,
        body: JSON.stringify(actionItem),
      });
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
      expect(spiedStompService.publish).toHaveBeenCalledWith({
        destination: `/app/${dataService.team.id}/action-item/${actionItem.id}/delete`,
        body: JSON.stringify(actionItem),
      });
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
      expect(spiedStompService.publish).toHaveBeenCalledWith({
        destination: `/app/${dataService.team.id}/action-item/${actionItem.id}/edit`,
        body: JSON.stringify(actionItem),
      });
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
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `/api/team/${fakeTeamId}/action-items/archived`
      );
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
      expect(spiedStompService.publish).toHaveBeenCalledWith({
        destination: `/app/${dataService.team.id}/action-item/${firstActionItem.id}/edit`,
        body: JSON.stringify(firstActionItem),
      });
      expect(spiedStompService.publish).toHaveBeenCalledWith({
        destination: `/app/${dataService.team.id}/action-item/${secondActionItem.id}/edit`,
        body: JSON.stringify(secondActionItem),
      });
    });
  });
});
