import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Team} from './team';
import {DataService} from '../../../data.service';

@Component({
  selector: 'rq-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {
  teamList: Array<Team> = [];
  existingTeamName = '';
  existingTeamPassword = '';

  newTeamName = '';
  userName = '';

  constructor(private http: HttpClient,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              public dataService: DataService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.userName = params.user;

      this.getTeamsAttachedToUser();
    });
  }

  addExistingTeamToUser() {
    this.http.put(`/api/user/${this.userName}/team`,
      {name: this.existingTeamName, password: this.existingTeamPassword},
      {observe: 'response'}
    ).subscribe(() => {

      this.getTeamsAttachedToUser();

      this.existingTeamName = '';
      this.existingTeamPassword = '';
    }, err => {
      console.log(`An error occurred creating the team ${this.newTeamName}`);
      this.existingTeamName = '';
      this.existingTeamPassword = '';
    });

  }

  addNewTeamToUser() {

    this.http.post(`/api/user/${this.userName}/team`,
      {name: this.newTeamName},
      {observe: 'response'}
    ).subscribe(() => {

      this.getTeamsAttachedToUser();

      this.newTeamName = '';
    }, err => {
      console.log(`An error occurred creating the team ${this.newTeamName}`);
      this.newTeamName = '';
    });

  }

  getTeamsAttachedToUser() {
    this.http.get(`/api/user/${this.userName}/team`,
      {observe: 'response'}).subscribe(response => {
      this.teamList = response.body as Array<Team>;
    });

  }

  fetchColumnsForTeamTest(teamId: string) {
    this.router.navigateByUrl(`/team/${teamId}`);
    // this.columnAggregationService.getColumns(teamId).subscribe(response => {
    //   console.log('GOT columns for team ', teamId, response);
    // });
  }
}
