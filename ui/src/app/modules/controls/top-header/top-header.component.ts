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

import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Themes} from '../../domain/Theme';
import {SettingsDialogComponent} from '../settings-dialog/settings-dialog.component';
import {Router} from '@angular/router';
import {SaveCheckerService} from '../../teams/services/save-checker.service';

@Component({
  selector: 'rq-top-header',
  templateUrl: './top-header.component.html',
  styleUrls: ['./top-header.component.scss']
})
export class TopHeaderComponent implements OnInit {
  @Input() teamName: string;
  @Input() teamId: string;

  @Input() theme: Themes;

  @Output() themeChanged: EventEmitter<Themes> = new EventEmitter();

  @ViewChild(SettingsDialogComponent) settingsDialog: SettingsDialogComponent;

  @Input() selectedView = '';

  constructor(private router: Router, private saveCheckerService: SaveCheckerService) {
  }

  ngOnInit(): void {
    if (this.router.url.endsWith(this.teamId)) {
      this.changeView('retro');
    } else if (this.router.url.includes('archives')) {
      this.changeView('archives');
    }
  }

  get darkThemeIsEnabled(): boolean {
    return this.theme === Themes.Dark;
  }

  get lastSavedText(): string {
    if (this.saveCheckerService.lastSavedDateTime === '') {
      return 'All changes saved';
    }

    return 'Last change saved at ' + this.saveCheckerService.lastSavedDateTime;
  }


  isSelected(view: string): boolean {
    return this.selectedView === view;
  }

  changeView(view: string) {
    this.selectedView = view;

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


