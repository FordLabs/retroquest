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

import { getMockActionItem, getMockThought } from '../../../services/__mocks__/ColumnsService';
import ColumnTopic from '../../../types/ColumnTopic';

import RetroColumn from './RetroColumn';

const retroItemsColumn = {
  id: 1,
  items: {
    active: [getMockThought(ColumnTopic.HAPPY, false), getMockThought(ColumnTopic.HAPPY, false)],
    completed: [getMockThought(ColumnTopic.HAPPY, true)],
  },
  title: 'Happy',
  topic: ColumnTopic.HAPPY,
};

const actionItemsColumn = {
  id: 1,
  items: { active: [getMockActionItem(false), getMockActionItem(false)], completed: [getMockActionItem(true)] },
  title: 'Action Item',
  topic: ColumnTopic.ACTION,
};

describe('RetroColumn.spec.tsx', () => {
  let container: HTMLElement;
  let rerender;

  beforeEach(async () => {
    await act(async () => {
      ({ container, rerender } = render(<RetroColumn column={retroItemsColumn} />));
    });
  });

  it('should render without axe errors', async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should show column title', () => {
    expect(screen.getByText(retroItemsColumn.title)).toBeDefined();
  });

  it('should show count of active items', () => {
    const countContainer = screen.getByTestId('countSeparator');
    const activeItemCount = within(countContainer).getByText(retroItemsColumn.items.active.length);
    expect(activeItemCount).toBeDefined();
  });

  it('should render retro items if column is a retro column', () => {
    const retroItems = screen.getAllByTestId('retroItem');
    expect(retroItems.length).toBe(3);
    const actionItems = screen.queryByTestId('actionItem');
    expect(actionItems).toBeNull();
  });

  it('should render action items if column is a actions column', async () => {
    await act(async () => {
      rerender(<RetroColumn column={actionItemsColumn} />);
    });
    const actionItems = screen.getAllByTestId('actionItem');
    expect(actionItems.length).toBe(3);
    const retroItem = screen.queryByTestId('retroItem');
    expect(retroItem).toBeNull();
  });
});
