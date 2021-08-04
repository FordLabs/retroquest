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

import EndRetroDialog, { EndRetroDialogRenderer } from './EndRetroDialog';
import Dialog from '../../types/dialog';

describe('EndRetroDialog', () => {
  it('should show', () => {
    const ref = React.createRef<Dialog>();
    render(<EndRetroDialog ref={ref} />);

    act(() => {
      ref.current.show();
    });

    screen.getByText('Do you want to end the retro?');
    screen.getByText('This will archive all thoughts!');

    act(() => {
      ref.current.hide();
    });

    expect(screen.queryByText('Do you want to end the retro?')).toBeFalsy();
  });

  describe('EndRetroDialogRenderer', () => {
    const mockOnSubmit = jest.fn();
    const mockOnHide = jest.fn();

    beforeEach(() => {
      render(<EndRetroDialogRenderer onSubmit={mockOnSubmit} onHide={mockOnHide} />);

      jest.clearAllMocks();
    });

    it('should end retro', () => {
      userEvent.click(screen.getByText('yes!'));

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('should hide', () => {
      userEvent.click(screen.getByTestId('dialogBackdrop'));
      userEvent.click(screen.getByText('nope'));

      expect(mockOnHide).toHaveBeenCalledTimes(2);
    });
  });
});
