import {Component, Input} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';

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

  constructor(private router: Router) {
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

}
