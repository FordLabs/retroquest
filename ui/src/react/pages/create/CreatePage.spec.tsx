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
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';

import { mockContributors } from '../../services/__mocks__/ContributorsService';
import ContributorsService from '../../services/ContributorsService';
import TeamService from '../../services/TeamService';

import CreatePage from './CreatePage';

jest.mock('../../services/ContributorsService');
jest.mock('../../services/TeamService');

describe('CreatePage.spec.tsx', () => {
  let container: HTMLElement;
  const validTeamName = 'Team Awesome';
  const validPassword = 'Password1';
  let routeTo;

  beforeEach(async () => {
    ContributorsService.getContributors = jest.fn().mockResolvedValue(mockContributors);
    TeamService.create = jest.fn().mockResolvedValue(validTeamName);

    routeTo = jest.fn();
    await act(async () => {
      ({ container } = render(<CreatePage routeTo={routeTo} />));
    });
  });

  it('should render without axe errors', async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should show correct heading', () => {
    expect(screen.getByText('Create a new Team!')).toBeDefined();
  });

  it('should show link to login page', () => {
    const createNewTeamLink = screen.getByText('or sign in to your existing team');
    expect(createNewTeamLink.getAttribute('href')).toBe('/login');
  });

  it('should successfully create team', async () => {
    typeIntoTeamNameInput(validTeamName);
    typeIntoPasswordInput(validPassword);
    typeIntoConfirmPasswordInput(validPassword);

    const submitButton = screen.getByText('Create Team');
    await act(async () => {
      userEvent.click(submitButton);
    });
    expect(TeamService.create).toHaveBeenCalledWith(validTeamName, validPassword);
    expect(routeTo).toHaveBeenCalledWith(`/team/${validTeamName}`);
  });

  describe('Form errors', () => {
    beforeEach(() => {
      expect(screen.queryByTestId('inputValidationMessage')).toBeNull();
      expect(screen.queryByTestId('formErrorMessage')).toBeNull();
    });

    it('should warn user with message when team name has special characters', async () => {
      typeIntoPasswordInput(validPassword);
      typeIntoConfirmPasswordInput(validPassword);

      const invalidTeamName = '&%(#';
      typeIntoTeamNameInput(invalidTeamName);

      await act(async () => {
        fireEvent.submit(getTeamNameInput());
      });

      const inputValidationMessage = screen.getByTestId('inputValidationMessage');
      expect(inputValidationMessage.textContent).toBe('Names must not contain special characters.');

      const formErrorMessage = screen.getByTestId('formErrorMessage');
      expect(formErrorMessage.textContent).toBe('Please enter a team name without any special characters.');
    });

    it('should warn user with message when password is not valid', async () => {
      typeIntoTeamNameInput(validTeamName);

      const invalidPassword = 'MissingANumber';
      typeIntoPasswordInput(invalidPassword);
      typeIntoConfirmPasswordInput(invalidPassword);

      await act(async () => {
        fireEvent.submit(getPasswordInput());
      });

      const inputValidationMessage = screen.getByTestId('inputValidationMessage');
      expect(inputValidationMessage.textContent).toBe('8 or more characters with a mix of numbers and letters');

      const formErrorMessage = screen.getByTestId('formErrorMessage');
      expect(formErrorMessage.textContent).toBe('Password must contain at least one number.');
    });

    it('should warn user with message when passwords do not match', async () => {
      typeIntoTeamNameInput(validTeamName);
      typeIntoPasswordInput(validPassword);
      typeIntoConfirmPasswordInput(validPassword + '-nice-try');

      await act(async () => {
        fireEvent.submit(getPasswordInput());
      });

      expect(screen.queryByTestId('inputValidationMessage')).toBeNull();

      const formErrorMessage = screen.getByTestId('formErrorMessage');
      expect(formErrorMessage.textContent).toBe('Please enter matching passwords');
    });
  });
});

const getTeamNameInput = (): HTMLInputElement => screen.getByLabelText('Team name', { selector: 'input' });
const getPasswordInput = (): HTMLInputElement => screen.getByLabelText('Password', { selector: 'input' });
const getConfirmPasswordInput = (): HTMLInputElement =>
  screen.getByLabelText('Confirm Password', { selector: 'input' });

const typeIntoPasswordInput = (password: string) => {
  const passwordInput = getPasswordInput();
  fireEvent.change(passwordInput, { target: { value: password } });
};

const typeIntoConfirmPasswordInput = (confirmationPassword: string) => {
  const confirmPasswordInput = getConfirmPasswordInput();
  fireEvent.change(confirmPasswordInput, { target: { value: confirmationPassword } });
};

const typeIntoTeamNameInput = (teamName: string) => {
  const teamNameInput = getTeamNameInput();
  fireEvent.change(teamNameInput, { target: { value: teamName } });
};
