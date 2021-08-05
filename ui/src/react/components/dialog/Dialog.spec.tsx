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

import Dialog from './Dialog';

describe('Dialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('default dialog', () => {
    beforeEach(() => {
      render(
        <Dialog header="Dialog Header" subHeader="Dialog Sub Header">
          Dialog Content
        </Dialog>
      );
    });

    it('should render', () => {
      screen.getByText('Dialog Header');
      screen.getByText('Dialog Sub Header');
      screen.getByText('Dialog Content');
    });
  });

  describe('custom dialog', () => {
    const mockConfirm = jest.fn();
    const mockCancel = jest.fn();
    const buttons = {
      cancel: {
        text: 'Custom Cancel',
        onClick: mockCancel,
      },
      confirm: {
        text: 'Custom Confirm',
        onClick: mockConfirm,
      },
    };

    beforeEach(() => {
      render(
        <Dialog header="Dialog Header" subHeader="Dialog Sub Header" buttons={buttons}>
          Dialog Content
        </Dialog>
      );
    });

    it('should render footer buttons', () => {
      userEvent.click(screen.getByText('Custom Confirm'));
      userEvent.click(screen.getByText('Custom Cancel'));

      expect(mockConfirm).toHaveBeenCalledTimes(1);
      expect(mockCancel).toHaveBeenCalledTimes(1);
    });
  });
});
