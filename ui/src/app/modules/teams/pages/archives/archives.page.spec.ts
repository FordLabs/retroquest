/*
 * Copyright (c) 2018 Ford Motor Company
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

import {ArchivesPageComponent} from './archives.page';
import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {TeamService} from '../../services/team.service';

describe('ArchivesPageComponent', () => {
  let component: ArchivesPageComponent;
  let mockActivatedRoute: ActivatedRoute;
  let mockTeamService: TeamService;

  beforeEach(() => {
    mockActivatedRoute = {
      params: jasmine.createSpyObj({subscribe: new Subject()})
    } as ActivatedRoute;
    mockTeamService = jasmine.createSpyObj({fetchTeamName: new Subject()});
    component = new ArchivesPageComponent(mockActivatedRoute, mockTeamService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should subscribe to params on the activated route on init`, () => {
    component.ngOnInit();
    expect(mockActivatedRoute.params.subscribe).toHaveBeenCalled();
  });
});
