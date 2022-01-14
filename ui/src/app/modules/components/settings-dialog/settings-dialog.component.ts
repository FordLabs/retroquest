/*
 * Copyright (c) 2021 Ford Motor Company
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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import versionJson from '../../../../application-version.json';
import { AuthService } from '../../auth/auth.service';
import { Themes, themeToString } from '../../domain/Theme';

enum SettingsTab {
  STYLES,
  ACCOUNT,
  INFO
}

@Component({
  selector: 'rq-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
  host: {
    '(click)': 'hide()',
    '[style.display]': 'visible ? "flex": "none"',
  },
})

export class SettingsDialogComponent {
  @Input() visible = false;
  @Input() teamId: string;
  @Input() theme: Themes;
  @Output() themeChanged: EventEmitter<Themes> = new EventEmitter();

  _visibleTab: SettingsTab = SettingsTab.STYLES;
  settingsTab = SettingsTab;

  constructor(private router: Router) {}

  set currentlyVisibleTab(tab: SettingsTab) {
    this._visibleTab = tab;
  }

  tabIsVisible(tab: SettingsTab): boolean {
    return this._visibleTab === tab;
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  logoutOfAccount() {
    AuthService.clearToken();
    this.router.navigate(['login', this.teamId]);
  }

  enableDarkTheme() {
    this.enableTheme(Themes.Dark);
  }

  enableLightTheme() {
    this.enableTheme(Themes.Light);
  }

  private enableTheme(theme: Themes) {
    this.theme = theme;
    this.themeChanged.emit(this.theme);
    this.saveTheme();
  }

  get darkThemeIsEnabled(): boolean {
    return this.theme === Themes.Dark;
  }

  get lightThemeIsEnabled(): boolean {
    return this.theme === Themes.Light;
  }

  get applicationVersion(): string {
    return versionJson.version;
  }

  private saveTheme(): void {
    const themeString = themeToString(this.theme);
    if (themeString !== '') {
      localStorage.setItem('theme', themeString);
    }
    this.themeChanged.emit(this.theme);
  }
}
