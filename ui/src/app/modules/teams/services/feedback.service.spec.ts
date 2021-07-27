/*
 * Copyright (c) 2021 Ford Motor Company
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

import { FeedbackService } from './feedback.service';
import { Observable } from 'rxjs';
import { createMockHttpClient } from '../../utils/testutils';

describe('FeedbackService', () => {
  let service: FeedbackService;
  const mockHttpClient = createMockHttpClient();

  beforeEach(() => {
    service = new FeedbackService(mockHttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the add feedback endpoint', () => {
    const feedback = {
      id: null,
      dateCreated: null,
      stars: 1,
      comment: 'Comment',
      userEmail: 'email@email.com',
      teamId: 'teamId',
    };

    const response = service.addFeedback(feedback);

    expect(mockHttpClient.post).toHaveBeenCalledWith(
      '/api/feedback/',
      feedback,
      { observe: 'response' }
    );

    expect(response instanceof Observable).toBe(true);
  });
});
