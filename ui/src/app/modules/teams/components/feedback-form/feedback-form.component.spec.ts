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

import {FeedbackFormComponent} from './feedback-form.component';
import {Observable} from 'rxjs/index';
import {Feedback} from '../../domain/feedback';

describe('FeedbackFormComponent', () => {
  let mockFeedbackService;
  let component: FeedbackFormComponent;

  const starBorder = 'star_border';
  const star = 'star';

  const expectedFeedback: Feedback = {
    stars: 5,
    comment: 'comment',
    userEmail: 'email@email.com',
    teamId: 'team-id'
  };

  beforeEach(() => {
    mockFeedbackService = jasmine.createSpyObj({addFeedback: new Observable()});
    component = new FeedbackFormComponent(mockFeedbackService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.stars).toEqual([starBorder, starBorder, starBorder, starBorder, starBorder]);
  });

  describe('ratings', () => {
    it('should update array appropriately', () => {
      component.setRating(1);
      expect(component.stars).toEqual([star, starBorder, starBorder, starBorder, starBorder]);
    });

    it('should update array appropriately for two stars', () => {
      component.setRating(2);
      expect(component.stars).toEqual([star, star, starBorder, starBorder, starBorder]);
    });

    it('should set the rating to the given rating', () => {
      component.setRating(5);
      expect(component.rating).toBe(5);
    });
  });

  describe('submit', () => {
    beforeEach(() => {
      component.teamId = expectedFeedback.teamId;
      component.rating = expectedFeedback.stars;
      component.followupEmail = expectedFeedback.userEmail;
      component.comments = expectedFeedback.comment;
    });

    it('should post the data to the backend', () => {
      component.submit();

      expect(mockFeedbackService.addFeedback).toHaveBeenCalledWith(expectedFeedback);
    });

    it('should not submit the form if there are no comments', () => {
      component.comments = null;

      component.submit();

      expect(mockFeedbackService.addFeedback).not.toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should reset the form', () => {
      component.teamId = expectedFeedback.teamId;
      component.rating = expectedFeedback.stars;
      component.followupEmail = expectedFeedback.userEmail;
      component.comments = expectedFeedback.comment;

      component.reset();

      expect(component.rating).toEqual(0);
      expect(component.stars).toEqual(component.emptyStars());
      expect(component.followupEmail).toEqual('');
      expect(component.comments).toEqual('');
    });
  });
});
