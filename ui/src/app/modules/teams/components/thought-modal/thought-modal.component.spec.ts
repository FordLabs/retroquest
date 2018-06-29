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

import {ThoughtModalComponent} from './thought-modal.component';
import {emptyThoughtWithColumn, emptyThought} from '../../domain/thought';
import {Column} from '../../domain/column';

describe('ThoughtModalComponent', () => {
  let component: ThoughtModalComponent;
  let mockThoughtService;

  beforeEach(() => {
    mockThoughtService = jasmine.createSpyObj({updateThought: null});
    component = new ThoughtModalComponent(mockThoughtService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('discussThought', () => {
    it('should toggle the discussed parameter on thought', () => {
      const selectedThought = emptyThought();

      component.thought = selectedThought;
      component.discussThought();

      expect(selectedThought.discussed).toBeTruthy();
    });

    it('should set thought to be null', () => {
      component.thought = emptyThought();
      component.discussThought();

      expect(component.thought).toBeNull();
    });

    it('should call updateThought', () => {
      const selectedThought = emptyThought();

      component.thought = selectedThought;
      component.discussThought();

      expect(mockThoughtService.updateThought).toHaveBeenCalledWith(selectedThought);
    });

  });

  describe('open', () => {
    it('should update the thought of the modal', () => {
      const expectedThought = emptyThoughtWithColumn();
      component.thought = null;
      expect(component.thought).toBeNull();
      component.open(expectedThought, '');
      expect(component.thought).toBe(expectedThought);
    });

    it('should update the title of the column in the thought', () => {
      const expectedThought = emptyThoughtWithColumn();
      component.thought = expectedThought;
      const newTitle = 'new title';
      component.open(expectedThought, newTitle);
      expect(component.thought.columnTitle.title).toBe(newTitle);
    });

  });
});
