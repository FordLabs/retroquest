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

import {Component, Input} from '@angular/core';
import {Feedback} from '../../domain/feedback';
import {FeedbackService} from '../../services/feedback.service';

@Component({
  selector: 'rq-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent {

  static emptyStar = 'star_border';
  static fullStar = 'star';

  @Input() teamId: string;

  maxStars = 5;
  rating = 0;
  stars: string[];
  comments = '';
  followupEmail = '';

  constructor (private feedbackService: FeedbackService) {
    this.stars = this.emptyStars();
  }

  emptyStars () {
    const emptyStars = [];
    for (let i = 0; i < this.maxStars; i++) {
      emptyStars.push(FeedbackFormComponent.emptyStar);
    }
    return emptyStars;
  }

  reset () {
    this.stars = this.emptyStars();
    this.rating = 0;
    this.comments = '';
    this.followupEmail = '';
  }

  setRating (rating: number) {
    this.rating = rating;
    this.stars = this.emptyStars();
    for (let i = 0; i < rating; i++) {
      this.stars[i] = FeedbackFormComponent.fullStar;
    }
  }

  submit () {
    if (this.comments && this.comments.length) {
      const feedback: Feedback = {
        stars: this.rating,
        comment: this.comments,
        userEmail: this.followupEmail,
        teamId: this.teamId
      };

      this.feedbackService.addFeedback(feedback).subscribe(
        (response) => {
          console.log(response);
        }
      );
    }
  }

}
