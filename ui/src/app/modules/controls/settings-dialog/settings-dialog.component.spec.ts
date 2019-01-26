import {SettingsDialogComponent} from './settings-dialog.component';
import {Router} from '@angular/router';

describe('SettingsDialogComponent', () => {
  let component: SettingsDialogComponent;
  let mockRouter: Router;

  beforeEach(() => {
    component = new SettingsDialogComponent(mockRouter);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
