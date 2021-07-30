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

import TextField from './TextField';

describe('TextField', () => {
  const mockHandleSubmit = jest.fn();
  const placeholder = 'Enter A Thought';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should style based on type', () => {
    const result = render(
      <TextField data-testid="happy" type="happy" placeholder={placeholder} handleSubmission={mockHandleSubmit} />
    );
    expect(screen.getByTestId('happy').className).toContain('happy');

    result.rerender(
      <TextField data-testid="confused" type="confused" placeholder={placeholder} handleSubmission={mockHandleSubmit} />
    );
    expect(screen.getByTestId('confused').className).toContain('confused');

    result.rerender(
      <TextField data-testid="unhappy" type="unhappy" placeholder={placeholder} handleSubmission={mockHandleSubmit} />
    );
    expect(screen.getByTestId('unhappy').className).toContain('unhappy');
  });

  it('should submit on enter', () => {
    render(<TextField type="happy" placeholder={placeholder} handleSubmission={mockHandleSubmit} />);
    const textField = screen.getByPlaceholderText(placeholder);

    userEvent.type(textField, 'Submission Text{enter}');

    expect(mockHandleSubmit).toHaveBeenCalledWith('Submission Text');
  });
});
