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

import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import { Themes, themeToString } from '../../domain/Theme';

import { SettingsDialogComponent } from './settings-dialog.component';

describe('SettingsDialogComponent', () => {
  let component: SettingsDialogComponent;
  let fakeRouter: Router;
  let fakeThemeChangedEmitter: EventEmitter<Themes>;

  beforeEach(() => {
    fakeRouter = {
      navigate: jest.fn().mockReturnValue(null),
    } as unknown as Router;

    fakeThemeChangedEmitter = {
      emit: jest.fn().mockReturnValue(null),
    } as unknown as EventEmitter<Themes>;

    component = new SettingsDialogComponent(fakeRouter);
    component.themeChanged = fakeThemeChangedEmitter;
  });

  describe('logoutOfAccount', () => {
    let spyClearToken;
    const fakeTeamId = 'FAKE TEAM ID';

    beforeEach(() => {
      spyClearToken = jest.spyOn(AuthService, 'clearToken');
      component.teamId = fakeTeamId;
      component.logoutOfAccount();
    });

    it('should clear the user token from cookies', () => {
      expect(spyClearToken).toHaveBeenCalled();
    });

    it('should navigate to the login page with the teamId', () => {
      expect(fakeRouter.navigate).toHaveBeenCalledWith(['login', fakeTeamId]);
    });
  });

  describe('enableDarkTheme', () => {
    beforeEach(() => {
      component.enableDarkTheme();
    });

    it('should set theme value in local storage to dark', () => {
      expect(localStorage.getItem('theme')).toEqual(themeToString(Themes.Dark));
    });

    it('should emit the theme changed as dark', () => {
      expect(fakeThemeChangedEmitter.emit).toHaveBeenCalledWith(Themes.Dark);
    });

    it('should set the theme to dark', () => {
      expect(component.theme).toEqual(Themes.Dark);
    });
  });

  describe('enableLightTheme', () => {
    beforeEach(() => {
      component.enableLightTheme();
    });

    it('should set theme value in local storage to light', () => {
      expect(localStorage.getItem('theme')).toEqual(themeToString(Themes.Light));
    });

    it('should emit the theme changed as light', () => {
      expect(fakeThemeChangedEmitter.emit).toHaveBeenCalledWith(Themes.Light);
    });

    it('should set the theme to light', () => {
      expect(component.theme).toEqual(Themes.Light);
    });
  });

  describe('getApplicationVersion', () => {
    it('should return version from json file', () => {
      const actual = component.applicationVersion;
      expect(actual).toEqual('0ddb411');
    });
  });
});
