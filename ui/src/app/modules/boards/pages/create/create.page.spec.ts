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

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { render } from '@testing-library/angular';
import { RenderResult } from '@testing-library/angular/src/lib/models';
import { of } from 'rxjs/internal/observable/of';

import { AuthService } from '../../../auth/auth.service';
import { TeamService } from '../../../teams/services/team.service';
import { EmptyComponent } from '../../../test/empty.page';
import { TestModule } from '../../../test/test.module';
import { createMockHttpClient, createMockTeamService, enterTextIntoFormElement } from '../../../utils/testutils';
import { BoardsModule } from '../../boards.module';

import { CreateComponent } from './create.page';

describe('CreateComponent', () => {
  async function createComponent(teamService: TeamService): Promise<RenderResult<CreateComponent>> {
    return render(CreateComponent, {
      routes: [
        {
          path: 'create',
          component: CreateComponent,
        },
        {
          path: 'team/:teamId',
          component: EmptyComponent,
        },
      ],
      imports: [BoardsModule, TestModule],
      excludeComponentDeclaration: true,
      providers: [
        {
          provide: TeamService,
          useValue: teamService,
        },
        {
          provide: HttpClient,
          useValue: createMockHttpClient(),
        },
      ],
    });
  }

  describe('Validating form fields', () => {
    let component: RenderResult<CreateComponent>;
    let mockTeamService;

    beforeEach(async () => {
      mockTeamService = createMockTeamService();

      component = await createComponent(mockTeamService);
    });

    it('Requires a team name to be entered', async () => {
      component.getByText('create team').click();
      await component.findByText('Please enter a team name');
    });

    it('Requires a password to be entered', async () => {
      enterTextIntoFormElement(component, 'Team name', 'test');
      component.getByText('create team').click();
      await component.findByText('Please enter a password');
    });

    it('Requires a confirmation password to be entered', async () => {
      enterTextIntoFormElement(component, 'Team name', 'test');
      enterTextIntoFormElement(component, 'Password', 'Test1234');
      component.getByText('create team').click();
      await component.findByText('Please enter matching passwords');
    });

    it('Requires a confirmation password to match entered password', async () => {
      enterTextIntoFormElement(component, 'Team name', 'test');
      enterTextIntoFormElement(component, 'Password', 'Test1234');
      enterTextIntoFormElement(component, 'Confirm Password', 'peanutButter');
      component.getByText('create team').click();
      await component.findByText('Please enter matching passwords');
    });
  });

  describe('Submitting form', () => {
    let component: RenderResult<CreateComponent>;
    let mockTeamService;

    const jwt = 'im.a.jwt';
    const teamUrl = '/team/teamId';
    const loginResponse: HttpResponse<string> = new HttpResponse({
      body: 'im.a.jwt',
      headers: new HttpHeaders({ location: teamUrl }),
    });
    const createSpy = jest.fn().mockReturnValue(of(loginResponse));
    const authSpy = jest.spyOn(AuthService, 'setToken');

    beforeEach(async () => {
      mockTeamService = createMockTeamService();
      mockTeamService.create = createSpy;
      component = await createComponent(mockTeamService);

      enterTextIntoFormElement(component, 'Team name', 'test');
      enterTextIntoFormElement(component, 'Password', 'Test1234');
      enterTextIntoFormElement(component, 'Confirm Password', 'Test1234');
      component.getByText('create team').click();
    });

    it('Makes call to create team service if form entry is valid', () => {
      expect(createSpy).toHaveBeenCalled();
    });

    it('Sets the JWT token on auth service', () => {
      expect(authSpy).toHaveBeenCalledWith(jwt);
    });
  });
});
