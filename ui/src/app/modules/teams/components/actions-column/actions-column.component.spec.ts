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

import {ActionsColumnComponent} from './actions-column.component';
import {ActionItem} from '../../domain/action-item';
import {ActionItemService} from '../../services/action.service';

describe('ActionsColumnComponent', () => {
  let component: ActionsColumnComponent;

  let mockActionItemService: ActionItemService;
  let fakeActionItem: ActionItem;

  beforeEach(() => {
    mockActionItemService = jasmine.createSpyObj({
      updateActionItem: null,
      deleteActionItem: null
    });

    component = new ActionsColumnComponent(mockActionItemService);

    fakeActionItem = {
      id: -1,
      teamId: null,
      task: '',
      completed: false,
      assignee: null
    };

    component.actionItems = [fakeActionItem];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('completeActionItem', () => {
    it('should toggle completion flag', () => {
      component.completeActionItem(fakeActionItem);
      expect(mockActionItemService.updateActionItem).toHaveBeenCalled();
      expect(fakeActionItem.completed).toBeTruthy();
    });
  });

  describe('setCurrentActionItem', () => {
    it('should copy the selected action item to the editedActionItem', () => {
      component.setCurrentActionItem(fakeActionItem);

      expect(component.currentActionItemId).toEqual(fakeActionItem.id);
    });

    it('should update action item when editing a different action item', () => {
      const newActionItem = {
        id: 1,
        teamId: null,
        task: '',
        completed: false,
        assignee: null
      };
      component.setCurrentActionItem(fakeActionItem);
      component.setCurrentActionItem(newActionItem);

      expect(component.currentActionItemId).toEqual(newActionItem.id);
    });

    it('should call ActionService.updateActionItem when closing edit box', () => {
      component.setCurrentActionItem(fakeActionItem);
      component.setCurrentActionItem(fakeActionItem);
      expect(mockActionItemService.updateActionItem).toHaveBeenCalledWith(fakeActionItem);
    });

    it('should maintain changes while editing', () => {
      const expectedActionItem = {...fakeActionItem};
      expectedActionItem.assignee = 'assignee';

      component.setCurrentActionItem(fakeActionItem);
      component.actionItems[0].assignee = 'assignee';
      component.setCurrentActionItem();
      expect(mockActionItemService.updateActionItem).toHaveBeenCalledWith(expectedActionItem);
    });

  });

  describe('deleteActionItem', () => {
    it('should call ActionItemService.deleteActionItem', () => {
      const originalConfirmFunction = window.confirm;

      window.confirm = () => true;

      component.deleteActionItem(fakeActionItem);

      expect(mockActionItemService.deleteActionItem).toHaveBeenCalledWith(fakeActionItem);

      window.confirm = originalConfirmFunction;
    });

  });

  describe('updateAssignee', () => {
    it('should call ActionItemService.updateActionItem', () => {
      const newActionItem = {...fakeActionItem};
      const newAssignee = 'bob';

      component.updateAssignee(fakeActionItem, newAssignee);
      newActionItem.assignee = newAssignee;
      newActionItem.expanded = false;

      expect(mockActionItemService.updateActionItem).toHaveBeenCalledWith(newActionItem);
    });

  });
});
