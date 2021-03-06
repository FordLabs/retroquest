/*
 * Copyright (c) 2021 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TeamService} from '../teams/services/team.service';
import {DataService} from '../data.service';
import {parseTheme, Themes} from '../domain/Theme';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'rq-sub-app',
  templateUrl: './sub-app.component.html',
  styleUrls: ['./sub-app.component.scss'],
  host: {
    '[class.dark-theme]': 'darkThemeIsEnabled'
  }
})
export class SubAppComponent implements OnInit, AfterViewInit {

  teamId: string;
  teamName: string;

  constructor(private activatedRoute: ActivatedRoute,
              private teamService: TeamService,
              private dataService: DataService,
              private titleService: Title) {
  }

  ngOnInit() {

    this.activatedRoute.params.subscribe((params) => {
      this.teamId = params.teamId;
      this.dataService.team.id = this.teamId;

      this.setTeamName();
    });
  }

  ngAfterViewInit(): void {
    window.setTimeout(_ => this.loadTheme());
  }

  get theme(): Themes {
    return this.dataService.theme;
  }

  get darkThemeIsEnabled(): boolean {
    return this.dataService.theme === Themes.Dark;
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
        this.titleService.setTitle(this.teamName + ' | RetroQuest');
      }
    );
  }

  emitThemeChanged(theme: Themes) {
    this.dataService.theme = theme;
    this.dataService.themeChanged.emit(theme);
  }
}
