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

import {FloatingCharacterCountdownComponent} from './floating-character-countdown.component';

describe('FloatingCharacterCountdownComponent', () => {
  let component: FloatingCharacterCountdownComponent;

  beforeEach(() => {
    component = new FloatingCharacterCountdownComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('charactersRemaining', () => {
    it('should return the number of remaining characters', () => {
      component.characterCount = 'new task'.length;
      component.maxCharacterCount = 20;
      expect(component.charactersRemaining()).toBe(component.maxCharacterCount - component.characterCount);
    });
  });

  describe('textIsEmpty', () => {
    it('should return false of the title has a value', () => {
      component.characterCount = 'X'.length;
      expect(component.textIsEmpty()).toBeFalsy();
    });

    it('should return true if the title is an empty string', () => {
      component.characterCount = ''.length;
      expect(component.textIsEmpty()).toBeTruthy();
    });
  });

  describe('charactersRemainingAreAboutToRunOut', () => {
    it('should return true if the remaining characters to input are less than threshold', () => {
      component.characterCount = '12'.length;
      component.maxCharacterCount = 3;
      component.charsAreRunningOutThreshold = 2;
      expect(component.charactersRemainingAreAboutToRunOut()).toBeTruthy();
    });

    it('should return false if the remaining characters to input are greater than or equal to the threshold', () => {
      component.characterCount = '1'.length;
      component.maxCharacterCount = 3;
      component.charsAreRunningOutThreshold = 2;
      expect(component.charactersRemainingAreAboutToRunOut()).toBeFalsy();
    });
  });
});
