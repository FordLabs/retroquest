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
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';

import ColumnHeader from './ColumnHeader';

describe('ColumnHeader', () => {
  const mockHandleTitleChange = jest.fn();
  const mockHandleSortChange = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render without axe errors', async () => {
    const { container } = render(
      <ColumnHeader
        initialTitle="Some title"
        sortedChanged={mockHandleSortChange}
        titleChanged={mockHandleTitleChange}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not display sort button when header is not sortable', () => {
    render(<ColumnHeader initialTitle="Not Sortable" titleChanged={mockHandleTitleChange} />);
    expect(screen.queryByTestId('sort-button')).toBeNull();
  });

  it('should display sort button when header is sortable', () => {
    render(
      <ColumnHeader initialTitle="Sortable" sortedChanged={mockHandleSortChange} titleChanged={mockHandleTitleChange} />
    );
    expect(screen.queryByTestId('sort-button')).not.toBeNull();
  });

  it('should toggle and emit sort state when the sort is toggled', () => {
    render(<ColumnHeader sortedChanged={mockHandleSortChange} titleChanged={mockHandleTitleChange} />);

    userEvent.click(screen.getByTestId('sort-button'));
    expect(mockHandleSortChange).toHaveBeenCalledWith(true);

    userEvent.click(screen.getByTestId('sort-button'));
    expect(mockHandleSortChange).toHaveBeenCalledWith(false);
  });

  it('should not display edit button when header is read only', () => {
    render(<ColumnHeader initialTitle="Read Only" sortedChanged={mockHandleSortChange} />);
    expect(screen.queryByTestId('columnHeader-editTitleButton')).toBeNull();
  });

  it('should display edit button when header is not read only', () => {
    render(
      <ColumnHeader
        initialTitle="Not Read Only"
        sortedChanged={mockHandleSortChange}
        titleChanged={mockHandleTitleChange}
      />
    );
    expect(screen.queryByTestId('columnHeader-editTitleButton')).not.toBeNull();
  });

  it('should not display character counter when not editing', () => {
    render(
      <ColumnHeader
        initialTitle="Change This"
        sortedChanged={mockHandleSortChange}
        titleChanged={mockHandleTitleChange}
      />
    );
    expect(screen.queryByText('5')).toBeNull();
  });

  it('should display character counter when editing', () => {
    render(
      <ColumnHeader
        initialTitle="Change This"
        sortedChanged={mockHandleSortChange}
        titleChanged={mockHandleTitleChange}
      />
    );
    userEvent.click(screen.getByTestId('columnHeader-editTitleButton'));
    expect(screen.queryByText('5')).not.toBeNull();
  });

  it('should notify observers of title change when title changed', function () {
    render(
      <ColumnHeader
        initialTitle="Change This"
        sortedChanged={mockHandleSortChange}
        titleChanged={mockHandleTitleChange}
      />
    );

    userEvent.click(screen.getByTestId('columnHeader-editTitleButton'));
    userEvent.type(screen.getByTestId('column-input'), 'Something Else{enter}');

    expect(mockHandleTitleChange).toHaveBeenCalledWith('Something Else');
  });

  it('Clicking off input should save title', function () {
    render(
      <ColumnHeader
        initialTitle="Change This"
        sortedChanged={mockHandleSortChange}
        titleChanged={mockHandleTitleChange}
      />
    );

    userEvent.click(screen.getByTestId('columnHeader-editTitleButton'));
    userEvent.type(screen.getByTestId('column-input'), 'Something Else');
    fireEvent.blur(screen.getByTestId('column-input'));

    expect(screen.queryByTestId('column-input')).toBeNull();
    expect(screen.queryByText('Change This')).toBeNull();
    expect(screen.queryByText('Something Else')).not.toBeNull();
  });

  it('Pressing Enter on input should save title changes', () => {
    render(
      <ColumnHeader
        initialTitle="Change This"
        sortedChanged={mockHandleSortChange}
        titleChanged={mockHandleTitleChange}
      />
    );

    userEvent.click(screen.getByTestId('columnHeader-editTitleButton'));
    userEvent.type(screen.getByTestId('column-input'), 'Something Else{enter}');

    expect(screen.queryByTestId('column-input')).toBeNull();
    expect(screen.queryByText('Change This')).toBeNull();
    expect(screen.queryByText('Something Else')).not.toBeNull();
  });

  it('should ignore title changes when escape key pressed', () => {
    render(
      <ColumnHeader
        initialTitle="No Change"
        sortedChanged={mockHandleSortChange}
        titleChanged={mockHandleTitleChange}
      />
    );

    userEvent.click(screen.getByTestId('columnHeader-editTitleButton'));
    userEvent.type(screen.getByTestId('column-input'), 'Something Else{esc}');

    expect(screen.queryByTestId('column-input')).toBeNull();
    expect(screen.queryByText('Something Else')).toBeNull();
    expect(screen.queryByText('No Change')).not.toBeNull();
  });
});
