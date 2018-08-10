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

import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {EndRetroDialogComponent} from '../../../controls/end-retro-dialog/end-retro-dialog.component';
import {FeedbackService} from '../../services/feedback.service';
import {Feedback} from '../../domain/feedback';
import {FeedbackDialogComponent} from '../../../controls/feedback-dialog/feedback-dialog.component';

@Component({
  selector: 'rq-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() teamName: string;
  @Input() teamId: string;

  @Output() endRetro: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(FeedbackDialogComponent) feedbackDialog: FeedbackDialogComponent;
  @ViewChild(EndRetroDialogComponent) endRetroDialog: EndRetroDialogComponent;

  constructor(private feedbackService: FeedbackService) {

  }

  public getCsvUrl(): string {
    return `api/team/${this.teamId}/csv`;
  }

  public showEndRetroDialog(): void {
    this.endRetroDialog.show();
  }

  public onEndRetroDialogSubmitted(): void {
    this.endRetro.emit();
  }

  public onFeedbackSubmitted(feedback: Feedback) {
    feedback.teamId = this.teamId;
    this.feedbackService.addFeedback(feedback);
  }
}
