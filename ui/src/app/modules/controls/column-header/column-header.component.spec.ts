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

import {ColumnHeaderComponent} from './column-header.component';

describe('ColumnHeaderComponent', () => {
  let component: ColumnHeaderComponent;

  beforeEach(() => {
    component = new ColumnHeaderComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('toggleSort', () => {

    it('should emit true when the sort state is toggled from false to true', () => {
      component.sortedChanged = jasmine.createSpyObj({emit: null});
      component.sorted = false;

      component.toggleSort();

      expect(component.sortedChanged.emit).toHaveBeenCalledWith(true);
    });

    it('should emit false when the sort state is toggled from true to false', () => {
      component.sortedChanged = jasmine.createSpyObj({emit: null});
      component.sorted = true;

      component.toggleSort();

      expect(component.sortedChanged.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('emitTitleChangedAndEnableReadonlyMode', () => {

    it('should emit the modified title', () => {
      component.titleChanged = jasmine.createSpyObj({emit: null});
      component.title = 'MODIFIED TEXT';

      component.emitTitleChangedAndEnableReadonlyMode();

      expect(component.titleChanged.emit).toHaveBeenCalledWith(component.title);
    });

    it('should set the read only mode to true when false', () => {
      component.readOnlyEnabled = false;

      component.emitTitleChangedAndEnableReadonlyMode();

      expect(component.readOnlyEnabled).toBeTruthy();
    });

    it('should set the read only mode to true when true', () => {
      component.emitTitleChangedAndEnableReadonlyMode();

      expect(component.readOnlyEnabled).toBeTruthy();
    });
  });

  describe('toggleEdit', () => {

    let originalSetTimeoutFunction = null;
    const mockInputFieldRef = {
      nativeElement: jasmine.createSpyObj({focus: null, select: null})
    };

    beforeEach(() => {
      component.inputFieldRef = mockInputFieldRef;
      originalSetTimeoutFunction = window.setTimeout;
      window.setTimeout = (fn) => fn();
    });

    afterEach(() => {
      window.setTimeout = originalSetTimeoutFunction;
      mockInputFieldRef.nativeElement.focus.calls.reset();
    });

    it('should disable readonly mode', () => {
      component.toggleEdit();
      expect(component.readOnlyEnabled).toBeFalsy();
    });

    it('should focus on the input field', () => {
      component.toggleEdit();
      expect(component.inputFieldRef.nativeElement.focus).toHaveBeenCalled();
    });
    it('should call select on the input field', () => {
      component.toggleEdit();
      expect(component.inputFieldRef.nativeElement.select).toHaveBeenCalled();
    });
  });

  describe('blurInput', () => {
    let originalSetTimeoutFunction = null;
    const mockInputFieldRef = {
      nativeElement: jasmine.createSpyObj({blur: null})
    };

    beforeEach(() => {
      component.inputFieldRef = mockInputFieldRef;
      originalSetTimeoutFunction = window.setTimeout;
      window.setTimeout = (fn) => fn();
    });

    afterEach(() => {
      window.setTimeout = originalSetTimeoutFunction;
      mockInputFieldRef.nativeElement.blur.calls.reset();
    });


    it('should blur the input field', () => {
      component.blurInput();
      expect(component.inputFieldRef.nativeElement.blur).toHaveBeenCalled();
    });
  });
});
