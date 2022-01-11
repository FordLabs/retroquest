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

import { createMockEventEmitter } from '../../utils/testutils';

import { ColumnHeaderComponent } from './column-header.component';

describe('ColumnHeaderComponent', () => {
  let component: ColumnHeaderComponent;
  const myWindow: Window = {
    setTimeout: (fn: Function) => fn(),
  } as unknown as Window;

  beforeEach(() => {
    component = new ColumnHeaderComponent();
    component.myWindow = myWindow;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleSort', () => {
    it('should emit true when the sort state is toggled from false to true', () => {
      component.sortedChanged = createMockEventEmitter();
      component.sorted = false;

      component.toggleSort();

      expect(component.sortedChanged.emit).toHaveBeenCalledWith(true);
    });

    it('should emit false when the sort state is toggled from true to false', () => {
      component.sortedChanged = createMockEventEmitter();
      component.sorted = true;

      component.toggleSort();

      expect(component.sortedChanged.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('emitTitleChangedAndEnableReadonlyMode', () => {
    const fakeText = 'MODIFIED TEXT';

    beforeEach(() => {
      component.escapeKeyPressed = false;
      component.titleCopy = fakeText;
    });

    it('should emit the modified title', () => {
      component.titleChanged = createMockEventEmitter();

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

    it('should copy the value of temp title into the title variable ' + 'if the escape key was not pressed', () => {
      component.emitTitleChangedAndEnableReadonlyMode();

      expect(component.title).toEqual(fakeText);
    });

    it('should not copy the value of temp title into the title variable' + 'if the escape key was pressed', () => {
      component.escapeKeyPressed = true;
      component.emitTitleChangedAndEnableReadonlyMode();

      expect(component.title).toEqual('');
    });

    it('should set the temp title to empty string' + 'if the escape key was pressed', () => {
      component.escapeKeyPressed = true;
      component.emitTitleChangedAndEnableReadonlyMode();

      expect(component.titleCopy).toEqual('');
    });

    it('should set the escape key pressed flag to false', () => {
      component.escapeKeyPressed = true;
      component.emitTitleChangedAndEnableReadonlyMode();
      expect(component.escapeKeyPressed).toBeFalsy();
    });
  });

  describe('toggleEdit', () => {
    const mockInputFieldRef = {
      nativeElement: {
        focus: jest.fn(),
        select: jest.fn(),
      },
    };

    beforeEach(() => {
      component.inputFieldRef = mockInputFieldRef;
    });

    afterEach(() => {
      mockInputFieldRef.nativeElement.focus.mockClear();
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
    const mockInputFieldRef = {
      nativeElement: {
        blur: jest.fn(),
      },
    };

    beforeEach(() => {
      component.inputFieldRef = mockInputFieldRef;
    });

    afterEach(() => {
      mockInputFieldRef.nativeElement.blur.mockClear();
    });

    it('should blur the input field', () => {
      component.blurInput();
      expect(component.inputFieldRef.nativeElement.blur).toHaveBeenCalled();
    });
  });

  describe('onEscapeKeyPressed', () => {
    const mockInputFieldRef = {
      nativeElement: {
        blur: jest.fn(),
      },
    };

    beforeEach(() => {
      component.inputFieldRef = mockInputFieldRef;

      component.escapeKeyPressed = false;
      component.onEscapeKeyPressed();
    });

    afterEach(() => {
      mockInputFieldRef.nativeElement.blur.mockClear();
    });

    it('should set the escape key was pressed flag to true', () => {
      expect(component.escapeKeyPressed).toBeTruthy();
    });

    it('should blur the input field', () => {
      expect(component.inputFieldRef.nativeElement.blur).toHaveBeenCalled();
    });
  });
});
