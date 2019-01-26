import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';
import {getAllThemesAsString, Themes} from '../../domain/Theme';

@Component({
  selector: 'rq-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
  host: {
    '(click)': 'hide()',
    '[style.display]': 'visible ? "flex": "none"'
  }
})
export class SettingsDialogComponent {

  @Input() visible = true;
  @Input() teamId: string;
  @Input() theme: Themes;
  @Output() themeChanged: EventEmitter<Themes> = new EventEmitter();

  _stylesTabIsVisible = true;
  _accountTabIsVisible = false;

  constructor(private router: Router) {
  }

  get allThemes(): Array<string> {
    return getAllThemesAsString();
  }

  set stylesTabIsVisible(visible: boolean) {
    this._stylesTabIsVisible = visible;
    this.accountTabIsVisible = !visible;
  }

  get stylesTabIsVisible(): boolean {
    return this._stylesTabIsVisible;
  }

  set accountTabIsVisible(visible: boolean) {
    this._accountTabIsVisible = visible;
    this.stylesTabIsVisible = !visible;
  }

  get accountTabIsVisible(): boolean {
    return this._accountTabIsVisible;
  }

  show() {
    this.visible = true;
  }

  hide() {
    console.log(this.visible);
    this.visible = false;
  }

  logoutOfAccount() {
    AuthService.clearToken();
    this.router.navigate(['login', this.teamId]);
  }

  enableDarkTheme() {
    console.log("ENABLE DAERK");
    this.themeChanged.emit(Themes.Dark);
  }

  enableLightTheme() {
    console.log("ENABLE light");
    this.themeChanged.emit(Themes.Light);
  }
}
