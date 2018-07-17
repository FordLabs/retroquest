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

import {TaskComponent} from './task.component';
import {emptyTask} from '../../teams/domain/task';

describe('ThoughtComponent', () => {
  let component: TaskComponent;

  beforeEach(() => {
    component = new TaskComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleEditMode', () => {

    let originalTimeoutFunction = null;
    const fakeElementRef = {
      nativeElement: jasmine.createSpyObj({
        focus: null
      })
    };

    beforeEach(() => {
      originalTimeoutFunction = window.setTimeout;
      window.setTimeout = (fn) => fn();

      component.editableTextArea = fakeElementRef;
    });

    afterEach(() => {
      window.setTimeout = originalTimeoutFunction;
      fakeElementRef.nativeElement.focus.calls.reset();
    });

    it('should set the edit mode value to true', () => {
      component.taskEditModeEnabled = false;
      component.toggleEditMode();

      expect(component.taskEditModeEnabled).toBeTruthy();
    });

    it('should set the edit mode value to false', () => {
      component.taskEditModeEnabled = true;
      component.toggleEditMode();

      expect(component.taskEditModeEnabled).toBeFalsy();
    });

    it('should focus the title area when the edit mode is toggled true', () => {
      component.taskEditModeEnabled = false;
      component.toggleEditMode();
      expect(component.editableTextArea.nativeElement.focus).toHaveBeenCalled();
    });

    it('should not focus the title area when the edit mode is toggled false', () => {
      component.taskEditModeEnabled = true;
      component.toggleEditMode();
      expect(component.editableTextArea.nativeElement.focus).not.toHaveBeenCalled();
    });

  });

  describe('addStar', () => {

    it('should increase the star count by one', () => {
      component.starCountIncreased = jasmine.createSpyObj({emit: null});

      component.task = emptyTask();
      component.task.hearts = 1;
      component.addStar();

      expect(component.task.hearts).toEqual(2);
    });

    it('should emit the star', () => {
      component.starCountIncreased = jasmine.createSpyObj({emit: null});

      component.task = emptyTask();
      component.task.hearts = 1;
      component.addStar();

      expect(component.starCountIncreased.emit).toHaveBeenCalledWith(2);
    });
  });

  describe('emitDeleteItem', () => {

    it('should emit the task to be deleted', () => {
      component.deleted = jasmine.createSpyObj({emit: null});

      component.task = emptyTask();
      component.task.hearts = 1;
      component.emitDeleteItem();

      expect(component.deleted.emit).toHaveBeenCalledWith(component.task);
    });

  });

  describe('emitTaskContentClicked', () => {

    it('should emit the task', () => {
      component.messageClicked = jasmine.createSpyObj({emit: null});

      component.task = emptyTask();
      component.task.hearts = 1;
      component.emitTaskContentClicked();

      expect(component.messageClicked.emit).toHaveBeenCalledWith(component.task);
    });

  });

  describe('forceBlur', () => {
    let originalTimeoutFunction = null;

    beforeEach(() => {
      originalTimeoutFunction = window.setTimeout;
      window.setTimeout = (fn) => fn();
    });

    afterEach(() => {
      window.setTimeout = originalTimeoutFunction;
    });

    it('should call blur on the native textarea element', () => {
      component.editableTextArea = {
        nativeElement: jasmine.createSpyObj({
          blur: null
        })
      };
      component.forceBlur();

      expect(component.editableTextArea.nativeElement.blur).toHaveBeenCalled();
    });
  });
});
