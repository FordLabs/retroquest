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

describe('TaskDialogComponent', () => {
  let component: TaskDialogComponent;

  beforeEach(() => {
    component = new TaskDialogComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('hide', () => {
    it('should hide the dialog when called', () => {
      component.hide();
      expect(component.visible).toBeFalsy();
    });

    it('should emit that the visibility is false', () => {
      component.visibilityChanged = jasmine.createSpyObj({emit: null});
      component.hide();

      expect(component.visibilityChanged.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('show', () => {
    it('should display the dialog when called', () => {
      component.show();
      expect(component.visible).toBeTruthy();
    });

  });

});
