import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TeamService} from "../teams/services/team.service";
import {DataService} from "../data.service";
import {parseTheme, Themes} from "../domain/Theme";

@Component({
  selector: 'rq-sub-app',
  templateUrl: './sub-app.component.html',
  styleUrls: ['./sub-app.component.scss']
})
export class SubAppComponent implements OnInit {

  teamId: string;
  teamName: string;
  theme: Themes;

  constructor(private activatedRoute: ActivatedRoute,
              private teamService: TeamService,
              private dataService: DataService) {
  }

  ngOnInit() {

    this.loadTheme();

    this.activatedRoute.params.subscribe((params) => {
      this.teamId = params.teamId;
      this.dataService.team.id = this.teamId;

      this.setTeamName();
    });
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    console.log(savedTheme);
    if (savedTheme) {
      this.theme = parseTheme(savedTheme);
      this.dataService.themeChanged.emit(this.theme);
    }
  }

  private setTeamName(): void {
    this.teamService.fetchTeamName(this.teamId).subscribe(
      (teamName) => {
        this.teamName = teamName;
        this.dataService.team.name = this.teamName;
      }
    );
  }

  emitThemeChanged(theme: Themes) {
    this.theme = theme;
    this.dataService.themeChanged.emit(theme);
  }
}
