/*
 * Copyright (c) 2021 Ford Motor Company
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

import RetroItemModal from './RetroItemModal';
import { ModalMethods } from '../modal/Modal';
import ColumnType from '../../types/ColumnType';

describe('RetroItemModal', () => {
  const mockOnAction = jest.fn();

  const fakeThought = {
    id: 0,
    message: 'fake thought',
    hearts: 3,
    discussed: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render as a retro item in a modal', () => {
    const ref = React.createRef<ModalMethods>();
    render(<RetroItemModal type={ColumnType.HAPPY} thought={fakeThought} ref={ref} />);

    act(() => {
      ref.current.show();
    });

    screen.getByText('fake thought');
    screen.getByTestId('retroItem');
    screen.getByTestId('modalBackdrop');
  });

  describe('not readonly', () => {
    beforeEach(() => {
      const ref = React.createRef<ModalMethods>();
      render(<RetroItemModal type={ColumnType.HAPPY} thought={fakeThought} ref={ref} onAction={mockOnAction} />);

      act(() => {
        ref.current.show();
      });
    });

    it('should show action item form when add action item button is clicked', () => {
      clickAddActionItem();

      screen.getByTestId('addActionItem');
    });

    it('should hide action item form when discard button is clicked', () => {
      clickAddActionItem();

      clickDiscard();

      expect(screen.queryByTestId('addActionItem')).toBeFalsy();
    });

    it('should add action item when form is filled out and create button is clicked', () => {
      clickAddActionItem();

      typeTask('Run this test');
      typeAssignee('jest');

      clickCreate();

      expect(mockOnAction).toHaveBeenCalledWith('Run this test', 'jest');
    });
  });

  describe('readonly', () => {
    beforeEach(() => {
      const ref = React.createRef<ModalMethods>();
      render(<RetroItemModal type={ColumnType.HAPPY} thought={fakeThought} ref={ref} readOnly={true} />);

      act(() => {
        ref.current.show();
      });
    });

    it('should not show add action button', () => {
      expect(getAddActionItemButton()).toBeFalsy();
    });
  });
});

function getAddActionItemButton() {
  return screen.queryByText('Add Action Item', { exact: false });
}

function clickAddActionItem() {
  userEvent.click(getAddActionItemButton());
}

function clickDiscard() {
  userEvent.click(screen.getByText('Discard'));
}

function clickCreate() {
  userEvent.click(screen.getByText('Create!', { exact: false }));
}

function typeTask(text) {
  userEvent.type(screen.getByTestId('addActionItem-task'), text);
}

function typeAssignee(text) {
  return userEvent.type(screen.getByTestId('actionItem-assignee'), text);
}
