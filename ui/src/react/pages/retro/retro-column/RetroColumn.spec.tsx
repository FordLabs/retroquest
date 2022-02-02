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

import { getMockThought } from '../../../services/api/__mocks__/ThoughtService';
import ThoughtService from '../../../services/api/ThoughtService';
import { ColumnTitleByTopicState } from '../../../state/ColumnTitleState';
import { TeamState } from '../../../state/TeamState';
import { ActiveThoughtsByTopicState, DiscussedThoughtsState } from '../../../state/ThoughtsState';
import { ColumnTitle } from '../../../types/ColumnTitle';
import ColumnTopic from '../../../types/ColumnTopic';
import Team from '../../../types/Team';
import Thought, { ThoughtTopic } from '../../../types/Thought';

import RetroColumn from './RetroColumn';

const team: Team = {
  name: 'My Team',
  id: 'my-team',
};

const activeThought1: Thought = getMockThought(ColumnTopic.HAPPY, false);
activeThought1.id = 943;
const activeThought2: Thought = getMockThought(ColumnTopic.HAPPY, false);
const discussedThought1: Thought = getMockThought(ColumnTopic.HAPPY, true);

const thoughtColumnTitle: ColumnTitle = {
  id: 123456,
  topic: ColumnTopic.HAPPY,
  title: 'Happy',
  teamId: 'team-id',
};

const actionItemColumnTitle: ColumnTitle = {
  id: 465657,
  topic: ColumnTopic.ACTION,
  title: 'Action',
  teamId: 'team-id',
};

jest.mock('../../../services/api/ThoughtService');

describe('RetroColumn.spec.tsx', () => {
  let container: HTMLElement;
  let rerender;

  beforeEach(async () => {
    const topic = thoughtColumnTitle.topic as ThoughtTopic;
    await act(async () => {
      ({ container, rerender } = render(
        <RecoilRoot
          initializeState={({ set }) => {
            set(ActiveThoughtsByTopicState(topic), [activeThought1, activeThought2]);
            set(DiscussedThoughtsState(topic), [discussedThought1]);
            set(ColumnTitleByTopicState(topic), thoughtColumnTitle);
            set(TeamState, team);
          }}
        >
          <RetroColumn topic={topic} />
        </RecoilRoot>
      ));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without axe errors', async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should show column title', () => {
    expect(screen.getByText(thoughtColumnTitle.title)).toBeDefined();
  });

  it('should show count of active items', () => {
    const countContainer = screen.getByTestId('countSeparator');
    const activeItemCount = within(countContainer).getByText('2');
    expect(activeItemCount).toBeDefined();
  });

  it('should render retro items if column is a thought column', () => {
    const retroItems = screen.getAllByTestId('retroItem');
    expect(retroItems.length).toBe(3);
    const actionItems = screen.queryByTestId('actionItem');
    expect(actionItems).toBeNull();
  });

  describe('Create Thought', () => {
    it('should make call to add thought when user types and submits a new thought', () => {
      const placeholderText = 'Enter a Thought';
      const textField = screen.getByPlaceholderText(placeholderText);

      const thoughtMessage = 'I had a new thought...';
      userEvent.type(textField, `${thoughtMessage}{enter}`);

      expect(ThoughtService.create).toHaveBeenCalledWith(team.id, {
        id: -1,
        teamId: team.id,
        topic: thoughtColumnTitle.topic,
        message: thoughtMessage,
        hearts: 0,
        discussed: false,
      });
    });
  });

  describe('Delete Thought', () => {
    it('should delete thought when user clicks delete and confirms with "Yes"', () => {
      const retroItems = screen.getAllByTestId('retroItem');
      const firstThoughtsDeleteIcon = within(retroItems[0]).getByTestId('columnItem-delete');
      userEvent.click(firstThoughtsDeleteIcon);

      const confirmDeletionButton = screen.queryByText('Yes');
      userEvent.click(confirmDeletionButton);
      expect(ThoughtService.delete).toHaveBeenCalledWith(team.id, activeThought1.id);
    });

    it('should NOT delete thought when user clicks delete and confirms with "No"', () => {
      const retroItems = screen.getAllByTestId('retroItem');
      const firstThoughtsDeleteIcon = within(retroItems[0]).getByTestId('columnItem-delete');
      userEvent.click(firstThoughtsDeleteIcon);

      const confirmDeletionButton = screen.queryByText('No');
      userEvent.click(confirmDeletionButton);
      expect(ThoughtService.delete).not.toHaveBeenCalledWith(team.id, activeThought1.id);
    });
  });

  xit('should render action items if column is a actions column', async () => {
    await act(async () => {
      rerender(<RetroColumn topic={actionItemColumnTitle.topic as ThoughtTopic} />);
    });
    const actionItems = screen.getAllByTestId('actionItem');
    expect(actionItems.length).toBe(3);
    const retroItem = screen.queryByTestId('retroItem');
    expect(retroItem).toBeNull();
  });
});
