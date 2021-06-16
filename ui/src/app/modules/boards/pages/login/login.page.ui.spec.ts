import { render, RenderResult } from '@testing-library/angular';
import {
  createMockHttpClient,
  createMockTeamService,
  enterTextIntoFormElement,
} from '../../../utils/testutils';
import { LoginComponent } from './login.page';
import { BoardsModule } from '../../boards.module';
import { TeamService } from '../../../teams/services/team.service';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';

describe('Logging in', () => {
  let mockTeamService;

  const teamId = 'login-ui-test';
  const teamName = 'Login UI Test';

  async function createComponent(): Promise<RenderResult<LoginComponent>> {
    return render(LoginComponent, {
      imports: [BoardsModule, RouterModule.forRoot([])],
      excludeComponentDeclaration: true,
      providers: [
        {
          provide: TeamService,
          useValue: mockTeamService,
        },
        {
          provide: APP_BASE_HREF,
          useValue: '/',
        },
        {
          provide: HttpClient,
          useValue: createMockHttpClient(),
        },
      ],
    });
  }

  beforeEach(async () => {
    mockTeamService = createMockTeamService();

    mockTeamService.login = () => {
      const error = {
        error: JSON.stringify({
          timestamp: '2021-04-04T18:04:13.234+00:00',
          status: 403,
          error: 'Forbidden',
          message: 'Incorrect board or password. Please try again.',
          path: '/api/team/login',
        }),
      };

      throw error;
    };
  });

  describe('Login Validation', () => {
    let component: RenderResult<LoginComponent>;

    beforeEach(async () => {
      component = await createComponent();
    });

    it('Displays an error message if team name is not entered', async () => {
      component.getByText('Sign In').click();
      await component.findByText('Please enter a team name');
    });
    it('Displays an error message if password is not entered', async () => {
      enterTextIntoFormElement(component, 'Board name', teamName);
      component.getByText('Sign In').click();

      await component.findByText('Please enter a password');
    });
    it('Displays an error message if password is entered correctly', async () => {
      enterTextIntoFormElement(component, 'Board name', teamName);
      enterTextIntoFormElement(component, 'Password', 'wrongPassword');
      component.getByText('Sign In').click();

      await component.findByText(
        'Incorrect board or password. Please try again.'
      );
    });
  });
});
