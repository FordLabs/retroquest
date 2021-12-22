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

import { CountdownDialogComponent } from './countdown-dialog.component';
import { createMockEventEmitter } from '../../utils/testutils';

describe('CountdownDialogComponent', () => {
  let component: CountdownDialogComponent;

  beforeEach(() => {
    component = new CountdownDialogComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('oneMinute', () => {
    beforeEach(() => {
      component.oneMinuteMore = createMockEventEmitter();
      component.oneMinute();
    });

    it('should emit the oneMinuteMore signal', () => {
      expect(component.oneMinuteMore.emit).toHaveBeenCalled();
    });

    it('should hide the dialogue', () => {
      expect(component.visible).toBeFalsy();
    });
  });

  describe('show', () => {
    beforeEach(() => {
      component.show();
    });

    it('should show the dialogue', () => {
      expect(component.visible).toBeTruthy();
    });
  });

  describe('hide', () => {
    beforeEach(() => {
      component.hide();
    });

    it('should hide the dialogue', () => {
      expect(component.visible).toBeFalsy();
    });
  })
});

