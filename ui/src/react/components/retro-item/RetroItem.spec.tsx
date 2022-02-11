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

import Topic, { ThoughtTopic } from '../../types/Topic';

import RetroItem from './RetroItem';

describe('RetroItem', () => {
  const mockSelect = jest.fn();
  const mockEdit = jest.fn();
  const mockDelete = jest.fn();
  const mockDiscuss = jest.fn();
  const mockUpvote = jest.fn();

  const fakeThought = {
    id: 0,
    message: 'fake message',
    hearts: 3,
    discussed: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without axe errors', async () => {
    const { container } = render(<RetroItem thought={fakeThought} type={Topic.HAPPY} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it.each([[Topic.HAPPY], [Topic.CONFUSED], [Topic.UNHAPPY]])('should render %s type', (type: ThoughtTopic) => {
    render(<RetroItem thought={fakeThought} type={type} />);

    expect(screen.getByTestId('retroItem').className).toContain(type);
  });

  it('should render thought message and upvotes', () => {
    render(<RetroItem thought={fakeThought} type={Topic.HAPPY} />);

    screen.getByText(fakeThought.message);
    screen.getByText(fakeThought.hearts);
    screen.getByText('Upvote');
  });

  describe('when not discussed and not readonly', () => {
    beforeEach(() => {
      render(
        <RetroItem
          type={Topic.HAPPY}
          thought={fakeThought}
          onSelect={mockSelect}
          onUpvote={mockUpvote}
          onEdit={mockEdit}
          onDelete={mockDelete}
          onDiscuss={mockDiscuss}
        />
      );
    });

    it('can select', () => {
      clickText();

      expect(mockSelect).toHaveBeenCalledTimes(1);
    });

    it('can upvote', () => {
      clickUpvote();

      expect(mockUpvote).toHaveBeenCalledTimes(1);
    });

    it('can start and cancel edit', () => {
      const newText = 'New Fake Text';

      screen.getByText(fakeThought.message);

      clickEdit();
      screen.getByText(fakeThought.message);

      editText(newText);
      screen.getByText(newText);

      escapeKey();
      screen.getByText(fakeThought.message);

      clickEdit();
      screen.getByText(fakeThought.message);

      editText(newText);
      screen.getByText(newText);

      clickEdit();
      screen.getByText(fakeThought.message);
    });

    it('should disable other buttons while editing', () => {
      clickEdit();
      expect(textReadonly()).toBeFalsy();

      clickUpvote();
      expect(mockUpvote).not.toHaveBeenCalled();

      clickDelete();
      expect(deleteMessage()).toBeFalsy();

      clickCheckbox();
      expect(mockDiscuss).not.toHaveBeenCalled();
    });

    it('can complete edit', () => {
      clickEdit();
      editText('New Fake Text{Enter}');
      expect(mockEdit).toHaveBeenCalledWith(fakeThought, 'New Fake Text');
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

    it('can discuss', () => {
      clickCheckbox();
      expect(mockDiscuss).toHaveBeenCalledTimes(1);
    });
  });

  describe('when discussed', () => {
    beforeEach(() => {
      render(
        <RetroItem
          type={Topic.HAPPY}
          thought={{ ...fakeThought, discussed: true }}
          onSelect={mockSelect}
          onUpvote={mockUpvote}
          onEdit={mockEdit}
          onDelete={mockDelete}
          onDiscuss={mockDiscuss}
        />
      );
    });

    it('should disable upvote button', () => {
      clickUpvote();
      expect(mockUpvote).not.toHaveBeenCalled();
    });

    it('should disable edit button', () => {
      clickEdit();
      expect(textReadonly()).toBeTruthy();
    });

    it('should disable select', () => {
      clickText();
      expect(mockSelect).not.toHaveBeenCalled();
    });

    it('should not disable delete button', () => {
      clickDelete();
      expect(deleteMessage()).toBeTruthy();
    });

    it('should not disable checkbox button', () => {
      clickCheckbox();
      expect(mockDiscuss).toHaveBeenCalledTimes(1);
    });
  });

  describe('when readonly', () => {
    beforeEach(() => {
      render(
        <RetroItem
          readOnly={true}
          type={Topic.HAPPY}
          thought={fakeThought}
          onSelect={mockSelect}
          onUpvote={mockUpvote}
          onEdit={mockEdit}
          onDelete={mockDelete}
          onDiscuss={mockDiscuss}
        />
      );
    });

    it('should disable all buttons', () => {
      clickUpvote();
      expect(mockUpvote).not.toHaveBeenCalled();

      clickEdit();
      expect(textReadonly()).toBeTruthy();

      clickDelete();
      expect(deleteMessage()).toBeFalsy();

      clickCheckbox();
      expect(mockDiscuss).not.toHaveBeenCalled();
    });

    it('should not disable select', () => {
      clickText();
      expect(mockSelect).toHaveBeenCalledTimes(1);
    });
  });
});

function editText(text) {
  const textArea = screen.getByTestId('editableText') as HTMLTextAreaElement;
  textArea.select();
  userEvent.type(textArea, text);
}

function clickText() {
  userEvent.click(screen.queryByTestId('editableText-container'));
}

function clickUpvote() {
  userEvent.click(screen.getByTestId('retroItem-upvote'));
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

function escapeKey() {
  userEvent.type(document.body, '{Escape}');
}

function textReadonly() {
  return screen.getByTestId('editableText').getAttribute('readonly') === '';
}

function deleteMessage() {
  return screen.queryByText('Delete this Thought?');
}
