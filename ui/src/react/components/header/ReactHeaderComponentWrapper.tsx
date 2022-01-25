/*
 * Copyright (c) 2022 Ford Motor Company
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
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router as AngularRouter } from '@angular/router';
import { RecoilRoot } from 'recoil';

import { DataService } from '../../../app/modules/data.service';
import { parseTheme } from '../../../app/modules/domain/Theme';
import { TeamService } from '../../../app/modules/teams/services/team.service';
import Theme from '../../types/Theme';

import Header from './Header';

const containerElementName = 'reactHeaderComponentWrapper';

@Component({
  selector: 'react-header-component-wrapper',
  template: `
    <span #${containerElementName}></span>
    <router-outlet></router-outlet>
  `,
  styleUrls: [
    '../../templates/app/App.scss',
    './Header.scss',
    '../settings-dialog/SettingsDialog.scss',
    '../settings-dialog/styles-tab/StylesTab.scss',
    '../settings-dialog/account-tab/AccountTab.scss',
    '../dialog/Dialog.scss',
    '../button/Button.scss',
    '../modal/Modal.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ReactHeaderComponentWrapper implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(containerElementName, { static: false }) containerRef: ElementRef;
  teamId: string;
  teamName: string;

  constructor(
    private angularRoute: ActivatedRoute,
    private angularRouter: AngularRouter,
    private teamService: TeamService,
    private dataService: DataService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.angularRoute.params.subscribe((params) => {
      this.teamId = params.teamId;
      this.dataService.team.id = this.teamId;

      this.setTeamName();
    });
  }

  ngAfterViewInit(): void {
    this.render();
    this.loadTheme();
  }

  ngOnChanges(): void {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      this.emitThemeChanged(savedTheme);
    }
  }

  private emitThemeChanged(theme: Theme) {
    const angularTheme = parseTheme(theme);

    this.dataService.theme = angularTheme;
    this.dataService.themeChanged.emit(angularTheme);
  }

  private setTeamName(): void {
    this.teamService.fetchTeamName(this.teamId).subscribe((teamName) => {
      this.teamName = teamName;
      this.dataService.team.name = this.teamName;
      this.titleService.setTitle(this.teamName + ' | RetroQuest');
    });
  }

  private render() {
    ReactDOM.render(
      <React.StrictMode>
        <RecoilRoot>
          <Header
            emitThemeChangedToAngular={(theme) => {
              this.emitThemeChanged(theme);
            }}
            teamId={this.angularRoute.snapshot.params['teamId'] as string}
            routeTo={(path: string) => {
              this.angularRouter.navigateByUrl(path).then();
            }}
          />
        </RecoilRoot>
      </React.StrictMode>,
      this.containerRef.nativeElement
    );
  }
}
