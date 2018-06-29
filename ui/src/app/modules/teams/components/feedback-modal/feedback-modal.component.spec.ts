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

import {FeedbackModalComponent} from './feedback-modal.component';

describe('FeedbackModalComponent', () => {
  let component: FeedbackModalComponent;

  beforeEach(() => {
    component = new FeedbackModalComponent();
    component.feedbackForm = jasmine.createSpyObj({submit: null, reset: null});
  });

  it('should change isOpen to false when pressing confirm', () => {
    component.isOpen = true;

    component.submit();

    expect(component.isOpen).toBe(false);
  });
});
