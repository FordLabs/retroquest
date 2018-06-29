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

import {EndRetroModalComponent} from './end-retro-modal.component';

describe('EndRetroModalComponent', () => {
  let component: EndRetroModalComponent;
  let mockThoughtService;
  let mockFeedbackForm;
  let mockResetThoughts;

  const teamId = 'team-id';
  beforeEach(() => {
    mockThoughtService = jasmine.createSpyObj( {deleteAllThoughts: null});
    mockFeedbackForm = jasmine.createSpyObj( {submit: null, reset: null});
    mockResetThoughts = jasmine.createSpyObj( {emit: null});

    component = new EndRetroModalComponent(mockThoughtService);
    component.feedbackForm = mockFeedbackForm;
    component.teamId = teamId;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit', () => {
    beforeEach(() => {
      component.submit();
    });

    it('should submit the feedback form and reset it', () => {

      expect(mockFeedbackForm.submit).toHaveBeenCalled();
      expect(mockFeedbackForm.reset).toHaveBeenCalled();
    });

    it('should delete all thoughts', () => {

      expect(mockThoughtService.deleteAllThoughts).toHaveBeenCalledWith();
    });

    it('should close the modal', () => {
      expect(component.isOpen).toBe(false);
    });
  });
});
