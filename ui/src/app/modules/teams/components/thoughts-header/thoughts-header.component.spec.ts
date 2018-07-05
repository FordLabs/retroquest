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

import { Observable } from 'rxjs/index';
import { ThoughtsHeaderComponent } from './thoughts-header.component';

describe('ThoughtsHeaderComponent', () => {
  let component: ThoughtsHeaderComponent;
  let mockThoughtService;
  let mockColumnService;

  const testColumn = {
    id: 0,
    topic: 'happy',
    title: 'column title',
    teamId: 'team-id',
    sorted: false
  };

  beforeEach(() => {
    mockThoughtService = jasmine.createSpyObj({ addThought: new Observable() });
    mockColumnService = jasmine.createSpyObj({ updateColumn: new Observable() });

    component = new ThoughtsHeaderComponent(mockThoughtService, mockColumnService);
    component.column = testColumn;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getCharactersRemaining', () => {
    it('should return the number of remaining characters', () => {
      component.newThought = 'new task';
      component.maxThoughtLength = 20;
      expect(component.getCharactersRemaining()).toBe(component.maxThoughtLength - component.newThought.length);
    });
  });


  describe('addThought', () => {
    it('should construct the thought and call ThoughtService.addThought', () => {
      const newThoughtMessage = 'a new thought';

      const expectedThought = {
        id: null,
        teamId: testColumn.teamId,
        topic: testColumn.topic,
        message: newThoughtMessage,
        hearts: 0,
        discussed: false,
        columnTitle: testColumn
      };

      component.newThought = newThoughtMessage;

      component.addThought();

      expect(mockThoughtService.addThought).toHaveBeenCalledWith(expectedThought);
    });
  });

  describe('sortByHearts', () => {
    it('toggle sorting by hearts flag from false', () => {
      component.column.sorted = false;
      component.sortByHearts();
      expect(component.column.sorted).toBe(true);
    });

    it('toggle sorting by hearts flag from true', () => {
      component.column.sorted = true;
      component.sortByHearts();
      expect(component.column.sorted).toBe(false);
    });
  });

  describe('toggleEdit', () => {
    it('should pass the column with updated title to column service', () => {
      const newTitle = 'new title';
      const expectedColumn = { ...testColumn };
      expectedColumn.title = newTitle;

      component.editing = true;
      component.newTitle = newTitle;
      component.toggleEdit();

      expect(mockColumnService.updateColumn).toHaveBeenCalledWith(expectedColumn);
      expect(component.editing).toBeFalsy();
    });

    it('should set the newTitle to the existing title when toggled to editing', () => {
      component.editing = false;

      component.toggleEdit();

      expect(component.newTitle).toBe(testColumn.title);
      expect(component.editing).toBeTruthy();
    });
  });
});
