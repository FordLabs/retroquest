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
import { act, render, screen, within } from '@testing-library/react';
import { axe } from 'jest-axe';
import { RecoilRoot } from 'recoil';

import { mockColumns } from '../../services/__mocks__/ColumnsService';
import ColumnsService from '../../services/ColumnsService';

import RetroPage from './RetroPage';

jest.mock('../../services/ColumnsService');
jest.mock('../../websocket/WebSocketService');

jest.setTimeout(60000);

describe('RetroPage.spec.tsx', () => {
  let container: HTMLElement;
  const teamId = 'some-team-id';

  beforeEach(async () => {
    await act(async () => {
      ({ container } = render(
        <RecoilRoot>
          <RetroPage teamId={teamId} />
        </RecoilRoot>
      ));
    });

    expect(ColumnsService.getColumns).toHaveBeenCalledWith(teamId);
  });

  it('should render without axe errors', async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should show all columns returned from backend', (done) => {
    mockColumns.forEach((column) => {
      const retroColumn = screen.getByTestId(`retroColumn__${column.topic}`);
      expect(within(retroColumn).getByText(column.title)).toBeDefined();
    });
    done();
  });
});
