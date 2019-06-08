import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {RecaptchaComponent} from 'ng-recaptcha';
import {concatMap, map} from 'rxjs/operators';
import {EMPTY, Observable, of} from 'rxjs';
import {HttpResponse} from '@angular/common/http';
import {TeamService} from '../../../teams/services/team.service';
import {AuthService} from '../../../auth/auth.service';

@Component({
  selector: 'rq-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {


  constructor(private teamService: TeamService, private router: Router) {
  }

  teamName: string;
  password: string;
  confirmPassword: string;
  errorMessage: string;

  ngOnInit(): void {
  }

  requestCaptchaStateAndCreateTeam() {
    if (!this.validateInput()) {
      return;
    }

    this.teamService.isCaptchaEnabled().pipe(
      map(response => JSON.parse(response.body).captchaEnabled),
      concatMap(captchaEnabled => this.createTeamOrExecuteCaptcha(captchaEnabled)),
    ).subscribe(
      response => this.handleResponse(response),
      error => this.handleError(error)
    );
  }

  private createTeamOrExecuteCaptcha(captchaEnabled): Observable<HttpResponse<Object>> {
    return this.teamService.createUser(this.teamName, this.password);
  }

  create(captchaResponse: string = null): void {
    this.teamService.createUser(this.teamName, this.password)
      .subscribe(
        response => this.handleResponse(response),
        error => this.handleError(error)
      );
  }

  private validateInput(): boolean {
    if (!this.teamName || this.teamName === '') {
      this.errorMessage = 'Please enter a team name';
      return false;
    }

    if (!this.password || this.password === '') {
      this.errorMessage = 'Please enter a password';
      return false;
    }

    if (this.confirmPassword !== this.password) {
      this.errorMessage = 'Please enter matching passwords';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  private handleResponse(response): void {
    AuthService.setToken(response.body);
    const teamUrl = response.headers.get('location');
    this.router.navigateByUrl(teamUrl);
  }

  private handleError(error) {
    error.error = JSON.parse(error.error);
    this.errorMessage = error.error.message ? error.error.message : `${error.status} ${error.error}`;
    console.error('A registration error occurred: ', this.errorMessage);
    return of(this.errorMessage);
  }

}
