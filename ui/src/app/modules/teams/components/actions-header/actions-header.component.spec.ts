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

import {ActionsHeaderComponent} from './actions-header.component';
import {Observable} from 'rxjs/index';
import {ActionItem} from '../../../domain/action-item';
import * as moment from 'moment';

describe('ActionsHeaderComponent', () => {
  let component: ActionsHeaderComponent;
  let mockActionItemService;

  const teamId = 'team-id';

  beforeEach(() => {
    mockActionItemService = jasmine.createSpyObj({addActionItem: new Observable()});

    component = new ActionsHeaderComponent(mockActionItemService);
    component.teamId = teamId;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addThought', () => {

    const mockDateString = '2018-01-01';
    const mockDate = moment(mockDateString).toDate();

    beforeEach(() => {
      jasmine.clock().mockDate(mockDate);
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should construct the thought and call ThoughtService.addThought', () => {
      const newTask = 'a new actionItem';

      const expectedActionItem: ActionItem = {
        id: null,
        teamId: teamId,
        task: newTask,
        completed: false,
        assignee: null,
        dateCreated: moment(mockDateString).format()
      };

      component.addActionItem(newTask);

      expect(mockActionItemService.addActionItem).toHaveBeenCalledWith(expectedActionItem);
    });
  });

  describe('onSortChanged', () => {
    beforeEach(() => {
      component.sortChanged = jasmine.createSpyObj({
        emit: null
      });
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
