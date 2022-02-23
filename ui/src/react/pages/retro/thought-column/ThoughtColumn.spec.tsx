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
import ColumnService from '../../../services/api/ColumnService';
import ThoughtService from '../../../services/api/ThoughtService';
import { ColumnTitleByTopicState } from '../../../state/ColumnTitleState';
import { TeamState } from '../../../state/TeamState';
import { ThoughtsState } from '../../../state/ThoughtsState';
import { ColumnTitle } from '../../../types/ColumnTitle';
import Team from '../../../types/Team';
import Thought from '../../../types/Thought';
import Topic, { ThoughtTopic } from '../../../types/Topic';

import ThoughtColumn from './ThoughtColumn';

const team: Team = {
  name: 'My Team',
  id: 'my-team',
};

const activeThought1: Thought = getMockThought(Topic.HAPPY, false, 1);
activeThought1.id = 943;
const activeThought2: Thought = getMockThought(Topic.HAPPY, false, 2);
const discussedThought1: Thought = getMockThought(Topic.HAPPY, true, 3);
const discussedThought2: Thought = getMockThought(Topic.HAPPY, true, 4);

const thoughtColumnTitle: ColumnTitle = {
  id: 123456,
  topic: Topic.HAPPY,
  title: 'Happy',
  teamId: 'team-id',
};

jest.mock('../../../services/api/ThoughtService');
jest.mock('../../../services/api/ColumnService');

describe('ThoughtColumn.spec.tsx', () => {
  let container: HTMLElement;

  beforeEach(async () => {
    const topic = thoughtColumnTitle.topic as ThoughtTopic;
    await act(async () => {
      ({ container } = render(
        <RecoilRoot
          initializeState={({ set }) => {
            set(ColumnTitleByTopicState(topic), thoughtColumnTitle);
            set(ThoughtsState, [activeThought1, activeThought2, discussedThought1, discussedThought2]);
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
    expect(retroItems.length).toBe(4);
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

  describe('sort', () => {
    it('should return thoughts in descending order based on heart count after activity when sort clicked', () => {
      userEvent.click(screen.getByTestId('sort-button'));
      const thoughtItems = screen.getAllByTestId('retroItem');
      expect(thoughtItems).toHaveLength(4);
      expect(within(thoughtItems[0]).queryByText('2')).not.toBeNull();
      expect(within(thoughtItems[1]).queryByText('1')).not.toBeNull();
      expect(within(thoughtItems[2]).queryByText('4')).not.toBeNull();
      expect(within(thoughtItems[3]).queryByText('3')).not.toBeNull();
    });

    it('should return thoughts in unedited order after activity sorting when sort clicked twice', () => {
      userEvent.click(screen.getByTestId('sort-button'));
      userEvent.click(screen.getByTestId('sort-button'));
      const thoughtItems = screen.getAllByTestId('retroItem');
      expect(thoughtItems).toHaveLength(4);
      expect(within(thoughtItems[0]).queryByText('1')).not.toBeNull();
      expect(within(thoughtItems[1]).queryByText('2')).not.toBeNull();
      expect(within(thoughtItems[2]).queryByText('3')).not.toBeNull();
      expect(within(thoughtItems[3]).queryByText('4')).not.toBeNull();
    });
  });

  it('should send update event to API when header title changed', () => {
    userEvent.click(screen.getByTestId('columnHeader-editTitleButton'));
    userEvent.type(screen.getByTestId('column-input'), 'Something Else{enter}');
    expect(ColumnService.updateColumnTitle).toHaveBeenCalledWith('my-team', 123456, 'Something Else');
  });
});
