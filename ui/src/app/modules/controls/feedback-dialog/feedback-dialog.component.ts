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

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {emptyFeedback, Feedback} from '../../domain/feedback';
import {Themes} from "../../domain/Theme";

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
  starStates: Array<boolean> = [false, false, false, false, false];
  starsClicked = false;

  get darkThemeIsEnabled(): boolean {
    return this.theme === Themes.Dark;
  }

  public hide(): void {
    this.visible = false;
    this.visibilityChanged.emit(this.visible);
    this.feedback = emptyFeedback();
    this.starsClicked = false;
    this.clearStars();
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
    this.submitted.emit(this.feedback);
    this.hide();
  }

  public onStarHovered(index: number): void {

    const starRating = index + 1;

    if (!this.starsClicked) {

      this.clearStars();

      for (let i = 0; i < starRating; ++i) {
        this.starStates[i] = true;
      }
      this.feedback.stars = starRating;
    }
  }

  public clearStars(): void {
    if (!this.starsClicked) {
      for (let i = 0; i < this.starStates.length; ++i) {
        this.starStates[i] = false;
      }
      this.feedback.stars = 0;
    }
  }

  public onStarClicked(index: number): void {
    if (this.starsClicked) {
      this.starsClicked = false;
      this.onStarHovered(index);
    }
    this.starsClicked = true;
  }
}

