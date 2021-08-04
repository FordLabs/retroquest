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
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';

import TopHeader from './TopHeader';

describe('TopHeader', () => {
  let testLocation;

  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={['/team/team-id']}>
        <TopHeader />
        <Route
          path="*"
          render={({ location }) => {
            testLocation = location;
            return null;
          }}
        />
      </MemoryRouter>
    );
  });

  it('should render logo link and team name', () => {
    const logo = screen.getByAltText('RetroQuest');
    screen.getByText('Team Name');

    userEvent.click(logo);

    expect(testLocation.pathname).toBe('/');
  });

  it('should render nav links', () => {
    userEvent.click(screen.getByText('archives'));
    expect(testLocation.pathname).toBe('/team/team-id/archives');

    userEvent.click(screen.getByText('radiator'));
    expect(testLocation.pathname).toBe('/team/team-id/radiator');

    userEvent.click(screen.getByText('retro'));
    expect(testLocation.pathname).toBe('/team/team-id');
  });

  it('should render the settings button and setting dialog', () => {
    userEvent.click(screen.getByTestId('settingsBtn'));
    screen.getByText('settings');
    screen.getByText('choose your preferences');
  });
});
