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
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecoilRoot } from 'recoil';

import TeamService from '../../services/TeamService';

import Header from './Header';

describe('Header', () => {
  let routeTo;
  const teamName = 'Lucille Ball';
  const teamId = 'lucille-ball';

  beforeEach(async () => {
    routeTo = jest.fn();
    TeamService.getTeamName = jest.fn().mockResolvedValue(teamName);

    await act(async () => {
      render(
        <RecoilRoot>
          <Header teamId={teamId} routeTo={routeTo} />
        </RecoilRoot>
      );
    });
  });

  it('should render logo link and team name', () => {
    const logo = screen.getByAltText('RetroQuest');
    screen.getByText(teamName);

    expect(logo.closest('a').pathname).toBe('/');
  });

  it('should render nav links', () => {
    userEvent.click(screen.getByText('Archives'));
    expect(routeTo).toHaveBeenCalledWith(`/team/${teamId}/archives`);

    userEvent.click(screen.getByText('Radiator'));
    expect(routeTo).toHaveBeenCalledWith(`/team/${teamId}/radiator`);

    userEvent.click(screen.getByText('Retro'));
    expect(routeTo).toHaveBeenCalledWith(`/team/${teamId}`);
  });

  it('should render the settings button and setting dialog', () => {
    userEvent.click(screen.getByTestId('settingsButton'));
    screen.getByText('Settings');
    screen.getByText('choose your preferences');
  });
});
