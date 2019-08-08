/*
 *  Copyright (c) 2018 Ford Motor Company
 *  All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {emptyFeedback, Feedback} from '../../domain/feedback';
import {Themes} from '../../domain/Theme';

const ESC_KEY = 27;

@Component({
  selector: 'rq-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.scss'],
  host: {
    '(click)': 'hide()',
    '[style.display]': 'visible ? "flex": "none"'
  }
})
export class FeedbackDialogComponent {

  @Input() visible = false;
  @Input() theme: Themes = Themes.Light;

  @Output() visibilityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() submitted: EventEmitter<Feedback> = new EventEmitter<Feedback>();

  feedback: Feedback = emptyFeedback();

  get darkThemeIsEnabled(): boolean {
    return this.theme === Themes.Dark;
  }

  get commentsAreEmpty(): boolean {
    return this.feedback.comment === '';
  }

  public hide(): void {
    this.visible = false;
    this.visibilityChanged.emit(this.visible);
    this.feedback = emptyFeedback();
    document.onkeydown = null;
  }

  public show(): void {
    this.visible = true;
    document.onkeydown = event => {
      if (event.keyCode === ESC_KEY) {
        this.hide();
      }
    };
  }

  public onSendButtonClicked(): void {
    if (!this.commentsAreEmpty) {
      this.submitted.emit(this.feedback);
      this.hide();
    }
  }

}

