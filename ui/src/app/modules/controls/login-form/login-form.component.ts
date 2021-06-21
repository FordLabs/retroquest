import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'rq-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  @Output() captchaResolved = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
