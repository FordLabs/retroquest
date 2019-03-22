import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TeamService} from '../teams/services/team.service';
import {DataService} from '../data.service';
import {parseTheme, Themes} from '../domain/Theme';

@Component({
  selector: 'rq-sub-app',
  templateUrl: './sub-app.component.html',
  styleUrls: ['./sub-app.component.scss']
})
export class SubAppComponent implements OnInit, AfterViewInit {

  teamId: string;
  teamName: string;
  theme: Themes;

  constructor(private activatedRoute: ActivatedRoute,
              private teamService: TeamService,
              private dataService: DataService) {
  }

  ngOnInit() {

    this.activatedRoute.params.subscribe((params) => {
      this.teamId = params.teamId;
      this.dataService.team.id = this.teamId;

      this.setTeamName();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(_ => this.loadTheme());
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.emitThemeChanged(parseTheme(savedTheme));
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
