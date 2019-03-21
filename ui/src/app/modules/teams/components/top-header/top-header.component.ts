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
import {Themes} from '../../../domain/Theme';
import {SettingsDialogComponent} from '../../../controls/settings-dialog/settings-dialog.component';
import {Router} from '@angular/router';

const CURRENT_VIEW_KEY = 'currentView';

@Component({
  selector: 'rq-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.scss']
})
export class TopHeaderComponent implements OnInit {
  @Input() teamName: string;
  @Input() lastSavedText: string;
  @Input() teamId: string;

  @Input() theme: Themes = Themes.Light;

  @Output() radiatorViewClicked: EventEmitter<void> = new EventEmitter();
  @Output() themeChanged: EventEmitter<Themes> = new EventEmitter();

  @ViewChild(SettingsDialogComponent) settingsDialog: SettingsDialogComponent;

  selectedView = '';

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    const currentView = localStorage.getItem(CURRENT_VIEW_KEY);
    if (currentView) {
      this.selectedView = currentView;
    }
  }

  get darkThemeIsEnabled(): boolean {
    return this.theme === Themes.Dark;
  }

  isSelected(view: string): boolean {
    return this.selectedView === view;
  }

  changeView(view: string) {
    this.selectedView = view;
    localStorage.setItem(CURRENT_VIEW_KEY, view);

    switch (view) {
      case 'retro': {
        this.router.navigateByUrl(`/team/${this.teamId}`);
        break;
      }
      case 'archives': {
        this.router.navigateByUrl(`/team/${this.teamId}/archives`);
        break;
      }
      default:
        break;
    }
  }
}


