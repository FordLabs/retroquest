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
import {ActionItem} from '../../../domain/action-item';
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
      assignee: null,
      dateCreated: null
    };

    component.actionItems = [fakeActionItem];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onCompleted', () => {

    it('should update the action item on the backend with the passed in state', () => {
      component.onCompleted(true, fakeActionItem);
      expect(mockActionItemService.updateActionItem).toHaveBeenCalledWith(fakeActionItem);
    });

    it('should set the action item with the passed in index to false', () => {
      component.onCompleted(false, fakeActionItem);
      expect(fakeActionItem.completed).toBeFalsy();
    });

    it('should set the action item with the passed in index to true', () => {
      component.onCompleted(true, fakeActionItem);
      expect(fakeActionItem.completed).toBeTruthy();
    });
  });

  describe('onDeleted', () => {

    it('should delete the action item on the backend', () => {
      component.onDeleted(fakeActionItem);

      expect(mockActionItemService.deleteActionItem).toHaveBeenCalledWith(fakeActionItem);
    });

  });

  describe('onMessageChanged', () => {

    const fakeMessage = 'I AM A FAKE MESSAGE';

    it('should update the action item on the backend', () => {
      component.onMessageChanged(fakeMessage, fakeActionItem);
      expect(mockActionItemService.updateActionItem).toHaveBeenCalledWith(fakeActionItem);
    });

    it('should set the message on the action item with the passed in index', () => {
      component.onMessageChanged(fakeMessage, fakeActionItem);
      expect(fakeActionItem.task).toEqual(fakeMessage);
    });

  });

  describe('onAssigneeUpdated', () => {

    const fakeAssignee = 'I AM A FAKE ASSIGNEE';

    it('should update the action item on the backend', () => {
      component.onAssigneeUpdated(fakeAssignee, fakeActionItem);
      expect(mockActionItemService.updateActionItem).toHaveBeenCalledWith(fakeActionItem);
    });

    it('should set the assignee on the action item with the passed in index', () => {
      component.onAssigneeUpdated(fakeAssignee, fakeActionItem);
      expect(fakeActionItem.assignee).toEqual(fakeAssignee);
    });
  });

  describe('displayPopup', () => {

    beforeEach(() => {
      component.actionItemDialog = jasmine.createSpyObj({
        show: null
      });
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
});
