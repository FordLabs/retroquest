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


import {ActionItemDialogComponent} from './action-item-dialog.component';

describe('ActionItemDialogComponent', () => {
  let component: ActionItemDialogComponent;

  beforeEach(() => {
    component = new ActionItemDialogComponent();
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
    beforeEach(() => {
      component.show();
    });

    it('should display the dialog when called', () => {
      expect(component.visible).toBeTruthy();
    });

    it('should set a function callback to document.onkeydown', () => {
      expect(document.onkeydown).not.toBeNull();
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
      component.actionItem.task = 'I AM A FAKE TASK';
      component.emitDeleted();
      expect(component.deleted.emit).toHaveBeenCalledWith(component.actionItem);
    });

    it('should hide the dialog', () => {
      component.emitDeleted();

      expect(component.visible).toEqual(false);
      expect(component.visibilityChanged.emit).toHaveBeenCalledWith(false);
    });

    it('should set the document.onkeydown callback to null', () => {
      component.emitDeleted();
      expect(document.onkeydown).toBeNull();
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

  describe('emitAssigneeUpdated', () => {

    beforeEach(() => {
      component.assignedUpdated = jasmine.createSpyObj({
        emit: null
      });
    });

    it('should emit the passed in assignee', () => {
      const fakeAssignee = 'I AM A FAKE ASSIGNEE';
      component.emitAssigneeUpdated(fakeAssignee);

      expect(component.assignedUpdated.emit).toHaveBeenCalledWith(fakeAssignee);
    });
  });

});
