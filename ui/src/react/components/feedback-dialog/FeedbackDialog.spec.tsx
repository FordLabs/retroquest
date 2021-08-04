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

import { FeedbackDialogRenderer } from './FeedbackDialog';
import { DialogMethods } from '../dialog/Dialog';

describe('FeedbackDialog', () => {
  const mockOnSubmit = jest.fn();
  const fakeTeamId = 'fake-team-id';
  const fakeComment = 'This is a fake comment';
  const fakeEmail = 'user@ford.com';

  const ref = React.createRef<DialogMethods>();

  beforeEach(() => {
    jest.clearAllMocks();

    render(<FeedbackDialogRenderer teamId={fakeTeamId} onSubmit={mockOnSubmit} ref={ref} />);

    act(() => {
      ref.current.show();
    });
  });

  it('should show and hide from ref methods', () => {
    screen.getByText('feedback');
    screen.getByText('How can we improve RetroQuest?');

    act(() => {
      ref.current.hide();
    });

    expect(screen.queryByText('feedback')).toBeFalsy();
  });

  it('should submit feedback', () => {
    userEvent.click(screen.getByTestId('star4'));
    userEvent.type(screen.getByLabelText('feedback email'), fakeEmail);
    userEvent.type(screen.getByLabelText('comments*'), fakeComment);
    userEvent.click(screen.getByText('send!'));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      teamId: fakeTeamId,
      stars: 5,
      comment: fakeComment,
      userEmail: fakeEmail,
    });
  });

  it('should not submit with empty comments', () => {
    userEvent.click(screen.getByTestId('star4'));
    userEvent.type(screen.getByLabelText('feedback email'), fakeEmail);
    userEvent.click(screen.getByText('send!'));

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should hide on cancel', () => {
    userEvent.click(screen.getByText('cancel'));

    expect(screen.queryByText('feedback')).toBeFalsy();
  });
});
