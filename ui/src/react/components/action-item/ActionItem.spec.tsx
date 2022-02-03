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
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';

import * as Modal from '../modal/Modal';

import ActionItem from './ActionItem';

export const mockUseModalValue = {
  hide: jest.fn(),
  show: jest.fn(),
  setHideOnEscape: jest.fn(),
  setHideOnBackdropClick: jest.fn(),
};

jest.spyOn(Modal, 'useModal').mockReturnValue(mockUseModalValue);

describe('ActionItem', () => {
  const mockSelect = jest.fn();
  const mockEdit = jest.fn();
  const mockDelete = jest.fn();
  const mockComplete = jest.fn();
  const mockAssign = jest.fn();

  const fakeAction = {
    id: 0,
    task: 'fake task',
    assignee: '',
    completed: false,
    dateCreated: '2021-08-12',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without axe errors', async () => {
    const { container } = render(<ActionItem action={fakeAction} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should render as an action column item with created date', () => {
    render(<ActionItem action={fakeAction} />);

    expect(screen.getByTestId('actionItem').className).toContain('action');
    screen.getByText('Aug 12th');
  });

  describe('when not completed and not readonly', () => {
    beforeEach(() => {
      render(
        <ActionItem
          action={fakeAction}
          onSelect={mockSelect}
          onEdit={mockEdit}
          onDelete={mockDelete}
          onComplete={mockComplete}
          onAssign={mockAssign}
        />
      );
    });

    it('can select', () => {
      clickTask();

      expect(mockSelect).toHaveBeenCalledTimes(1);
    });

    it('can start and cancel edit', () => {
      const newTask = 'New Fake Task';

      screen.getByText(fakeAction.task);

      clickEdit();
      screen.getByText(fakeAction.task);

      editTask(newTask);
      screen.getByText(newTask);

      escapeKey();
      screen.getByText(fakeAction.task);

      clickEdit();
      screen.getByText(fakeAction.task);

      editTask(newTask);
      screen.getByText(newTask);

      clickEdit();
      screen.getByText(fakeAction.task);
    });

    it('should disable other items while editing', () => {
      clickEdit();
      expect(taskReadonly()).toBeFalsy();

      expect(assigneeDisable()).not.toBeNull();

      clickDelete();
      expect(deleteMessage()).toBeFalsy();

      clickCheckbox();
      expect(mockComplete).not.toHaveBeenCalled();
    });

    it('can complete edit', () => {
      clickEdit();
      editTask('New Fake Task{Enter}');

      expect(mockEdit).toHaveBeenCalledWith('New Fake Task');
    });

    it('can start and cancel delete', () => {
      expect(deleteMessage()).toBeFalsy();

      clickDelete();
      expect(deleteMessage()).toBeTruthy();

      escapeKey();
      expect(deleteMessage()).toBeFalsy();

      clickDelete();
      expect(deleteMessage()).toBeTruthy();

      clickCancelDelete();
      expect(deleteMessage()).toBeFalsy();
    });

    it('can complete delete', () => {
      clickDelete();
      clickConfirmDelete();

      expect(mockDelete).toHaveBeenCalledTimes(1);
    });

    it('can be completed', () => {
      clickCheckbox();

      expect(mockComplete).toHaveBeenCalledTimes(1);
    });

    it('can edit assignee', () => {
      typeAssignee('FordLabs{enter}');

      expect(mockAssign).toHaveBeenCalledWith('FordLabs');

      typeAssignee(' Team');
      clickTask();

      expect(mockAssign).toHaveBeenCalledWith('FordLabs Team');
    });
  });

  describe('when completed', () => {
    beforeEach(() => {
      render(
        <ActionItem
          action={{ ...fakeAction, completed: true }}
          onSelect={mockSelect}
          onEdit={mockEdit}
          onDelete={mockDelete}
          onComplete={mockComplete}
          onAssign={mockAssign}
        />
      );
    });

    it('should disable edit button', () => {
      clickEdit();
      expect(taskReadonly()).toBeTruthy();
    });

    it('should disable select', () => {
      clickTask();
      expect(mockSelect).not.toHaveBeenCalled();
    });

    it('should not disable delete button', () => {
      clickDelete();
      expect(deleteMessage()).toBeTruthy();
    });

    it('should not disable checkbox button', () => {
      clickCheckbox();
      expect(mockComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('when readonly', () => {
    beforeEach(() => {
      render(
        <ActionItem
          action={fakeAction}
          readOnly={true}
          onSelect={mockSelect}
          onEdit={mockEdit}
          onDelete={mockDelete}
          onComplete={mockComplete}
          onAssign={mockAssign}
        />
      );
    });

    it('should disable all buttons', () => {
      clickEdit();
      expect(taskReadonly()).toBeTruthy();

      clickDelete();
      expect(deleteMessage()).toBeFalsy();

      clickCheckbox();
      expect(mockComplete).not.toHaveBeenCalled();
    });

    it('should disable assignee', () => {
      typeAssignee('new assignee{Enter}');
      expect(mockAssign).not.toHaveBeenCalled();
    });

    it('should not disable select', () => {
      clickTask();
      expect(mockSelect).toHaveBeenCalledTimes(1);
    });
  });
});

function taskReadonly() {
  return screen.getByTestId('editableText').getAttribute('readonly') === '';
}

function assigneeDisable() {
  return screen.getByTestId('actionItem-assignee').getAttribute('disabled');
}

export function editTask(text) {
  const textArea = (screen.queryByTestId('editableText') ||
    screen.queryByTestId('addActionItem-task')) as HTMLTextAreaElement;
  textArea.select();
  userEvent.type(textArea, text);
}

function clickTask() {
  userEvent.click(screen.queryByTestId('editableText-container'));
}

export function typeAssignee(text) {
  return userEvent.type(screen.getByTestId('actionItem-assignee'), text);
}

function clickEdit() {
  userEvent.click(screen.getByTestId('columnItem-editButton'));
}

function clickDelete() {
  userEvent.click(screen.getByTestId('columnItem-deleteButton'));
}

function clickCheckbox() {
  userEvent.click(screen.getByTestId('columnItem-checkboxButton'));
}

function clickCancelDelete() {
  userEvent.click(screen.getByText('No'));
}

function clickConfirmDelete() {
  userEvent.click(screen.getByText('Yes'));
}

export function escapeKey() {
  userEvent.type(document.body, '{Escape}');
}

function deleteMessage() {
  return screen.queryByText('Delete this Action Item?');
}
