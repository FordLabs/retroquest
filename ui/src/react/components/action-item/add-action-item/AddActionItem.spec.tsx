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

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { editTask, escapeKey, mockUseModalValue, typeAssignee } from '../ActionItem.spec';

import AddActionItem from './AddActionItem';

describe('AddActionItem', () => {
  const mockConfirm = jest.fn();
  const mockCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    render(<AddActionItem onConfirm={mockConfirm} onCancel={mockCancel} />);
  });

  it('should cancel on escape and discard', () => {
    escapeKey();
    clickDiscard();

    expect(mockCancel).toHaveBeenCalledTimes(2);
  });

  it('should call onConfirm with task and assignee', () => {
    editTask('Run this test');
    typeAssignee('jest');
    clickCreate();

    expect(mockConfirm).toHaveBeenCalledWith('Run this test', 'jest');
  });

  it('should shake and not call onConfirm when task is empty', () => {
    typeAssignee('jest');
    clickCreate();

    expect(mockConfirm).not.toHaveBeenCalled();
    expect(screen.getByTestId('addActionItem').className).toContain('shake');
  });

  it('should stop modal from closing', () => {
    expect(mockUseModalValue.setHideOnEscape).toHaveBeenCalledWith(false);
    expect(mockUseModalValue.setHideOnBackdropClick).toHaveBeenCalledWith(false);
  });
});

function clickDiscard() {
  userEvent.click(screen.getByText('Discard'));
}

function clickCreate() {
  userEvent.click(screen.getByText('Create', { exact: false }));
}
