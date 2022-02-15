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
import { createRef } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecoilRoot } from 'recoil';

import FeedbackService from '../../services/api/FeedbackService';
import { ModalMethods } from '../modal/Modal';

import FeedbackDialog, { FeedbackDialogRenderer } from './FeedbackDialog';

jest.mock('../../services/api/FeedbackService');

describe('FeedbackDialog', () => {
  const ref = createRef<ModalMethods>();

  beforeEach(() => {
    render(
      <RecoilRoot>
        <FeedbackDialog ref={ref} />
      </RecoilRoot>
    );

    act(() => {
      ref.current.show();
    });
  });

  it('should show and hide from ref methods', () => {
    const modalTitle = 'Feedback';
    screen.getByText(modalTitle);
    screen.getByText('How can we improve RetroQuest?');

    act(() => {
      ref.current.hide();
    });

    expect(screen.queryByText(modalTitle)).toBeFalsy();
  });
});

describe('FeedbackDialogRenderer', () => {
  const mockOnCancel = jest.fn();
  const fakeTeamId = 'fake-team-id';
  const fakeComment = 'This is a fake comment';
  const fakeEmail = 'user@ford.com';

  beforeEach(() => {
    jest.clearAllMocks();

    render(<FeedbackDialogRenderer teamId={fakeTeamId} closeModal={mockOnCancel} />);
  });

  it('should submit feedback', () => {
    userEvent.click(screen.getByTestId('feedback-star-4'));
    userEvent.type(screen.getByLabelText('Feedback Email'), fakeEmail);
    userEvent.type(screen.getByLabelText('Comments*'), fakeComment);
    userEvent.click(screen.getByText('Send!'));

    expect(FeedbackService.addFeedback).toHaveBeenCalledWith({
      teamId: fakeTeamId,
      stars: 4,
      comment: fakeComment,
      userEmail: fakeEmail,
    });
  });

  it('should not submit with empty comments', () => {
    userEvent.click(screen.getByTestId('feedback-star-4'));
    userEvent.type(screen.getByLabelText('Feedback Email'), fakeEmail);
    userEvent.click(screen.getByText('Send!'));

    expect(FeedbackService.addFeedback).not.toHaveBeenCalled();
  });

  it('should cancel', () => {
    userEvent.click(screen.getByText('Cancel'));

    expect(mockOnCancel).toHaveBeenCalled();
    expect(FeedbackService.addFeedback).not.toHaveBeenCalled();
  });
});
