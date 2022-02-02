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
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { RecoilRoot } from 'recoil';

import { getMockActionItem } from '../../../services/api/__mocks__/ActionItemService';
import ThoughtService from '../../../services/api/ThoughtService';
import { ActionItemState } from '../../../state/ActionItemState';
import { ColumnTitleByTopicState } from '../../../state/ColumnTitleState';
import { TeamState } from '../../../state/TeamState';
import Action from '../../../types/Action';
import { ColumnTitle } from '../../../types/ColumnTitle';
import Team from '../../../types/Team';
import Topic, { ThoughtTopic } from '../../../types/Topic';

import ActionItemsColumn from './ActionItemsColumn';

const team: Team = {
  name: 'My Team',
  id: 'my-team',
};

const activeActionItem1: Action = getMockActionItem(false);
activeActionItem1.id = 943;
const activeActionItem2: Action = getMockActionItem(false);
const completedActionItem1: Action = getMockActionItem(true);

const actionItemsColumnTitle: ColumnTitle = {
  id: 465657,
  topic: Topic.ACTION,
  title: 'Action',
  teamId: 'team-id',
};

jest.mock('../../../services/api/ThoughtService');

describe('ActionItemsColumn.spec.tsx', () => {
  let container: HTMLElement;

  beforeEach(async () => {
    const topic = actionItemsColumnTitle.topic as ThoughtTopic;
    await act(async () => {
      ({ container } = render(
        <RecoilRoot
          initializeState={({ set }) => {
            set(ActionItemState, [activeActionItem1, activeActionItem2, completedActionItem1]);
            set(ColumnTitleByTopicState(topic), actionItemsColumnTitle);
            set(TeamState, team);
          }}
        >
          <ActionItemsColumn />
        </RecoilRoot>
      ));
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render without axe errors', async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should show column title', () => {
    expect(screen.getByText(actionItemsColumnTitle.title)).toBeDefined();
  });

  it('should show count of active items', () => {
    const countContainer = screen.getByTestId('countSeparator');
    const activeItemCount = within(countContainer).getByText('2');
    expect(activeItemCount).toBeDefined();
  });

  it('should render action items', () => {
    const actionItems = screen.getAllByTestId('actionItem');
    expect(actionItems.length).toBe(3);
  });

  xdescribe('Create Action Item', () => {
    it('should make call to add action item when user types and submits a new action', () => {
      const placeholderText = 'Enter an Action Item';
      const textField = screen.getByPlaceholderText(placeholderText);

      const thoughtMessage = 'I had a new thought...';
      userEvent.type(textField, `${thoughtMessage}{enter}`);

      expect(ThoughtService.create).toHaveBeenCalledWith(team.id, {
        id: -1,
        teamId: team.id,
        topic: actionItemsColumnTitle.topic,
        message: thoughtMessage,
        hearts: 0,
        discussed: false,
      });
    });
  });

  xdescribe('Delete Action Item', () => {
    it('should delete action item when user clicks delete and confirms with "Yes"', () => {
      const retroItems = screen.getAllByTestId('retroItem');
      const firstThoughtsDeleteIcon = within(retroItems[0]).getByTestId('columnItem-delete');
      userEvent.click(firstThoughtsDeleteIcon);

      const confirmDeletionButton = screen.queryByText('Yes');
      userEvent.click(confirmDeletionButton);
      expect(ThoughtService.delete).toHaveBeenCalledWith(team.id, activeActionItem1.id);
    });

    it('should NOT delete action item when user clicks delete and confirms with "No"', () => {
      const retroItems = screen.getAllByTestId('retroItem');
      const firstThoughtsDeleteIcon = within(retroItems[0]).getByTestId('columnItem-delete');
      userEvent.click(firstThoughtsDeleteIcon);

      const confirmDeletionButton = screen.queryByText('No');
      userEvent.click(confirmDeletionButton);
      expect(ThoughtService.delete).not.toHaveBeenCalledWith(team.id, activeActionItem1.id);
    });
  });
});
