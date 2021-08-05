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

import { ModalMethods } from '../modal/Modal';
import EndRetroDialog, { EndRetroDialogRenderer } from './EndRetroDialog';

describe('EndRetroDialog', () => {
  const ref = React.createRef<ModalMethods>();

  beforeEach(() => {
    render(<EndRetroDialog ref={ref} />);

    act(() => {
      ref.current.show();
    });
  });

  it('should show and hide from ref methods', () => {
    screen.getByText('End the retro?');
    screen.getByText('This will archive all thoughts!');

    act(() => {
      ref.current.hide();
    });

    expect(screen.queryByText('End the retro?')).toBeFalsy();
  });
});

describe('EndRetroDialogRenderer', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    render(<EndRetroDialogRenderer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
  });

  it('should submit', () => {
    userEvent.click(screen.getByText('yes!'));

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('should cancel', () => {
    userEvent.click(screen.getByText('nope'));

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
