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

import { ThoughtsColumnComponent } from './thoughts-column.component';
import { Observable } from 'rxjs/index';
import 'jest';

describe('ThoughtColumnComponent', () => {
  let component: ThoughtsColumnComponent;
  let mockThoughtService;

  let testThought;

  beforeEach(() => {
    mockThoughtService = {
      deleteThought: jest.fn().mockReturnValue(new Observable()),
      discussThought: jest.fn().mockReturnValue(new Observable()),
      heartThought: jest.fn().mockReturnValue(new Observable()),
      updateThought: jest.fn().mockReturnValue(new Observable()),
    };

    component = new ThoughtsColumnComponent(mockThoughtService);

    testThought = {
      id: 0,
      teamId: 'team-id',
      topic: null,
      message: null,
      hearts: 0,
      discussed: false,
      columnTitle: null,
    };

    // component.thoughts = [testThought];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
      expect(mockThoughtService.updateThought).toHaveBeenCalledWith(
        testThought
      );
    });
  });

  describe('heartThought', () => {
    it('should increment the hearts count', () => {
      component.heartThought(testThought);
      expect(testThought.hearts).toEqual(1);
    });

    it('should call ThoughtService.setCurrentThought', () => {
      component.heartThought(testThought);
      expect(mockThoughtService.updateThought).toHaveBeenCalledWith(
        testThought
      );
    });
  });

  describe('updating the thoughts inside the component', () => {
    test.todo(
      'does nothing when the thought is not in this column, and was not before'
    );
    test.todo('does nothing when the thought has not changed');
    describe('deleting a thought that was in this column and is not now', () => {
      // note: there is some behavior in the deleteThought method for when thoughtId is -1. Not tested here.
      test.todo('removes an active thought that was deleted');
      test.todo('removes a completed thought that was deleted');
    });
    test.todo('adds an active thought that was not here before');
    describe('updating thought discussedness', () => {
      test.todo('moves a discussed thought from active to completed');
      test.todo('moves a not-discussed thought from completed to active');
    });
    describe('setting the thought state to active', () => {
      // I don't know why it sets it to active, but never to anything else.
      // 'active' has something to do with an animation, but I don't understand it.
      // Testing it here so that I don't unintentionally change it.
      test.todo('sets a formerly-discussed thought state to active');
      test.todo('sets a newly-discussed thought state to active');
      test.todo('sets a new-to-this-topic thought state to active');
    });
  });
});
