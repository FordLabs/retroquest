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
import Team from '../../../types/Team';
import Thought from '../../../types/Thought';
import Topic, { ThoughtTopic } from '../../../types/Topic';

import ThoughtColumn from './ThoughtColumn';

const team: Team = {
  name: 'My Team',
  id: 'my-team',
};

const activeThought1: Thought = getMockThought(Topic.HAPPY, false);
activeThought1.id = 943;
const activeThought2: Thought = getMockThought(Topic.HAPPY, false);
const discussedThought1: Thought = getMockThought(Topic.HAPPY, true);

const thoughtColumnTitle: ColumnTitle = {
  id: 123456,
  topic: Topic.HAPPY,
  title: 'Happy',
  teamId: 'team-id',
};

jest.mock('../../../services/api/ThoughtService');

describe('ThoughtColumn.spec.tsx', () => {
  let container: HTMLElement;

  beforeEach(async () => {
    const topic = thoughtColumnTitle.topic as ThoughtTopic;
    await act(async () => {
      ({ container } = render(
        <RecoilRoot
          initializeState={({ set }) => {
            set(ActiveThoughtsByTopicState(topic), [activeThought1, activeThought2]);
            set(DiscussedThoughtsState(topic), [discussedThought1]);
            set(ColumnTitleByTopicState(topic), thoughtColumnTitle);
            set(TeamState, team);
          }}
        >
          <ThoughtColumn topic={topic} />
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

  it('should show count of active thoughts', () => {
    const countContainer = screen.getByTestId('countSeparator');
    const activeItemCount = within(countContainer).getByText('2');
    expect(activeItemCount).toBeDefined();
  });

  it('should render retro items', () => {
    const retroItems = screen.getAllByTestId('retroItem');
    expect(retroItems.length).toBe(3);
  });

  describe('Create Thought', () => {
    const placeholderText = 'Enter a Thought';

    it('should not make call to create thought until user types a thought', () => {
      const textField = screen.getByPlaceholderText(placeholderText);
      userEvent.type(textField, `{enter}`);

      expect(ThoughtService.create).not.toHaveBeenCalled();
    });

    it('should make call to create thought when user types and submits a new thought', () => {
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
    const deleteButtonTestId = 'columnItem-deleteButton';

    it('should delete thought when user clicks delete and confirms with "Yes"', () => {
      const thoughtItems = screen.getAllByTestId('retroItem');
      const firstThoughtsDeleteIcon = within(thoughtItems[0]).getByTestId(deleteButtonTestId);
      userEvent.click(firstThoughtsDeleteIcon);

      const confirmDeletionButton = screen.queryByText('Yes');
      userEvent.click(confirmDeletionButton);
      expect(ThoughtService.delete).toHaveBeenCalledWith(team.id, activeThought1.id);
    });

    it('should NOT delete thought when user clicks delete and confirms with "No"', () => {
      const thoughtItems = screen.getAllByTestId('retroItem');
      const firstThoughtsDeleteIcon = within(thoughtItems[0]).getByTestId(deleteButtonTestId);
      userEvent.click(firstThoughtsDeleteIcon);

      const confirmDeletionButton = screen.queryByText('No');
      userEvent.click(confirmDeletionButton);
      expect(ThoughtService.delete).not.toHaveBeenCalledWith(team.id, activeThought1.id);
    });
  });

  describe('Edit Thought', () => {
    const editButtonTestId = 'columnItem-editButton';

    it('should make call to edit thought when user types and submits an edited thought', () => {
      const thoughtItems = screen.getAllByTestId('retroItem');
      const firstThoughtsEditIcon = within(thoughtItems[0]).getByTestId(editButtonTestId);
      userEvent.click(firstThoughtsEditIcon);

      userEvent.type(screen.getAllByTestId('editableText')[0], `New thought{enter}`);

      expect(ThoughtService.updateMessage).toHaveBeenCalledWith(team.id, activeThought1.id, 'New thought');
    });
  });

  it('should upvote a thought', () => {
    const thoughtItems = screen.getAllByTestId('retroItem');
    const firstThoughtItemsUpvoteButton = within(thoughtItems[0]).getByTestId('retroItem-upvote');
    expect(within(thoughtItems[0]).getByText('0'));
    userEvent.click(firstThoughtItemsUpvoteButton);

    expect(ThoughtService.upvoteThought).toHaveBeenCalledWith(team.id, activeThought1.id);
  });

  it('should update discussion status of a thought', () => {
    const thoughtItems = screen.getAllByTestId('retroItem');
    const discussedButtonTestid = 'columnItem-checkboxButton';
    const firstThoughtsDiscussedButton = within(thoughtItems[0]).getByTestId(discussedButtonTestid);
    expect(within(thoughtItems[0]).getByText('0'));
    userEvent.click(firstThoughtsDiscussedButton);

    expect(ThoughtService.updateDiscussionStatus).toHaveBeenCalledWith(
      team.id,
      activeThought1.id,
      !activeThought1.discussed
    );
  });
});
