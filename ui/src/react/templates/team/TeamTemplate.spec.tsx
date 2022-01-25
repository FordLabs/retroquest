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
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import TeamTemplate from './TeamTemplate';

describe('TeamTemplate', () => {
  xit('should render the team header, sub header, and children', () => {
    render(
      <MemoryRouter initialEntries={['/team/team-id']}>
        <RecoilRoot>
          <TeamTemplate subHeader={<div>sub header</div>}>
            <div>children</div>
          </TeamTemplate>
        </RecoilRoot>
      </MemoryRouter>
    );

    screen.getByText('retro');
    screen.getByText('archives');
    screen.getByText('radiator');
    screen.getByText('sub header');
    screen.getByText('children');
  });
});
