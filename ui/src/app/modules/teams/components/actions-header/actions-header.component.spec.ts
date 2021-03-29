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

import { ActionsHeaderComponent } from './actions-header.component';
import { Observable } from 'rxjs/index';
import { ActionItem } from '../../../domain/action-item';
import moment from 'moment';
import { createMockEventEmitter } from '../../../utils/testutils';
import MockDate from 'mockdate';

describe('ActionsHeaderComponent', () => {
  let component: ActionsHeaderComponent;
  let mockActionItemService;

  const teamId = 'team-id';

  beforeEach(() => {
    mockActionItemService = {
      addActionItem: jest.fn().mockReturnValue(new Observable()),
    };

    component = new ActionsHeaderComponent(mockActionItemService);
    component.teamId = teamId;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addActionItem', () => {
    const mockDateString = '2018-01-01';
    const mockDate = moment(mockDateString).toDate();

    beforeEach(() => {
      MockDate.set(mockDate);
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('should construct the action item and call the backend', () => {
      const newMessage = 'a new actionItem';

      const expectedActionItem: ActionItem = {
        id: null,
        teamId,
        task: newMessage,
        completed: false,
        assignee: null,
        dateCreated: moment(mockDateString).format(),
        archived: false,
      };

      component.addActionItem(newMessage);

      expect(mockActionItemService.addActionItem).toHaveBeenCalledWith(
        expectedActionItem
      );
    });

    it('should parse out the assignees from the new message and add it to the action item', () => {
      const newUnformattedMessage = `a new actionItem @ben12 @frank`;
      const expectedFormattedMessage = 'a new actionItem';

      const expectedActionItem: ActionItem = {
        id: null,
        teamId,
        task: expectedFormattedMessage,
        completed: false,
        assignee: 'ben12, frank',
        dateCreated: moment(mockDateString).format(),
        archived: false,
      };

      component.addActionItem(newUnformattedMessage);

      expect(mockActionItemService.addActionItem).toHaveBeenCalledWith(
        expectedActionItem
      );
    });

    it('should set the assignees in the action item to null if none could be parsed out of the message', () => {
      const newMessage = `a new actionItem`;

      const expectedActionItem: ActionItem = {
        id: null,
        teamId,
        task: newMessage,
        completed: false,
        assignee: null,
        dateCreated: moment(mockDateString).format(),
        archived: false,
      };

      component.addActionItem(newMessage);

      expect(mockActionItemService.addActionItem).toHaveBeenCalledWith(
        expectedActionItem
      );
    });

    it('should not let the user submit a assignee string greater than the max limit', () => {
      const expectedAssignee =
        'llllllllllllllllllllllllllllllllllllllllllllllllll';
      const newMessage = `a new actionItem @${expectedAssignee}p`;
      const expectedFormattedMessage = 'a new actionItem';

      const expectedActionItem: ActionItem = {
        id: null,
        teamId,
        task: expectedFormattedMessage,
        completed: false,
        assignee: expectedAssignee,
        dateCreated: moment(mockDateString).format(),
        archived: false,
      };

      component.addActionItem(newMessage);

      expect(mockActionItemService.addActionItem).toHaveBeenCalledWith(
        expectedActionItem
      );
    });
  });

  describe('onSortChanged', () => {
    beforeEach(() => {
      component.sortChanged = createMockEventEmitter();
    });

    it('should emit the sort state passed in as true', () => {
      component.onSortChanged(true);
      expect(component.sortChanged.emit).toHaveBeenCalledWith(true);
    });

    it('should emit the sort state passed in as false', () => {
      component.onSortChanged(false);
      expect(component.sortChanged.emit).toHaveBeenCalledWith(false);
    });
  });
});
