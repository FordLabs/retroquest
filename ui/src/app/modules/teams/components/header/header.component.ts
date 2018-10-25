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

import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {EndRetroDialogComponent} from '../../../controls/end-retro-dialog/end-retro-dialog.component';
import {FeedbackService} from '../../services/feedback.service';
import {Feedback} from '../../../domain/feedback';
import {FeedbackDialogComponent} from '../../../controls/feedback-dialog/feedback-dialog.component';
import {SaveCheckerService} from '../../services/save-checker.service';
import {parseTheme, Themes, themeToString} from '../../../domain/Theme';

@Component({
  selector: 'rq-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  host: {
    '[class.dark-theme]': 'darkThemeIsEnabled'
  }
})
export class HeaderComponent implements OnInit {
  @Input() teamName: string;
  @Input() teamId: string;
  @Input() theme = Themes.Light;

  @Output() endRetro: EventEmitter<void> = new EventEmitter<void>();
  @Output() actionsRadiatorViewClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() themeChanged: EventEmitter<Themes> = new EventEmitter<Themes>();

  @ViewChild(FeedbackDialogComponent) feedbackDialog: FeedbackDialogComponent;
  @ViewChild(EndRetroDialogComponent) endRetroDialog: EndRetroDialogComponent;

  actionsRadiatorViewEnabled = false;

  constructor(
    private feedbackService: FeedbackService,
    private saveChecker: SaveCheckerService
  ) {

  }

  public ngOnInit(): void {
    this.loadTheme();
  }

  get darkThemeIsEnabled(): boolean {
    return this.theme === Themes.Dark;
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
    this.feedbackService.addFeedback(feedback).subscribe();
  }

  public onActionsRadiatorViewClicked(): void {
    this.actionsRadiatorViewEnabled = !this.actionsRadiatorViewEnabled;
    this.actionsRadiatorViewClicked.emit(this.actionsRadiatorViewEnabled);
  }

  get lastSavedText(): string {
    if (this.saveChecker.lastSavedDateTime === '') {
      return 'All changes saved';
    }

    return 'Last change saved at ' + this.saveChecker.lastSavedDateTime;
  }

  public toggleThemeColor(): void {

    if (this.theme === Themes.Dark) {
      this.theme = Themes.Light;
    } else {
      this.theme = Themes.Dark;
    }

    this.saveTheme();
    this.themeChanged.emit(this.theme);
  }

  private saveTheme(): void {
    const themeString = themeToString(this.theme);
    if (themeString !== '') {
      localStorage.setItem('theme', themeString);
    }
  }


  private loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.theme = parseTheme(savedTheme);
      this.themeChanged.emit(this.theme);
    }
  }
}
