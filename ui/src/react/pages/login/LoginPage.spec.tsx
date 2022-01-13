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
import React, { ReactElement } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';

import { mockContributors } from '../../services/__mocks__/ContributorsService';
import ContributorsService from '../../services/ContributorsService';
import TeamService from '../../services/TeamService';

import { LoginPage } from './LoginPage';

jest.mock('../../services/ContributorsService');
jest.mock('../../services/TeamService');

describe('LoginPage.spec.tsx', () => {
  let container: HTMLElement;
  let rerender: (ui: ReactElement) => void;
  const validTeamName = 'Team Awesome';
  const validPassword = 'Password1';
  let routeTo;

  beforeEach(async () => {
    ContributorsService.getContributors = jest.fn().mockResolvedValue(mockContributors);
    TeamService.getTeamName = jest.fn().mockResolvedValue(validTeamName);
    TeamService.login = jest.fn().mockResolvedValue(validTeamName);

    routeTo = jest.fn();
    await waitFor(() => {
      ({ container, rerender } = render(<LoginPage routeTo={routeTo} teamId="" />));
    });
  });

  it('should render without axe errors', async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should show correct heading', async () => {
    expect(await screen.findByText('Sign in to your Team!')).toBeDefined();
  });

  it('should show link to create new team', async () => {
    const createNewTeamLink = await screen.findByText('or create a new team');
    expect(createNewTeamLink.getAttribute('href')).toBe('/create');
  });

  it('should pre-populate team name if team name is in route', async () => {
    let teamNameInput = getTeamNameInput();
    expect(teamNameInput.value).toBe('');

    await waitFor(() => {
      rerender(<LoginPage routeTo={routeTo} teamId={validTeamName} />);
    });
    teamNameInput = getTeamNameInput();
    expect(teamNameInput.value).toBe(validTeamName);
  });

  it('should login with correct credentials', async () => {
    await typeIntoTeamNameInput(validTeamName);
    await typeIntoPasswordInput(validPassword);

    const submitButton = await screen.findByText('Sign in');
    await waitFor(() => {
      userEvent.click(submitButton);
    });
    expect(TeamService.login).toHaveBeenCalledWith(validTeamName, validPassword);
    expect(routeTo).toHaveBeenCalledWith(`/team/${validTeamName}`);
  });

  describe('Form errors', () => {
    it('should show validation message when team name is not valid', async () => {
      expect(screen.queryByTestId('inputValidationMessage')).toBeNull();

      await typeIntoPasswordInput(validPassword);

      const invalidTeamName = '&%(#';
      await typeIntoTeamNameInput(invalidTeamName);

      await waitFor(() => {
        fireEvent.submit(getTeamNameInput());
      });

      expect(await screen.findByTestId('inputValidationMessage')).toBeDefined();
    });

    it('should show validation message when validPassword is not valid', async () => {
      expect(screen.queryByTestId('inputValidationMessage')).toBeNull();

      await typeIntoTeamNameInput(validTeamName);

      const invalidPassword = 'MissingANumber';
      await typeIntoPasswordInput(invalidPassword);

      await waitFor(() => {
        fireEvent.submit(getPasswordInput());
      });

      expect(await screen.findByTestId('inputValidationMessage')).toBeDefined();
    });

    it('should show error if login was unsuccessful', async () => {
      TeamService.login = jest.fn().mockRejectedValue(new Error('Async error'));

      await waitFor(() => {
        rerender(<LoginPage routeTo={routeTo} teamId={validTeamName} />);
      });

      await typeIntoPasswordInput(validPassword);

      const submitButton = await screen.findByText('Sign in');
      await waitFor(() => {
        userEvent.click(submitButton);
      });
      expect(TeamService.login).toHaveBeenCalledWith(validTeamName, validPassword);
      expect(routeTo).not.toHaveBeenCalled();
      expect(await screen.findByText('Incorrect team name or password. Please try again.')).toBeDefined();
    });
  });
});

const getTeamNameInput = (): HTMLInputElement => screen.getByLabelText('Team name', { selector: 'input' });
const getPasswordInput = (): HTMLInputElement => screen.getByLabelText('Password', { selector: 'input' });

const typeIntoPasswordInput = async (password: string) => {
  const teamPasswordInput = getPasswordInput();
  await waitFor(() => {
    fireEvent.change(teamPasswordInput, { target: { value: password } });
  });
};

const typeIntoTeamNameInput = async (teamName: string) => {
  const teamNameInput = getTeamNameInput();
  await waitFor(() => {
    fireEvent.change(teamNameInput, { target: { value: teamName } });
  });
};
