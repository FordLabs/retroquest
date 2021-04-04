/*
 *  Copyright (c) 2020 Ford Motor Company
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

import { CreateComponent } from './create.page';
import { AuthService } from '../../../auth/auth.service';
import { Subject, throwError } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import {
  createMockHttpClient,
  createMockRecaptchaComponent,
  createMockRouter,
  createMockTeamService,
  enterTextIntoFormElement,
} from '../../../utils/testutils';
import { TeamService } from '../../../teams/services/team.service';
import { render } from '@testing-library/angular';
import { BoardsModule } from '../../boards.module';
import { RenderResult } from '@testing-library/angular/src/lib/models';
import { BrandFooterComponent } from '../../components/brand-footer/brand-footer.component';

describe('CreateComponent', () => {
  let component: RenderResult<CreateComponent>;
  let mockTeamService;

  beforeEach(async () => {
    mockTeamService = createMockTeamService();

    component = await render(CreateComponent, {
      routes: [
        {
          path: '',
          component: CreateComponent,
        },
        {
          path: 'team/teamId',
          //Just need to be able to ensure we were routed to another component
          component: BrandFooterComponent,
        },
      ],
      imports: [BoardsModule],
      excludeComponentDeclaration: true,
      componentProviders: [
        {
          provide: TeamService,
          useValue: mockTeamService,
        },
        {
          provide: HttpClient,
          useValue: createMockHttpClient(),
        },
      ],
    });
  });

  describe('Validating form fields', () => {
    it('Requires a team name to be entered', async () => {
      component.getByText('create board').click();
      await component.findByText('Please enter a team name');
    });

    it('Requires a password to be entered', async () => {
      enterTextIntoFormElement(component, 'Board name', 'test');
      component.getByText('create board').click();
      await component.findByText('Please enter a password');
    });

    it('Requires a confirmation password to be entered', async () => {
      enterTextIntoFormElement(component, 'Board name', 'test');
      enterTextIntoFormElement(component, 'Password', 'Test1234');
      component.getByText('create board').click();
      await component.findByText('Please enter matching passwords');
    });

    it('Requires a confirmation password to match entered password', async () => {
      enterTextIntoFormElement(component, 'Board name', 'test');
      enterTextIntoFormElement(component, 'Password', 'Test1234');
      enterTextIntoFormElement(component, 'Confirm Password', 'peanutButter');
      component.getByText('create board').click();
      await component.findByText('Please enter matching passwords');
    });

    it('Requires at least one capital letter', async () => {
      enterTextIntoFormElement(component, 'Board name', 'test');
      enterTextIntoFormElement(component, 'Password', 'test1234');
      enterTextIntoFormElement(component, 'Confirm Password', 'test1234');
      component.getByText('create board').click();
      await component.findByText(
        'Password must be greater than 7 characters and contain one capital letter, one lowercase letter and 1 numeral'
      );
    });

    it('Requires at least one lowercase letter', async () => {
      enterTextIntoFormElement(component, 'Board name', 'test');
      enterTextIntoFormElement(component, 'Password', 'TEST1234');
      enterTextIntoFormElement(component, 'Confirm Password', 'TEST1234');
      component.getByText('create board').click();
      await component.findByText(
        'Password must be greater than 7 characters and contain one capital letter, one lowercase letter and 1 numeral'
      );
    });

    it('Requires at least one number', async () => {
      enterTextIntoFormElement(component, 'Board name', 'test');
      enterTextIntoFormElement(component, 'Password', 'TESTtest');
      enterTextIntoFormElement(component, 'Confirm Password', 'TESTtest');
      component.getByText('create board').click();
      await component.findByText(
        'Password must be greater than 7 characters and contain one capital letter, one lowercase letter and 1 numeral'
      );
    });
  });
  describe('Submitting form', () => {
    const jwt = 'im.a.jwt';
    const teamUrl = 'team/teamId';
    const loginResponse: HttpResponse<string> = new HttpResponse({
      body: 'im.a.jwt',
      headers: new HttpHeaders({ location: teamUrl }),
    });
    const authSpy = jest.spyOn(AuthService, 'setToken');

    beforeEach(() => {
      mockTeamService.create = jest.fn().mockReturnValue(of(loginResponse));

      enterTextIntoFormElement(component, 'Board name', 'test');
      enterTextIntoFormElement(component, 'Password', 'Test1234');
      enterTextIntoFormElement(component, 'Confirm Password', 'Test1234');
      component.getByText('create board').click();
    });

    it('Makes call to create team service if form entry is valid', () => {
      expect(mockTeamService.create).toHaveBeenCalled();
    });

    it('Sets the JWT token on auth service', () => {
      expect(authSpy).toHaveBeenCalledWith(jwt);
    });

    it('Routes to the team board', () => {
      expect(component.findByText('Powered By'));
    });
  });
});
