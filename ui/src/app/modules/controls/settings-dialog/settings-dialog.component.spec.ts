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
