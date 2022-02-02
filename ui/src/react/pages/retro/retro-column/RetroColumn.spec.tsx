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

import { getMockThought } from '../../../services/api/__mocks__/ColumnsService';
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
