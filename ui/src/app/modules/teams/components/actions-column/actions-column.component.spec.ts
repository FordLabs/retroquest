/*
 * Copyright (c) 2021 Ford Motor Company
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

import { ActionsColumnComponent } from './actions-column.component';
import { ActionItem } from '../../../domain/action-item';
import { ActionItemService } from '../../services/action.service';
import { ActionItemDialogComponent } from '../../../components/action-item-dialog/action-item-dialog.component';
import { WebsocketActionItemResponse } from '../../../domain/websocket-response';

describe('ActionsColumnComponent', () => {
  let component: ActionsColumnComponent;

  let mockActionItemService: ActionItemService;
  let fakeActionItem: ActionItem;

  beforeEach(() => {
    // @ts-ignore
    mockActionItemService = {
      updateActionItem: jest.fn(),
      deleteActionItem: jest.fn(),
      updateTask: jest.fn(),
      updateAssignee: jest.fn(),
      updateCompleted: jest.fn()
    } as ActionItemService;

    component = new ActionsColumnComponent(mockActionItemService);

    fakeActionItem = {
      id: -1,
      teamId: null,
      task: '',
      completed: false,
      assignee: null,
      dateCreated: null,
      archived: false,
    };

    component.actionItemAggregation = {
      id: 1,
      items: { active: [fakeActionItem], completed: [] },
      title: 'Action Item',
      topic: 'action',
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the action item on the backend with the passed in state on completed', () => {
    component.onCompleted(true, fakeActionItem);
    expect(mockActionItemService.updateCompleted).toHaveBeenCalledWith(fakeActionItem, true);
  });

  it('should delete the action item on the backend', () => {
    component.onDeleted(fakeActionItem);
    expect(mockActionItemService.deleteActionItem).toHaveBeenCalledWith(
      fakeActionItem
    );
  });

  it('should update the action item on the backend on message changed', () => {
    component.onMessageChanged('I AM A FAKE MESSAGE', fakeActionItem);
    expect(mockActionItemService.updateTask).toHaveBeenCalledWith(
      fakeActionItem, 'I AM A FAKE MESSAGE'
    );
  });

  it('should update the action item on the backend on assignee updated', () => {
    component.onAssigneeUpdated('I AM A FAKE ASSIGNEE', fakeActionItem);
    expect(mockActionItemService.updateAssignee).toHaveBeenCalledWith(
      fakeActionItem, 'I AM A FAKE ASSIGNEE'
    );
  });

  describe('displayPopup', () => {
    beforeEach(() => {
      // @ts-ignore
      component.actionItemDialog = {
        show: jest.fn(),
      } as ActionItemDialogComponent;
    });

    it('should show the action item dialog', () => {
      component.displayPopup(fakeActionItem);
      expect(component.actionItemDialog.show).toHaveBeenCalled();
    });

    it('should set the selected action item index to the index passed in', () => {
      component.displayPopup(fakeActionItem);
      expect(component.selectedActionItem).toEqual(fakeActionItem);
    });
  });

  describe('processActionItemChanged', () => {
    let deleteSpy;
    let updateSpy;

    beforeEach(() => {
      deleteSpy = jest.spyOn(component, 'deleteActionItem');
      updateSpy = jest.spyOn(component, 'updateActionItems');
    });

    it('Handles update correctly', () => {
      const response = {
        type: 'put',
        payload: {
          id: 11,
          task: 'NBC',
          completed: false,
          teamId: 'test',
          assignee: null,
          dateCreated: '2021-03-29',
          archived: false,
        },
      };
      component.processActionItemChange(response);

      expect(updateSpy).toHaveBeenCalledWith(response.payload);
      expect(deleteSpy).not.toHaveBeenCalled();
    });

    it('Does not update archived action items', () => {
      const response = {
        type: 'put',
        payload: {
          id: 11,
          task: 'NBC',
          completed: false,
          teamId: 'test',
          assignee: null,
          dateCreated: '2021-03-29',
          archived: true,
        },
      };
      component.processActionItemChange(response);

      expect(updateSpy).not.toHaveBeenCalled();
      expect(deleteSpy).not.toHaveBeenCalled();
    });

    it('Handles delete correctly', () => {
      const response = { type: 'delete', payload: { id: 11 } } as WebsocketActionItemResponse;
      component.processActionItemChange(response);

      expect(updateSpy).not.toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalledWith({
        id: 11,
      });
    });
  });

  describe('deleting action items', () => {
    const incompleteActionItem = createActionItem(1, 'take out the trash');
    const completedActionItem = createActionItem(
      2,
      'wipe off the dry erase board',
      true
    );

    let active;
    let completed;

    beforeEach(() => {
      active = [incompleteActionItem];
      completed = [completedActionItem];
      component.actionItemAggregation.items = {
        active,
        completed,
      };
    });

    it('properly deletes incomplete action items', () => {
      component.deleteActionItem({ id: incompleteActionItem.id } as ActionItem);
      expect(component.actionItemAggregation.items.active.length).toEqual(0);
      expect(component.actionItemAggregation.items.completed.length).toEqual(1);
    });

    it('properly deletes complete action items', () => {
      component.deleteActionItem({ id: completedActionItem.id } as ActionItem);
      expect(component.actionItemAggregation.items.active.length).toEqual(1);
      expect(component.actionItemAggregation.items.completed.length).toEqual(0);
    });
  });

  function createActionItem(
    id: number,
    task: string,
    completed: boolean = false
  ): ActionItem {
    return {
      id,
      task,
      completed,
      teamId: 'test',
      assignee: null,
      dateCreated: null,
      archived: false,
    } as ActionItem;
  }
});
