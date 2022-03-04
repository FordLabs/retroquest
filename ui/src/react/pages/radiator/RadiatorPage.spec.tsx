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
import { act, render, screen } from '@testing-library/react';
import moment from 'moment';
import { RecoilRoot } from 'recoil';

import ActionItemService from '../../services/api/ActionItemService';
import { TeamState } from '../../state/TeamState';

import RadiatorPage from './RadiatorPage';

jest.mock('../../services/api/ActionItemService');

const archivedActionItems = [
  {
    id: 1,
    task: 'Make it better',
    completed: false,
    assignee: 'Ginnie',
    dateCreated: '2022-01-20',
    archived: true,
  },
  {
    id: 2,
    task: 'Take action',
    completed: true,
    assignee: 'Georgia',
    dateCreated: '2022-03-20',
    archived: true,
  },
];

describe('Radiator Page', () => {
  const teamId = 'team-id';

  it('should get active action items and display them on page', async () => {
    ActionItemService.get = jest.fn().mockResolvedValue(archivedActionItems);

    await act(async () => {
      render(
        <RecoilRoot
          initializeState={({ set }) => {
            set(TeamState, { name: '', id: teamId });
          }}
        >
          <RadiatorPage />
        </RecoilRoot>
      );
    });

    expect(ActionItemService.get).toHaveBeenCalledWith(teamId, false);
    expect(screen.getByText('Radiator')).toBeDefined();
    expect(screen.getByText("Take a look at all your team's active action items")).toBeDefined();

    const activeActionItem = archivedActionItems[0];
    expect(screen.getByText(activeActionItem.task)).toBeDefined();
    expect(screen.getByDisplayValue(activeActionItem.assignee)).toBeDefined();
    expect(screen.getByText(moment(activeActionItem.dateCreated).format('MMM Do'))).toBeDefined();

    const completedActionItem = archivedActionItems[1];
    expect(screen.queryByText(completedActionItem.task)).toBeNull();
    expect(screen.queryByDisplayValue(completedActionItem.assignee)).toBeNull();
    expect(screen.queryByText(moment(completedActionItem.dateCreated).format('MMM Do'))).toBeNull();
  });

  it('should show "No active action items" message when no active action items are present', () => {
    ActionItemService.get = jest.fn().mockResolvedValue([]);

    render(
      <RecoilRoot>
        <RadiatorPage />
      </RecoilRoot>
    );

    screen.getByText('No active action items were found.');
    const description = screen.getByTestId('notFoundSectionDescription');
    expect(description.innerHTML).toBe('You can create new action items on the <span class="bold">retro page</span>.');

    expect(screen.queryByText('Radiator')).toBeNull();
  });
});
