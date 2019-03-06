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

import {TaskDialogComponent} from './task-dialog.component';
import {emptyActionItem} from '../../domain/action-item';
import {ActionItemService} from '../../teams/services/action.service';
import * as moment from 'moment';

describe('TaskDialogComponent', () => {
  let component: TaskDialogComponent;
  let mockActionItemService: ActionItemService;

  beforeEach(() => {
    mockActionItemService = jasmine.createSpyObj({
      addActionItem: null
    });
    component = new TaskDialogComponent(mockActionItemService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('emitCompleted', () => {

    beforeEach(() => {
      component.completed = jasmine.createSpyObj({emit: null});
      component.visibilityChanged = jasmine.createSpyObj({emit: null});
    });

    it('should emit the completed signal with a state of true', () => {
      component.emitCompleted(true);
      expect(component.completed.emit).toHaveBeenCalledWith(true);
    });

    it('should emit the completed signal with a state of false', () => {
      component.emitCompleted(false);
      expect(component.completed.emit).toHaveBeenCalledWith(false);
    });

    it('should hide the dialog when called with any value', () => {
      component.emitCompleted(true);
      expect(component.visible).toBeFalsy();
    });

    it('should emit that the visibility is false', () => {
      component.emitCompleted(true);

      expect(component.visibilityChanged.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('show', () => {
    it('should display the dialog when called', () => {
      component.show();
      expect(component.visible).toBeTruthy();
    });

    it('should set a function callback to document.onkeydown', () => {
      expect(document.onkeydown).not.toBeNull();
    });

  });

  describe('hide', () => {
    it('should set the document.onkeydown callback to null', () => {
      component.hide();
      expect(document.onkeydown).toBeNull();
    });
  });

  describe('emitDeleted', () => {

    beforeEach(() => {
      component.visibilityChanged = jasmine.createSpyObj({
        emit: null
      });
      component.deleted = jasmine.createSpyObj({
        emit: null
      });
    });

    it('should emit the deleted signal when the delete button is clicked', () => {
      component.task.message = 'I AM A FAKE TASK';

      component.emitDeleted();

      expect(component.deleted.emit).toHaveBeenCalledWith(component.task);
    });

    it('should hide the dialog', () => {
      component.emitDeleted();

      expect(component.visible).toEqual(false);
      expect(component.visibilityChanged.emit).toHaveBeenCalledWith(false);
    });

  });

  describe('emitMessageChanged', () => {

    beforeEach(() => {
      component.messageChanged = jasmine.createSpyObj({
        emit: null
      });
    });

    it('should emit the passed in message', () => {
      const fakeMessage = 'I AM A FAKE MESSAGE';
      component.emitMessageChanged(fakeMessage);

      expect(component.messageChanged.emit).toHaveBeenCalledWith(fakeMessage);
    });

  });

  describe('emitStarCountIncreased', () => {

    beforeEach(() => {
      component.starCountIncreased = jasmine.createSpyObj({
        emit: null
      });
    });

    it('should emit the passed in star count', () => {
      const fakeCount = 2;
      component.emitStarCountIncreased(fakeCount);

      expect(component.starCountIncreased.emit).toHaveBeenCalledWith(fakeCount);
    });

  });

  describe('createLinking', () => {

    beforeEach(() => {
      component.actionItemIsVisible = true;
      component.show();
    });

    describe('action item message is not filled out', () => {
      beforeEach(() => {
        component.createLinking();
      });

      it('should not do anything, the user will be shown a warning', () => {
        expect(component.assignedActionItem).toEqual(emptyActionItem());
        expect(component.visible).toBeTruthy();
        expect(component.actionItemIsVisible).toBeTruthy();
      });
    });

    describe('action item message is filled out', () => {

      const fakeTaskMessage = 'fake message';
      const fakeDate = moment('2001-01-01');

      beforeEach(() => {
        jasmine.clock().mockDate(fakeDate.toDate());
        component.assignedActionItem.task = fakeTaskMessage;
        component.actionItemIsVisible = true;
        component.createLinking();
      });

      afterEach(() => {
        jasmine.clock().uninstall();
      });

      it('should hide all the dialogs', () => {
        expect(component.visible).toBeFalsy();
        expect(component.actionItemIsVisible).toBeFalsy();
      });

      it('should reset the assigned action item to empty', () => {
        expect(component.assignedActionItem).toEqual(emptyActionItem());
      });

      it('should call the backend to add the assigned action item', () => {
        const expectedActionItem = emptyActionItem();
        expectedActionItem.task = fakeTaskMessage;
        expectedActionItem.dateCreated = fakeDate.format();
        expect(mockActionItemService.addActionItem).toHaveBeenCalledWith(expectedActionItem);
      });
    });
  });

  describe('toggleActionItem', () => {
    it('should reset the assigned action item if it is false', () => {
      component.actionItemIsVisible = false;
      expect(component.assignedActionItem).toEqual(emptyActionItem());
    });
  });

});
