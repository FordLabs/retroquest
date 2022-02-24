/*
 * Copyright (c) 2022 Ford Motor Company
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

import { DataService } from '../../data.service';
import { ActionItem } from '../../domain/action-item';
import { createMockHttpClient } from '../../utils/testutils';

import { ActionItemService } from './action.service';

describe('ActionItemService', () => {
  let service: ActionItemService;
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
    mockHttpClient = createMockHttpClient();

    dataService.team.id = teamId;

    service = new ActionItemService(mockHttpClient, dataService);
  });

  it('should add Action Item', () => {
    const actionItem = createActionItem(teamId);
    service.addActionItem(actionItem);
    expect(mockHttpClient.post).toHaveBeenCalledWith(
      `/api/team/${dataService.team.id}/action-item`,
      JSON.stringify(actionItem),
      { headers: { 'Content-Type': 'application/json' } }
    );
  });

  it('should delete Action Item', () => {
    const actionItem = createActionItem(teamId, 1);
    service.deleteActionItem(actionItem);
    expect(mockHttpClient.delete).toHaveBeenCalledWith(`/api/team/${actionItem.teamId}/action-item/${actionItem.id}`);
  });

  describe('update ActionItem', () => {
    it('should update task', () => {
      const actionItem = createActionItem(teamId, 1);
      service.updateTask(actionItem, 'updated task');
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `/api/team/${dataService.team.id}/action-item/1/task`,
        JSON.stringify({ task: 'updated task' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    });

    it('should update assignee', () => {
      const actionItem = createActionItem(teamId, 1);
      service.updateAssignee(actionItem, 'updated assignee');
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `/api/team/${dataService.team.id}/action-item/1/assignee`,
        JSON.stringify({ assignee: 'updated assignee' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    });

    it('should update completed status', () => {
      const actionItem = createActionItem(teamId, 1);
      service.updateCompleted(actionItem, true);
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `/api/team/${dataService.team.id}/action-item/1/completed`,
        JSON.stringify({ completed: true }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    });

    it('should update archived status', () => {
      const actionItem = createActionItem(teamId, 1);
      service.updateArchived(actionItem, true);
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `/api/team/${dataService.team.id}/action-item/1/archived`,
        JSON.stringify({ archived: true }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    });
  });

  describe('fetchArchivedActionItems', () => {
    const fakeTeamId = 'fake-team-id';

    it('should call the backend api with the correct url', () => {
      service.fetchArchivedActionItems(fakeTeamId);
      expect(mockHttpClient.get).toHaveBeenCalledWith(`/api/team/${fakeTeamId}/action-item?archived=true`);
    });
  });

  describe('archiveActionItems', () => {
    const archivedActionItems = new Array<ActionItem>();
    const firstActionItem = createActionItem(teamId, 1);
    const secondActionItem = createActionItem(teamId, 2);
    archivedActionItems.push(firstActionItem, secondActionItem);

    it('should call the backend api with the correct url', () => {
      service.archiveActionItems(archivedActionItems);
      expect(mockHttpClient.put).toHaveBeenCalledTimes(2);
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `/api/team/${dataService.team.id}/action-item/${firstActionItem.id}/archived`,
        JSON.stringify({ archived: true }),
        { headers: { 'Content-Type': 'application/json' } }
      );
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `/api/team/${dataService.team.id}/action-item/${secondActionItem.id}/archived`,
        JSON.stringify({ archived: true }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    });
  });
});
