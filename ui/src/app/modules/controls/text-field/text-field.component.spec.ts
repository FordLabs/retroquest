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

import {TextFieldComponent} from './text-field.component';

describe('TextFieldComponent', () => {
  let component: TextFieldComponent;

  beforeEach(() => {
    component = new TextFieldComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('charactersRemaining', () => {
    it('should return the number of remaining characters', () => {
      component.text = 'new task';
      component.maxCharLength = 20;
      expect(component.charactersRemaining()).toBe(component.maxCharLength - component.text.length);
    });
  });

  describe('textIsEmpty', () => {
    it('should return false of the title has a value', () => {
      component.text = 'X';
      expect(component.textIsEmpty()).toBeFalsy();
    });

    it('should return true if the title is an empty string', () => {
      component.text = '';
      expect(component.textIsEmpty()).toBeTruthy();
    });
  });

  describe('charactersRemainingAreAboutToRunOut', () => {
    it('should return true if the remaining characters to input are less than threshold', () => {
      component.text = '12';
      component.maxCharLength = 3;
      component.charsAreRunningOutThreshold = 2;
      expect(component.charactersRemainingAreAboutToRunOut()).toBeTruthy();
    });

    it('should return false if the remaining characters to input are greater than or equal to the threshold', () => {
      component.text = '1';
      component.maxCharLength = 3;
      component.charsAreRunningOutThreshold = 2;
      expect(component.charactersRemainingAreAboutToRunOut()).toBeFalsy();
    });
  });

  describe('emitNewTaskMessage', () => {

    it('should emit the new task message', () => {

      component.newMessageAdded = jasmine.createSpyObj({emit: null});

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
