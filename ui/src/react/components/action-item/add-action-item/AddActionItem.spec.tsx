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

import { getMockThought } from '../../../services/api/__mocks__/ThoughtService';
import ActionItemService from '../../../services/api/ActionItemService';
import { TeamState } from '../../../state/TeamState';
import Team from '../../../types/Team';
import Topic from '../../../types/Topic';
import { editTask, escapeKey, mockUseModalValue, typeAssignee } from '../ActionItem.spec';

import AddActionItem from './AddActionItem';

jest.mock('../../../services/api/ActionItemService');

describe('AddActionItem', () => {
  const hideComponentCallback = jest.fn();
  const team: Team = {
    name: 'My Team',
    id: 'my-team',
  };
  const thought = getMockThought(Topic.HAPPY);

  beforeEach(() => {
    jest.clearAllMocks();

    render(
      <RecoilRoot
        initializeState={({ set }) => {
          set(TeamState, team);
        }}
      >
        <AddActionItem hideComponentCallback={hideComponentCallback} thought={thought} />
      </RecoilRoot>
    );
  });

  it('should cancel on escape and discard', () => {
    escapeKey();
    clickDiscard();

    expect(hideComponentCallback).toHaveBeenCalledTimes(2);
    expect(ActionItemService.create).not.toHaveBeenCalled();
  });

  it('should call onConfirm with task and assignee', async () => {
    const task = 'Run this test';
    const assignee = 'jest';
    editTask(task);
    typeAssignee(assignee);
    clickCreate();

    await act(async () => expect(ActionItemService.create).toHaveBeenCalledWith(team.id, task, assignee));
    expect(hideComponentCallback).toHaveBeenCalled();
  });

  it('should shake and not call onConfirm when task is empty', () => {
    typeAssignee('jest');
    clickCreate();

    expect(hideComponentCallback).not.toHaveBeenCalled();
    expect(ActionItemService.create).not.toHaveBeenCalled();
    expect(screen.getByTestId('addActionItem').className).toContain('shake');
  });

  it('should stop modal from closing', () => {
    expect(mockUseModalValue.setHideOnEscape).toHaveBeenCalledWith(false);
    expect(mockUseModalValue.setHideOnBackdropClick).toHaveBeenCalledWith(false);
  });
});

function clickDiscard() {
  userEvent.click(screen.getByText('Discard'));
}

function clickCreate() {
  userEvent.click(screen.getByText('Create', { exact: false }));
}
