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

import {TextFieldComponent} from './text-field.component';
import {createMockEventEmitter} from '../../utils/testutils';

describe('TextFieldComponent', () => {
  let component: TextFieldComponent;

  beforeEach(() => {
    component = new TextFieldComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('emitNewTaskMessage', () => {

    it('should emit the new actionItem message', () => {

      component.newMessageAdded = createMockEventEmitter();

      const fakeMessage = 'FAKE MESSAGE';
      component.text = fakeMessage;

      component.emitNewTaskMessage();

      expect(component.newMessageAdded.emit).toHaveBeenCalledWith(fakeMessage);
    });

    it('should clear out the text from the text field', () => {
      const fakeMessage = 'FAKE MESSAGE';
      component.text = fakeMessage;

      component.emitNewTaskMessage();
      expect(component.text).toEqual('');
    });

  });

});
