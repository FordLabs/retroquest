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

import {Observable} from 'rxjs/index';
import {ThoughtsHeaderComponent} from './thoughts-header.component';

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

      component.addThought(newThoughtMessage);

      expect(mockThoughtService.addThought).toHaveBeenCalledWith(expectedThought);
    });
  });

  describe('sortByHearts', () => {
    it('disables sorting by hearts', () => {
      component.sortByHearts(false);
      expect(component.column.sorted).toBeFalsy();
    });

    it('enables sorting by hearts', () => {
      component.sortByHearts(true);
      expect(component.column.sorted).toBeTruthy();
    });
  });

  describe( 'editTitle', () => {
    it('should send column service the new title', function () {

      component.column = {
        sorted: false,
        id: null,
        topic: null,
        title: 'newTitle',
        teamId: null,
      };

      component.editTitle('someTitle');
      expect(mockColumnService.updateColumn).toHaveBeenCalledWith(component.column);
      expect(component.column.title).toEqual('someTitle');
    });
  });

});
