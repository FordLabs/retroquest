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

import {ThoughtsColumnComponent} from './thoughts-column.component';
import {Observable} from 'rxjs/index';

describe('ThoughtColumnComponent', () => {
  let component: ThoughtsColumnComponent;
  let mockThoughtService;

  let testThought;


  beforeEach(() => {
    mockThoughtService = jasmine.createSpyObj({
      deleteThought: new Observable(),
      discussThought: new Observable(),
      heartThought: new Observable(),
      updateThought: new Observable()
    });

    component = new ThoughtsColumnComponent(mockThoughtService);

    testThought = {
      id: 0,
      teamId: 'team-id',
      topic: null,
      message: null,
      hearts: 0,
      discussed: false,
      columnTitle: null
    };

    component.thoughts = [testThought];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteThought', () => {
    it('should call ThoughtService.deleteThought', () => {

      const originalConfirmFunction = window.confirm;

      window.confirm = () => true;

      component.deleteThought(testThought);

      expect(mockThoughtService.deleteThought).toHaveBeenCalledWith(testThought);

      window.confirm = originalConfirmFunction;
    });
  });

  describe('setCurrentThought', () => {
    it('should call ThoughtService.updateThought when closing edit box', () => {
      component.setCurrentThought(testThought);
      component.setCurrentThought();
      expect(mockThoughtService.updateThought).toHaveBeenCalledWith(testThought);
    });

    it('should update thought when editing a different thought', () => {
      const newThought = {
        id: 1,
        teamId: 'team-id',
        topic: null,
        message: null,
        hearts: 0,
        discussed: false,
        columnTitle: null
      };
      component.setCurrentThought(testThought);
      component.setCurrentThought(newThought);
      expect(component.currentThoughtId).toEqual(newThought.id);
    });

    it('should maintain changes while editing', () => {
      const expectedThought = {...testThought};
      expectedThought.hearts = 5;

      component.setCurrentThought(testThought);
      component.thoughts[0].hearts = 5;
      component.setCurrentThought();
      expect(mockThoughtService.updateThought).toHaveBeenCalledWith(expectedThought);
    });
  });

  describe('discussThought', () => {
    it('should toggle the discussed flag', () => {
      component.discussThought(testThought);
      expect(testThought.discussed).toBeTruthy();
      component.discussThought(testThought);
      expect(testThought.discussed).toBeFalsy();
    });

    it('should call ThoughtService.discussThought', () => {
      component.discussThought(testThought);
      expect(mockThoughtService.updateThought).toHaveBeenCalledWith(testThought);
    });
  });

  describe('heartThought', () => {
    it('should increment the hearts count', () => {
      component.heartThought(testThought);
      expect(testThought.hearts).toEqual(1);
    });

    it('should call ThoughtService.setCurrentThought', () => {
      component.heartThought(testThought);
      expect(mockThoughtService.updateThought).toHaveBeenCalledWith(testThought);
    });
  });
});
