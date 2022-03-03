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
import { RecoilRoot } from 'recoil';

import ActionItemService from '../../../services/api/ActionItemService';
import { TeamState } from '../../../state/TeamState';

import ActionItemArchives from './ActionItemArchives';

jest.mock('../../../services/api/ActionItemService');

const archivedActionItems = [
  {
    id: 1,
    task: 'Make it better',
    completed: true,
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

describe('Action Item Archives', () => {
  const teamId = 'team-id';

  it('should get archived action items and display them on page', async () => {
    ActionItemService.get = jest.fn().mockResolvedValue(archivedActionItems);

    await act(async () => {
      render(
        <RecoilRoot
          initializeState={({ set }) => {
            set(TeamState, { name: '', id: teamId });
          }}
        >
          <ActionItemArchives />
        </RecoilRoot>
      );
    });

    expect(ActionItemService.get).toHaveBeenCalledWith(teamId, true);

    expect(screen.getByText('Action Item Archives')).toBeDefined();
    expect(screen.getByText(archivedActionItems[0].task)).toBeDefined();
    expect(screen.getByText(archivedActionItems[0].assignee)).toBeDefined();
    expect(screen.getByText(archivedActionItems[1].task)).toBeDefined();
    expect(screen.getByText(archivedActionItems[1].assignee)).toBeDefined();
  });

  it('should show "No Archives" message when no archived action items are present', () => {
    ActionItemService.get = jest.fn().mockResolvedValue([]);

    render(
      <RecoilRoot>
        <ActionItemArchives />
      </RecoilRoot>
    );

    screen.getByText('No archives were found.');
    const description = screen.getByTestId('noArchivesFoundSectionDescription');
    expect(description.innerHTML).toBe(
      'Archives will appear when retros are ended with <b>completed action items</b>.'
    );
  });
});
