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

import {SettingsDialogComponent} from './settings-dialog.component';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';
import {EventEmitter} from '@angular/core';
import {Themes, themeToString} from '../../domain/Theme';

describe('SettingsDialogComponent', () => {
  let component: SettingsDialogComponent;
  let mockRouter: Router;
  let mockThemeChangedEmitter: EventEmitter<Themes>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj({
      'navigate': null
    });
    mockThemeChangedEmitter = jasmine.createSpyObj({
      'emit': null
    });

    component = new SettingsDialogComponent(mockRouter);
    component.themeChanged = mockThemeChangedEmitter;

    let store = {};

    spyOn(localStorage, 'getItem').and.callFake((key) => {
      return store[key];
    });
    spyOn(localStorage, 'setItem').and.callFake((key, value) => {
      return store[key] = value + '';
    });
    spyOn(localStorage, 'clear').and.callFake(() => {
      store = {};
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logoutOfAccount', () => {
    let spyClearToken;
    const fakeTeamId = 'FAKE TEAM ID';

    beforeEach(() => {
      spyClearToken = spyOn(AuthService, 'clearToken');
      component.teamId = fakeTeamId;
      component.logoutOfAccount();
    });

    afterEach(() => {
      spyClearToken.calls.reset();
    });

    it('should clear the user token from cookies', () => {
      expect(spyClearToken).toHaveBeenCalled();
    });

    it('should navigate to the login page with the teamId', () => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['login', fakeTeamId]);
    });
  });

  describe('updatePassword', () => {
    it('should navigate to password update page', () => {
      const fakeTeamId = 'fake-id';
      component.teamId = fakeTeamId;
      component.updatePassword();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['update-password', fakeTeamId]);
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
      expect(mockThemeChangedEmitter.emit).toHaveBeenCalledWith(Themes.Dark);
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
      expect(mockThemeChangedEmitter.emit).toHaveBeenCalledWith(Themes.Light);
    });

    it('should set the theme to light', () => {
      expect(component.theme).toEqual(Themes.Light);
    });
  });
});
