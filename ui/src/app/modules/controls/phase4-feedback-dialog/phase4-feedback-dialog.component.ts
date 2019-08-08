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
import {HttpClient} from '@angular/common/http';

const ESC_KEY = 27;

export interface Phase4AnswerForm {
  time_stamp: string;
  q_0: number;
  q_1: string;
  q_2: string;
  q_3: string;
  prj_name: string;
  platform: string;
}

export function emptyPhase4AnswerForm(): Phase4AnswerForm {
  return {
    time_stamp: '',
    q_0: 0,
    q_1: '',
    q_2: '',
    q_3: '',
    prj_name: 'retroquest',
    platform: 'desktop'
  };
}

@Component({
  selector: 'rq-phase4-feedback-dialog',
  templateUrl: './phase4-feedback-dialog.component.html',
  styleUrls: ['./phase4-feedback-dialog.component.scss'],
  host: {
    '[style.display]': 'visible ? "flex": "none"'
  }
})
export class Phase4FeedbackDialogComponent {

  @Input() visible = false;
  @Input() theme: Themes = Themes.Light;

  @Output() visibilityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() submitted: EventEmitter<Feedback> = new EventEmitter<Feedback>();

  feedback: Feedback = emptyFeedback();
  starStates: Array<boolean> = [false, false, false, false, false];
  starsClicked = false;

  currentQuestion = 1;
  phase4AnswerForm: Phase4AnswerForm = emptyPhase4AnswerForm();

  constructor(private httpClient: HttpClient) {
  }

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
    this.starsClicked = false;
    this.clearStars();
    document.onkeydown = null;
    this.phase4AnswerForm = emptyPhase4AnswerForm();
    this.currentQuestion = 1;
  }

  public show(): void {
    this.visible = true;
    console.log(this.visible);
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

  questionOneEquals(answer: number) {
    this.phase4AnswerForm.q_0 = answer;
    this.advanceToQuestion(2);
  }

  submitForm() {
    this.phase4AnswerForm.time_stamp = new Date().toLocaleString();
    this.httpClient
      .post(
        'https://phasefour-phasefourserver.apps.pp01i.edc1.cf.ford.com/survey',
        this.phase4AnswerForm
      )
      .subscribe(res => {
        this.hide();
      }, err => {
        this.hide();
      });
  }

  advanceToQuestion(question: number) {
    this.currentQuestion = question;
  }
}

