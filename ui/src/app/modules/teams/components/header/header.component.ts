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

import {Component, Input, ViewChild} from '@angular/core';
import {FeedbackModalComponent} from '../feedback-modal/feedback-modal.component';
import {EndRetroModalComponent} from '../end-retro-modal/end-retro-modal.component';

@Component({
  selector: 'rq-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() teamName: string;
  @Input() teamId: string;

  @ViewChild(FeedbackModalComponent) feedbackModal: FeedbackModalComponent;
  @ViewChild(EndRetroModalComponent) endRetroModal: EndRetroModalComponent;

  getCsvUrl (): string {
    return `api/team/${this.teamId}/csv`;
  }

}
