/*
 *  Copyright (c) 2018 Ford Motor Company
 *  All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import {SubAppComponent} from './sub-app.component';
import {ActivatedRoute} from '@angular/router';
import {TeamService} from '../teams/services/team.service';
import {DataService} from '../data.service';
import {of} from 'rxjs';
import {instance, mock, when} from 'ts-mockito';
import {Themes} from '../domain/Theme';

describe('SubAppComponent', () => {
  let component: SubAppComponent;
  let activatedRoute: ActivatedRoute;
  let teamService: TeamService;
  let dataService: DataService;

  beforeEach(() => {
    activatedRoute = mock(ActivatedRoute);
    teamService = mock(TeamService);
    dataService = new DataService();

    component = new SubAppComponent(instance(activatedRoute), instance(teamService), dataService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    const fakeId = 'fake-id';
    const fakeName = 'fake-name';

    beforeEach(() => {
      when(activatedRoute.params).thenReturn(of({teamId: fakeId}));
      when(teamService.fetchTeamName(fakeId)).thenReturn(of(fakeName));
      component.ngOnInit();
    });

    it('should set the team id to the id in the params', () => {
      expect(component.teamId).toEqual(fakeId);
      expect(dataService.team.id).toEqual(fakeId);
    });

    it('should set the team name to name returned by the backend', () => {
      expect(component.teamName).toEqual(fakeName);
      expect(dataService.team.name).toEqual(fakeName);
    });
  });

  describe('emitThemeChanged', () => {
    beforeEach(() => {
      dataService.themeChanged = jasmine.createSpyObj({emit: null});
    });

    it('should set the theme to the one passed in', () => {
      component.emitThemeChanged(Themes.Dark);
    });

    it('should emit the passed in theme', () => {
      component.emitThemeChanged(Themes.Dark);
      expect(dataService.themeChanged.emit).toHaveBeenCalledWith(Themes.Dark);
    });
  });
});
